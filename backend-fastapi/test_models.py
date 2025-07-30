# test_models.py
import asyncio
from utils.elevenlabs import get_elevenlabs_models

async def test():
    models = await get_elevenlabs_models()
    print("Fetched", len(models), "models.")
    for m in models:
        print(f"- {m['name']} ({m['model_id']})")

if __name__ == "__main__":
    asyncio.run(test())
