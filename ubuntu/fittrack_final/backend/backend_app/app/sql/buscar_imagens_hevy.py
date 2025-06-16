import requests
import psycopg2
import time

# Configuração
API_KEY = "009267ee-f71e-4c3b-93c9-eb4a4bc1ea0a"
DB_URL = "postgresql://saga_user@127.0.0.1:5432/saga"
HEADERS = {"api-key": API_KEY}

def main():
    print("🎬 Buscando exercícios com imagens do Hevy...")
    
    # Buscar exercícios do Hevy
    url = "https://api.hevyapp.com/v1/exercise_templates"
    exercicios_com_imagens = []
    
    while url:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            
            for ex in data["exercise_templates"]:
                if ex.get("animation_url") or ex.get("video_url") or ex.get("image_url"):
                    exercicios_com_imagens.append({
                        "id": ex["id"],
                        "title": ex["title"],
                        "animation_url": ex.get("animation_url"),
                        "video_url": ex.get("video_url"),
                        "image_url": ex.get("image_url")
                    })
            
            print(f"Página {data['page']}/{data['page_count']} processada")
            
            if data["page"] < data["page_count"]:
                url = f"https://api.hevyapp.com/v1/exercise_templates?page={data['page']+1}"
            else:
                url = None
                
            time.sleep(0.5)
            
        except Exception as e:
            print(f"Erro: {e}")
            break
    
    print(f"🎯 Encontrados {len(exercicios_com_imagens)} exercícios com imagens")
    
    # Conectar ao banco e atualizar
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    # Adicionar colunas se não existirem
    try:
        cur.execute("ALTER TABLE exercises ADD COLUMN IF NOT EXISTS animation_url TEXT")
        cur.execute("ALTER TABLE exercises ADD COLUMN IF NOT EXISTS external_id VARCHAR(100)")
        conn.commit()
    except:
        pass
    
    atualizados = 0
    
    for ex in exercicios_com_imagens:
        # Tentar encontrar exercício por nome similar
        cur.execute("SELECT id FROM exercises WHERE LOWER(name) LIKE %s LIMIT 1", 
                   (f"%{ex['title'].lower()[:20]}%",))
        result = cur.fetchone()
        
        if result:
            exercise_id = result[0]
            cur.execute("""
                UPDATE exercises 
                SET animation_url = %s, video_url = %s, image_url = %s, external_id = %s
                WHERE id = %s
            """, (ex["animation_url"], ex["video_url"], ex["image_url"], ex["id"], exercise_id))
            atualizados += 1
            print(f"✅ Atualizado: {ex['title']}")
    
    conn.commit()
    cur.close()
    conn.close()
    
    print(f"🎉 {atualizados} exercícios atualizados com imagens!")

if __name__ == "__main__":
    main() 