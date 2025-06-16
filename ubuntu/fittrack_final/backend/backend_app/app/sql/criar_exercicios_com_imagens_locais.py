import psycopg2
from psycopg2.extras import execute_values

# Configuração
DB_URL = "postgresql://saga_user@127.0.0.1:5432/saga"

# Base URL para imagens (pode ser um CDN ou pasta local)
IMAGE_BASE_URL = "/assets/exercise-images"
GIF_BASE_URL = "/assets/exercise-gifs"

# Lista de exercícios com imagens (simulando URLs de imagens próprias)
EXERCICIOS_COM_IMAGENS = [
    # PEITO
    {
        "nome": "Supino Reto com Barra",
        "nome_en": "Barbell Bench Press",
        "descricao": "Exercício fundamental para desenvolvimento do peitoral maior. Deite-se no banco, pegue a barra com afastamento na largura dos ombros e execute o movimento controlado.",
        "musculo_primario": "Peito",
        "equipamento": "Barra",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/barbell-bench-press.jpg",
        "gif": f"{GIF_BASE_URL}/barbell-bench-press.gif",
        "instrucoes": [
            "Deite-se no banco com os pés firmes no chão",
            "Pegue a barra com afastamento na largura dos ombros",
            "Desça a barra controladamente até o peito",
            "Empurre a barra para cima até a extensão completa dos braços",
            "Mantenha as escápulas retraídas durante todo o movimento"
        ]
    },
    {
        "nome": "Supino Inclinado com Barra",
        "nome_en": "Incline Barbell Bench Press",
        "descricao": "Foca na porção superior do peitoral. O banco deve estar inclinado entre 30-45 graus.",
        "musculo_primario": "Peito",
        "equipamento": "Barra",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/incline-barbell-bench-press.jpg",
        "gif": f"{GIF_BASE_URL}/incline-barbell-bench-press.gif",
        "instrucoes": [
            "Ajuste o banco para inclinação de 30-45 graus",
            "Posicione-se no banco com os pés firmes no chão",
            "Pegue a barra com afastamento um pouco maior que os ombros",
            "Desça a barra até a parte superior do peito",
            "Empurre para cima mantendo controle total"
        ]
    },
    {
        "nome": "Supino com Halteres",
        "nome_en": "Dumbbell Bench Press",
        "descricao": "Permite maior amplitude de movimento e trabalho unilateral dos músculos.",
        "musculo_primario": "Peito",
        "equipamento": "Halteres",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/dumbbell-bench-press.jpg",
        "gif": f"{GIF_BASE_URL}/dumbbell-bench-press.gif",
        "instrucoes": [
            "Deite-se no banco com um halter em cada mão",
            "Posicione os halteres na altura do peito",
            "Empurre os halteres para cima simultaneamente",
            "Desça controladamente até sentir alongamento no peito",
            "Mantenha os cotovelos ligeiramente flexionados"
        ]
    },
    {
        "nome": "Crucifixo com Halteres",
        "nome_en": "Dumbbell Flyes",
        "descricao": "Exercício de isolamento para o peitoral com foco no alongamento muscular.",
        "musculo_primario": "Peito",
        "equipamento": "Halteres",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/dumbbell-flyes.jpg",
        "gif": f"{GIF_BASE_URL}/dumbbell-flyes.gif",
        "instrucoes": [
            "Deite-se no banco com halteres nas mãos",
            "Abra os braços em arco amplo",
            "Desça até sentir alongamento no peito",
            "Contraia o peito para subir os halteres",
            "Mantenha leve flexão nos cotovelos"
        ]
    },
    {
        "nome": "Flexão de Braço",
        "nome_en": "Push-ups",
        "descricao": "Exercício clássico usando peso corporal, excelente para iniciantes.",
        "musculo_primario": "Peito",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/push-ups.jpg",
        "gif": f"{GIF_BASE_URL}/push-ups.gif",
        "instrucoes": [
            "Posicione-se em prancha com mãos na largura dos ombros",
            "Mantenha o corpo reto da cabeça aos pés",
            "Desça o corpo até o peito quase tocar o chão",
            "Empurre para cima até a extensão completa",
            "Respire controladamente durante o movimento"
        ]
    },

    # COSTAS
    {
        "nome": "Barra Fixa",
        "nome_en": "Pull-ups",
        "descricao": "Exercício fundamental para latíssimo do dorso e força funcional.",
        "musculo_primario": "Costas",
        "equipamento": "Barra Fixa",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/pull-ups.jpg",
        "gif": f"{GIF_BASE_URL}/pull-ups.gif",
        "instrucoes": [
            "Pendure-se na barra com pegada pronada",
            "Mantenha afastamento maior que a largura dos ombros",
            "Puxe o corpo para cima até o queixo passar a barra",
            "Desça controladamente até extensão completa",
            "Evite balançar o corpo durante o movimento"
        ]
    },
    {
        "nome": "Levantamento Terra",
        "nome_en": "Deadlift",
        "descricao": "Um dos exercícios mais completos, trabalha múltiplos grupos musculares.",
        "musculo_primario": "Costas",
        "equipamento": "Barra",
        "dificuldade": "Avançado",
        "imagem": f"{IMAGE_BASE_URL}/deadlift.jpg",
        "gif": f"{GIF_BASE_URL}/deadlift.gif",
        "instrucoes": [
            "Posicione-se com pés na largura dos ombros",
            "Pegue a barra com afastamento das mãos na largura dos ombros",
            "Mantenha coluna neutra e peito elevado",
            "Levante a barra estendendo quadris e joelhos simultaneamente",
            "Finalize em pé com ombros para trás"
        ]
    },
    {
        "nome": "Remada Curvada",
        "nome_en": "Bent Over Barbell Row",
        "descricao": "Excelente para desenvolvimento da musculatura das costas e postura.",
        "musculo_primario": "Costas",
        "equipamento": "Barra",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/bent-over-row.jpg",
        "gif": f"{GIF_BASE_URL}/bent-over-row.gif",
        "instrucoes": [
            "Fique em pé segurando a barra",
            "Incline o tronco para frente mantendo coluna reta",
            "Puxe a barra em direção ao abdômen",
            "Contraia as escápulas no final do movimento",
            "Desça a barra controladamente"
        ]
    },

    # PERNAS
    {
        "nome": "Agachamento Livre",
        "nome_en": "Barbell Back Squat",
        "descricao": "O rei dos exercícios para pernas, trabalha quadríceps, glúteos e core.",
        "musculo_primario": "Pernas",
        "equipamento": "Barra",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/barbell-squat.jpg",
        "gif": f"{GIF_BASE_URL}/barbell-squat.gif",
        "instrucoes": [
            "Posicione a barra nas costas (trapézio)",
            "Pés na largura dos ombros, pontas ligeiramente para fora",
            "Desça flexionando quadris e joelhos simultaneamente",
            "Desça até coxas paralelas ao chão",
            "Suba empurrando pelos calcanhares"
        ]
    },
    {
        "nome": "Leg Press",
        "nome_en": "Leg Press",
        "descricao": "Exercício seguro para quadríceps e glúteos, ideal para iniciantes.",
        "musculo_primario": "Pernas",
        "equipamento": "Máquina",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/leg-press.jpg",
        "gif": f"{GIF_BASE_URL}/leg-press.gif",
        "instrucoes": [
            "Sente-se na máquina com costas apoiadas",
            "Posicione pés na plataforma na largura dos ombros",
            "Desça flexionando joelhos até 90 graus",
            "Empurre a plataforma de volta à posição inicial",
            "Mantenha core contraído durante todo movimento"
        ]
    },

    # OMBROS
    {
        "nome": "Desenvolvimento Militar",
        "nome_en": "Military Press",
        "descricao": "Exercício fundamental para força e desenvolvimento dos ombros.",
        "musculo_primario": "Ombros",
        "equipamento": "Barra",
        "dificuldade": "Intermediário",
        "imagem": f"{IMAGE_BASE_URL}/military-press.jpg",
        "gif": f"{GIF_BASE_URL}/military-press.gif",
        "instrucoes": [
            "Fique em pé com barra na altura dos ombros",
            "Pegue a barra com afastamento na largura dos ombros",
            "Empurre a barra verticalmente acima da cabeça",
            "Mantenha core contraído e postura ereta",
            "Desça controladamente até a posição inicial"
        ]
    },
    {
        "nome": "Elevação Lateral",
        "nome_en": "Lateral Raise",
        "descricao": "Isolamento para deltoides medial, criando largura nos ombros.",
        "musculo_primario": "Ombros",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/lateral-raise.jpg",
        "gif": f"{GIF_BASE_URL}/lateral-raise.gif",
        "instrucoes": [
            "Fique em pé com halter em cada mão",
            "Braços ligeiramente flexionados ao lado do corpo",
            "Levante os halteres lateralmente até altura dos ombros",
            "Pause no topo e desça controladamente",
            "Evite usar impulso ou balançar o corpo"
        ]
    },

    # BRAÇOS - BÍCEPS
    {
        "nome": "Rosca Direta",
        "nome_en": "Barbell Curl",
        "descricao": "Exercício clássico para desenvolvimento do bíceps.",
        "musculo_primario": "Bíceps",
        "equipamento": "Barra",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/barbell-curl.jpg",
        "gif": f"{GIF_BASE_URL}/barbell-curl.gif",
        "instrucoes": [
            "Fique em pé segurando a barra com pegada supinada",
            "Mantenha cotovelos próximos ao corpo",
            "Flexione os cotovelos levantando a barra",
            "Contraia os bíceps no topo do movimento",
            "Desça a barra controladamente"
        ]
    },
    {
        "nome": "Rosca Martelo",
        "nome_en": "Hammer Curl",
        "descricao": "Trabalha bíceps e antebraços com pegada neutra.",
        "musculo_primario": "Bíceps",
        "equipamento": "Halteres",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/hammer-curl.jpg",
        "gif": f"{GIF_BASE_URL}/hammer-curl.gif",
        "instrucoes": [
            "Segure halteres com pegada neutra (palmas voltadas uma para a outra)",
            "Mantenha cotovelos fixos ao lado do corpo",
            "Flexione um braço de cada vez ou simultaneamente",
            "Pause no topo contraindo o bíceps",
            "Desça controladamente mantendo tensão"
        ]
    },

    # BRAÇOS - TRÍCEPS
    {
        "nome": "Tríceps na Polia",
        "nome_en": "Tricep Pushdown",
        "descricao": "Exercício popular e eficaz para isolamento do tríceps.",
        "musculo_primario": "Tríceps",
        "equipamento": "Cabos",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/tricep-pushdown.jpg",
        "gif": f"{GIF_BASE_URL}/tricep-pushdown.gif",
        "instrucoes": [
            "Posicione-se de frente para a polia alta",
            "Segure a barra ou corda com pegada pronada",
            "Mantenha cotovelos fixos ao lado do corpo",
            "Empurre para baixo até extensão completa",
            "Suba controladamente mantendo tensão"
        ]
    },

    # CORE/ABDÔMEN
    {
        "nome": "Prancha",
        "nome_en": "Plank",
        "descricao": "Exercício isométrico fundamental para fortalecimento do core.",
        "musculo_primario": "Abdômen",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/plank.jpg",
        "gif": f"{GIF_BASE_URL}/plank.gif",
        "instrucoes": [
            "Posicione-se em posição de flexão com antebraços no chão",
            "Mantenha corpo reto da cabeça aos pés",
            "Contraia abdômen e glúteos",
            "Respire normalmente mantendo posição",
            "Evite levantar ou baixar o quadril"
        ]
    },
    {
        "nome": "Abdominal",
        "nome_en": "Crunches",
        "descricao": "Exercício clássico para fortalecimento do reto abdominal.",
        "musculo_primario": "Abdômen",
        "equipamento": "Peso Corporal",
        "dificuldade": "Iniciante",
        "imagem": f"{IMAGE_BASE_URL}/crunches.jpg",
        "gif": f"{GIF_BASE_URL}/crunches.gif",
        "instrucoes": [
            "Deite-se com joelhos flexionados",
            "Mãos atrás da cabeça ou cruzadas no peito",
            "Contraia o abdômen levantando os ombros",
            "Pare quando sentir contração máxima",
            "Desça controladamente sem relaxar completamente"
        ]
    }
]

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
    """Insere exercícios em português com imagens locais"""
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
    
    # Limpar exercícios existentes
    cur.execute("DELETE FROM exercises;")
    cur.execute("ALTER SEQUENCE exercises_id_seq RESTART WITH 1;")
    conn.commit()
    print("🗑️  Exercícios anteriores removidos")
    
    # Preparar lookups
    muscle_map, equipment_map, diff_map = preparar_lookups(cur)
    print("📋 Lookup maps carregados")
    
    # SQL de inserção
    sql = """
        INSERT INTO exercises (
            name, description, instructions, primary_muscle_group_id, 
            equipment_id, difficulty_level_id, image_url, animation_url,
            original_name
        ) VALUES %s
    """
    
    batch = []
    
    for exercicio in EXERCICIOS_COM_IMAGENS:
        # Obter IDs das tabelas de referência
        muscle_id = muscle_map.get(exercicio["musculo_primario"], 1)
        equipment_id = equipment_map.get(exercicio["equipamento"], 1)
        diff_id = diff_map.get(exercicio["dificuldade"], 2)
        
        # Converter instruções para texto
        instrucoes = "\n".join([f"{i+1}. {instrucao}" for i, instrucao in enumerate(exercicio.get("instrucoes", []))])
        
        batch.append((
            exercicio["nome"],
            exercicio["descricao"],
            instrucoes,
            muscle_id,
            equipment_id,
            diff_id,
            exercicio["imagem"],
            exercicio["gif"],
            exercicio["nome_en"]
        ))
        
        print(f"✅ {exercicio['nome']}")
    
    # Inserir em batch
    execute_values(cur, sql, batch)
    conn.commit()
    
    cur.close()
    conn.close()
    
    print(f"\n🎉 {len(EXERCICIOS_COM_IMAGENS)} exercícios inseridos com imagens!")
    return len(EXERCICIOS_COM_IMAGENS)

def verificar_resultado():
    """Verifica os exercícios inseridos"""
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT COUNT(*) as total,
               COUNT(image_url) as com_imagem,
               COUNT(animation_url) as com_gif
        FROM exercises 
        WHERE image_url IS NOT NULL OR animation_url IS NOT NULL
    """)
    
    result = cur.fetchone()
    total, com_imagem, com_gif = result
    
    cur.execute("SELECT name, image_url, animation_url FROM exercises LIMIT 5;")
    exemplos = cur.fetchall()
    
    cur.close()
    conn.close()
    
    print(f"\n📊 RESULTADO:")
    print(f"Total de exercícios: {total}")
    print(f"Com imagem estática: {com_imagem}")
    print(f"Com GIF/animação: {com_gif}")
    
    print(f"\n📋 Exemplos:")
    for nome, img, gif in exemplos:
        print(f"  {nome}")
        print(f"    Imagem: {img}")
        print(f"    GIF: {gif}")

if __name__ == "__main__":
    print("🏋️‍♂️ SAGA - Exercícios em Português com Imagens")
    print("=" * 60)
    
    try:
        total = inserir_exercicios_com_imagens()
        verificar_resultado()
        print(f"\n✅ SUCESSO! {total} exercícios inseridos com imagens!")
        
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc() 