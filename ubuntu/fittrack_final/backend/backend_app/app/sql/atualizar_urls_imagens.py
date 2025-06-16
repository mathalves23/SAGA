import psycopg2

# Configuração
DB_URL = "postgresql://saga_user@127.0.0.1:5432/saga"

# Mapeamento de exercícios para imagens reais (URLs de exemplo)
EXERCISE_IMAGES = {
    # Exercícios de peito
    "Supino Reto com Barra": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Bench-Press.gif"
    },
    "Supino Inclinado com Barra": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Incline-Barbell-Bench-Press.gif"
    },
    "Supino com Halteres": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Bench-Press.gif"
    },
    "Crucifixo com Halteres": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Dumbbell-Flyes.gif"
    },
    "Flexão de Braço": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Push-up.gif"
    },
    
    # Exercícios de costas
    "Barra Fixa": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Pull-up.gif"
    },
    "Levantamento Terra": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Deadlift.gif"
    },
    "Remada Curvada": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Bent-Over-Row.gif"
    },
    
    # Exercícios de pernas
    "Agachamento Livre": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Squat.gif"
    },
    "Leg Press": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Leg-Press.gif"
    },
    
    # Exercícios de ombros
    "Desenvolvimento Militar": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Military-Press.gif"
    },
    "Elevação Lateral": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Lateral-Raise.gif"
    },
    
    # Exercícios de braços
    "Rosca Direta": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Barbell-Curl.gif"
    },
    "Rosca Martelo": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Hammer-Curl.gif"
    },
    "Tríceps na Polia": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Tricep-Pushdown.gif"
    },
    
    # Exercícios de core
    "Prancha": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Plank.gif"
    },
    "Abdominal": {
        "image": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        "gif": "https://fitnessprogramer.com/wp-content/uploads/2021/02/Crunches.gif"
    }
}

def atualizar_imagens_exercicios():
    """Atualiza as URLs das imagens dos exercícios no banco"""
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Buscar todos os exercícios
    cur.execute("SELECT id, name FROM exercises;")
    exercicios = cur.fetchall()
    
    atualizados = 0
    
    for exercise_id, name in exercicios:
        # Verificar se temos imagens específicas para este exercício
        if name in EXERCISE_IMAGES:
            image_data = EXERCISE_IMAGES[name]
            cur.execute("""
                UPDATE exercises 
                SET 
                    image_url = %s,
                    animation_url = %s,
                    thumbnail_url = %s
                WHERE id = %s
            """, (
                image_data["image"],
                image_data["gif"],
                image_data["image"],  # Usar a mesma imagem como thumbnail
                exercise_id
            ))
            atualizados += 1
            print(f"✅ {name} - Imagens atualizadas")
        else:
            # Usar imagem placeholder baseada no grupo muscular
            placeholder_image = gerar_placeholder_url(name)
            cur.execute("""
                UPDATE exercises 
                SET 
                    image_url = %s,
                    thumbnail_url = %s
                WHERE id = %s AND (image_url IS NULL OR image_url = '')
            """, (
                placeholder_image,
                placeholder_image,
                exercise_id
            ))
            print(f"📷 {name} - Placeholder adicionado")
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"\n🎉 {atualizados} exercícios atualizados com imagens reais!")
    return atualizados

def gerar_placeholder_url(exercise_name):
    """Gera URL de placeholder baseada no nome do exercício"""
    # Usar Unsplash com termos relacionados ao exercício
    base_url = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
    params = "?w=400&h=300&fit=crop&auto=format"
    
    # Mapear exercícios para imagens específicas do Unsplash
    if any(word in exercise_name.lower() for word in ["supino", "peito", "flexão"]):
        return f"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b{params}&q=80"
    elif any(word in exercise_name.lower() for word in ["agachamento", "leg", "pernas"]):
        return f"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b{params}&q=80"
    elif any(word in exercise_name.lower() for word in ["barra", "remada", "costas"]):
        return f"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b{params}&q=80"
    elif any(word in exercise_name.lower() for word in ["ombro", "desenvolvimento", "elevação"]):
        return f"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b{params}&q=80"
    elif any(word in exercise_name.lower() for word in ["rosca", "bíceps", "tríceps"]):
        return f"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b{params}&q=80"
    else:
        return f"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b{params}&q=80"

def verificar_resultado():
    """Verifica quantos exercícios têm imagens"""
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    cur.execute("""
        SELECT 
            COUNT(*) as total,
            COUNT(image_url) as com_imagem,
            COUNT(animation_url) as com_gif
        FROM exercises 
        WHERE image_url IS NOT NULL AND image_url != ''
    """)
    
    result = cur.fetchone()
    total, com_imagem, com_gif = result
    
    cur.execute("SELECT COUNT(*) FROM exercises;")
    total_exercicios = cur.fetchone()[0]
    
    # Mostrar alguns exemplos
    cur.execute("""
        SELECT name, image_url, animation_url 
        FROM exercises 
        WHERE image_url IS NOT NULL 
        LIMIT 5
    """)
    exemplos = cur.fetchall()
    
    cur.close()
    conn.close()
    
    print(f"\n📊 RESULTADO:")
    print(f"Total de exercícios: {total_exercicios}")
    print(f"Com imagem: {com_imagem}")
    print(f"Com GIF: {com_gif}")
    print(f"Taxa de cobertura: {(com_imagem/total_exercicios)*100:.1f}%")
    
    print(f"\n📋 Exemplos:")
    for nome, img, gif in exemplos:
        print(f"  {nome}")
        if img:
            print(f"    📷 {img}")
        if gif:
            print(f"    🎬 {gif}")

if __name__ == "__main__":
    print("🖼️  SAGA - Atualização de Imagens dos Exercícios")
    print("=" * 60)
    
    try:
        atualizar_imagens_exercicios()
        verificar_resultado()
        print("\n✅ Atualização concluída!")
        
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc() 