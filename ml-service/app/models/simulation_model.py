# ============================================================
# ARTH ML Service — Simulation Model
# Uses LinearRegression to predict future financial balance.
# Trains on synthetic data at startup.
# ============================================================

import numpy as np
from sklearn.linear_model import LinearRegression
import logging

logger = logging.getLogger("arth.ml.simulation")


class SimulationModel:
    """
    Financial simulation model using Linear Regression.
    
    Features used:
    - income: Total income
    - expenses: Total expenses  
    - transaction_count: Number of transactions
    - months_ahead: How far to predict
    
    Output:
    - Predicted balance trajectory
    - Risk score (0-100)
    """

    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False

    def train(self):
        """Train model on synthetic financial data."""
        logger.info("Training simulation model on synthetic data...")

        np.random.seed(42)
        n_samples = 1000

        # Generate synthetic financial profiles
        income = np.random.uniform(2000, 15000, n_samples)
        expenses = income * np.random.uniform(0.3, 1.2, n_samples)
        transaction_count = np.random.randint(5, 200, n_samples)
        savings_rate = (income - expenses) / np.maximum(income, 1)

        # Features: income, expenses, tx_count, savings_rate
        X = np.column_stack([income, expenses, transaction_count, savings_rate])

        # Target: projected balance after 6 months (with noise)
        y = (income - expenses) * 6 + np.random.normal(0, 500, n_samples)

        self.model.fit(X, y)
        self.is_trained = True

        score = self.model.score(X, y)
        logger.info(f"Simulation model trained. R² score: {score:.4f}")

    def predict(self, income: float, expenses: float,
                transaction_count: int, months_ahead: int = 6) -> dict:
        """
        Predict future financial state.
        
        Returns dict with:
        - predicted_balance: Estimated balance after months_ahead
        - risk_score: Financial risk (0-100, higher = riskier)
        - monthly_predictions: List of monthly projections
        - savings_rate: Current savings rate
        - risk_level: Categorical risk level
        """
        if not self.is_trained:
            self.train()

        savings_rate = (income - expenses) / max(income, 1)
        features = np.array([[income, expenses, transaction_count, savings_rate]])

        # Base prediction for 6 months
        base_prediction = self.model.predict(features)[0]

        # Scale prediction for requested months
        monthly_net = income - expenses
        scale_factor = months_ahead / 6.0

        predicted_balance = base_prediction * scale_factor

        # Generate monthly trajectory
        monthly_predictions = []
        cumulative = 0
        for month in range(1, months_ahead + 1):
            # Add some variance to monthly predictions
            variance = np.random.normal(0, abs(monthly_net) * 0.1)
            cumulative += monthly_net + variance
            confidence = max(0.5, 1.0 - (month * 0.05))  # Decreasing confidence

            monthly_predictions.append({
                "month": month,
                "predicted_balance": round(cumulative, 2),
                "confidence": round(confidence, 3),
            })

        # Calculate risk score (0-100)
        risk_score = self._calculate_risk(income, expenses, savings_rate, transaction_count)

        # Determine risk level
        if risk_score < 25:
            risk_level = "LOW"
            recommendation = "Your finances look healthy. Consider increasing investments."
        elif risk_score < 50:
            risk_level = "MEDIUM"
            recommendation = "Monitor your spending. Try to increase your savings rate."
        elif risk_score < 75:
            risk_level = "HIGH"
            recommendation = "Warning: Your expenses are high relative to income. Create a budget plan."
        else:
            risk_level = "CRITICAL"
            recommendation = "Critical: You are spending more than you earn. Immediate action needed."

        return {
            "predicted_balance": round(predicted_balance, 2),
            "risk_score": round(risk_score, 1),
            "risk_level": risk_level,
            "monthly_predictions": monthly_predictions,
            "savings_rate": round(savings_rate * 100, 1),
            "recommendation": recommendation,
        }

    def _calculate_risk(self, income: float, expenses: float,
                        savings_rate: float, transaction_count: int) -> float:
        """Calculate financial risk score (0-100)."""
        risk = 50.0  # Start at medium

        # Savings rate impact (-30 to +30)
        if savings_rate > 0.3:
            risk -= 30
        elif savings_rate > 0.1:
            risk -= 15
        elif savings_rate > 0:
            risk -= 5
        elif savings_rate > -0.1:
            risk += 15
        else:
            risk += 30

        # Expense ratio impact
        expense_ratio = expenses / max(income, 1)
        if expense_ratio > 1.0:
            risk += 20
        elif expense_ratio > 0.8:
            risk += 10
        elif expense_ratio < 0.5:
            risk -= 10

        # Transaction count impact (more data = more reliable)
        if transaction_count < 10:
            risk += 5  # Low data confidence

        return max(0, min(100, risk))


# Global model instance
simulation_model = SimulationModel()
