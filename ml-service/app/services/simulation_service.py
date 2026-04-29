# ============================================================
# ARTH ML Service — Simulation Service
# Business logic layer between routes and model.
# ============================================================

from app.models.simulation_model import simulation_model
from app.schemas.simulation import SimulationRequest
import logging

logger = logging.getLogger("arth.ml.simulation.service")


def predict(request: SimulationRequest) -> dict:
    """
    Run financial simulation prediction.
    """
    try:
        logger.info(f"Running simulation: income={request.income}, expenses={request.expenses}")

        result = simulation_model.predict(
            income=request.income,
            expenses=request.expenses,
            transaction_count=request.transaction_count,
            months_ahead=request.months_ahead,
        )

        logger.info(f"Simulation result: risk_score={result['risk_score']}, risk_level={result['risk_level']}")
        return result

    except Exception as e:
        logger.error(f"Simulation prediction failed: {str(e)}")
        raise
