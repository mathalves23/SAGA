import requests
import psycopg2
from psycopg2.extras import execute_values
import json
import time
from googletrans import Translator

# 1) Configuração
API_KEY = "009267ee-f71e-4c3b-93c9-eb4a4bc1ea0a"
DB_URL = "postgresql://saga_user@127.0.0.1:5432/saga"
HEADERS = {"api-key": API_KEY}
BATCH_SIZE = 50
SLEEP_TIME = 0.5  # Para não sobrecarregar a API de tradução

# Inicializa tradutor
translator = Translator()

# 2) Dicionário de traduções para exercícios comuns (para acelerar)
EXERCISE_TRANSLATIONS = {
    # Exercícios básicos
    "Barbell Squat": "Agachamento com Barra",
    "Deadlift": "Levantamento Terra",
    "Bench Press": "Supino Reto",
    "Pull-up": "Barra Fixa",
    "Push-up": "Flexão de Braço",
    "Overhead Press": "Desenvolvimento Militar",
    "Bent-Over Row": "Remada Curvada",
    "Dumbbell Curl": "Rosca com Halter",
    "Tricep Dips": "Paralelas",
    "Plank": "Prancha",
    
    # Exercícios com halteres
    "Dumbbell Bench Press": "Supino com Halteres",
    "Dumbbell Flyes": "Crucifixo com Halteres",
    "Dumbbell Shoulder Press": "Desenvolvimento com Halteres",
    "Dumbbell Rows": "Remada com Halteres",
    "Dumbbell Lunges": "Afundo com Halteres",
    "Bicep Curls": "Rosca Bíceps",
    "Hammer Curls": "Rosca Martelo",
    "Tricep Extensions": "Extensão de Tríceps",
    
    # Exercícios de pernas
    "Leg Press": "Leg Press",
    "Leg Curls": "Mesa Flexora",
    "Leg Extensions": "Cadeira Extensora",
    "Calf Raises": "Elevação de Panturrilha",
    "Bulgarian Split Squats": "Agachamento Búlgaro",
    "Walking Lunges": "Afundo Caminhando",
    "Hip Thrusts": "Elevação de Quadril",
    
    # Exercícios de costas
    "Lat Pulldowns": "Puxada na Polia Alta",
    "Cable Rows": "Remada na Polia",
    "T-Bar Rows": "Remada T",
    "Face Pulls": "Puxada Facial",
    "Shrugs": "Encolhimento de Ombros",
    
    # Exercícios cardiovasculares
    "Burpees": "Burpees",
    "Mountain Climbers": "Escalador",
    "Jumping Jacks": "Polichinelos",
    "High Knees": "Elevação de Joelhos",
    "Squat Jumps": "Agachamento com Salto",
    
    # Exercícios de core
    "Crunches": "Abdominal",
    "Russian Twists": "Giro Russo",
    "Leg Raises": "Elevação de Pernas",
    "Dead Bug": "Inseto Morto",
    "Bird Dog": "Cão Apontador",
    
    # Exercícios funcionais
    "Kettlebell Swings": "Balanço com Kettlebell",
    "Turkish Get-ups": "Levantamento Turco",
    "Box Jumps": "Salto na Caixa",
    "Battle Ropes": "Cordas de Batalha",
    "Medicine Ball Slams": "Arremesso de Medicine Ball"
}

# Traduções de grupos musculares
MUSCLE_TRANSLATIONS = {
    "Chest": "Peito",
    "Back": "Costas", 
    "Legs": "Pernas",
    "Shoulders": "Ombros",
    "Arms": "Braços",
    "Biceps": "Bíceps",
    "Triceps": "Tríceps",
    "Abs": "Abdômen",
    "Core": "Core",
    "Glutes": "Glúteos",
    "Calves": "Panturrilhas",
    "Forearms": "Antebraços",
    "Quads": "Quadríceps",
    "Hamstrings": "Posteriores",
    "Lats": "Latíssimo",
    "Traps": "Trapézio",
    "Delts": "Deltoides",
    "Cardio": "Cardio",
    "Full Body": "Corpo Todo"
}

# Traduções de equipamentos
EQUIPMENT_TRANSLATIONS = {
    "Barbell": "Barra",
    "Dumbbell": "Halteres", 
    "Machine": "Máquina",
    "Bodyweight": "Peso Corporal",
    "Cable": "Cabos",
    "Kettlebell": "Kettlebell",
    "Resistance Band": "Elásticos",
    "Medicine Ball": "Bola Medicinal",
    "Battle Rope": "Corda de Batalha",
    "TRX": "TRX",
    "Suspension": "Suspensão",
    "None": "Nenhum",
    "Smith Machine": "Smith",
    "Pull-up Bar": "Barra Fixa",
    "Parallel Bars": "Paralelas",
    "Bench": "Banco",
    "Exercise Ball": "Bola Suíça"
}

def translate_text(text, from_lang='en', to_lang='pt'):
    """Traduz um texto usando o dicionário ou Google Translate como fallback"""
    if not text:
        return text
    
    # Verifica se já temos a tradução no dicionário
    if text in EXERCISE_TRANSLATIONS:
        return EXERCISE_TRANSLATIONS[text]
    
    if text in MUSCLE_TRANSLATIONS:
        return MUSCLE_TRANSLATIONS[text]
    
    if text in EQUIPMENT_TRANSLATIONS:
        return EQUIPMENT_TRANSLATIONS[text]
    
    try:
        # Usa Google Translate como fallback
        translated = translator.translate(text, src=from_lang, dest=to_lang)
        time.sleep(0.1)  # Rate limiting
        return translated.text
    except Exception as e:
        print(f"Erro na tradução de '{text}': {e}")
        return text  # Retorna o original se falhar

def fetch_hevy_exercises():
    """Coleta todos os exercícios da API do Hevy com imagens"""
    url = "https://api.hevyapp.com/v1/exercise_templates"
    all_exercises = []
    
    while url:
        try:
            print(f"Coletando: {url}")
            resp = requests.get(url, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            
            for ex in data["exercise_templates"]:
                # Traduz nomes e descrições
                translated_name = translate_text(ex["title"])
                translated_description = translate_text(ex.get("description", "")) if ex.get("description") else None
                translated_muscle = translate_text(ex.get("primary_muscle_group", ""))
                translated_equipment = translate_text(ex.get("equipments", "Nenhum"))
                
                exercise_data = {
                    "external_id": ex["id"],
                    "name": translated_name,
                    "original_name": ex["title"],  # Mantém o original para referência
                    "description": translated_description,
                    "equipments": translated_equipment,
                    "primary_muscle": translated_muscle,
                    "secondary_muscles": [translate_text(muscle) for muscle in ex.get("secondary_muscle_groups", [])],
                    "type": ex.get("type"),
                    "animation_url": ex.get("animation_url"),
                    "video_url": ex.get("video_url"),
                    "image_url": ex.get("image_url"),  # Imagem estática se disponível
                    "thumbnail_url": ex.get("thumbnail_url")  # Thumbnail para lista
                }
                
                all_exercises.append(exercise_data)
                
                # Rate limiting para tradução
                time.sleep(SLEEP_TIME)
            
            print(f"Página {data['page']} de {data['page_count']} coletada. Total: {len(all_exercises)}")
            
            # Próxima página
            if data["page"] < data["page_count"]:
                url = f"https://api.hevyapp.com/v1/exercise_templates?page={data['page']+1}"
            else:
                url = None
                
        except Exception as e:
            print(f"Erro ao coletar exercícios: {e}")
            break
    
    return all_exercises

def get_exercise_details(external_id):
    """Busca detalhes adicionais de um exercício específico"""
    url = f"https://api.hevyapp.com/v1/exercise_templates/{external_id}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        
        detail = data.get("exercise_template", {})
        return {
            "detailed_description": translate_text(detail.get("description", "")),
            "instructions": [translate_text(inst) for inst in detail.get("instructions", [])],
            "animation_url": detail.get("animation_url"),
            "video_url": detail.get("video_url"),
            "image_urls": detail.get("image_urls", []),  # Múltiplas imagens se disponível
            "muscle_diagram_url": detail.get("muscle_diagram_url"),  # Diagrama dos músculos
            "tips": [translate_text(tip) for tip in detail.get("tips", [])]
        }
    except Exception as e:
        print(f"Erro ao buscar detalhes do exercício {external_id}: {e}")
        return None

def prepare_lookup(cur, table_name):
    """Prepara mapeamento de IDs para tabelas de referência"""
    cur.execute(f"SELECT id, name FROM {table_name};")
    lookup_map = {}
    for _id, name in cur.fetchall():
        lookup_map[name] = _id
    
    upsert_sql = (
        f"INSERT INTO {table_name} (name) VALUES (%s) "
        "ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name "
        "RETURNING id"
    )
    return lookup_map, upsert_sql

def insert_into_db(records):
    """Insere exercícios com imagens no banco de dados"""
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Limpa tabela para nova importação
    cur.execute("TRUNCATE TABLE exercises RESTART IDENTITY CASCADE;")
    
    # Prepara lookups
    muscle_map, muscle_upsert_sql = prepare_lookup(cur, "muscle_groups")
    equipment_map, equip_upsert_sql = prepare_lookup(cur, "equipments")
    
    # Carrega difficulty_levels
    cur.execute("SELECT id, name FROM difficulty_levels;")
    diff_map = {name: id for id, name in cur.fetchall()}
    default_diff_id = diff_map.get("Intermediário", 2)
    
    print("Lookup maps carregados.")
    
    # SQL de inserção com todos os campos de imagem
    sql = """
        INSERT INTO exercises (
            name, description, instructions, primary_muscle_group_id, 
            difficulty_level_id, equipment_id, image_url, video_url,
            animation_url, thumbnail_url, original_name, external_id
        ) VALUES %s
        ON CONFLICT (name) DO UPDATE SET
            description = EXCLUDED.description,
            instructions = EXCLUDED.instructions,
            primary_muscle_group_id = EXCLUDED.primary_muscle_group_id,
            difficulty_level_id = EXCLUDED.difficulty_level_id,
            equipment_id = EXCLUDED.equipment_id,
            image_url = EXCLUDED.image_url,
            video_url = EXCLUDED.video_url,
            animation_url = EXCLUDED.animation_url,
            thumbnail_url = EXCLUDED.thumbnail_url,
            original_name = EXCLUDED.original_name,
            external_id = EXCLUDED.external_id
    """
    
    batch = []
    
    for i, ex in enumerate(records, start=1):
        # Upsert muscle group
        pm = ex["primary_muscle"]
        if pm and pm not in muscle_map:
            cur.execute(muscle_upsert_sql, (pm,))
            row = cur.fetchone()
            if row:
                pm_id = row[0]
                muscle_map[pm] = pm_id
            else:
                pm_id = default_diff_id  # Fallback
        else:
            pm_id = muscle_map.get(pm, default_diff_id)
        
        # Upsert equipment
        eq = ex["equipments"]
        if eq and eq not in equipment_map:
            cur.execute(equip_upsert_sql, (eq,))
            row = cur.fetchone()
            if row:
                eq_id = row[0]
                equipment_map[eq] = eq_id
            else:
                eq_id = 1  # Fallback para primeiro equipment
        else:
            eq_id = equipment_map.get(eq, 1)
        
        # Preparar instruções como JSON se houver
        instructions = None
        if "instructions" in ex and ex["instructions"]:
            instructions = json.dumps(ex["instructions"], ensure_ascii=False)
        
        batch.append((
            ex["name"],
            ex.get("description"),
            instructions,
            pm_id,
            default_diff_id,
            eq_id,
            ex.get("image_url"),
            ex.get("video_url"),
            ex.get("animation_url"),  # GIF/animação
            ex.get("thumbnail_url"),  # Thumbnail para listas
            ex.get("original_name"),  # Nome original em inglês
            ex.get("external_id")     # ID da API do Hevy
        ))
        
        # Insere em batches
        if i % BATCH_SIZE == 0 or i == len(records):
            execute_values(cur, sql, batch)
            conn.commit()
            start = i - len(batch) + 1
            print(f"✅ Inseridos exercícios {start} a {i}")
            batch.clear()
    
    cur.close()
    conn.close()
    print("🎉 Todos os exercícios com imagens foram importados!")

def save_exercises_cache(exercises, filename="exercises_cache.json"):
    """Salva exercícios em cache para não precisar reprocessar"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(exercises, f, ensure_ascii=False, indent=2)
    print(f"💾 Cache salvo em {filename}")

def load_exercises_cache(filename="exercises_cache.json"):
    """Carrega exercícios do cache"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            exercises = json.load(f)
        print(f"📂 Cache carregado de {filename}")
        return exercises
    except FileNotFoundError:
        print("📂 Cache não encontrado, coletando da API...")
        return None

if __name__ == "__main__":
    print("🏋️ Iniciando coleta de exercícios com imagens e tradução...")
    
    # Tenta carregar do cache primeiro
    exercises = load_exercises_cache()
    
    if not exercises:
        # Coleta da API se não há cache
        exercises = fetch_hevy_exercises()
        
        if exercises:
            save_exercises_cache(exercises)
        else:
            print("❌ Nenhum exercício coletado!")
            exit(1)
    
    print(f"📊 Total de exercícios coletados: {len(exercises)}")
    
    # Mostra alguns exemplos
    print("\n📋 Exemplos de exercícios traduzidos:")
    for i, ex in enumerate(exercises[:5]):
        print(f"{i+1}. {ex['name']} (Original: {ex['original_name']})")
        if ex.get('animation_url'):
            print(f"   🎬 Animação: {ex['animation_url']}")
        print(f"   💪 Músculo: {ex['primary_muscle']}")
        print(f"   🏋️ Equipamento: {ex['equipments']}")
        print()
    
    # Inserir no banco
    try:
        insert_into_db(exercises)
        print("✅ Importação concluída com sucesso!")
        print(f"📈 {len(exercises)} exercícios com imagens importados!")
    except Exception as e:
        print(f"❌ Erro na importação: {e}") 