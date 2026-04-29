# ARTH Architecture

## System Overview

ARTH follows a three-tier architecture with strict separation of concerns:

```
┌─────────────────────────────────────────────┐
│              Frontend (React)               │
│  Vite + Tailwind CSS + Axios                │
│  Port: 5173                                 │
└──────────────────┬──────────────────────────┘
                   │ REST API (JSON)
┌──────────────────▼──────────────────────────┐
│            Backend (Express.js)              │
│  Modules: auth, user, transaction,          │
│           simulation, credit, fraud         │
│  Port: 5000                                 │
└──────────────────┬──────────────────────────┘
                   │ HTTP (Axios → FastAPI)
┌──────────────────▼──────────────────────────┐
│           ML Service (FastAPI)              │
│  Models: LinearRegression, RandomForest,    │
│          IsolationForest                    │
│  Port: 8000                                 │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│            MongoDB (Mongoose)               │
│  Collections: users, transactions           │
└─────────────────────────────────────────────┘
```

## Data Flow

```
User Action → Frontend Component
  → api.js (Axios) → POST /api/{feature}/{action}
    → Express Router → Controller → Service
      → mlClient.js → POST /ml/{feature}/{action}
        → FastAPI Router → Service → ML Model
      ← ML Response (prediction/score/risk)
    ← Formatted Response { success, data, message }
  ← Update UI State → Render Result
```

## Module Pattern (Backend)

Every backend module follows the same structure:
- **route.js** — URL mapping only, no logic
- **controller.js** — Parse req, call service, send res
- **service.js** — Business logic, call integrations
- **model.js** — Mongoose schema (if data is persisted)

## Error Handling Strategy

1. **asyncHandler** wraps controllers — catches all async errors
2. **ApiError** class — typed errors (validation, auth, not-found, server)
3. **errorHandler middleware** — formats all errors into `{ success: false, error }`
4. **ML Service errors** — caught by mlClient, re-thrown as ApiError

## Environment Variables

| Service | Variable | Description |
|---------|----------|-------------|
| Backend | `PORT` | Server port (default 5000) |
| Backend | `MONGO_URI` | MongoDB connection string |
| Backend | `JWT_SECRET` | JWT signing secret |
| Backend | `ML_SERVICE_URL` | URL of FastAPI service |
| ML | `ML_PORT` | FastAPI port (default 8000) |
| Frontend | `VITE_API_URL` | Backend API URL |
