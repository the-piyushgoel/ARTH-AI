# ============================================================
# ARTH ML Service — Credit Service
# ============================================================

from app.models.credit_model import credit_model
from app.schemas.credit import CreditRequest
import logging

logger = logging.getLogger("arth.ml.credit.service")


def get_score(request: CreditRequest) -> dict:
    """Calculate credit score."""
    try:
        logger.info(f"Calculating credit score: income={request.income}")

        features = {
            "income": request.income,
            "expenses": request.expenses,
            "transaction_count": request.transaction_count,
            "expense_to_income_ratio": request.expense_to_income_ratio,
            "category_diversity": request.category_diversity,
            "net_balance": request.net_balance,
            "avg_transaction_amount": request.avg_transaction_amount,
        }

        result = credit_model.score(features)
        logger.info(f"Credit score result: {result['score']} (Grade {result['grade']})")
        return result

    except Exception as e:
        logger.error(f"Credit scoring failed: {str(e)}")
        raise


def get_explanation(request: CreditRequest) -> dict:
    """Get detailed credit explanation."""
    try:
        logger.info(f"Generating credit explanation for income={request.income}")

        features = {
            "income": request.income,
            "expenses": request.expenses,
            "transaction_count": request.transaction_count,
            "expense_to_income_ratio": request.expense_to_income_ratio,
            "category_diversity": request.category_diversity,
            "net_balance": request.net_balance,
            "avg_transaction_amount": request.avg_transaction_amount,
        }

        result = credit_model.explain(features)
        logger.info(f"Credit explanation generated: score={result['score']}")
        return result

    except Exception as e:
        logger.error(f"Credit explanation failed: {str(e)}")
        raise
