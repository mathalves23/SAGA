import requests
import psycopg2
from psycopg2.extras import execute_values

# 1) Configuração
API_KEY    = "009267ee-f71e-4c3b-93c9-eb4a4bc1ea0a"
DB_URL     = "postgresql://saga_user@127.0.0.1:5432/saga"
HEADERS    = {"api-key": API_KEY}
BATCH_SIZE = 100

# 2) Coleta paginada
def fetch_hevy_exercises():
    url    = "https://api.hevyapp.com/v1/exercise_templates"
    all_ex = []
    while url:
        resp = requests.get(url, headers=HEADERS)
        resp.raise_for_status()
        data = resp.json()
        for ex in data["exercise_templates"]:
            all_ex.append({
                "external_id":       ex["id"],
                "name":              ex["title"],
                "description":       ex.get("description") or None,
                "equipments":        ex.get("equipments") or "Nenhum",
                "primary_muscle":    ex.get("primary_muscle_group"),
                "secondary_muscles": ex.get("secondary_muscle_groups", []),
                "type":              ex.get("type"),
                "animation_url":     ex.get("animation_url") or None,
                "video_url":         ex.get("video_url") or None  # se disponível na API
            })
        print(f"Página {data['page']} de {data['page_count']} coletada.")
        if data["page"] < data["page_count"]:
            url = f"https://api.hevyapp.com/v1/exercise_templates?page={data['page']+1}"
        else:
            url = None
    return all_ex

# 3) Prepara lookup e upsert SQL
def prepare_lookup(cur, table_name, needs_body_region=False):
    cur.execute(f"SELECT id, name FROM {table_name};")
    lookup_map = {}
    for _id, name in cur.fetchall():
        lookup_map[name] = _id

    if needs_body_region:
        upsert_sql = (
            f"INSERT INTO {table_name} (name, body_region) VALUES (%s, %s) "
            "ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name "
            "RETURNING id"
        )
    else:
        upsert_sql = (
            f"INSERT INTO {table_name} (name) VALUES (%s) "
            "ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name "
            "RETURNING id"
        )
    return lookup_map, upsert_sql

# 4) Inserção em batch com upserts completos
def insert_into_db(records):
    conn = psycopg2.connect(DB_URL)
    cur  = conn.cursor()
    cur.execute("TRUNCATE TABLE exercises RESTART IDENTITY CASCADE;")

    # Prepara muscle_groups e equipment
    muscle_map, muscle_upsert_sql     = prepare_lookup(cur, "muscle_groups")
    equipment_map, equip_upsert_sql   = prepare_lookup(cur, "equipments")
    print("Lookup maps de músculo e equipamento carregados.")

    # Carrega difficulty_levels
    cur.execute("SELECT id, name FROM difficulty_levels;")
    diff_map = {name: id for id, name in cur.fetchall()}
    default_diff_id = diff_map.get("Intermediário")  # costuma ser ID=2

    sql = """
        INSERT INTO exercises (
            name, description, instructions, primary_muscle_group_id, difficulty_level_id, equipment_id, image_url, video_url
        ) VALUES %s
        ON CONFLICT (name) DO UPDATE SET
            description = EXCLUDED.description,
            instructions = EXCLUDED.instructions,
            primary_muscle_group_id = EXCLUDED.primary_muscle_group_id,
            difficulty_level_id = EXCLUDED.difficulty_level_id,
            equipment_id = EXCLUDED.equipment_id,
            image_url = EXCLUDED.image_url,
            video_url = EXCLUDED.video_url
    """

    batch = []
    for i, ex in enumerate(records, start=1):
        # upsert muscle_group
        pm = ex["primary_muscle"]
        if pm not in muscle_map:
            cur.execute(muscle_upsert_sql, (pm,))
            row = cur.fetchone()
            if row:
                pm_id = row[0]
            else:
                cur.execute("SELECT id FROM muscle_groups WHERE name = %s;", (pm,))
                pm_id = cur.fetchone()[0]
            muscle_map[pm] = pm_id
        else:
            pm_id = muscle_map[pm]

        # upsert equipment
        eq = ex["equipments"]
        if eq not in equipment_map:
            cur.execute(equip_upsert_sql, (eq,))
            row = cur.fetchone()
            if row:
                eq_id = row[0]
            else:
                cur.execute("SELECT id FROM equipments WHERE name = %s;", (eq,))
                eq_id = cur.fetchone()[0]
            equipment_map[eq] = eq_id
        else:
            eq_id = equipment_map[eq]

        # difficulty
        diff_id = default_diff_id

        batch.append((
            ex["name"],
            ex.get("description") or None,
            None,  # instructions
            pm_id,
            diff_id,
            eq_id,
            ex.get("animation_url") or None,
            ex.get("video_url") or None
        ))

        if i % BATCH_SIZE == 0 or i == len(records):
            execute_values(cur, sql, batch)
            conn.commit()
            start = i - len(batch) + 1
            print(f"Inseridos registros {start} a {i}")
            batch.clear()

    cur.close()
    conn.close()
    print("Todos os registros foram importados com sucesso.")

if __name__ == "__main__":
    exercises = fetch_hevy_exercises()
    print(f"Total de exercícios Hevy coletados: {len(exercises)}")
    insert_into_db(exercises)
    print("Importação Hevy concluída!")
