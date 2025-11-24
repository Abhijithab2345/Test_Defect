import logging
from datetime import datetime
from typing import List, Dict, Any
import uuid

logger = logging.getLogger(__name__)

# In-memory storage (replace with database in production)
_analyses: List[Dict[str, Any]] = []


class Storage:
    """Simple in-memory storage for analysis history."""
    
    def save_analysis(
        self,
        image_url: str,
        description: str = None,
        results: Dict[str, Any] = None,
        runtime: Dict[str, float] = None
    ):
        """Save an analysis to storage."""
        analysis = {
            "id": str(uuid.uuid4()),
            "timestamp": datetime.utcnow().isoformat(),
            "description": description,
            "image_url": image_url,
            "results": results or {},
            "runtime": runtime or {}
        }
        _analyses.append(analysis)
        logger.info(f"Saved analysis {analysis['id']} to storage")
        
        # Keep only last 100 analyses in memory
        if len(_analyses) > 100:
            _analyses.pop(0)
    
    def get_all_analyses(self) -> List[Dict[str, Any]]:
        """Get all analyses from storage."""
        return _analyses.copy()
    
    def get_analysis(self, analysis_id: str) -> Dict[str, Any]:
        """Get a specific analysis by ID."""
        for analysis in _analyses:
            if analysis["id"] == analysis_id:
                return analysis
        return None


# Global storage instance
storage = Storage()

