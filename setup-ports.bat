@echo off
echo ========================================
echo Tech Solutions - Port Configuration
echo ========================================
echo.

echo Step 1: Creating frontend environment file...
cd frontend
echo REACT_APP_API_URL=http://localhost:5001 > .env.local
echo ✓ Created frontend/.env.local
cd ..
echo.

echo Step 2: Updating backend port configuration...
echo Please manually edit your .env file and change:
echo   FROM: PORT=5000
echo   TO:   PORT=5001
echo.
echo This is needed because port 5000 is in use by a system process.
echo.

echo ========================================
echo Configuration Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file and change PORT=5000 to PORT=5001
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo 4. Seed database: http://localhost:5001/api/seed
echo.
pause
