import requests
import json

API_KEY = "009267ee-f71e-4c3b-93c9-eb4a4bc1ea0a"
HEADERS = {"api-key": API_KEY}

def debug_api():
    print("🔍 Analisando estrutura da API do Hevy...")
    
    url = "https://api.hevyapp.com/v1/exercise_templates"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        data = resp.json()
        
        print(f"📊 Página 1 de {data['page_count']}")
        print(f"📋 Total de exercícios na página: {len(data['exercise_templates'])}")
        
        # Analisar primeiro exercício
        if data["exercise_templates"]:
            primeiro = data["exercise_templates"][0]
            print(f"\n🔍 Estrutura do primeiro exercício:")
            print(json.dumps(primeiro, indent=2))
            
            print(f"\n📋 Campos disponíveis:")
            for key in primeiro.keys():
                value = primeiro[key]
                print(f"  {key}: {type(value).__name__} = {value}")
        
        # Procurar exercícios com campos de imagem
        print(f"\n🎬 Procurando exercícios com imagens...")
        for i, ex in enumerate(data["exercise_templates"][:10]):
            has_media = False
            media_fields = []
            
            for field in ["animation_url", "video_url", "image_url", "images", "media", "gif_url", "asset_url"]:
                if field in ex and ex[field]:
                    has_media = True
                    media_fields.append(f"{field}: {ex[field]}")
            
            if has_media:
                print(f"  ✅ {ex['title']}")
                for field in media_fields:
                    print(f"    {field}")
            elif i < 5:  # Mostrar os primeiros 5 mesmo sem mídia
                print(f"  ❌ {ex['title']} (sem mídia)")
    
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == "__main__":
    debug_api() 