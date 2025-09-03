from fastapi import APIRouter, Depends, HTTPException
from Backend.api.v1.schemas.query.request import UserQuery
from Backend.api.v1.schemas.analyzer.response import AnalysisOutput
from Backend.api.v1.dependencies.service_deps import get_query_service
from Backend.services.v1.query import QueryService

# Initialize router
router = APIRouter()

@router.post("/query", summary="Takes a user and return all true and fake news related to the query", response_model=AnalysisOutput)
async def receive_query(user_query: UserQuery, query_service: QueryService = Depends(get_query_service)):
    enhanced_query = await query_service.enhance_query()
    return enhanced_query