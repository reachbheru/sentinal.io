from Backend.core.v1.llm.llm_client import LLMClient

async def get_gemini():
    return LLMClient().gemini()
