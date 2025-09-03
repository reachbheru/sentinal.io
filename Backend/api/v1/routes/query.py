from fastapi import APIRouter, Depends, HTTPException
from Backend.api.v1.schemas.query.request import UserQuery
from Backend.api.v1.schemas.analyzer.response import AnalysisOutput

# Initialize router
router = APIRouter()

@router.post("/query", summary="Takes a user and return all true and fake news related to the query", response_model=AnalysisOutput)
async def receive_query(user_query: UserQuery):
    # Logic goes here: enhance query, fetch data, analyze, return output
    return True