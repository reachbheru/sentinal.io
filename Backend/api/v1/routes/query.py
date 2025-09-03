from fastapi import APIRouter, Depends, HTTPException
from Backend.api.v1.schemas.query.request import UserQuery
from Backend.api.v1.dependencies.service_deps import get_news_verification_flow, get_structured_output


# Initialize router
router = APIRouter()

@router.post("/query", summary="Takes a user and return all true and fake news related to the query")
async def receive_query(user_query: UserQuery):
    news_verification_flow = get_news_verification_flow()
    data = news_verification_flow.run_news_verification(user_query.query)

    return data