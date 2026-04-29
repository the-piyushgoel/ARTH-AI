# ============================================================
# ARTH ML Service — Configuration
# ============================================================

import os
from dotenv import load_dotenv

load_dotenv()

ML_PORT = int(os.getenv("ML_PORT", 8000))
ML_ENV = os.getenv("ML_ENV", "development")
