from langchain.chat_models import init_chat_model
import os
from dotenv import load_dotenv

class LLMClient:
    """
    A client class for managing different LLM models.
    This class provides a unified interface to access various language models.
    """
    
    def __init__(self):
        """Initialize the LLM client and load environment variables."""
        load_dotenv(".env")
        self._models = {}
    
    def gemini(self, model_name="gemini-2.5-flash"):
        """
        Initialize and return a Gemini model instance.
        
        Args:
            model_name (str): The Gemini model name to use. Defaults to "gemini-2.5-flash"
            
        Returns:
            ChatModel: Initialized Gemini model instance
            
        Raises:
            ValueError: If GEMINI_API_KEY is not found in environment variables
        """
        # Check if model is already cached
        cache_key = f"gemini_{model_name}"
        if cache_key in self._models:
            return self._models[cache_key]
        
        # Get Gemini API key from environment variables
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        # Initialize the model
        llm = init_chat_model(
            model_name, 
            model_provider="google_genai", 
            api_key=gemini_api_key
        )
        
        # Cache the model for future use
        self._models[cache_key] = llm
        
        return llm
    
    def openai(self, model_name="gpt-3.5-turbo"):
        """
        Initialize and return an OpenAI model instance.
        
        Args:
            model_name (str): The OpenAI model name to use. Defaults to "gpt-3.5-turbo"
            
        Returns:
            ChatModel: Initialized OpenAI model instance
            
        Raises:
            ValueError: If OPENAI_API_KEY is not found in environment variables
        """
        # Check if model is already cached
        cache_key = f"openai_{model_name}"
        if cache_key in self._models:
            return self._models[cache_key]
        
        # Get OpenAI API key from environment variables
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        
        # Initialize the model
        llm = init_chat_model(
            model_name, 
            model_provider="openai", 
            api_key=openai_api_key
        )
        
        # Cache the model for future use
        self._models[cache_key] = llm
        
        return llm
    
    def anthropic(self, model_name="claude-3-sonnet-20240229"):
        """
        Initialize and return an Anthropic model instance.
        
        Args:
            model_name (str): The Anthropic model name to use. Defaults to "claude-3-sonnet-20240229"
            
        Returns:
            ChatModel: Initialized Anthropic model instance
            
        Raises:
            ValueError: If ANTHROPIC_API_KEY is not found in environment variables
        """
        # Check if model is already cached
        cache_key = f"anthropic_{model_name}"
        if cache_key in self._models:
            return self._models[cache_key]
        
        # Get Anthropic API key from environment variables
        anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
        if not anthropic_api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment variables")
        
        llm = init_chat_model(
            model_name, 
            model_provider="anthropic", 
            api_key=anthropic_api_key
        )
        
        self._models[cache_key] = llm
        
        return llm
    
    def clear_cache(self):
        """Clear all cached models."""
        self._models.clear()
