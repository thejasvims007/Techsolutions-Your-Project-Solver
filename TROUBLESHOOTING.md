# Tech Solutions - Quick Start Script

## Port Conflict Issue

If you see errors like:
- `EADDRINUSE: address already in use :::5000`
- `Something is already running on port 3000`

This means the ports are already in use by previous instances.

## Solution

### Option 1: Use the Kill Ports Script (Easiest)
```bash
# Run this batch file to kill processes on ports 3000 and 5000
kill-ports.bat
```

### Option 2: Manual Kill
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F

# Find process on port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Option 3: Change Ports
Edit `.env` file:
```env
PORT=5001
```

Edit `frontend/.env.local`:
```env
REACT_APP_API_URL=http://localhost:5001
```

## After Fixing Ports

1. **Create frontend environment file** (if not done):
   ```bash
   cd frontend
   echo REACT_APP_API_URL=http://localhost:5000 > .env.local
   cd ..
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```

3. **Seed the database** (first time only):
   - Visit: http://localhost:5000/api/seed

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000
   - Login: admin@techsolutions.com / admin123

## Common Issues

### "Cannot find module"
```bash
npm install
cd frontend && npm install && cd ..
```

### "MongoDB connection error"
Make sure MongoDB is running:
```bash
net start MongoDB
```

### "CORS error"
Check that `CLIENT_URL` in `.env` is set to `http://localhost:3000`

## Need Help?

See the full documentation:
- [README.md](./README.md) - Complete setup guide
- [QUICKSTART.md](./QUICKSTART.md) - 5-minute quick start
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
