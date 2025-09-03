from pydantic import BaseModel, Field
from typing import List,Annotated
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict

class State(TypedDict):
    messages: Annotated[list, add_messages]
    user_question: str | None
    google_results: str | None
    instagram_post_data: str | None
    selected_instagram_post_urls: list[str] | None
    google_analysis: str | None
    final_answer: str | None

class InstagramURLAnalysis(BaseModel):
    selected_urls: List[str] = Field(description="List of Instagram URLs that contain valuable information for answering the user's question")