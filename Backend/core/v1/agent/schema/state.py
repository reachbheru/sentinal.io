from pydantic import BaseModel, Field
from typing import List,Annotated, Dict, Any
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict

class State(TypedDict):
    messages: Annotated[list, add_messages]
    user_question: str | None
    google_results: str | None
    instagram_data: str | None
    facebook_data: str | None
    google_analysis: str | None
    instagram_analysis: str | None
    facebook_analysis: str | None
    social_media_analysis: str | None
    final_answer: str | None

class InstagramURLAnalysis(BaseModel):
    selected_urls: List[str] = Field(description="List of Instagram URLs that contain valuable information for answering the user's question")
    instagram_post_data: List[Dict[str, Any]] = Field(description="List of Instagram post data corresponding to the selected URLs")

class FacebookURLAnalysis(BaseModel):
    selected_urls: List[str] = Field(description="List of Facebook URLs that contain valuable information for answering the user's question")
    facebook_post_data: List[Dict[str, Any]] = Field(description="List of Facebook post data corresponding to the selected URLs")