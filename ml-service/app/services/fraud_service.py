# ============================================================
# ARTH ML Service — Fraud Service
# ============================================================

from app.models.fraud_model import fraud_model
from app.schemas.fraud import FraudRequest
import logging

logger = logging.getLogger("arth.ml.fraud.service")


def detect(request: FraudRequest) -> dict:
    """Detect fraud risk for a transaction."""
    try:
        logger.info(f"Running fraud detection: amount={request.amount}, category={request.category}")

        features = {
            "amount": request.amount,
            "hour_of_day": request.hour_of_day,
            "avg_transaction_amount": request.avg_transaction_amount,
            "amount_deviation": request.amount_deviation,
            "transaction_count": request.transaction_count,
            "is_new_category": request.is_new_category,
        }

        result = fraud_model.detect(features)
        logger.info(f"Fraud detection result: prob={result['fraud_probability']}, level={result['risk_level']}")
        return result

    except Exception as e:
        logger.error(f"Fraud detection failed: {str(e)}")
        raise
