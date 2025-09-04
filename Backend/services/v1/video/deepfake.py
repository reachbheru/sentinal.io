import cv2
import numpy as np
import tempfile
import os
from typing import List, Dict, Tuple, Optional, Any, Union
from PIL import Image
import logging
from transformers import pipeline, AutoTokenizer, AutoModelForImageClassification
import torch
from io import BytesIO
import base64

logger = logging.getLogger(__name__)

class DeepfakeDetector:
    """
    A comprehensive deepfake detection system that analyzes video frames
    using Hugging Face transformers to identify AI-generated content.

    example usage:
    from deepfake import DeepfakeDetector
    detector = DeepfakeDetector()
    video_path = "path/to/video.mp4"
    results = detector.process_video(frames)

    """
    
    def __init__(self):
        self.model_name = "prithivMLmods/deepfake-detector-model-v1"
        self.confidence_threshold = 0.5
        self.max_frames = 30
        self.frame_size = (224, 224)
        self.classifier = None
        self._initialize_model()
        self._validate_model()
    
    def _validate_model(self):
        """Test model with sample image to understand output format"""
        try:
            # Test with a small image to verify model works
            test_img = Image.new('RGB', (224, 224), color='red')
            results = self.classifier(test_img)#type:ignore
            logger.info(f"Model validation successful. Sample output: {results[:1] if results else 'No results'}")
            
            # Check if we get expected format
            if not results or 'label' not in results[0] or 'score' not in results[0]:
                logger.warning("Model output format may not be standard, but proceeding...")
                
        except Exception as e:
            logger.warning(f"Model validation had issues: {e}, but proceeding with analysis")
    
    def _initialize_model(self):
        """Initialize the Hugging Face deepfake detection model."""
        try:
            logger.info(f"Loading deepfake detection model: {self.model_name}")
            
            # Initialize the image classification pipeline
            self.classifier = pipeline(
                "image-classification",
                model=self.model_name,
                device=0 if torch.cuda.is_available() else -1  # Use GPU if available
            )
            
            logger.info("Deepfake detection model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load deepfake detection model: {str(e)}")
            # Fallback to a more basic model if the specific one fails
            try:
                logger.info("Attempting to load fallback model...")
                self.classifier = pipeline(
                    "image-classification",
                    model="google/vit-base-patch16-224",  # Better fallback for image classification
                    device=-1
                )
                logger.info("Fallback model loaded successfully")
            except Exception as fallback_error:
                logger.error(f"Failed to load fallback model: {str(fallback_error)}")
                raise Exception("Unable to initialize any deepfake detection model")
    
    def extract_frames(self, video_path: str) -> List[np.ndarray]:
        """
        Extract frames from video file for analysis.
        
        Args:
            video_path (str): Path to the video file
            
        Returns:
            List[np.ndarray]: List of extracted frames
        """
        frames = []
        
        try:
            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                raise ValueError(f"Unable to open video file: {video_path}")
            
            # Get video properties
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            duration = total_frames / fps if fps > 0 else 0
            
            logger.info(f"Video properties - Total frames: {total_frames}, FPS: {fps}, Duration: {duration:.2f}s")
            
            # Calculate frame sampling - use evenly distributed frames
            if total_frames <= self.max_frames:
                frame_indices = list(range(total_frames))
            else:
                # Get evenly distributed frame indices across the video
                frame_indices = np.linspace(0, total_frames-1, self.max_frames, dtype=int)
            
            for frame_idx in frame_indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                
                if not ret:
                    continue
                
                # Resize frame to model input size
                resized_frame = cv2.resize(frame, self.frame_size)
                # Convert BGR to RGB (OpenCV uses BGR, PIL/transformers use RGB)
                rgb_frame = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2RGB)
                frames.append(rgb_frame)
            
            cap.release()
            logger.info(f"Extracted {len(frames)} frames for analysis")
            
        except Exception as e:
            logger.error(f"Error extracting frames: {str(e)}")
            raise
        
        return frames
    
    def analyze_frame(self, frame: np.ndarray) -> Dict[str, Union[str, float]]:
        """
        Analyze a single frame for deepfake content.
        
        Args:
            frame (np.ndarray): Frame to analyze
            
        Returns:
            Dict[str, Union[str, float]]: Analysis results with prediction and confidence
        """
        try:
            # Convert numpy array to PIL Image
            pil_image = Image.fromarray(frame)
            
            # Run inference
            results = self.classifier(pil_image) #type:ignore
            
            # Process results - expect format: [{'label': 'FAKE'/'REAL', 'score': float}]
            prediction = "authentic"  # default
            confidence = 0.0
            
            if results:
                # Get the highest confidence prediction
                top_result = max(results, key=lambda x: x['score'])
                
                # Map model labels to our format - be more flexible with label detection
                label = str(top_result['label']).upper()
                
                # Check for fake/deepfake indicators in label
                fake_indicators = ['FAKE', 'DEEPFAKE', 'MANIPULATED', 'SYNTHETIC', 'GENERATED']
                authentic_indicators = ['REAL', 'AUTHENTIC', 'GENUINE', 'ORIGINAL']
                
                if any(indicator in label for indicator in fake_indicators):
                    prediction = "fake"
                elif any(indicator in label for indicator in authentic_indicators):
                    prediction = "authentic"
                else:
                    # If unclear, use score threshold (higher score = more confident in the prediction)
                    # For binary classification, often label 1 = fake, label 0 = authentic
                    if 'LABEL_1' in label or '1' in label:
                        prediction = "fake"
                    else:
                        prediction = "authentic"
                
                confidence = float(top_result['score'])
            
            return {
                "prediction": prediction,
                "confidence": confidence
            }
            
        except Exception as e:
            logger.error(f"Error analyzing frame: {str(e)}")
            # Return neutral result on error
            return {
                "prediction": "authentic",
                "confidence": 0.0
            }
    
    def calculate_verdict(self, frame_results: List[Dict[str, Union[str, float, int]]]) -> Dict[str, Any]:
        """
        Calculate final verdict based on frame analysis results.
        
        Args:
            frame_results (List[Dict]): Results from individual frame analysis
            
        Returns:
            Dict: Final verdict with statistics
        """
        total_frames = len(frame_results)
        fake_frames_count = 0
        
        # Count frames classified as fake with sufficient confidence
        for result in frame_results:
            prediction = result.get("prediction", "authentic")
            confidence = result.get("confidence", 0.0)
            
            if (prediction == "fake" and 
                isinstance(confidence, (int, float)) and 
                confidence >= self.confidence_threshold):
                fake_frames_count += 1
        
        # Calculate percentage
        fake_percentage = (fake_frames_count / total_frames * 100) if total_frames > 0 else 0
        
        # Determine verdict
        if fake_percentage >= 60:
            verdict = "DEEPFAKE DETECTED"
            color = "red"
            risk_level = "HIGH"
        elif fake_percentage >= 40:
            verdict = "SUSPICIOUS CONTENT"
            color = "orange"
            risk_level = "MEDIUM"
        else:
            verdict = "AUTHENTIC VIDEO"
            color = "green"
            risk_level = "LOW"
        
        # Calculate average confidence for fake predictions
        fake_confidences = []
        for result in frame_results:
            prediction = result.get("prediction", "authentic")
            confidence = result.get("confidence", 0.0)
            
            if prediction == "fake" and isinstance(confidence, (int, float)):
                fake_confidences.append(float(confidence))
        
        avg_fake_confidence = np.mean(fake_confidences) if fake_confidences else 0.0
        
        return {
            "verdict": verdict,
            "color": color,
            "risk_level": risk_level,
            "fake_percentage": round(fake_percentage, 2),
            "fake_frames_count": fake_frames_count,
            "total_frames": total_frames,
            "average_fake_confidence": round(float(avg_fake_confidence), 3),
            "frame_results": frame_results
        }
    
    def process_video(self, video_path: str) -> Dict[str, Any]:
        """
        Complete video analysis pipeline.
        
        Args:
            video_path (str): Path to video file
            
        Returns:
            Dict: Complete analysis results
        """
        try:
            logger.info(f"Starting deepfake analysis for video: {video_path}")
            
            # Step 1: Extract frames
            frames = self.extract_frames(video_path)
            
            if not frames:
                raise ValueError("No frames could be extracted from the video")
            
            # Step 2: Analyze each frame
            frame_results = []
            for i, frame in enumerate(frames):
                logger.debug(f"Analyzing frame {i+1}/{len(frames)}")
                result = self.analyze_frame(frame)
                frame_results.append({
                    "frame_number": i + 1,
                    **result
                })
            
            # Step 3: Calculate final verdict
            final_result = self.calculate_verdict(frame_results)
            
            logger.info(f"Analysis complete. Verdict: {final_result['verdict']} "
                       f"({final_result['fake_percentage']}% fake frames)")
            
            return final_result
            
        except Exception as e:
            logger.error(f"Error processing video: {str(e)}")
            raise
    
    def process_video_from_bytes(self, video_bytes: bytes, filename: str = "video") -> Dict[str, Any]:
        """
        Process video from bytes data (for file uploads).
        
        Args:
            video_bytes (bytes): Video file bytes
            filename (str): Original filename for reference
            
        Returns:
            Dict: Complete analysis results
        """
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
            temp_file.write(video_bytes)
            temp_path = temp_file.name
        
        try:
            # Process the temporary file
            result = self.process_video(temp_path)
            result["original_filename"] = filename
            return result
            
        finally:
            # Clean up temporary file
            try:
                os.unlink(temp_path)
            except OSError:
                pass
    
    def get_supported_formats(self) -> List[str]:
        """Get list of supported video formats."""
        return ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.wmv', '.flv', '.m4v']
    
    def validate_video_file(self, filename: str) -> bool:
        """
        Validate if the uploaded file is a supported video format.
        
        Args:
            filename (str): Name of the uploaded file
            
        Returns:
            bool: True if supported, False otherwise
        """
        if not filename:
            return False
        
        file_extension = os.path.splitext(filename.lower())[1]
        return file_extension in self.get_supported_formats()
    
    def __del__(self):
        """Cleanup resources when object is destroyed"""
        try:
            if hasattr(self, 'classifier') and self.classifier:
                # Clear GPU memory if using CUDA
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
        except Exception as e:
            logger.debug(f"Cleanup warning: {e}")


# Global instance for use in API endpoints
deepfake_detector = DeepfakeDetector()


def analyze_video_for_deepfake(video_path: str) -> Dict[str, Any]:
    """
    Convenience function for video analysis.
    
    Args:
        video_path (str): Path to video file
        
    Returns:
        Dict: Analysis results
    """
    return deepfake_detector.process_video(video_path)


def analyze_video_bytes_for_deepfake(video_bytes: bytes, filename: str = "video") -> Dict[str, Any]:
    """
    Convenience function for video analysis from bytes.
    
    Args:
        video_bytes (bytes): Video file bytes
        filename (str): Original filename
        
    Returns:
        Dict: Analysis results
    """
    return deepfake_detector.process_video_from_bytes(video_bytes, filename)


def get_video_formats() -> List[str]:
    """Get supported video formats."""
    return deepfake_detector.get_supported_formats()


def validate_video_format(filename: str) -> bool:
    """Validate video file format."""
    return deepfake_detector.validate_video_file(filename)