from pydantic import BaseModel, Field
from typing import Optional


class AnalyzeRequest(BaseModel):
    image_url: str = Field(..., description="URL or base64 data URL of the image to analyze")
    description: Optional[str] = Field(None, description="Optional description of the defect")


class ModelResult(BaseModel):
    image_understanding: Optional[str] = None
    detected_defects: Optional[str] = None
    root_cause: Optional[str] = None
    severity: Optional[str] = None  # low, medium, high
    recommendations: Optional[str] = None
    confidence: Optional[str] = None  # 0 to 1
    error: Optional[str] = None


class AnalyzeResponse(BaseModel):
    openai: Optional[ModelResult] = None
    gpt4_1: Optional[ModelResult] = None
    gemini: Optional[ModelResult] = None
    qwen: Optional[ModelResult] = None
    llama: Optional[ModelResult] = None
    runtime: Optional[dict] = None


class HistoryItem(BaseModel):
    id: str
    timestamp: str
    description: Optional[str] = None
    results: dict

