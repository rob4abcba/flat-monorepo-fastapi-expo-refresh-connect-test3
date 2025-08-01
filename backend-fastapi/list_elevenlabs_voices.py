import requests
import os

API_KEY = os.getenv("ELEVENLABS_API_KEY")
BASE_URL = "https://api.elevenlabs.io/v1"

headers = {
    "xi-api-key": API_KEY
}

def list_voices():
    url = f"{BASE_URL}/voices"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        voices = response.json()
        print("Available Voices:")
        for voice in voices.get("voices", []):
            print(f"- ID: {voice['voice_id']}, Name: {voice['name']}")
    else:
        print(f"Failed to get voices. Status: {response.status_code}, Response: {response.text}")

if __name__ == "__main__":
    list_voices()
