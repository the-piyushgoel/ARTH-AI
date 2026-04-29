# ARTH — Complete Setup Guide (Step by Step)

This guide walks you through everything you need to run ARTH on your local machine.

---

## Prerequisites (Install These First)

| Tool | Version | How to Check | Download |
|------|---------|--------------|----------|
| **Node.js** | 18+ | `node --version` | [nodejs.org](https://nodejs.org) |
| **Python** | 3.10+ | `python --version` | [python.org](https://python.org) |
| **MongoDB** | Any | See Step 1 below | [MongoDB Atlas](https://www.mongodb.com/atlas) (free) |

---

## Step 1: Set Up MongoDB (FREE — MongoDB Atlas)

You need a MongoDB database. The easiest way is **MongoDB Atlas** (free cloud database):

### Create a Free MongoDB Atlas Cluster:

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Try Free"** → Sign up with Google/Email
3. Choose **FREE Shared Cluster** (M0 Sandbox — completely free)
4. Select any cloud provider (AWS is fine) and nearest region
5. Click **"Create Cluster"** (takes 1-3 minutes)

### Get Your Connection String:

6. Go to **Database Access** (left sidebar) → Click **"Add New Database User"**
   - Username: `arth_admin`
   - Password: Pick something (e.g., `ArthPass123!`) — **save this!**
   - Role: **Read and write to any database**
   - Click **"Add User"**

7. Go to **Network Access** (left sidebar) → Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (for development)
   - Click **"Confirm"**

8. Go to **Database** (left sidebar) → Click **"Connect"** on your cluster
   - Choose **"Drivers"**
   - Copy the connection string. It looks like:
   ```
   mongodb+srv://arth_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **Replace `<password>`** with the password you set in step 6

### Alternative: Local MongoDB
If you have MongoDB installed locally, your URI is simply:
```
mongodb://localhost:27017/arth
```

---

## Step 2: Configure Environment Files

You have **3 services**, each needs a `.env` file. They are already created — you just need to **edit the backend one**.

### Backend `.env` (THE ONLY FILE YOU NEED TO EDIT)

Open: `backend/.env`

```env
# Backend Environment Variables
PORT=5000
MONGO_URI=mongodb+srv://arth_admin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/arth?retryWrites=true&w=majority
JWT_SECRET=arth_super_secret_key_2026_change_in_production
ML_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

**What each variable does:**

| Variable | What It Is | What To Put |
|----------|-----------|-------------|
| `PORT` | Backend server port | Leave as `5000` |
| `MONGO_URI` | Your MongoDB connection string | **Paste your Atlas URI from Step 1** |
| `JWT_SECRET` | Secret key for login tokens | Any random string (change in production) |
| `ML_SERVICE_URL` | Where the Python ML service runs | Leave as `http://localhost:8000` |
| `NODE_ENV` | Environment mode | Leave as `development` |

### Frontend `.env` (Already configured — no changes needed)

File: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000
```
This tells the frontend where to find the backend. ✅ Already correct.

### ML Service `.env` (Already configured — no changes needed)

File: `ml-service/.env`
```env
ML_PORT=8000
ML_ENV=development
```
✅ Already correct.

---

## Step 3: Run the Project (3 Terminals)

You need **3 separate terminal windows** — one for each service. Start them in this order:

### Terminal 1: ML Service (Python) — START THIS FIRST

```powershell
cd "c:\Users\piyus\OneDrive\Desktop\New folder\ml-service"

# Create a virtual environment (first time only)
python -m venv venv

# Activate it
.\venv\Scripts\Activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Start the ML service
uvicorn app.main:app --reload --port 8000
```

**You should see:**
```
INFO:     ARTH ML Service starting up...
INFO:     Training ML models on synthetic data...
INFO:     Simulation model trained. R² score: 0.xxxx
INFO:     Credit model trained. Accuracy: 0.xxxx
INFO:     Fraud detection model trained successfully.
INFO:     All models trained and ready to serve!
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ ML Service running on **http://localhost:8000**
📄 API Docs at **http://localhost:8000/docs** (interactive Swagger UI!)

---

### Terminal 2: Backend (Node.js)

```powershell
cd "c:\Users\piyus\OneDrive\Desktop\New folder\backend"

# Install dependencies (first time only)
npm install

# Start the backend
npm run dev
```

**You should see:**
```
[INFO] MongoDB connected: cluster0-shard-xxxx
[INFO] 🚀 ARTH Backend running on port 5000
[INFO] 📡 Environment: development
[INFO] 🤖 ML Service URL: http://localhost:8000
```

✅ Backend running on **http://localhost:5000**

---

### Terminal 3: Frontend (React)

```powershell
cd "c:\Users\piyus\OneDrive\Desktop\New folder\frontend"

# Install dependencies (first time only — already done)
npm install

# Start the frontend
npm run dev
```

**You should see:**
```
VITE v8.0.10  ready in 655 ms
➜  Local:   http://localhost:5173/
```

✅ Frontend running on **http://localhost:5173**

---

## Step 4: Use the App!

1. Open **http://localhost:5173** in your browser
2. You'll see the **Login page** — click **"Create one"** to register
3. Fill in name, email, password → Click **"Create Account"**
4. You're now on the **Dashboard** — explore:
   - 🔮 **AI Financial Twin** — Enter income/expenses, predict your future balance
   - 🛡️ **Credit Score** — Get an AI-explained credit score
   - 🔍 **Fraud Detection** — Check if a transaction looks suspicious
   - 💳 **Transactions** — Add income/expense records

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB connection error` | Check your `MONGO_URI` in `backend/.env` — is the password correct? Did you allow your IP in Atlas? |
| `ML Service is currently unavailable` | Start the ML service first (Terminal 1) before the backend |
| `ECONNREFUSED on port 5000` | Backend isn't running — start Terminal 2 |
| `pip not found` | Use `python -m pip install -r requirements.txt` instead |
| `uvicorn not found` | Run `pip install uvicorn` or check your virtual environment is activated |
| Frontend shows blank page | Check browser console (F12) for errors |

---

## Quick Reference: Startup Order

```
1. ML Service  (port 8000)  ← Start first, models need to train
2. Backend     (port 5000)  ← Needs ML service + MongoDB
3. Frontend    (port 5173)  ← Needs backend
```

All 3 must be running simultaneously for the full app to work!
