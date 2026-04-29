# ============================================================
# ARTH ML Service — Fraud Detection Model
# Uses IsolationForest for anomaly-based fraud detection.
# ============================================================

import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import logging

logger = logging.getLogger("arth.ml.fraud")


class FraudModel:
    """
    Fraud detection model using Isolation Forest (unsupervised).
    
    Detects anomalous transactions based on:
    - Transaction amount vs user average
    - Time of day patterns
    - Category novelty
    - Deviation from normal behavior
    """

    def __init__(self):
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.1,  # Expect ~10% anomalies
            random_state=42,
        )
        self.scaler = StandardScaler()
        self.is_trained = False

    def train(self):
        """Train model on synthetic transaction data."""
        logger.info("Training fraud detection model on synthetic data...")

        np.random.seed(42)
        n_samples = 2000

        # Generate normal transaction patterns
        amount = np.random.lognormal(mean=4, sigma=1, size=n_samples)
        hour_of_day = np.random.choice(
            range(24), size=n_samples,
            p=self._get_hour_distribution()
        )
        avg_amount = np.random.uniform(50, 500, n_samples)
        amount_deviation = np.abs(amount - avg_amount) / np.maximum(avg_amount, 1)
        tx_count = np.random.randint(1, 200, n_samples)
        is_new_category = np.random.binomial(1, 0.1, n_samples).astype(float)

        X = np.column_stack([
            amount, hour_of_day, avg_amount,
            amount_deviation, tx_count, is_new_category,
        ])

        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled)
        self.is_trained = True

        logger.info("Fraud detection model trained successfully.")

    def detect(self, features: dict) -> dict:
        """
        Detect fraud risk for a transaction.
        
        Returns:
        - fraud_probability (0-1)
        - risk_level (SAFE/LOW/MEDIUM/HIGH/CRITICAL)
        - indicators list
        - recommendation
        """
        if not self.is_trained:
            self.train()

        X = np.array([[
            features.get("amount", 0),
            features.get("hour_of_day", 12),
            features.get("avg_transaction_amount", 100),
            features.get("amount_deviation", 0),
            features.get("transaction_count", 0),
            1.0 if features.get("is_new_category", False) else 0.0,
        ]])

        X_scaled = self.scaler.transform(X)

        # Isolation Forest: -1 = anomaly, 1 = normal
        prediction = self.model.predict(X_scaled)[0]
        # Score: more negative = more anomalous
        anomaly_score = self.model.decision_function(X_scaled)[0]

        # Convert anomaly score to fraud probability (0-1)
        # decision_function returns negative for anomalies
        fraud_probability = max(0, min(1, 0.5 - anomaly_score))

        # Analyze indicators
        indicators = self._analyze_indicators(features, fraud_probability)

        # Determine risk level
        if fraud_probability < 0.15:
            risk_level = "SAFE"
            recommendation = "Transaction appears normal. No action needed."
        elif fraud_probability < 0.3:
            risk_level = "LOW"
            recommendation = "Minor anomaly detected. Monitor for patterns."
        elif fraud_probability < 0.5:
            risk_level = "MEDIUM"
            recommendation = "Moderate risk detected. Verify transaction details."
        elif fraud_probability < 0.75:
            risk_level = "HIGH"
            recommendation = "High fraud risk. Manual review recommended."
        else:
            risk_level = "CRITICAL"
            recommendation = "Critical fraud alert! Block transaction and contact user."

        return {
            "fraud_probability": round(fraud_probability, 4),
            "risk_level": risk_level,
            "is_suspicious": prediction == -1,
            "indicators": indicators,
            "recommendation": recommendation,
        }

    def _analyze_indicators(self, features: dict, fraud_prob: float) -> list:
        """Generate human-readable fraud indicators."""
        indicators = []

        amount = features.get("amount", 0)
        avg = features.get("avg_transaction_amount", 100)
        deviation = features.get("amount_deviation", 0)
        hour = features.get("hour_of_day", 12)
        is_new_cat = features.get("is_new_category", False)
        tx_count = features.get("transaction_count", 0)

        # Amount anomaly
        if deviation > 3:
            indicators.append({
                "indicator": "Extreme amount deviation",
                "severity": "HIGH",
                "description": f"Transaction amount (${amount:.2f}) is {deviation:.1f}x the average (${avg:.2f})",
            })
        elif deviation > 1.5:
            indicators.append({
                "indicator": "High amount deviation",
                "severity": "MEDIUM",
                "description": f"Transaction amount is significantly above average",
            })

        # Unusual hour
        if hour < 5 or hour > 23:
            indicators.append({
                "indicator": "Unusual transaction time",
                "severity": "MEDIUM",
                "description": f"Transaction at {hour}:00 is outside normal hours",
            })

        # New category
        if is_new_cat:
            indicators.append({
                "indicator": "New spending category",
                "severity": "LOW",
                "description": "First transaction in this category",
            })

        # Low history
        if tx_count < 5:
            indicators.append({
                "indicator": "Limited transaction history",
                "severity": "LOW",
                "description": "User has very few prior transactions",
            })

        # If no specific indicators but score is high
        if not indicators and fraud_prob > 0.3:
            indicators.append({
                "indicator": "Combined behavioral anomaly",
                "severity": "MEDIUM",
                "description": "Multiple small factors combine to suggest unusual behavior",
            })

        if not indicators:
            indicators.append({
                "indicator": "No anomalies detected",
                "severity": "LOW",
                "description": "Transaction matches normal behavioral patterns",
            })

        return indicators

    @staticmethod
    def _get_hour_distribution():
        """Realistic hour-of-day distribution for transactions."""
        # Most transactions happen during business hours
        dist = np.array([
            1, 1, 1, 1, 1, 2,    # 00-05: very low
            3, 5, 8, 10, 10, 9,  # 06-11: morning ramp up
            10, 10, 9, 8, 7, 8,  # 12-17: afternoon
            9, 8, 6, 4, 3, 2,    # 18-23: evening decline
        ], dtype=float)
        return dist / dist.sum()


# Global model instance
fraud_model = FraudModel()
