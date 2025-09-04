from fastapi import APIRouter, UploadFile, File
from Backend.services.v1.video.deepfake import DeepfakeDetector
from fastapi import HTTPException

router = APIRouter()

@router.post("/video/analyze")
async def analyze_video_threat(file: UploadFile = File(...)):
    # Read the uploaded video file
    video_bytes = await file.read()

    # Initialize Deepfake detector
    detector = DeepfakeDetector()

    try:
        result = detector.process_video_from_bytes(video_bytes, filename=file.filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")

    return result

#