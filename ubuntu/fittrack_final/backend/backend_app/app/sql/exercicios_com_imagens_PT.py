import requests
import psycopg2
from psycopg2.extras import execute_values
import json

# Configuração
API_KEY = "009267ee-f71e-4c3b-93c9-eb4a4bc1ea0a"
DB_URL = "postgresql://saga_user@127.0.0.1:5432/saga"
HEADERS = {"api-key": API_KEY}
BATCH_SIZE = 50

# Lista de exercícios traduzidos com seus IDs do Hevy para buscar imagens
EXERCICIOS_TRADUZIDOS = [
    # PEITO
    {
        "nome": "Supino Reto com Barra",
        "hevy_id": "barbell-bench-press",
        "descricao": "Exercício fundamental para desenvolvimento do peitoral maior",
        "musculo_primario": "Peito",
        "equipamento": "Barra",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Supino Inclinado com Barra", 
        "hevy_id": "incline-barbell-bench-press",
        "descricao": "Foca na porção superior do peitoral",
        "musculo_primario": "Peito",
        "equipamento": "Barra",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Supino com Halteres",
        "hevy_id": "dumbbell-bench-press", 
        "descricao": "Permite maior amplitude de movimento que a barra",
        "musculo_primario": "Peito",
        "equipamento": "Halteres",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Crucifixo com Halteres",
        "hevy_id": "dumbbell-flyes",
        "descricao": "Exercício de isolamento para o peitoral",
        "musculo_primario": "Peito", 
        "equipamento": "Halteres",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Flexão de Braço",
        "hevy_id": "push-ups",
        "descricao": "Exercício clássico usando peso corporal",
        "musculo_primario": "Peito",
        "equipamento": "Peso Corporal", 
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Paralelas",
        "hevy_id": "dips",
        "descricao": "Exercício composto para peito e tríceps",
        "musculo_primario": "Peito",
        "equipamento": "Paralelas",
        "dificuldade": "Intermediário"
    },

    # COSTAS
    {
        "nome": "Barra Fixa",
        "hevy_id": "pull-ups",
        "descricao": "Exercício fundamental para latíssimo do dorso",
        "musculo_primario": "Costas",
        "equipamento": "Barra Fixa",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Levantamento Terra",
        "hevy_id": "conventional-deadlift",
        "descricao": "Um dos exercícios mais completos para força",
        "musculo_primario": "Costas",
        "equipamento": "Barra",
        "dificuldade": "Avançado"
    },
    {
        "nome": "Remada Curvada",
        "hevy_id": "bent-over-barbell-row",
        "descricao": "Excelente para desenvolvimento do latíssimo",
        "musculo_primario": "Costas",
        "equipamento": "Barra", 
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Puxada na Polia Alta",
        "hevy_id": "lat-pulldown",
        "descricao": "Alternativa assistida à barra fixa",
        "musculo_primario": "Costas",
        "equipamento": "Máquina",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Remada Sentado",
        "hevy_id": "seated-cable-row",
        "descricao": "Exercício para meio das costas",
        "musculo_primario": "Costas",
        "equipamento": "Cabos",
        "dificuldade": "Iniciante"
    },

    # PERNAS
    {
        "nome": "Agachamento Livre",
        "hevy_id": "barbell-back-squat",
        "descricao": "O rei dos exercícios para pernas",
        "musculo_primario": "Pernas",
        "equipamento": "Barra",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Leg Press",
        "hevy_id": "leg-press",
        "descricao": "Exercício para quadríceps e glúteos",
        "musculo_primario": "Pernas",
        "equipamento": "Máquina",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Afundo",
        "hevy_id": "lunges",
        "descricao": "Exercício unilateral para pernas",
        "musculo_primario": "Pernas",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Agachamento Búlgaro",
        "hevy_id": "bulgarian-split-squat",
        "descricao": "Exercício unilateral avançado",
        "musculo_primario": "Pernas",
        "equipamento": "Halteres",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Mesa Flexora",
        "hevy_id": "lying-leg-curl",
        "descricao": "Isolamento para músculos posteriores",
        "musculo_primario": "Pernas",
        "equipamento": "Máquina",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Cadeira Extensora",
        "hevy_id": "leg-extension",
        "descricao": "Isolamento para quadríceps",
        "musculo_primario": "Pernas",
        "equipamento": "Máquina",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Elevação de Panturrilha",
        "hevy_id": "calf-raise",
        "descricao": "Exercício para panturrilhas",
        "musculo_primario": "Panturrilhas",
        "equipamento": "Máquina",
        "dificuldade": "Iniciante"
    },

    # OMBROS
    {
        "nome": "Desenvolvimento Militar",
        "hevy_id": "overhead-press",
        "descricao": "Exercício fundamental para ombros",
        "musculo_primario": "Ombros",
        "equipamento": "Barra",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Desenvolvimento com Halteres",
        "hevy_id": "dumbbell-shoulder-press",
        "descricao": "Permite movimento mais natural",
        "musculo_primario": "Ombros",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Elevação Lateral",
        "hevy_id": "dumbbell-lateral-raise",
        "descricao": "Isolamento para deltoides medial",
        "musculo_primario": "Ombros",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Elevação Frontal",
        "hevy_id": "front-raise",
        "descricao": "Isolamento para deltoides anterior",
        "musculo_primario": "Ombros",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Puxada Facial",
        "hevy_id": "face-pull",
        "descricao": "Exercício para deltoides posterior",
        "musculo_primario": "Ombros",
        "equipamento": "Cabos",
        "dificuldade": "Iniciante"
    },

    # BRAÇOS - BÍCEPS
    {
        "nome": "Rosca Direta",
        "hevy_id": "barbell-curl",
        "descricao": "Exercício clássico para bíceps",
        "musculo_primario": "Bíceps",
        "equipamento": "Barra",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Rosca com Halteres",
        "hevy_id": "dumbbell-bicep-curl",
        "descricao": "Permite movimento alternado",
        "musculo_primario": "Bíceps",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Rosca Martelo",
        "hevy_id": "hammer-curl",
        "descricao": "Trabalha bíceps e antebraços",
        "musculo_primario": "Bíceps",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Rosca Concentrada",
        "hevy_id": "concentration-curl",
        "descricao": "Isolamento máximo do bíceps",
        "musculo_primario": "Bíceps",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante"
    },

    # BRAÇOS - TRÍCEPS
    {
        "nome": "Tríceps Testa",
        "hevy_id": "lying-tricep-extension",
        "descricao": "Exercício de isolamento para tríceps",
        "musculo_primario": "Tríceps",
        "equipamento": "Barra",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Tríceps na Polia",
        "hevy_id": "tricep-pushdown",
        "descricao": "Exercício popular para tríceps",
        "musculo_primario": "Tríceps",
        "equipamento": "Cabos",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Tríceps Francês",
        "hevy_id": "overhead-tricep-extension",
        "descricao": "Exercício para cabeça longa do tríceps",
        "musculo_primario": "Tríceps",
        "equipamento": "Halteres",
        "dificuldade": "Intermediário"
    },

    # ABDÔMEN/CORE
    {
        "nome": "Prancha",
        "hevy_id": "plank",
        "descricao": "Exercício isométrico para core",
        "musculo_primario": "Abdômen",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Abdominal",
        "hevy_id": "crunches",
        "descricao": "Exercício clássico para abdômen",
        "musculo_primario": "Abdômen",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Elevação de Pernas",
        "hevy_id": "leg-raises",
        "descricao": "Trabalha abdômen inferior",
        "musculo_primario": "Abdômen",
        "equipamento": "Peso Corporal",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Giro Russo",
        "hevy_id": "russian-twist",
        "descricao": "Exercício para oblíquos",
        "musculo_primario": "Abdômen",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante"
    },

    # CARDIO/FUNCIONAIS
    {
        "nome": "Burpees",
        "hevy_id": "burpees",
        "descricao": "Exercício completo de alta intensidade",
        "musculo_primario": "Corpo Todo",
        "equipamento": "Peso Corporal",
        "dificuldade": "Intermediário"
    },
    {
        "nome": "Escalador",
        "hevy_id": "mountain-climbers",
        "descricao": "Exercício cardio para core",
        "musculo_primario": "Corpo Todo",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Polichinelos",
        "hevy_id": "jumping-jacks",
        "descricao": "Exercício cardiovascular básico",
        "musculo_primario": "Corpo Todo",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante"
    },
    {
        "nome": "Agachamento com Salto",
        "hevy_id": "jump-squat",
        "descricao": "Exercício pliométrico para pernas",
        "musculo_primario": "Pernas",
        "equipamento": "Peso Corporal",
        "dificuldade": "Intermediário"
    }
]

def buscar_dados_hevy(hevy_id):
    """Busca dados de um exercício específico na API do Hevy"""
    url = f"https://api.hevyapp.com/v1/exercise_templates/{hevy_id}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            template = data.get("exercise_template", {})
            return {
                "animation_url": template.get("animation_url"),
                "video_url": template.get("video_url"),
                "image_url": template.get("image_url"),
                "thumbnail_url": template.get("thumbnail_url")
            }
    except Exception as e:
        print(f"⚠️  Erro ao buscar dados do Hevy para {hevy_id}: {e}")
    
    return {"animation_url": None, "video_url": None, "image_url": None, "thumbnail_url": None}

def buscar_exercicios_hevy_lista():
    """Busca lista geral de exercícios para encontrar IDs"""
    url = "https://api.hevyapp.com/v1/exercise_templates"
    exercicios_encontrados = {}
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            for ex in data.get("exercise_templates", []):
                exercicios_encontrados[ex["id"]] = {
                    "title": ex["title"],
                    "animation_url": ex.get("animation_url"),
                    "video_url": ex.get("video_url"),
                    "image_url": ex.get("image_url")
                }
    except Exception as e:
        print(f"⚠️  Erro ao buscar lista do Hevy: {e}")
    
    return exercicios_encontrados

def preparar_lookups(cur):
    """Prepara mapeamentos de IDs para tabelas de referência"""
    # Muscle groups
    cur.execute("SELECT id, name FROM muscle_groups;")
    muscle_map = {name: id for id, name in cur.fetchall()}
    
    # Equipments  
    cur.execute("SELECT id, name FROM equipments;")
    equipment_map = {name: id for id, name in cur.fetchall()}
    
    # Difficulty levels
    cur.execute("SELECT id, name FROM difficulty_levels;")
    diff_map = {name: id for id, name in cur.fetchall()}
    
    return muscle_map, equipment_map, diff_map

def inserir_exercicios_com_imagens():
    """Insere exercícios traduzidos com imagens do Hevy"""
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Aplicar migração se necessário
    try:
        cur.execute("""
            ALTER TABLE exercises 
            ADD COLUMN IF NOT EXISTS animation_url TEXT,
            ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
            ADD COLUMN IF NOT EXISTS original_name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS external_id VARCHAR(50)
        """)
        conn.commit()
        print("✅ Campos de imagem adicionados à tabela exercises")
    except Exception as e:
        print(f"⚠️  Migração: {e}")
        conn.rollback()
    
    # Preparar lookups
    muscle_map, equipment_map, diff_map = preparar_lookups(cur)
    print("📋 Lookup maps carregados")
    
    # Buscar dados do Hevy
    print("🔍 Buscando exercícios na API do Hevy...")
    hevy_data = buscar_exercicios_hevy_lista()
    print(f"📊 {len(hevy_data)} exercícios encontrados no Hevy")
    
    # SQL de inserção
    sql = """
        INSERT INTO exercises (
            name, description, primary_muscle_group_id, equipment_id, 
            difficulty_level_id, animation_url, video_url, image_url,
            thumbnail_url, original_name, external_id
        ) VALUES %s
        ON CONFLICT (name) DO UPDATE SET
            description = EXCLUDED.description,
            primary_muscle_group_id = EXCLUDED.primary_muscle_group_id,
            equipment_id = EXCLUDED.equipment_id,
            difficulty_level_id = EXCLUDED.difficulty_level_id,
            animation_url = EXCLUDED.animation_url,
            video_url = EXCLUDED.video_url,
            image_url = EXCLUDED.image_url,
            thumbnail_url = EXCLUDED.thumbnail_url,
            original_name = EXCLUDED.original_name,
            external_id = EXCLUDED.external_id
    """
    
    batch = []
    exercicios_com_imagem = 0
    
    for exercicio in EXERCICIOS_TRADUZIDOS:
        # Buscar dados específicos do Hevy
        hevy_dados = None
        hevy_id = exercicio.get("hevy_id")
        
        if hevy_id and hevy_id in hevy_data:
            hevy_dados = hevy_data[hevy_id]
        elif hevy_id:
            hevy_dados = buscar_dados_hevy(hevy_id)
        
        # Obter IDs das tabelas de referência
        muscle_id = muscle_map.get(exercicio["musculo_primario"])
        equipment_id = equipment_map.get(exercicio["equipamento"])
        diff_id = diff_map.get(exercicio["dificuldade"])
        
        # Fallbacks se não encontrar
        if not muscle_id:
            muscle_id = 1  # Primeiro da lista
        if not equipment_id:
            equipment_id = 1  # Primeiro da lista  
        if not diff_id:
            diff_id = 2  # Intermediário
        
        # URLs de imagem
        animation_url = hevy_dados.get("animation_url") if hevy_dados else None
        video_url = hevy_dados.get("video_url") if hevy_dados else None
        image_url = hevy_dados.get("image_url") if hevy_dados else None
        thumbnail_url = hevy_dados.get("thumbnail_url") if hevy_dados else None
        
        if animation_url or image_url:
            exercicios_com_imagem += 1
        
        batch.append((
            exercicio["nome"],
            exercicio["descricao"],
            muscle_id,
            equipment_id,
            diff_id,
            animation_url,
            video_url, 
            image_url,
            thumbnail_url,
            hevy_dados.get("title") if hevy_dados else None,  # original_name
            hevy_id  # external_id
        ))
        
        print(f"✅ {exercicio['nome']} - {'🎬' if animation_url else '📷' if image_url else '❌'}")
    
    # Inserir em batch
    execute_values(cur, sql, batch)
    conn.commit()
    
    cur.close()
    conn.close()
    
    print(f"\n🎉 {len(EXERCICIOS_TRADUZIDOS)} exercícios inseridos!")
    print(f"🎬 {exercicios_com_imagem} exercícios com imagens/animações")
    return len(EXERCICIOS_TRADUZIDOS), exercicios_com_imagem

if __name__ == "__main__":
    print("🏋️‍♂️ SAGA - Importação de Exercícios com Imagens")
    print("=" * 50)
    
    try:
        total, com_imagem = inserir_exercicios_com_imagens()
        print(f"\n✅ SUCESSO!")
        print(f"📊 Total: {total} exercícios")
        print(f"🎬 Com imagens: {com_imagem} exercícios")
        print(f"📈 Taxa de sucesso: {(com_imagem/total)*100:.1f}%")
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc() 