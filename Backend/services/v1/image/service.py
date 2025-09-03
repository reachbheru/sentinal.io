from Backend.services.v1.s3.service import S3Service
from google.cloud import vision
from pymongo import MongoClient
from fastapi import HTTPException, UploadFile
import os, io, tempfile, shutil
from datetime import datetime
from typing import Dict, Any
import json
import requests
from PIL import Image
from dotenv import load_dotenv
load_dotenv(".env")


class ImageFactCheckService:
    def __init__(self):
        # MongoDB connection
        self.mongo_client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.mongo_client[os.getenv("MONGO_DB")]
        self.collection = self.db["image_analyses"]
        self.s3_service = S3Service()
        # Google Vision client
        self.vision_client = vision.ImageAnnotatorClient()

    async def upload_image(self, file: UploadFile) -> str:
        """Upload image to S3 and return the public URL"""
        return await self.s3_service.upload_file(file)

    async def save_to_mongodb(self, image_url: str, analysis_data: Dict[str, Any]) -> str:
        """Save image URL and analysis to MongoDB"""
        try:
            document = {
                "image_url": image_url,
                "analysis_data": analysis_data,
                "created_at": datetime.utcnow(),
                "status": "analyzed"
            }
            
            result = self.collection.insert_one(document)
            return str(result.inserted_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save to MongoDB: {str(e)}")

    async def analyze_with_vision(self, image_url: str) -> Dict[str, Any]:
        """Analyze image using Google Vision API"""
        try:
            # Create image object from URL
            image = vision.Image()
            image.source.image_uri = image_url
            
            # Configure features to detect
            features = [
                vision.Feature(type_=vision.Feature.Type.TEXT_DETECTION),
                vision.Feature(type_=vision.Feature.Type.LABEL_DETECTION),
                vision.Feature(type_=vision.Feature.Type.SAFE_SEARCH_DETECTION),
                vision.Feature(type_=vision.Feature.Type.OBJECT_LOCALIZATION),
                vision.Feature(type_=vision.Feature.Type.WEB_DETECTION)
            ]
            
            # Create request
            request = vision.AnnotateImageRequest(image=image, features=features)
            
            # Get response
            response = self.vision_client.annotate_image(request=request)
            
            # Process results
            analysis_results = {
                "text_annotations": [],
                "label_annotations": [],
                "safe_search": {},
                "objects": []
            }
            
            # Text detection
            for text in response.text_annotations:
                analysis_results["text_annotations"].append({
                    "text": text.description,
                    "confidence": text.confidence if hasattr(text, 'confidence') else None
                })
            
            # Label detection
            for label in response.label_annotations:
                analysis_results["label_annotations"].append({
                    "description": label.description,
                    "score": label.score,
                    "confidence": label.confidence if hasattr(label, 'confidence') else None
                })
            
            # Safe search
            safe = response.safe_search_annotation
            analysis_results["safe_search"] = {
                "adult": safe.adult.name,
                "spoof": safe.spoof.name,
                "medical": safe.medical.name,
                "violence": safe.violence.name,
                "racy": safe.racy.name
            }
            
            # Object detection
            for obj in response.localized_object_annotations:
                analysis_results["objects"].append({
                    "name": obj.name,
                    "score": obj.score
                })
            
            return analysis_results
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to analyze with Vision API: {str(e)}")

    def fact_check_analysis(self, vision_results: Dict[str, Any]) -> tuple[str, float]:
        """Perform fact-checking analysis based on Vision API results"""
        # Simple fact-checking logic (you can enhance this with your own logic)
        text_content = " ".join([text["text"] for text in vision_results["text_annotations"]])
        
        # Check for suspicious indicators
        suspicious_words = ["fake", "hoax", "manipulated", "edited", "photoshopped"]
        suspicious_count = sum(1 for word in suspicious_words if word.lower() in text_content.lower())
        
        # Check safe search results
        unsafe_categories = 0
        for category, level in vision_results["safe_search"].items():
            if level in ["LIKELY", "VERY_LIKELY"]:
                unsafe_categories += 1
        
        # Simple scoring
        confidence = max(0.0, 1.0 - (suspicious_count * 0.2) - (unsafe_categories * 0.15))
        
        if confidence > 0.7:
            summary = "Image appears authentic with no obvious signs of manipulation."
        elif confidence > 0.4:
            summary = "Image authenticity is questionable. Further verification recommended."
        else:
            summary = "Image shows signs of potential manipulation or contains suspicious content."
        
        return summary, confidence

    async def process_image(self, image: UploadFile) -> Dict[str, Any]:
        """Complete pipeline: upload, analyze, and fact-check image"""
        print("process image called")
        # Step 1: Upload to S3
        image_url = await self.upload_image(image)
        print("Uploaded image URL in process url:", image_url)

        # Step 2: Analyze with Google Vision
        vision_analysis = await self.analyze_with_vision(image_url)
        
        # Step 3: Perform fact-checking
        fact_check_summary, confidence_score = self.fact_check_analysis(vision_analysis)
        
        # Step 4: Save to MongoDB
        analysis_data = {
            "vision_analysis": vision_analysis,
            "fact_check_summary": fact_check_summary,
            "confidence_score": confidence_score
        }
        mongodb_id = await self.save_to_mongodb(image_url, analysis_data)
        
        return {
            "image_url": image_url,
            "mongodb_id": mongodb_id,
            "vision_analysis": vision_analysis,
            "fact_check_summary": fact_check_summary,
            "confidence_score": confidence_score
        }
