# ============================================================
# ARTH ML Service — FastAPI Main Application
# Initializes the app, trains models at startup via lifespan,
# and registers all route modules.
# ============================================================

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import simulation, credit, fraud
from app.models.simulation_model import simulation_model
from app.models.credit_model import credit_model
from app.models.fraud_model import fraud_model

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] [%(levelname)s] %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("arth.ml")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Trains all ML models at startup so they are ready to serve.
    """
    logger.info("🚀 ARTH ML Service starting up...")
    logger.info("📊 Training ML models on synthetic data...")

    # Train all models at startup
    simulation_model.train()
    credit_model.train()
    fraud_model.train()

    logger.info("✅ All models trained and ready to serve!")
    yield
    logger.info("🛑 ARTH ML Service shutting down...")


# Create FastAPI app
app = FastAPI(
    title="ARTH ML Service",
    description="AI-Powered Financial Intelligence — ML Prediction Engine",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route modules
app.include_router(simulation.router)
app.include_router(credit.router)
app.include_router(fraud.router)


# Health check endpoint
@app.get("/ml/health", tags=["Health"])
async def health_check():
    """Health check endpoint for ML service."""
    return {
        "service": "ARTH ML Service",
        "status": "running",
        "models": {
            "simulation": simulation_model.is_trained,
            "credit": credit_model.is_trained,
            "fraud": fraud_model.is_trained,
        },
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "ARTH ML Service — AI Financial Intelligence Engine",
        "docs": "/docs",
        "health": "/ml/health",
    }
