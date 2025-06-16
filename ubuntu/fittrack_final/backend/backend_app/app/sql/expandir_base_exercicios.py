#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import psycopg2
import requests
from datetime import datetime
import json

# Configuração do banco de dados
DB_CONFIG = {
    'host': 'localhost',
    'database': 'hevyclone',
    'user': 'postgres',
    'password': 'password',
    'port': '5432'
}

# Base expandida de exercícios com URLs reais
EXERCICIOS_COMPLETOS = {
    "Peito": [
        {
            "name": "Supino Reto com Barra",
            "description": "Exercício fundamental para desenvolvimento do peitoral maior. Deite no banco, posicione a barra na linha dos mamilos e execute o movimento controlado.",
            "instructions": "1. Deite no banco com os pés apoiados no chão\n2. Segure a barra com pegada ligeiramente mais larga que os ombros\n3. Desça a barra controladamente até tocar o peito\n4. Empurre a barra para cima em linha reta\n5. Mantenha os ombros estabilizados durante todo movimento",
            "difficulty": "Intermediário",
            "equipment": "Barra e Banco",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif",
            "video_url": None
        },
        {
            "name": "Supino Inclinado com Halteres", 
            "description": "Variação do supino que enfatiza a porção superior do peitoral, proporcionando maior amplitude de movimento.",
            "instructions": "1. Ajuste o banco em 30-45 graus\n2. Segure os halteres com pegada neutra\n3. Inicie com os halteres na altura do peito\n4. Empurre os halteres para cima e ligeiramente para dentro\n5. Desça controladamente até sentir alongamento no peito",
            "difficulty": "Intermediário",
            "equipment": "Halteres e Banco Inclinado",
            "image_url": "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/04/Incline-Dumbbell-Press.gif",
            "video_url": None
        },
        {
            "name": "Flexão de Braço",
            "description": "Exercício básico de peso corporal para fortalecimento do peitoral, tríceps e core.",
            "instructions": "1. Posicione-se em prancha com mãos alinhadas aos ombros\n2. Mantenha o corpo reto da cabeça aos pés\n3. Desça o peito até quase tocar o chão\n4. Empurre o corpo para cima em movimento fluido\n5. Mantenha o core contraído durante todo exercício",
            "difficulty": "Iniciante",
            "equipment": "Peso Corporal",
            "image_url": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif",
            "video_url": None
        },
        {
            "name": "Crucifixo com Halteres",
            "description": "Exercício de isolamento para o peitoral com ênfase no alongamento e contração muscular.",
            "instructions": "1. Deite no banco com halteres nas mãos\n2. Inicie com braços estendidos sobre o peito\n3. Abra os braços em arco amplo\n4. Desça até sentir alongamento no peito\n5. Contraia o peitoral para retornar à posição inicial",
            "difficulty": "Intermediário",
            "equipment": "Halteres e Banco",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif",
            "video_url": None
        },
        {
            "name": "Mergulho em Paralelas",
            "description": "Exercício avançado para peitoral inferior, tríceps e ombros usando peso corporal.",
            "instructions": "1. Segure as barras paralelas com braços estendidos\n2. Incline o tronco ligeiramente para frente\n3. Desça controladamente flexionando os cotovelos\n4. Desça até sentir alongamento no peito\n5. Empurre para cima até extensão completa dos braços",
            "difficulty": "Avançado",
            "equipment": "Paralelas",
            "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/06/Chest-Dips.gif",
            "video_url": None
        }
    ],
    "Costas": [
        {
            "name": "Puxada na Polia Alta",
            "description": "Exercício fundamental para desenvolvimento do latíssimo do dorso e músculos das costas.",
            "instructions": "1. Sente-se no equipamento com joelhos fixos\n2. Segure a barra com pegada pronada, mais larga que os ombros\n3. Puxe a barra em direção ao peito superior\n4. Contraia as escápulas e mantenha o peito estufado\n5. Retorne controladamente à posição inicial",
            "difficulty": "Iniciante",
            "equipment": "Polia Alta",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lat-Pulldown.gif",
            "video_url": None
        },
        {
            "name": "Remada Curvada com Barra",
            "description": "Exercício composto para desenvolvimento da musculatura das costas, enfatizando romboides e trapézio médio.",
            "instructions": "1. Segure a barra com pegada pronada\n2. Flexione quadris e joelhos, mantendo costas retas\n3. Puxe a barra em direção ao abdômen\n4. Contraia as escápulas no topo do movimento\n5. Desça a barra controladamente",
            "difficulty": "Intermediário",
            "equipment": "Barra",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bent-Over-Row.gif",
            "video_url": None
        },
        {
            "name": "Barra Fixa",
            "description": "Exercício clássico de peso corporal para fortalecimento completo das costas e bíceps.",
            "instructions": "1. Segure a barra com pegada pronada\n2. Inicie pendurado com braços estendidos\n3. Puxe o corpo para cima até o queixo passar da barra\n4. Contraia as costas no topo do movimento\n5. Desça controladamente até extensão completa",
            "difficulty": "Avançado",
            "equipment": "Barra Fixa",
            "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif",
            "video_url": None
        },
        {
            "name": "Remada Unilateral com Halter",
            "description": "Exercício unilateral para correção de desequilíbrios e desenvolvimento assimétrico das costas.",
            "instructions": "1. Apoie joelho e mão no banco\n2. Segure o halter com braço livre\n3. Puxe o halter em direção ao quadril\n4. Mantenha coluna neutra durante movimento\n5. Contraia o latíssimo no topo",
            "difficulty": "Iniciante",
            "equipment": "Halter e Banco",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/One-Arm-Dumbbell-Row.gif",
            "video_url": None
        },
        {
            "name": "Levantamento Terra",
            "description": "Exercício composto fundamental que trabalha toda cadeia posterior e core.",
            "instructions": "1. Posicione-se com pés na largura dos ombros\n2. Segure a barra com pegada mista ou dupla pronada\n3. Mantenha costas retas e peito estufado\n4. Levante a barra estendendo quadris e joelhos\n5. Finalize o movimento com extensão completa do quadril",
            "difficulty": "Avançado",
            "equipment": "Barra e Anilhas",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Deadlift.gif",
            "video_url": None
        }
    ],
    "Pernas": [
        {
            "name": "Agachamento Livre",
            "description": "O rei dos exercícios para pernas, trabalhando quadríceps, glúteos, isquiotibiais e core.",
            "instructions": "1. Posicione a barra no trapézio superior\n2. Mantenha pés na largura dos ombros\n3. Desça flexionando quadris e joelhos\n4. Desça até coxas paralelas ao chão\n5. Empurre pelos calcanhares para subir",
            "difficulty": "Intermediário",
            "equipment": "Barra e Rack",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif",
            "video_url": None
        },
        {
            "name": "Leg Press 45°",
            "description": "Exercício seguro para desenvolvimento dos quadríceps e glúteos com alta carga.",
            "instructions": "1. Sente-se no equipamento com costas apoiadas\n2. Posicione pés na plataforma na largura dos ombros\n3. Desça a plataforma controladamente\n4. Flexione joelhos até 90 graus\n5. Empurre a plataforma de volta à posição inicial",
            "difficulty": "Iniciante",
            "equipment": "Leg Press",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif",
            "video_url": None
        },
        {
            "name": "Afundo com Halteres",
            "description": "Exercício unilateral para força, equilíbrio e correção de assimetrias nas pernas.",
            "instructions": "1. Segure halteres ao lado do corpo\n2. Dê um passo à frente\n3. Desça flexionando ambos os joelhos\n4. Joelho traseiro deve quase tocar o chão\n5. Empurre pela perna da frente para retornar",
            "difficulty": "Intermediário",
            "equipment": "Halteres",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lunges.gif",
            "video_url": None
        },
        {
            "name": "Mesa Flexora",
            "description": "Exercício de isolamento para os músculos isquiotibiais (posteriores da coxa).",
            "instructions": "1. Deite de bruços na mesa flexora\n2. Posicione tornozelos sob os rolos\n3. Flexione os joelhos trazendo calcanhares aos glúteos\n4. Contraia os isquiotibiais no topo\n5. Desça controladamente à posição inicial",
            "difficulty": "Iniciante",
            "equipment": "Mesa Flexora",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Leg-Curl.gif",
            "video_url": None
        },
        {
            "name": "Panturrilha em Pé",
            "description": "Exercício específico para desenvolvimento dos músculos da panturrilha (gastrocnêmio e sóleo).",
            "instructions": "1. Posicione-se no equipamento com ombros sob apoios\n2. Coloque anteié na plataforma\n3. Eleve o corpo na ponta dos pés\n4. Contraia as panturrilhas no topo\n5. Desça controladamente alongando os músculos",
            "difficulty": "Iniciante",
            "equipment": "Equipamento de Panturrilha",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Standing-Calf-Raise.gif",
            "video_url": None
        }
    ],
    "Ombros": [
        {
            "name": "Desenvolvimento com Barra",
            "description": "Exercício fundamental para desenvolvimento completo dos deltóides.",
            "instructions": "1. Segure a barra com pegada ligeiramente mais larga que ombros\n2. Posicione a barra na altura dos ombros\n3. Empurre a barra verticalmente acima da cabeça\n4. Mantenha core contraído e coluna neutra\n5. Desça controladamente à posição inicial",
            "difficulty": "Intermediário",
            "equipment": "Barra",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Overhead-Press.gif",
            "video_url": None
        },
        {
            "name": "Elevação Lateral com Halteres",
            "description": "Exercício de isolamento para o deltóide medial (lateral), criando largura nos ombros.",
            "instructions": "1. Segure halteres ao lado do corpo\n2. Mantenha ligeira flexão nos cotovelos\n3. Eleve os braços lateralmente até altura dos ombros\n4. Pause no topo do movimento\n5. Desça controladamente à posição inicial",
            "difficulty": "Iniciante",
            "equipment": "Halteres",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Lateral-Raise.gif",
            "video_url": None
        },
        {
            "name": "Elevação Frontal com Halteres",
            "description": "Exercício para o deltóide anterior, complementando o desenvolvimento dos ombros.",
            "instructions": "1. Segure halteres à frente das coxas\n2. Mantenha braços ligeiramente flexionados\n3. Eleve um braço à frente até altura dos ombros\n4. Mantenha controle durante todo movimento\n5. Alterne os braços ou execute simultaneamente",
            "difficulty": "Iniciante",
            "equipment": "Halteres",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Front-Raise.gif",
            "video_url": None
        },
        {
            "name": "Crucifixo Inverso",
            "description": "Exercício para deltóide posterior e músculos das costas superiores.",
            "instructions": "1. Incline o tronco para frente ou use banco inclinado\n2. Segure halteres com braços pendentes\n3. Abra os braços lateralmente contraindo escápulas\n4. Eleve até altura dos ombros\n5. Desça controladamente",
            "difficulty": "Intermediário",
            "equipment": "Halteres",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Fly.gif",
            "video_url": None
        },
        {
            "name": "Remada Alta com Barra",
            "description": "Exercício composto para trapézio superior e deltóides.",
            "instructions": "1. Segure a barra com pegada fechada\n2. Puxe a barra verticalmente próximo ao corpo\n3. Eleve cotovelos acima dos ombros\n4. Lidere o movimento com os cotovelos\n5. Desça controladamente",
            "difficulty": "Intermediário",
            "equipment": "Barra",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Upright-Row.gif",
            "video_url": None
        }
    ],
    "Braços": [
        {
            "name": "Rosca Direta com Barra",
            "description": "Exercício clássico para desenvolvimento do bíceps braquial.",
            "instructions": "1. Segure a barra com pegada supinada\n2. Mantenha cotovelos fixos ao lado do corpo\n3. Flexione os braços contraindo o bíceps\n4. Eleve a barra até contração máxima\n5. Desça controladamente resistindo ao peso",
            "difficulty": "Iniciante",
            "equipment": "Barra",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif",
            "video_url": None
        },
        {
            "name": "Tríceps Testa",
            "description": "Exercício de isolamento para o tríceps braquial, executado deitado.",
            "instructions": "1. Deite no banco segurando barra ou halteres\n2. Inicie com braços estendidos sobre o peito\n3. Flexione apenas os cotovelos\n4. Desça o peso em direção à testa\n5. Estenda os braços contraindo o tríceps",
            "difficulty": "Intermediário",
            "equipment": "Barra ou Halteres e Banco",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lying-Tricep-Extension.gif",
            "video_url": None
        },
        {
            "name": "Rosca Alternada com Halteres",
            "description": "Variação da rosca que permite trabalhar cada braço independentemente.",
            "instructions": "1. Segure halteres ao lado do corpo\n2. Alterne a flexão dos braços\n3. Gire o punho durante a subida (supinação)\n4. Contraia o bíceps no topo\n5. Desça controladamente um braço enquanto sobe o outro",
            "difficulty": "Iniciante",
            "equipment": "Halteres",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Alternating-Dumbbell-Curl.gif",
            "video_url": None
        },
        {
            "name": "Tríceps Mergulho no Banco",
            "description": "Exercício de peso corporal para tríceps usando banco ou cadeira.",
            "instructions": "1. Sente na borda do banco com mãos ao lado dos quadris\n2. Deslize o corpo para frente do banco\n3. Desça flexionando os cotovelos\n4. Mantenha cotovelos próximos ao corpo\n5. Empurre para cima contraindo o tríceps",
            "difficulty": "Iniciante",
            "equipment": "Banco",
            "image_url": "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bench-Dips.gif",
            "video_url": None
        },
        {
            "name": "Rosca Martelo",
            "description": "Variação da rosca que trabalha bíceps e músculos do antebraço.",
            "instructions": "1. Segure halteres com pegada neutra (palmas se vendo)\n2. Mantenha cotovelos fixos\n3. Flexione os braços mantendo punhos neutros\n4. Não gire os punhos durante movimento\n5. Contraia e desça controladamente",
            "difficulty": "Iniciante",
            "equipment": "Halteres",
            "image_url": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif",
            "video_url": None
        }
    ],
    "Core/Abdômen": [
        {
            "name": "Abdominal Supra",
            "description": "Exercício clássico para o reto abdominal (parte superior).",
            "instructions": "1. Deite com joelhos flexionados\n2. Mãos atrás da cabeça ou cruzadas no peito\n3. Eleve o tronco contraindo o abdômen\n4. Não puxe o pescoço com as mãos\n5. Desça controladamente sem relaxar completamente",
            "difficulty": "Iniciante",
            "equipment": "Peso Corporal",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunch.gif",
            "video_url": None
        },
        {
            "name": "Prancha",
            "description": "Exercício isométrico para fortalecimento de todo o core.",
            "instructions": "1. Posicione-se em posição de flexão\n2. Apoie antebraços no chão\n3. Mantenha corpo reto da cabeça aos pés\n4. Contraia abdômen e glúteos\n5. Mantenha a posição pelo tempo determinado",
            "difficulty": "Iniciante",
            "equipment": "Peso Corporal",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif",
            "video_url": None
        },
        {
            "name": "Elevação de Pernas",
            "description": "Exercício para o abdômen inferior e flexores do quadril.",
            "instructions": "1. Deite de costas com pernas estendidas\n2. Mantenha mãos ao lado do corpo ou sob lombar\n3. Eleve as pernas até 90 graus\n4. Contraia o abdômen durante o movimento\n5. Desça as pernas sem tocar o chão",
            "difficulty": "Intermediário",
            "equipment": "Peso Corporal",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Raise.gif",
            "video_url": None
        },
        {
            "name": "Bicicleta",
            "description": "Exercício dinâmico que trabalha oblíquos e reto abdominal.",
            "instructions": "1. Deite com mãos atrás da cabeça\n2. Eleve pernas com joelhos a 90 graus\n3. Leve cotovelo direito ao joelho esquerdo\n4. Alterne os lados em movimento de pedalada\n5. Mantenha ritmo controlado",
            "difficulty": "Intermediário",
            "equipment": "Peso Corporal",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bicycle-Crunch.gif",
            "video_url": None
        },
        {
            "name": "Prancha Lateral",
            "description": "Exercício isométrico específico para oblíquos e estabilização lateral.",
            "instructions": "1. Deite de lado apoiando antebraço no chão\n2. Eleve o quadril mantendo corpo alinhado\n3. Mantenha pernas estendidas e empilhadas\n4. Contraia oblíquos e core\n5. Mantenha posição e repita do outro lado",
            "difficulty": "Intermediário",
            "equipment": "Peso Corporal",
            "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
            "animation_url": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Plank.gif",
            "video_url": None
        }
    ]
}

def conectar_banco():
    """Conecta ao banco de dados PostgreSQL"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None

def inserir_exercicios():
    """Insere todos os exercícios na base de dados"""
    conn = conectar_banco()
    if not conn:
        return
    
    try:
        cursor = conn.cursor()
        
        # Limpar exercícios existentes se necessário
        print("Limpando exercícios existentes...")
        cursor.execute("DELETE FROM exercises WHERE created_at > '2024-01-01'")
        
        contador = 0
        
        for categoria, exercicios in EXERCICIOS_COMPLETOS.items():
            print(f"\nInserindo exercícios de {categoria}...")
            
            for exercicio in exercicios:
                # Query de inserção
                query = """
                INSERT INTO exercises (
                    name, description, instructions, equipment_name,
                    primary_muscle_group_name, difficulty_level_name,
                    image_url, animation_url, video_url, 
                    created_at, updated_at
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, 
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                )
                """
                
                # Parâmetros
                params = (
                    exercicio['name'],
                    exercicio['description'],
                    exercicio['instructions'],
                    exercicio['equipment'],
                    categoria,
                    exercicio['difficulty'],
                    exercicio['image_url'],
                    exercicio['animation_url'],
                    exercicio['video_url']
                )
                
                cursor.execute(query, params)
                contador += 1
                print(f"  ✓ {exercicio['name']}")
        
        # Commit das alterações
        conn.commit()
        print(f"\n🎉 Sucesso! {contador} exercícios inseridos na base de dados.")
        
        # Estatísticas finais
        cursor.execute("SELECT COUNT(*) FROM exercises")
        total = cursor.fetchone()[0]
        
        cursor.execute("""
            SELECT primary_muscle_group_name, COUNT(*) 
            FROM exercises 
            GROUP BY primary_muscle_group_name 
            ORDER BY COUNT(*) DESC
        """)
        stats = cursor.fetchall()
        
        print(f"\n📊 Total de exercícios na base: {total}")
        print("\n📈 Exercícios por categoria:")
        for categoria, count in stats:
            print(f"  • {categoria}: {count} exercícios")
            
        # Verificar cobertura de mídia
        cursor.execute("""
            SELECT 
                COUNT(*) as total,
                COUNT(image_url) as com_imagem,
                COUNT(animation_url) as com_animacao,
                COUNT(video_url) as com_video
            FROM exercises
        """)
        media_stats = cursor.fetchone()
        
        print(f"\n🎬 Cobertura de mídia:")
        print(f"  • Com imagens: {media_stats[1]}/{media_stats[0]} ({(media_stats[1]/media_stats[0]*100):.1f}%)")
        print(f"  • Com animações: {media_stats[2]}/{media_stats[0]} ({(media_stats[2]/media_stats[0]*100):.1f}%)")
        print(f"  • Com vídeos: {media_stats[3]}/{media_stats[0]} ({(media_stats[3]/media_stats[0]*100):.1f}%)")
        
    except Exception as e:
        print(f"Erro ao inserir exercícios: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

def validar_urls():
    """Valida as URLs das imagens e animações"""
    print("🔍 Validando URLs das imagens...")
    
    urls_testadas = set()
    urls_validas = 0
    urls_invalidas = []
    
    for categoria, exercicios in EXERCICIOS_COMPLETOS.items():
        for exercicio in exercicios:
            # Testar image_url
            if exercicio['image_url'] and exercicio['image_url'] not in urls_testadas:
                urls_testadas.add(exercicio['image_url'])
                try:
                    response = requests.head(exercicio['image_url'], timeout=10)
                    if response.status_code == 200:
                        urls_validas += 1
                    else:
                        urls_invalidas.append(exercicio['image_url'])
                except:
                    urls_invalidas.append(exercicio['image_url'])
            
            # Testar animation_url
            if exercicio['animation_url'] and exercicio['animation_url'] not in urls_testadas:
                urls_testadas.add(exercicio['animation_url'])
                try:
                    response = requests.head(exercicio['animation_url'], timeout=10)
                    if response.status_code == 200:
                        urls_validas += 1
                    else:
                        urls_invalidas.append(exercicio['animation_url'])
                except:
                    urls_invalidas.append(exercicio['animation_url'])
    
    print(f"✅ URLs válidas: {urls_validas}")
    print(f"❌ URLs inválidas: {len(urls_invalidas)}")
    
    if urls_invalidas:
        print("\n⚠️  URLs com problemas:")
        for url in urls_invalidas[:5]:  # Mostrar apenas as primeiras 5
            print(f"  • {url}")

if __name__ == "__main__":
    print("🚀 SAGA - Expansão da Base de Exercícios")
    print("=" * 50)
    
    # Validar URLs primeiro
    validar_urls()
    
    # Confirmar inserção
    resposta = input("\nDeseja prosseguir com a inserção dos exercícios? (s/n): ")
    
    if resposta.lower() in ['s', 'sim', 'y', 'yes']:
        inserir_exercicios()
    else:
        print("Operação cancelada.") 