# First run main4.py to start the FastAPI server:
# uvicorn main4:app --reload --host 0.0.0.0 --port 8000

# Then run this test script to check the STT endpoint:
# python3 test4.py

# Make sure to have the ElevenLabs API key set in your environment variables:

import requests

url = "http://localhost:8000/stt/"
file_path = "ElevenLabsMandarinSample.mp3"

with open(file_path, "rb") as f:
    files = {
        "file": ("ElevenLabsMandarinSample.mp3", f, "audio/mpeg"),
    }
    data = {
        # "model_id": "eleven_multilingual_v2",  # required
        "model_id": "scribe_v1",  # valid STT model ID
        "language_id": "zh"  # optional
    }
    response = requests.post(url, files=files, data=data)

print("Status:", response.status_code)
try:
    print("Response:", response.json())
except Exception as e:
    print("Raw Response:", response.text)
    print("Error parsing JSON response:", e)
