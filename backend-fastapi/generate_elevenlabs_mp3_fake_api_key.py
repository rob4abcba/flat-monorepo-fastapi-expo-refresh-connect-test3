import requests

api_key = "sk_3850403ba8fb267dbf5d7eb0a6c663dcf943a79da493367b"  # Replace this fake key with your real key
voice_id = "pNInz6obpgDQGcFmaJgB"
text = "你好，我是 ElevenLabs 中文语音测试。"
model_id = "eleven_multilingual_v2"

url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
headers = {
    "xi-api-key": api_key,
    "Content-Type": "application/json"
}
data = {
    "text": text,
    "model_id": model_id,
    "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
}

response = requests.post(url, headers=headers, json=data)
if response.status_code == 200:
    with open("output.mp3", "wb") as f:
        f.write(response.content)
    print("✅ Saved ElevenLabs output to output.mp3")
else:
    print(f"❌ Error: {response.status_code} - {response.text}")
