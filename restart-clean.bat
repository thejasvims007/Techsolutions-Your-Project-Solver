@echo off
echo Stopping all Node.js processes and freeing ports...

echo.
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node.js processes terminated
) else (
    echo ℹ No Node.js processes found
)

echo.
echo Killing nodemon processes...
taskkill /F /IM nodemon.exe 2>nul

echo.
echo Waiting for ports to be released...
timeout /t 2 /nobreak >nul

echo.
echo ✓ All processes stopped and ports freed!
echo.
echo You can now run: npm run dev
echo.
pause
