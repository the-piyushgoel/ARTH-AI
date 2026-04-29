# ARTH — AI-Powered Financial Intelligence System

> **Meaning**: Financial Intelligence System that understands and predicts money behavior.

## Overview

ARTH is a production-ready, modular fintech platform with three AI-powered core features:

1. **AI Financial Twin** — Simulates and predicts future financial outcomes
2. **Explainable AI Credit System** — Transparent credit scoring with human-readable explanations
3. **Behavioral AI Fraud Detection** — Real-time fraud detection using behavioral intelligence

## Architecture

```
Frontend (React + Vite + Tailwind)
    ↕ REST API
Backend (Express.js + MongoDB)
    ↕ HTTP (Axios)
ML Service (FastAPI + scikit-learn)
```

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB (Atlas or local)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit with your MongoDB URI
npm run dev
```

### 2. ML Service
```bash
cd ml-service
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/user/profile` | Get profile |
| POST | `/api/transactions` | Add transaction |
| GET | `/api/transactions` | List transactions |
| POST | `/api/simulation/predict` | Predict future balance |
| POST | `/api/credit/score` | Get credit score |
| POST | `/api/credit/explain` | Explain credit decision |
| POST | `/api/fraud/detect` | Detect fraud risk |

## Project Structure

```
root/
├── frontend/      # React + Vite + Tailwind
├── backend/       # Express.js API
├── ml-service/    # FastAPI + scikit-learn
└── docs/          # Documentation
```

## License

MIT
