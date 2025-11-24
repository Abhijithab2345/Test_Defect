import time
import logging
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.models.schemas import AnalyzeRequest, AnalyzeResponse, ModelResult
from app.adapters.openai_adapter import OpenAIAdapter
from app.storage import storage

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize adapters
openai_adapter = None

try:
    openai_adapter = OpenAIAdapter()
except Exception as e:
    logger.warning(f"Failed to initialize OpenAI adapter: {str(e)}")
    logger.warning("API will return errors for OpenAI requests")


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(request: AnalyzeRequest) -> AnalyzeResponse:
    """
    Analyze an image using multiple AI models.
    
    Currently supports:
    - OpenAI GPT-4o
    - OpenAI GPT-4.1
    """
    start_time = time.time()
    results: Dict[str, Any] = {}
    runtime: Dict[str, float] = {}
    
    # Process OpenAI GPT-4o
    if openai_adapter:
        model_start = time.time()
        try:
            logger.info("Processing with OpenAI GPT-4o")
            openai_result = openai_adapter.analyze(
                request.image_url,
                request.description
            )
            runtime["openai"] = time.time() - model_start
            results["openai"] = openai_result
        except Exception as e:
            logger.error(f"OpenAI GPT-4o processing failed: {str(e)}")
            runtime["openai"] = time.time() - model_start
            results["openai"] = ModelResult(
                error=f"Failed to process with OpenAI GPT-4o: {str(e)}"
            )
        
        # Process OpenAI GPT-4.1
        model_start = time.time()
        try:
            logger.info("Processing with OpenAI GPT-4.1")
            gpt4_1_result = openai_adapter.analyze_gpt4_1(
                request.image_url,
                request.description
            )
            runtime["gpt4_1"] = time.time() - model_start
            results["gpt4_1"] = gpt4_1_result
        except Exception as e:
            logger.error(f"OpenAI GPT-4.1 processing failed: {str(e)}")
            runtime["gpt4_1"] = time.time() - model_start
            results["gpt4_1"] = ModelResult(
                error=f"Failed to process with OpenAI GPT-4.1: {str(e)}"
            )
    else:
        results["openai"] = ModelResult(
            error="OpenAI adapter not initialized. Please check API key configuration."
        )
        results["gpt4_1"] = ModelResult(
            error="OpenAI adapter not initialized. Please check API key configuration."
        )
        runtime["openai"] = 0
        runtime["gpt4_1"] = 0
    
    # Set other models to None (not implemented)
    results["gemini"] = None
    results["qwen"] = None
    results["llama"] = None
    
    total_runtime = time.time() - start_time
    logger.info(f"Total analysis time: {total_runtime:.2f}s")
    
    # Store in history
    try:
        storage.save_analysis(
            image_url=request.image_url,
            description=request.description,
            results=results,
            runtime=runtime
        )
    except Exception as e:
        logger.warning(f"Failed to save to history: {str(e)}")
    
    # Convert results to ModelResult objects
    openai_result = None
    if results.get("openai"):
        if isinstance(results["openai"], dict):
            openai_result = ModelResult(**results["openai"])
        else:
            openai_result = results["openai"]
    
    gpt4_1_result = None
    if results.get("gpt4_1"):
        if isinstance(results["gpt4_1"], dict):
            gpt4_1_result = ModelResult(**results["gpt4_1"])
        else:
            gpt4_1_result = results["gpt4_1"]
    
    return AnalyzeResponse(
        openai=openai_result,
        gpt4_1=gpt4_1_result,
        gemini=None,
        qwen=None,
        llama=None,
        runtime=runtime
    )

