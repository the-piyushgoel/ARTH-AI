# ============================================================
# ARTH ML Service — Fraud Routes
# ============================================================

from fastapi import APIRouter, HTTPException
from app.schemas.fraud import FraudRequest
from app.services import fraud_service
import logging

logger = logging.getLogger("arth.ml.routes.fraud")
router = APIRouter(prefix="/ml/fraud", tags=["Fraud"])


@router.post("/detect")
async def detect_fraud(request: FraudRequest):
    """Detect fraud risk for a transaction."""
    try:
        result = fraud_service.detect(request)
        return result
    except Exception as e:
        logger.error(f"Fraud detection endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
