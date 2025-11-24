import logging
from fastapi import APIRouter, HTTPException
from typing import List

from app.models.schemas import HistoryItem
from app.storage import storage

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/history", response_model=List[HistoryItem])
async def get_history() -> List[HistoryItem]:
    """
    Get analysis history.
    """
    try:
        history = storage.get_all_analyses()
        return [HistoryItem(**item) for item in history]
    except Exception as e:
        logger.error(f"Failed to retrieve history: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

