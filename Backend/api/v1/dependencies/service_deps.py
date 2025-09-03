from Backend.core.v1.llm.llm_client import LLMClient
from Backend.services.v1.query import QueryService
from Backend.api.v1.schemas.query.request import UserQuery


def get_gemini():
    return  LLMClient().gemini()

def get_query_service(user_query: UserQuery):
    llm = get_gemini()
    return QueryService(user_query=user_query, llm=llm)

def get_news_verification_flow():
    from Backend.core.v1.agent.flow import NewsVerificationFlow
    return NewsVerificationFlow()