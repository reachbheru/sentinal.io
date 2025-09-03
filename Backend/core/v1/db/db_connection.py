from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv  

load_dotenv(".env")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("MONGO_DB", "sentinel_io")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DATABASE_NAME]

# Optional: simple connection check
async def test_connection():
    try:
        await client.admin.command("ping")
        print("MongoDB connected successfully")
    except Exception as e:
        print("MongoDB connection failed:", e)
