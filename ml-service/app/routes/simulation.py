# ============================================================
# ARTH ML Service — Simulation Routes
# ============================================================

from fastapi import APIRouter, HTTPException
from app.schemas.simulation import SimulationRequest
from app.services import simulation_service
import logging

logger = logging.getLogger("arth.ml.routes.simulation")
router = APIRouter(prefix="/ml/simulation", tags=["Simulation"])


@router.post("/predict")
async def predict(request: SimulationRequest):
    """Predict future financial outcomes."""
    try:
        result = simulation_service.predict(request)
        return result
    except Exception as e:
        logger.error(f"Simulation endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
