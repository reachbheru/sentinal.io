from pydantic import BaseModel, Field

class QueryEnhancementOutput(BaseModel):
    enhanced_query: str = Field(..., description="Enhanced query returned by the LLM")
    notes: str | None = Field(None, description="Any extra explanation from the enhancement step")