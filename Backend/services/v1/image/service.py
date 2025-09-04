# from Backend.services.v1.s3.service import S3Service
# from google.cloud import vision
# from pymongo import MongoClient
# from fastapi import HTTPException, UploadFile
# import os, io, tempfile, shutil
# from datetime import datetime
# from typing import Dict, Any
# import json
# import requests
# from PIL import Image
# from dotenv import load_dotenv
# load_dotenv(".env")


# class ImageFactCheckService:
#     def __init__(self):
#         # MongoDB connection
#         self.mongo_client = MongoClient(os.getenv("MONGO_URI"))
#         self.db = self.mongo_client[os.getenv("MONGO_DB")]
#         self.collection = self.db["image_analyses"]
#         self.s3_service = S3Service()
#         # Google Vision client
#         self.vision_client = vision.ImageAnnotatorClient()

#     async def upload_image(self, file: UploadFile) -> str:
#         """Upload image to S3 and return the public URL"""
#         return await self.s3_service.upload_file(file)

#     async def save_to_mongodb(self, image_url: str, analysis_data: Dict[str, Any]) -> str:
#         """Save image URL and analysis to MongoDB"""
#         try:
#             document = {
#                 "image_url": image_url,
#                 "analysis_data": analysis_data,
#                 "created_at": datetime.utcnow(),
#                 "status": "analyzed"
#             }
            
#             result = self.collection.insert_one(document)
#             return str(result.inserted_id)
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Failed to save to MongoDB: {str(e)}")

#     async def analyze_with_vision(self, image_url: str) -> Dict[str, Any]:
#         """Analyze image using Google Vision API"""
#         try:
#             # Create image object from URL
#             image = vision.Image()
#             image.source.image_uri = image_url
            
#             # Configure features to detect
#             features = [
#                 vision.Feature(type_=vision.Feature.Type.TEXT_DETECTION),
#                 vision.Feature(type_=vision.Feature.Type.LABEL_DETECTION),
#                 vision.Feature(type_=vision.Feature.Type.SAFE_SEARCH_DETECTION),
#                 vision.Feature(type_=vision.Feature.Type.OBJECT_LOCALIZATION),
#                 vision.Feature(type_=vision.Feature.Type.WEB_DETECTION)
#             ]
            
#             # Create request
#             request = vision.AnnotateImageRequest(image=image, features=features)
            
#             # Get response
#             response = self.vision_client.annotate_image(request=request)
            
#             # Process results
#             analysis_results = {
#                 "text_annotations": [],
#                 "label_annotations": [],
#                 "safe_search": {},
#                 "objects": []
#             }
            
#             # Text detection
#             for text in response.text_annotations:
#                 analysis_results["text_annotations"].append({
#                     "text": text.description,
#                     "confidence": text.confidence if hasattr(text, 'confidence') else None
#                 })
            
#             # Label detection
#             for label in response.label_annotations:
#                 analysis_results["label_annotations"].append({
#                     "description": label.description,
#                     "score": label.score,
#                     "confidence": label.confidence if hasattr(label, 'confidence') else None
#                 })
            
#             # Safe search
#             safe = response.safe_search_annotation
#             analysis_results["safe_search"] = {
#                 "adult": safe.adult.name,
#                 "spoof": safe.spoof.name,
#                 "medical": safe.medical.name,
#                 "violence": safe.violence.name,
#                 "racy": safe.racy.name
#             }
            
#             # Object detection
#             for obj in response.localized_object_annotations:
#                 analysis_results["objects"].append({
#                     "name": obj.name,
#                     "score": obj.score
#                 })
            
#             return analysis_results
            
#         except Exception as e:
#             raise HTTPException(status_code=500, detail=f"Failed to analyze with Vision API: {str(e)}")

#     def fact_check_analysis(self, vision_results: Dict[str, Any]) -> tuple[str, float]:
#         """Perform fact-checking analysis based on Vision API results"""
#         # Simple fact-checking logic (you can enhance this with your own logic)
#         text_content = " ".join([text["text"] for text in vision_results["text_annotations"]])
        
#         # Check for suspicious indicators
#         suspicious_words = ["fake", "hoax", "manipulated", "edited", "photoshopped"]
#         suspicious_count = sum(1 for word in suspicious_words if word.lower() in text_content.lower())
        
#         # Check safe search results
#         unsafe_categories = 0
#         for category, level in vision_results["safe_search"].items():
#             if level in ["LIKELY", "VERY_LIKELY"]:
#                 unsafe_categories += 1
        
#         # Simple scoring
#         confidence = max(0.0, 1.0 - (suspicious_count * 0.2) - (unsafe_categories * 0.15))
        
#         if confidence > 0.7:
#             summary = "Image appears authentic with no obvious signs of manipulation."
#         elif confidence > 0.4:
#             summary = "Image authenticity is questionable. Further verification recommended."
#         else:
#             summary = "Image shows signs of potential manipulation or contains suspicious content."
        
#         return summary, confidence

#     async def process_image(self, image: UploadFile) -> Dict[str, Any]:
#         """Complete pipeline: upload, analyze, and fact-check image"""
#         print("process image called")
#         # Step 1: Upload to S3
#         image_url = await self.upload_image(image)
#         print("Uploaded image URL in process url:", image_url)

#         # Step 2: Analyze with Google Vision
#         vision_analysis = await self.analyze_with_vision(image_url)
        
#         # Step 3: Perform fact-checking
#         fact_check_summary, confidence_score = self.fact_check_analysis(vision_analysis)
        
#         # Step 4: Save to MongoDB
#         analysis_data = {
#             "vision_analysis": vision_analysis,
#             "fact_check_summary": fact_check_summary,
#             "confidence_score": confidence_score
#         }
#         mongodb_id = await self.save_to_mongodb(image_url, analysis_data)
        
#         return {
#             "image_url": image_url,
#             "mongodb_id": mongodb_id,
#             "vision_analysis": vision_analysis,
#             "fact_check_summary": fact_check_summary,
#             "confidence_score": confidence_score
#         }
import os
import re
import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from urllib.parse import urlparse

from fastapi import HTTPException, UploadFile
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl, validator
from pymongo import MongoClient
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from motor.motor_asyncio import AsyncIOMotorClient
from google.cloud import vision
from PIL import Image, ImageFile
from dotenv import load_dotenv
load_dotenv(".env")

from Backend.services.v1.s3.service import S3Service

# Enable loading of truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True

# Load environment variables
load_dotenv(".env")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration constants
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB = os.getenv("MONGO_DB")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10 * 1024 * 1024))  # 10MB default
VISION_RATE_LIMIT = int(os.getenv("VISION_RATE_LIMIT", 10))  # requests per minute
ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

# Pydantic models
class ImageAnalysisResponse(BaseModel):
    image_url: HttpUrl
    mongodb_id: str
    vision_analysis: dict
    fact_check_summary: str
    confidence_score: float  # Authenticity confidence (0-1)
    fake_probability: float  # Probability it's fake (0-1)
    processing_time: float
    metadata: Optional[Dict[str, Any]] = None

    @validator('confidence_score')
    def validate_confidence(cls, v):
        return max(0.0, min(1.0, v))
    
    @validator('fake_probability')
    def validate_fake_probability(cls, v):
        return max(0.0, min(1.0, v))

class FactCheckConfig(BaseModel):
    suspicious_keywords: list = [
        "fake", "hoax", "manipulated", "edited", "photoshopped", "deepfake",
        "generated", "artificial", "synthetic", "doctored", "altered"
    ]
    unsafe_threshold: float = 0.3
    suspicious_weight: float = 0.2
    unsafe_weight: float = 0.15

# Rate limiter utility
class RateLimiter:
    def _init_(self, max_calls: int, period: int):
        self.max_calls = max_calls
        self.period = period
        self.calls = []

    async def acquire(self):
        """Acquire rate limit permission"""
        now = datetime.now(timezone.utc).timestamp()
        # Remove old calls outside the period
        self.calls = [t for t in self.calls if now - t < self.period]
        
        if len(self.calls) >= self.max_calls:
            wait_time = self.period - (now - self.calls[0])
            logger.warning(f"Rate limit reached. Waiting {wait_time:.2f} seconds")
            await asyncio.sleep(wait_time)
        
        self.calls.append(now)

class ImageFactCheckService:
    """Enhanced image fact-checking service with comprehensive analysis capabilities"""
    
    def _init_(self):
        """Initialize the service with all required clients and configurations"""
        try:
            # Initialize MongoDB connection
            self.mongo_client = MongoClient(os.getenv("MONGO_URI"))
            self.db = self.mongo_client[os.getenv("MONGO_DB")] # type: ignore
            self.collection = self.db["image_analyses"]
            
            # Initialize external services
            self.s3_service = S3Service()
            self.vision_client = vision.ImageAnnotatorClient()
            
            # Initialize utilities
            self.rate_limiter = RateLimiter(VISION_RATE_LIMIT, 60) # type: ignore
            self.fact_check_config = FactCheckConfig()
            
            logger.info("ImageFactCheckService initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize ImageFactCheckService: {str(e)}")
            raise

    @staticmethod
    def validate_image_file(file: UploadFile) -> None:
        """Validate uploaded image file"""
        if not file.content_type or file.content_type not in ALLOWED_IMAGE_TYPES:
            logger.error(f"Invalid file type: {file.content_type}")
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail=f"Invalid image type. Allowed types: {', '.join(ALLOWED_IMAGE_TYPES)}"
            )
        
        if file.size and file.size > MAX_FILE_SIZE:
            logger.error(f"File too large: {file.size} bytes")
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail=f"Image file too large. Maximum size: {MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )

    @staticmethod
    def validate_url(url: str) -> None:
        """Validate image URL format and security"""
        try:
            parsed = urlparse(url)
            if parsed.scheme not in ['http', 'https']:
                raise ValueError("Invalid URL scheme")
            if not parsed.netloc:
                raise ValueError("Invalid URL netloc")
        except Exception:
            logger.error(f"Invalid URL: {url}")
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail="Invalid image URL format"
            )

    async def upload_image(self, file: UploadFile) -> str:
        """Upload image to S3 with validation and error handling"""
        start_time = datetime.now(timezone.utc)
        
        try:
            # Validate file
            self.validate_image_file(file)
            
            # Upload to S3
            image_url = await self.s3_service.upload_file(file)
            self.validate_url(image_url)
            
            processing_time = (datetime.now(timezone.utc) - start_time).total_seconds()
            logger.info(f"Image uploaded to S3 in {processing_time:.2f}s: {image_url}")
            
            return image_url
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"S3 upload failed: {str(e)}")
            raise HTTPException(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to upload image to storage"
            )

    async def save_to_mongodb(self, image_url: str, analysis_data: Dict[str, Any]) -> str:
        """Save analysis results to MongoDB with enhanced error handling"""
        try:
            document = {
                "image_url": image_url,
                "analysis_data": analysis_data,
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "status": "analyzed",
                "version": "2.0"
            }
            
            result = self.collection.insert_one(document)
            logger.info(f"Analysis saved to MongoDB: {result.inserted_id}")
            
            return str(result.inserted_id)
            
        except Exception as e:
            logger.error(f"MongoDB save failed: {str(e)}")
            raise HTTPException(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save analysis results"
            )

    async def analyze_with_vision(self, image_url: str) -> Dict[str, Any]:
        """Analyze image using Google Vision API with rate limiting and comprehensive feature detection"""
        # Apply rate limiting
        await self.rate_limiter.acquire()
        self.validate_url(image_url)
        
        start_time = datetime.now(timezone.utc)
        
        try:
            # Create Vision API request
            image = vision.Image()
            image.source.image_uri = image_url
            
            # Configure comprehensive feature detection
            features = [
                vision.Feature(type_=vision.Feature.Type.TEXT_DETECTION),
                vision.Feature(type_=vision.Feature.Type.LABEL_DETECTION, max_results=50),
                vision.Feature(type_=vision.Feature.Type.SAFE_SEARCH_DETECTION),
                vision.Feature(type_=vision.Feature.Type.OBJECT_LOCALIZATION, max_results=50),
                vision.Feature(type_=vision.Feature.Type.WEB_DETECTION),
                vision.Feature(type_=vision.Feature.Type.FACE_DETECTION, max_results=10),
                vision.Feature(type_=vision.Feature.Type.LANDMARK_DETECTION, max_results=10)
            ]
            
            request = vision.AnnotateImageRequest(image=image, features=features)
            response = self.vision_client.annotate_image(request=request)
            
            # Check for errors
            if response.error.message:
                raise Exception(f"Vision API error: {response.error.message}")
            
            # Process comprehensive results
            analysis_results = {
                "text_annotations": [
                    {
                        "text": text.description,
                        "locale": getattr(text, 'locale', None),
                        "confidence": getattr(text, 'confidence', None)
                    }
                    for text in response.text_annotations
                ],
                "label_annotations": [
                    {
                        "description": label.description,
                        "score": label.score,
                        "topicality": getattr(label, 'topicality', None)
                    }
                    for label in response.label_annotations
                ],
                "safe_search": {},
                "objects": [
                    {
                        "name": obj.name,
                        "score": obj.score,
                        "bounding_box": {
                            "vertices": [
                                {"x": vertex.x, "y": vertex.y}
                                for vertex in obj.bounding_poly.normalized_vertices
                            ]
                        }
                    }
                    for obj in response.localized_object_annotations
                ],
                "faces": [
                    {
                        "detection_confidence": face.detection_confidence,
                        "joy_likelihood": face.joy_likelihood.name,
                        "sorrow_likelihood": face.sorrow_likelihood.name,
                        "anger_likelihood": face.anger_likelihood.name,
                        "surprise_likelihood": face.surprise_likelihood.name
                    }
                    for face in response.face_annotations
                ],
                "landmarks": [
                    {
                        "description": landmark.description,
                        "score": landmark.score
                    }
                    for landmark in response.landmark_annotations
                ],
                "web_detection": {}
            }
            
            # Process safe search
            if response.safe_search_annotation:
                safe = response.safe_search_annotation
                analysis_results["safe_search"] = {
                    "adult": safe.adult.name,
                    "spoof": safe.spoof.name,
                    "medical": safe.medical.name,
                    "violence": safe.violence.name,
                    "racy": safe.racy.name
                }
            
            # Process web detection
            if response.web_detection:
                web = response.web_detection
                analysis_results["web_detection"] = {
                    "web_entities": [
                        {
                            "entity_id": entity.entity_id,
                            "description": entity.description,
                            "score": entity.score
                        }
                        for entity in web.web_entities
                    ],
                    "pages_with_matching_images": [
                        {
                            "url": page.url,
                            "page_title": page.page_title,
                            "score": getattr(page, 'score', None)
                        }
                        for page in web.pages_with_matching_images
                    ]
                }
            
            processing_time = (datetime.now(timezone.utc) - start_time).total_seconds()
            logger.info(f"Vision analysis completed in {processing_time:.2f}s for {image_url}")
            
            return analysis_results
            
        except Exception as e:
            logger.error(f"Vision API analysis failed: {str(e)}")
            raise HTTPException(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to analyze image with Vision API"
            )

    def fact_check_analysis(self, vision_results: Dict[str, Any]) -> tuple[str, float, float]:
        """Enhanced fact-checking analysis with configurable rules and comprehensive scoring"""
        try:
            # Extract text content
            text_content = " ".join([
                text["text"] for text in vision_results.get("text_annotations", [])
            ]).lower()
            
            # Check for suspicious keywords
            suspicious_count = sum(
                1 for keyword in self.fact_check_config.suspicious_keywords
                if keyword.lower() in text_content
            )
            
            # Analyze safe search results
            unsafe_categories = 0
            unsafe_levels = ["LIKELY", "VERY_LIKELY"]
            for category, level in vision_results.get("safe_search", {}).items():
                if level in unsafe_levels:
                    unsafe_categories += 1
            
            # Check for manipulation indicators in labels
            manipulation_labels = [
                "computer graphics", "digital art", "screenshot", "composite image"
            ]
            manipulation_score = 0
            for label in vision_results.get("label_annotations", []):
                if any(manip_label in label["description"].lower() for manip_label in manipulation_labels):
                    manipulation_score += label["score"]
            
            # Calculate authenticity confidence score
            authenticity_confidence = 1.0
            authenticity_confidence -= suspicious_count * self.fact_check_config.suspicious_weight
            authenticity_confidence -= unsafe_categories * self.fact_check_config.unsafe_weight
            authenticity_confidence -= min(manipulation_score, 0.3)  # Cap manipulation penalty
            authenticity_confidence = max(0.0, min(1.0, authenticity_confidence))
            
            # Calculate fake probability (inverse of authenticity confidence)
            fake_probability = 1.0 - authenticity_confidence
            
            # Generate detailed summary based on fake probability
            fake_percentage = fake_probability * 100
            
            if fake_probability < 0.2:  # Less than 20% fake probability
                summary = f"Image appears authentic ({fake_percentage:.0f}% chance of being fake)."
            elif fake_probability < 0.4:  # 20-40% fake probability
                summary = f"Image mostly appears authentic ({fake_percentage:.0f}% chance of being fake)."
            elif fake_probability < 0.6:  # 40-60% fake probability
                summary = f"Image authenticity is questionable ({fake_percentage:.0f}% chance of being fake). Manual review recommended."
            elif fake_probability < 0.8:  # 60-80% fake probability
                summary = f"Image is likely fake or manipulated ({fake_percentage:.0f}% chance of being fake)."
            else:  # 80%+ fake probability
                summary = f"Image is very likely fake, manipulated, or synthetic ({fake_percentage:.0f}% chance of being fake)."
            
            # Add specific concerns
            concerns = []
            if suspicious_count > 0:
                concerns.append(f"{suspicious_count} suspicious keyword(s) detected")
            if unsafe_categories > 0:
                concerns.append(f"{unsafe_categories} unsafe content categorie(s) flagged")
            if manipulation_score > 0.1:
                concerns.append("Digital manipulation indicators found")
            
            if concerns:
                summary += f" Detection reasons: {'; '.join(concerns)}."
            
            logger.info(f"Fact-check completed - {fake_percentage:.0f}% fake probability, Summary: {summary[:50]}...")
            
            return summary, authenticity_confidence, fake_probability
            
        except Exception as e:
            logger.error(f"Fact-check analysis failed: {str(e)}")
            return "Analysis failed - unable to determine authenticity.", 0.0, 1.0

    async def process_image(self, image: UploadFile) -> ImageAnalysisResponse:
        """Complete enhanced pipeline: upload, analyze, fact-check, and store"""
        start_time = datetime.now(timezone.utc)
        logger.info("Starting comprehensive image processing pipeline")
        
        try:
            # Step 1: Upload to S3
            image_url = await self.upload_image(image)
            
            # Step 2: Analyze with Google Vision
            vision_analysis = await self.analyze_with_vision(image_url)
            
            # Step 3: Perform enhanced fact-checking
            fact_check_summary, confidence_score, fake_probability = self.fact_check_analysis(vision_analysis)
            
            # Step 4: Prepare comprehensive analysis data
            total_processing_time = (datetime.now(timezone.utc) - start_time).total_seconds()
            
            analysis_data = {
                "vision_analysis": vision_analysis,
                "fact_check_summary": fact_check_summary,
                "confidence_score": confidence_score,
                "fake_probability": fake_probability,
                "processing_time": total_processing_time,
                "file_metadata": {
                    "filename": image.filename,
                    "content_type": image.content_type,
                    "size": image.size
                }
            }
            
            # Step 5: Save to MongoDB
            mongodb_id = await self.save_to_mongodb(image_url, analysis_data)
            
            # Step 6: Return comprehensive response
            response = ImageAnalysisResponse(
                image_url=image_url, # type: ignore
                mongodb_id=mongodb_id,
                vision_analysis=vision_analysis,
                fact_check_summary=fact_check_summary,
                confidence_score=confidence_score,
                fake_probability=fake_probability,
                processing_time=total_processing_time,
                metadata=analysis_data["file_metadata"]
            )
            
            logger.info(f"Image processing completed successfully in {total_processing_time:.2f}s")
            return response
            
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Image processing pipeline failed: {str(e)}")
            raise HTTPException(
                status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Image processing pipeline failed"
            )