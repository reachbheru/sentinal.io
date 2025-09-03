from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ImageAnalysisOutput(BaseModel):
    image_url: str = Field(..., description="Cloudinary URL of the uploaded image")
    mongodb_id: str = Field(..., description="MongoDB document ID")
    vision_analysis: Dict[str, Any] = Field(..., description="Google Vision API analysis results")
    fact_check_summary: str = Field(..., description="Summary of fact-checking analysis")
    confidence_score: Optional[float] = Field(None, description="Confidence score for fact-checking")