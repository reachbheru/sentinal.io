from pydantic import BaseModel, Field
from typing import Optional

class UserQuery(BaseModel):
    query: str = Field(..., description="The user's search query string")
    user_id: int | None = Field(None, description="Optional user ID if available for tracking")
