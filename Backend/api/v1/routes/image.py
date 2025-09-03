# Backend/api/v1/routers/image.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from Backend.api.v1.schemas.image.response import ImageAnalysisOutput
from Backend.services.v1.image.service import ImageFactCheckService

router = APIRouter()

@router.post("/upload-and-fact-check", response_model=ImageAnalysisOutput)
async def upload_and_fact_check_image(
    image: UploadFile = File(..., description="Image file to upload and fact-check")
):
    """
    Upload an image to Cloudinary, save metadata to MongoDB, 
    and perform fact-checking using Google Vision API.
    """

    print("Received image:", image.filename, image.content_type)

    # Validate file type
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail="File must be an image"
        )
    
    # Initialize service
    service = ImageFactCheckService()
    
    try:
        # Process the image through the complete pipeline
        result = await service.process_image(image)
        print("Processing result:", result)
        return ImageAnalysisOutput(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"An unexpected error occurred: {str(e)}"
        )
