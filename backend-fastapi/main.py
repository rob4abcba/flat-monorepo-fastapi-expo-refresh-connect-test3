from fastapi import FastAPI, UploadFile, File, Form, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from utils.elevenlabs import get_elevenlabs_models
import io
import httpx
import os
import requests
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
# ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
ELEVENLABS_BASE_URL = os.getenv("ELEVENLABS_BASE_URL", "https://api.elevenlabs.io")
HEADERS = {"xi-api-key": ELEVENLABS_API_KEY}
# headers = {"xi-api-key": ELEVEN_API_KEY}


class PingRequest(BaseModel):
    message: str

class PingResponse(BaseModel):
    message: str

@app.post("/ping2", response_model=PingResponse)
def ping2(data: PingRequest):
    return {"message": f"Echo: {data.message}"}

@app.get("/ping1")
def ping1():
    return {"message": "pongMISSkkkgggg"} # This is a test endpoint to check if the server is running.  If this message shows on the frontend in tab "refresh", the server is running and is correctly connected to the frontend with no CORS issues.

@app.post("/tts")
async def text_to_speech(
    text: str = Form(...),
    voice_id: str = Form(default="Rachel")
):
    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        # "model_id": "elevenlabs_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    async with httpx.AsyncClient() as client:
        tts_response = await client.post(
            f"{ELEVENLABS_BASE_URL}/v1/text-to-speech/{voice_id}",
            headers={
                **HEADERS,
                "Content-Type": "application/json"
            },
            json=payload
        )

    if tts_response.status_code != 200:
        return {"error": tts_response.text}

    return StreamingResponse(io.BytesIO(tts_response.content), media_type="audio/mpeg")

@app.post("/stt/")
# async def transcribe_audio(file: UploadFile = File(...)):
async def transcribe_audio(
    file: UploadFile = File(...),
    # model_id: str = Form(default="eleven_multilingual_v2"),  # Add default
    model_id: str = Form(...),
    # language_id: str = Form(default="en")
    language_id: str = Form(None)
):
    # audioYo = await file.read()
    # async with httpx.AsyncClient() as client:
    #     response = await client.post(
    #         f"{ELEVENLABS_BASE_URL}/v1/speech-to-text",
    #         headers={
    #             **HEADERS,
    #             "Content-Type": "application/octet-stream"
    #         },
    #         content=audioYo
    #     )


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

@app.get("/list_models/")
async def list_models():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{ELEVENLABS_BASE_URL}/v1/models", headers=HEADERS)
    return res.json()

@app.get("/models")
async def models():
    return await get_elevenlabs_models()

def fetch_model_ids_from_models():
    response = requests.get("http://localhost:8000/models", headers=HEADERS)
    response.raise_for_status()
    return [model["model_id"] for model in response.json()]


def fetch_model_ids_from_list_models():
    response = requests.get("http://localhost:8000/list_models", headers=HEADERS)
    response.raise_for_status()
    return [model["model_id"] for model in response.json()]


@router.get("/compare_models")
def compare_model_ids():
    models_1 = set(fetch_model_ids_from_models())
    models_2 = set(fetch_model_ids_from_list_models())

    return {
        "only_in_models": sorted(models_1 - models_2),
        "only_in_list_models": sorted(models_2 - models_1),
        "shared_models": sorted(models_1 & models_2),
    }

# app.include_router(router, prefix="/api")
app.include_router(router)