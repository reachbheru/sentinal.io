from dotenv import load_dotenv
from typing import Annotated, List
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain.chat_models import init_chat_model
from typing_extensions import TypedDict
from pydantic import BaseModel, Field
from .schema.state import State, InstagramURLAnalysis   
from Backend.api.v1.dependencies.service_deps import get_gemini
from weboperations import serp_search, instagram_post_search

class Flow:
    def __init__(self):
        self.state_graph = StateGraph(State)
        self.llm = get_gemini()

    def google_search(self, state: State):
        user_question = state.get("user_question", "")
        google_results = serp_search(user_question, engine="google")
        print(google_results)
        return {"google_results": google_results}
    
    def analyze_instagram_urls(self, state: State):
        user_question = state.get("user_question", "")

        instagram_post_search_results = instagram_post_search(user_question)
        print(instagram_post_search_results)

        return {"instagram_post_data": instagram_post_search_results}
