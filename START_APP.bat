@echo off
REM =======================
REM Daily Insights AI - Quick Start
REM =======================

echo.
echo ========================================
echo DAILY INSIGHTS AI - QUICK START
echo ========================================
echo.

REM Check if running from correct directory
if not exist "Life-Summarizer-AI" (
    echo ERROR: Please run this script from the root dailyInsights directory
    exit /b 1
)

echo [1] Stopping any existing processes...
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2] Activating Python virtual environment...
call venv\Scripts\activate.bat

echo [3] Verifying backend setup...
cd Life-Summarizer-AI\backend
python setup.py
if errorlevel 1 (
    echo Setup failed! Check your Python environment.
    exit /b 1
)

echo.
echo [4] Starting Flask backend (port 5000)...
echo.
start cmd /k "cd /d %CD% && python app.py"

timeout /t 3 /nobreak

echo [5] In a new terminal, starting React frontend...
echo.
cd ..\frontend\my-app
start cmd /k "npm start"

echo.
echo ========================================
echo SETUP COMPLETE!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo Troubleshooting:
echo   - Check COMPREHENSIVE_TROUBLESHOOTING.md
echo   - Watch backend terminal for [DEBUG] logs
echo   - Check browser console (F12) for frontend errors
echo.
pause
