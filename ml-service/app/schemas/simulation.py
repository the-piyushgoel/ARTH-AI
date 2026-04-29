# ============================================================
# ARTH ML Service — Pydantic Schemas for Simulation
# ============================================================

from pydantic import BaseModel
from typing import List, Optional


class SimulationRequest(BaseModel):
    """Input schema for financial simulation prediction."""
    income: float
    expenses: float
    transaction_count: int = 0
    net_balance: float = 0
    avg_monthly_income: float = 0
    avg_monthly_expenses: float = 0
    months_ahead: int = 6


class PredictionPoint(BaseModel):
    """Single prediction data point."""
    month: int
    predicted_balance: float
    confidence: float


class SimulationResponse(BaseModel):
    """Output schema for simulation prediction."""
    predicted_balance: float
    risk_score: float  # 0-100
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    monthly_predictions: List[PredictionPoint]
    savings_rate: float
    recommendation: str
