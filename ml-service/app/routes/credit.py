# ============================================================
# ARTH ML Service — Credit Routes
# ============================================================

from fastapi import APIRouter, HTTPException
from app.schemas.credit import CreditRequest
from app.services import credit_service
import logging

logger = logging.getLogger("arth.ml.routes.credit")
router = APIRouter(prefix="/ml/credit", tags=["Credit"])


@router.post("/score")
async def get_score(request: CreditRequest):
    """Calculate credit score."""
    try:
        result = credit_service.get_score(request)
        return result
    except Exception as e:
        logger.error(f"Credit score endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/explain")
async def get_explanation(request: CreditRequest):
    """Get detailed credit explanation."""
    try:
        result = credit_service.get_explanation(request)
        return result
    except Exception as e:
        logger.error(f"Credit explanation endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
