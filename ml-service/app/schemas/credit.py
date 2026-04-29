# ============================================================
# ARTH ML Service — Pydantic Schemas for Credit
# ============================================================

from pydantic import BaseModel
from typing import List, Optional


class CreditRequest(BaseModel):
    """Input schema for credit scoring."""
    income: float
    expenses: float
    transaction_count: int = 0
    net_balance: float = 0
    expense_to_income_ratio: float = 0
    category_diversity: int = 0
    avg_transaction_amount: float = 0


class CreditFactor(BaseModel):
    """Individual factor affecting credit score."""
    factor: str
    impact: str  # POSITIVE, NEGATIVE, NEUTRAL
    description: str
    weight: float


class CreditScoreResponse(BaseModel):
    """Output schema for credit score."""
    score: int  # 300-850
    grade: str  # A, B, C, D, F
    risk_level: str  # LOW, MEDIUM, HIGH
    factors: List[CreditFactor]


class CreditExplanationResponse(BaseModel):
    """Output schema for credit explanation."""
    score: int
    grade: str
    summary: str
    positive_factors: List[str]
    negative_factors: List[str]
    suggestions: List[str]
    detailed_breakdown: List[CreditFactor]
