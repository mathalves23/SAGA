import requests
import json
import time

API_KEY = "009267ee-f71e-4c3b-93c9-eb4a4bc1ea0a"
HEADERS = {"api-key": API_KEY}

def buscar_detalhes_exercicio(exercise_id):
    """Busca detalhes completos de um exercício específico"""
    url = f"https://api.hevyapp.com/v1/exercise_templates/{exercise_id}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return data.get("exercise_template", {})
    except Exception as e:
        print(f"❌ Erro ao buscar {exercise_id}: {e}")
        return None

def main():
    print("🔍 Buscando detalhes de exercícios...")
    
    # Primeiro, buscar lista de exercícios
    url = "https://api.hevyapp.com/v1/exercise_templates"
    exercicios_ids = []
    
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        data = resp.json()
        
        for ex in data["exercise_templates"][:10]:  # Testar apenas os primeiros 10
            exercicios_ids.append({
                "id": ex["id"],
                "title": ex["title"]
            })
    except Exception as e:
        print(f"❌ Erro ao buscar lista: {e}")
        return
    
    print(f"📋 Testando detalhes de {len(exercicios_ids)} exercícios...")
    
    exercicios_com_midia = []
    
    for ex in exercicios_ids:
        print(f"🔍 Buscando detalhes: {ex['title']}")
        detalhes = buscar_detalhes_exercicio(ex["id"])
        
        if detalhes:
            # Procurar por campos de mídia
            campos_midia = {}
            for campo in ["animation_url", "video_url", "image_url", "images", "media", "gif_url", "asset_url", "instruction_video_url", "demonstration_video_url"]:
                if campo in detalhes and detalhes[campo]:
                    campos_midia[campo] = detalhes[campo]
            
            if campos_midia:
                exercicios_com_midia.append({
                    "id": ex["id"],
                    "title": ex["title"],
                    "media": campos_midia
                })
                print(f"  ✅ Mídia encontrada: {list(campos_midia.keys())}")
            else:
                print(f"  ❌ Sem mídia")
            
            # Mostrar estrutura completa do primeiro exercício
            if ex == exercicios_ids[0]:
                print(f"\n📋 Estrutura completa do primeiro exercício:")
                print(json.dumps(detalhes, indent=2))
        
        time.sleep(0.5)  # Rate limiting
    
    print(f"\n🎬 Resumo:")
    print(f"Total testados: {len(exercicios_ids)}")
    print(f"Com mídia: {len(exercicios_com_midia)}")
    
    if exercicios_com_midia:
        print(f"\n✅ Exercícios com mídia encontrados:")
        for ex in exercicios_com_midia:
            print(f"  {ex['title']}: {list(ex['media'].keys())}")

if __name__ == "__main__":
    main() 