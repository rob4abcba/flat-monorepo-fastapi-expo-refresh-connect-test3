import requests

# Sample public MP3 (no API key needed)
url = "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3" # electronic music with no lyrics
output_path = "ElectronicMusic_NoLyrics_Kalimba.mp3"

# Download the MP3 file
print(f"Downloading from {url} to {output_path}...")

try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    with open(output_path, "wb") as f:
        f.write(response.content)
    print(f"✅ Successfully downloaded and saved test audio file to: {output_path}")
except requests.RequestException as e:
    print(f"Download failed: {e}")
