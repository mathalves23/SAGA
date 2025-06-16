import requests
import psycopg2
import time

API_KEY = "009267ee-f71e-4c3b-93c9-eb4a4bc1ea0a"
DB_URL = "postgresql://fittrack_user:sua_senha@127.0.0.1:5432/fittrack"
HEADERS = {"api-key": API_KEY}
BATCH_SIZE = 20
SLEEP_TIME = 0.5  # ajustar se necessário

def fetch_exercise_detail(external_id):
    url = f"https://api.hevyapp.com/v1/exercise_templates/{external_id}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        detail = data.get("exercise_template", {})
        return {
            "description": detail.get("description") or None,
            "animation_url": detail.get("animation_url") or None,
            "video_url": detail.get("video_url") or None
        }
    except requests.RequestException as e:
        print(f"[Erro] API {external_id}: {e}")
        return None

def get_exercises_to_update():
    with psycopg2.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT name, external_id
                FROM exercises
                WHERE description IS NULL OR image_url IS NULL OR video_url IS NULL;
            """)
            return cur.fetchall()

def update_exercise_details(records):
    with psycopg2.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            batch_count = 0
            for name, external_id in records:
                details = fetch_exercise_detail(external_id)
                if details:
                    cur.execute("""
                        UPDATE exercises
                        SET description = COALESCE(%s, description),
                            image_url = COALESCE(%s, image_url),
                            video_url = COALESCE(%s, video_url)
                        WHERE name = %s;
                    """, (details["description"], details["animation_url"], details["video_url"], name))
                    batch_count += 1
                    print(f"Atualizado: {name}")
                else:
                    print(f"Pulo: {name} (sem dados)")

                if batch_count >= BATCH_SIZE:
                    conn.commit()
                    batch_count = 0
                    time.sleep(SLEEP_TIME)

            # Commit restante
            if batch_count > 0:
                conn.commit()

if __name__ == "__main__":
    to_update = get_exercises_to_update()
    print(f"{len(to_update)} exercícios para atualizar.")
    update_exercise_details(to_update)
    print("Atualização finalizada.")
