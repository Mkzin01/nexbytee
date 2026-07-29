import os
import json
import base64
import requests
from pathlib import Path

# Configurações
LOVABLE_API_KEY = os.environ.get("LOVABLE_API_KEY")
GATEWAY_URL = "https://api.lovable.dev/v1/ai/chat/completions"

def generate_image(prompt, filename):
    print(f"Gerando imagem para: {filename}...")
    
    payload = {
        "model": "dall-e-3",
        "prompt": f"Professional website design mockup for a company. High-quality, modern, clean, tech-inspired. Desktop view of a landing page. Details: {prompt}",
        "n": 1,
        "size": "1024x1024",
        "response_format": "b64_json"
    }
    
    headers = {
        "Authorization": f"Bearer {LOVABLE_API_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(GATEWAY_URL, json=payload, headers=headers)
    
    if response.status_code != 200:
        print(f"Erro ao gerar imagem: {response.status_code}")
        print(response.text)
        return False
        
    data = response.json()
    # Note: The tool uses ai_gateway, but I'm simulating the image generation here.
    # Actually, I should use the imagegen tool if available, or just use the AI gateway for text.
    # Wait, the prompt says "gere imagens profissionais para o cliente ver o resultado".
    # I have a dedicated tool for images if I find it.
    return True

# Portfolio Projects
projects = [
    {
        "name": "Aurora Studio",
        "prompt": "Aurora Studio Architecture and Interior Design. Luxury minimalist website, large high-res images of modern buildings, elegant typography, Porto Portugal vibe.",
        "file": "src/assets/portfolio/aurora.jpg"
    },
    {
        "name": "Nova Café",
        "prompt": "Nova Café Specialty Coffee Shop. Warm, cozy, modern landing page, photos of latte art and coffee beans, Lisbon Portugal aesthetic.",
        "file": "src/assets/portfolio/nova.jpg"
    },
    {
        "name": "Vela Boutique",
        "prompt": "Vela Boutique Fashion Retail. High-end fashion e-commerce store, clean white background, stylish models, Cascais Portugal luxury style.",
        "file": "src/assets/portfolio/vela.jpg"
    },
    {
        "name": "Norte Advogados",
        "prompt": "Norte Advogados Law Firm. Professional legal website, blue and grey palette, images of law books and scales of justice, Braga Portugal trust and authority.",
        "file": "src/assets/portfolio/norte.jpg"
    }
]

# Since I can't actually call external APIs easily in this script without proper setup, 
# and there's a risk of failure, I'll use the prompt's instructions to "generate" 
# which usually means I should use the AI capabilities I have.
# I will use a simple placeholder approach or better yet, look for an image generation tool.
