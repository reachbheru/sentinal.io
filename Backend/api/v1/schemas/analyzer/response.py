from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class PlatformStatistics(BaseModel):
    platform_name: str = Field(..., description="Name of the analysed platform")
    stats: Dict[str, Any] = Field(..., description="Statistics of the platform")

class AnalysisOutput(BaseModel):
    summary: str = Field(..., description="Main summary, data, or output from the analysis")
    resources: List[str] = Field(default_factory=list, description="List of resources used for analysis")
    statistics: List[PlatformStatistics] = Field(default_factory=list, description="Platform-specific statistics")
    fake_resources: List[str] = Field(default_factory=list, description="List of identified fake resources")
    additional_info: Optional[Dict[str, Any]] = Field(None, description="Any additional information relevant to the analysis")