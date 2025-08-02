# First run this file:
# uvicorn main4_STT:app --reload --host 0.0.0.0 --port 8000

# Then run this test script to check the STT endpoint:
# python3 test4_STT.py

# Make sure to have the ElevenLabs API key set in your environment variables:

from fastapi import FastAPI, UploadFile, File, Form
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_BASE_URL = os.getenv("ELEVENLABS_BASE_URL", "https://api.elevenlabs.io")

@app.post("/stt/")
async def transcribe_audio(
    file: UploadFile = File(...),
    model_id: str = Form(...),
    language_id: str = Form(None)
):
    audio_bytes = await file.read()

    # Build multipart form-data for forwarding to ElevenLabs
    multipart_data = {
        "file": (file.filename, audio_bytes, file.content_type),
        "model_id": (None, model_id)
    }
    if language_id:
        multipart_data["language_id"] = (None, language_id)

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{ELEVENLABS_BASE_URL}/v1/speech-to-text",
            headers={"xi-api-key": ELEVENLABS_API_KEY},
            files=multipart_data,
        )

    if response.status_code != 200:
        return {"error": response.text}

    return response.json()
