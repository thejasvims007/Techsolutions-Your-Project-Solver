# Quick Fix Guide

## Current Status
✅ Port 3000 is FREE  
⚠️ Port 5000 is BLOCKED (system process)

## Fix in 3 Steps:

### Step 1: Edit .env file
Open `.env` and change line 1:
```
FROM: PORT=5000
TO:   PORT=5001
```

### Step 2: Create frontend environment
```bash
cd frontend
echo REACT_APP_API_URL=http://localhost:5001 > .env.local
cd ..
```

### Step 3: Start the app
```bash
npm run dev
```

## Access Your App:
- Frontend: http://localhost:3000
- Backend: http://localhost:5001
- Seed DB: http://localhost:5001/api/seed
- Login: admin@techsolutions.com / admin123

That's it! 🎉
