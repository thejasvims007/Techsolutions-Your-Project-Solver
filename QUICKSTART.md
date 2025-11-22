# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Step 2: Configure Environment
```bash
# Backend configuration is already set in .env
# Frontend needs .env.local file
cd frontend
echo REACT_APP_API_URL=http://localhost:5000 > .env.local
cd ..
```

### Step 3: Start MongoDB
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Step 4: Run the Application
```bash
# Start both frontend and backend
npm run dev
```

### Step 5: Seed the Database
Open your browser and visit:
```
http://localhost:5000/api/seed
```

### Step 6: Access the Application
```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
```

## 🔑 Login Credentials

**Admin Account:**
- Email: `admin@techsolutions.com`
- Password: `admin123`

**Test Client:**
- Create an account via signup, or use admin credentials

## 📝 What's Next?

1. **Explore the Application:**
   - Browse projects
   - Purchase a project (as client)
   - Manage orders (as admin)

2. **Deploy to Production:**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
   - Recommended: Heroku or Railway for easy deployment

3. **Customize:**
   - Add your own projects
   - Modify the UI
   - Add new features

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Change PORT in .env file
PORT=5001
```

**MongoDB connection error:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env

**CORS errors:**
- Verify CLIENT_URL in .env matches frontend URL
- Default: http://localhost:3000

## 📚 Documentation

- [README.md](./README.md) - Full documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guides
- [API Documentation](#api-endpoints) - In README.md

## ✅ Verification

Run this to verify your setup:
```bash
node verify-setup.js
```

---

**Need help?** Check the README.md or DEPLOYMENT.md files for detailed information.
