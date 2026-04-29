# ============================================================
# ARTH ML Service — Credit Model
# Uses RandomForestClassifier for credit scoring with
# explainable factor breakdown.
# ============================================================

import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger("arth.ml.credit")


class CreditModel:
    """
    Credit scoring model using Random Forest.
    
    Features:
    - income, expenses, transaction_count
    - expense_to_income_ratio, category_diversity
    - net_balance, avg_transaction_amount
    
    Output:
    - Credit score (300-850)
    - Grade (A-F)
    - Factor breakdown with impact analysis
    """

    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
        )
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_names = [
            "income", "expenses", "transaction_count",
            "expense_to_income_ratio", "category_diversity",
            "net_balance", "avg_transaction_amount",
        ]

    def train(self):
        """Train model on synthetic credit data."""
        logger.info("Training credit model on synthetic data...")

        np.random.seed(42)
        n_samples = 2000

        # Generate synthetic features
        income = np.random.uniform(1000, 20000, n_samples)
        expenses = income * np.random.uniform(0.2, 1.3, n_samples)
        transaction_count = np.random.randint(1, 300, n_samples)
        expense_ratio = expenses / np.maximum(income, 1)
        category_diversity = np.random.randint(1, 15, n_samples)
        net_balance = income - expenses
        avg_tx_amount = (income + expenses) / np.maximum(transaction_count, 1)

        X = np.column_stack([
            income, expenses, transaction_count,
            expense_ratio, category_diversity,
            net_balance, avg_tx_amount,
        ])

        # Generate credit grades based on financial health
        # 0=F, 1=D, 2=C, 3=B, 4=A
        grades = np.zeros(n_samples, dtype=int)
        for i in range(n_samples):
            score = 0
            if expense_ratio[i] < 0.5:
                score += 2
            elif expense_ratio[i] < 0.7:
                score += 1

            if net_balance[i] > 3000:
                score += 2
            elif net_balance[i] > 0:
                score += 1

            if transaction_count[i] > 50:
                score += 1

            if category_diversity[i] > 5:
                score += 1

            grades[i] = min(4, max(0, score - 1))

        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, grades)
        self.is_trained = True

        accuracy = self.model.score(X_scaled, grades)
        logger.info(f"Credit model trained. Accuracy: {accuracy:.4f}")

    def score(self, features: dict) -> dict:
        """
        Calculate credit score with factor breakdown.
        """
        if not self.is_trained:
            self.train()

        X = np.array([[
            features.get("income", 0),
            features.get("expenses", 0),
            features.get("transaction_count", 0),
            features.get("expense_to_income_ratio", 0),
            features.get("category_diversity", 0),
            features.get("net_balance", 0),
            features.get("avg_transaction_amount", 0),
        ]])

        X_scaled = self.scaler.transform(X)
        grade_idx = self.model.predict(X_scaled)[0]
        probabilities = self.model.predict_proba(X_scaled)[0]

        # Map grade index to letter and score range
        grade_map = {0: "F", 1: "D", 2: "C", 3: "B", 4: "A"}
        score_ranges = {0: (300, 499), 1: (500, 599), 2: (600, 699), 3: (700, 779), 4: (780, 850)}

        grade = grade_map[grade_idx]
        score_min, score_max = score_ranges[grade_idx]

        # Calculate precise score using probability distribution
        confidence = probabilities[grade_idx]
        credit_score = int(score_min + (score_max - score_min) * confidence)

        # Risk level
        if credit_score >= 700:
            risk_level = "LOW"
        elif credit_score >= 600:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        # Factor analysis using feature importances
        importances = self.model.feature_importances_
        factors = self._analyze_factors(features, importances)

        return {
            "score": credit_score,
            "grade": grade,
            "risk_level": risk_level,
            "factors": factors,
        }

    def explain(self, features: dict) -> dict:
        """
        Generate detailed credit explanation with suggestions.
        """
        score_result = self.score(features)

        positive_factors = []
        negative_factors = []
        suggestions = []

        # Analyze each financial dimension
        expense_ratio = features.get("expense_to_income_ratio", 1)
        net_balance = features.get("net_balance", 0)
        tx_count = features.get("transaction_count", 0)
        diversity = features.get("category_diversity", 0)
        income = features.get("income", 0)

        if expense_ratio < 0.5:
            positive_factors.append("Excellent expense-to-income ratio (under 50%)")
        elif expense_ratio < 0.7:
            positive_factors.append("Good expense-to-income ratio (under 70%)")
        else:
            negative_factors.append(f"High expense-to-income ratio ({expense_ratio:.0%})")
            suggestions.append("Reduce monthly expenses to below 70% of income")

        if net_balance > 5000:
            positive_factors.append("Strong positive net balance")
        elif net_balance > 0:
            positive_factors.append("Positive net balance")
            suggestions.append("Increase savings to build a stronger financial buffer")
        else:
            negative_factors.append("Negative net balance — spending exceeds income")
            suggestions.append("Create a budget and cut non-essential expenses immediately")

        if tx_count > 50:
            positive_factors.append("Active financial history with many transactions")
        elif tx_count < 10:
            negative_factors.append("Limited transaction history")
            suggestions.append("Build a longer financial history for better scoring")

        if diversity > 5:
            positive_factors.append("Diverse spending categories show financial maturity")
        elif diversity < 3:
            suggestions.append("Diversify your spending to show financial responsibility")

        if income > 5000:
            positive_factors.append("Strong income level")
        elif income < 2000:
            negative_factors.append("Low income level")
            suggestions.append("Consider ways to increase income through skills or side work")

        # Generate summary
        grade = score_result["grade"]
        credit_score = score_result["score"]
        summary = (
            f"Your credit score is {credit_score} (Grade {grade}). "
            f"This puts you in the {score_result['risk_level']} risk category. "
            f"{'Your finances are in good shape.' if credit_score >= 700 else 'There is room for improvement.'}"
        )

        return {
            "score": credit_score,
            "grade": grade,
            "summary": summary,
            "positive_factors": positive_factors,
            "negative_factors": negative_factors,
            "suggestions": suggestions if suggestions else ["Keep up the good work!"],
            "detailed_breakdown": score_result["factors"],
        }

    def _analyze_factors(self, features: dict, importances: np.ndarray) -> list:
        """Generate human-readable factor analysis."""
        factors = []
        feature_values = [
            features.get("income", 0),
            features.get("expenses", 0),
            features.get("transaction_count", 0),
            features.get("expense_to_income_ratio", 0),
            features.get("category_diversity", 0),
            features.get("net_balance", 0),
            features.get("avg_transaction_amount", 0),
        ]

        descriptions = {
            "income": "Monthly income level",
            "expenses": "Total expenses",
            "transaction_count": "Number of financial transactions",
            "expense_to_income_ratio": "Ratio of expenses to income",
            "category_diversity": "Diversity of spending categories",
            "net_balance": "Net financial balance",
            "avg_transaction_amount": "Average transaction size",
        }

        for i, name in enumerate(self.feature_names):
            # Determine impact direction
            value = feature_values[i]
            if name == "income" or name == "net_balance":
                impact = "POSITIVE" if value > 3000 else ("NEUTRAL" if value > 0 else "NEGATIVE")
            elif name == "expense_to_income_ratio":
                impact = "POSITIVE" if value < 0.5 else ("NEUTRAL" if value < 0.8 else "NEGATIVE")
            elif name == "transaction_count":
                impact = "POSITIVE" if value > 30 else "NEUTRAL"
            else:
                impact = "NEUTRAL"

            factors.append({
                "factor": descriptions.get(name, name),
                "impact": impact,
                "description": f"{name}: {value:.2f}" if isinstance(value, float) else f"{name}: {value}",
                "weight": round(float(importances[i]), 4),
            })

        # Sort by weight (most important first)
        factors.sort(key=lambda x: x["weight"], reverse=True)
        return factors


# Global model instance
credit_model = CreditModel()
