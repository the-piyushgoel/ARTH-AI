# ============================================================
# ARTH ML Service — Pydantic Schemas for Fraud Detection
# ============================================================

from pydantic import BaseModel
from typing import List, Optional


class FraudRequest(BaseModel):
    """Input schema for fraud detection."""
    amount: float = 0
    category: str = "unknown"
    location: str = "unknown"
    device: str = "unknown"
    hour_of_day: int = 12
    avg_transaction_amount: float = 0
    transaction_count: int = 0
    total_income: float = 0
    total_expenses: float = 0
    amount_deviation: float = 0
    is_new_category: bool = False


class FraudIndicator(BaseModel):
    """Individual fraud indicator."""
    indicator: str
    severity: str  # LOW, MEDIUM, HIGH
    description: str


class FraudResponse(BaseModel):
    """Output schema for fraud detection."""
    fraud_probability: float  # 0-1
    risk_level: str  # SAFE, LOW, MEDIUM, HIGH, CRITICAL
    is_suspicious: bool
    indicators: List[FraudIndicator]
    recommendation: str
