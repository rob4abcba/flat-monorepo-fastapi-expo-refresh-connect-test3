# utils/elevenlabs.py
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

async def get_elevenlabs_models():
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
    }
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.elevenlabs.io/v1/models", headers=headers)
        response.raise_for_status()
        return response.json()
