from fastapi import APIRouter, UploadFile, File
from Backend.services.v1.video.deepfake import DeepfakeDetector

router = APIRouter()

@router.post("/video/analyze")
async def analyze_video_threat(file: UploadFile = File(...)):
    # Read the uploaded video file
    video_bytes = await file.read()

    # Initialize Deepfake detector
    detector = DeepfakeDetector()

    # Analyze the video (assuming DeepfakeDetector.analyze accepts bytes)
    result = detector.analyze(video_bytes)

    return result

#