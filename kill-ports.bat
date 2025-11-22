@echo off
echo Killing processes on ports 3000 and 5000...

REM Find and kill process on port 5000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Killing process %%a on port 5000
    taskkill /PID %%a /F
)

REM Find and kill process on port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Killing process %%a on port 3000
    taskkill /PID %%a /F
)

echo Done! Ports 3000 and 5000 are now free.
echo You can now run: npm run dev
pause
