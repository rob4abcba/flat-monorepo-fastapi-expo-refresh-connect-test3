import httpx
from fastapi import HTTPException
import os

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_BASE_URL = os.getenv("ELEVENLABS_BASE_URL", "https://api.elevenlabs.io")

async def get_elevenlabs_models2():
    headers = {"xi-api-key": ELEVENLABS_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{ELEVENLABS_BASE_URL}/v1/models", headers=headers)

    if response.status_code != 200:
        # raise HTTPException(status_code=500, detail="Failed to fetch models from ElevenLabs")
        raise Exception(f"Error fetching models: {response.text}")

    # models = response.json()
    try:
        models = response.json()
    except Exception as e:
        print("❌ Failed to parse JSON in get_elevenlabs_models2:", e)
        raise

    print(f"Fetched {len(models)} models from ElevenLabs")
    # Check if the response is a list and contains models
    if not isinstance(models, list):
        raise HTTPException(status_code=500, detail="Unexpected response format from ElevenLabs")
    if not models:
        raise HTTPException(status_code=404, detail="No models found from ElevenLabs")
    print("elevenlabs2.py: RAW RESPONSE JSON:")
    print(models)
    print("Model IDs:")
    for model in models:
        print(f"- {model.get('model_id')} (type: {model.get('type')})") 


    # Split by type
    tts_models = [m for m in models if m.get("type") == "tts"]
    stt_models = [m for m in models if m.get("type") == "stt"]

    # return {
    #     "tts_models": tts_models,
    #     "stt_models": stt_models
    # }
    return models
