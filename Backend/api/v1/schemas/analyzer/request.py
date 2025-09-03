from pydantic import BaseModel, Field
from typing import List

class Resource(BaseModel):
    name: str
    url: str

class AnalysisInput(BaseModel):
    data: str = Field(..., description="Data to be analysed")
    resources: List[Resource] = Field(default_factory=list, description="List of resources relevant to analysis")
