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
