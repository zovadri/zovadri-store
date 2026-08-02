@echo off
echo ============================================
echo   ZOVADRI - Startup Script
echo ============================================

echo [1/3] Checking PostgreSQL...
"C:\pg17\pgsql\bin\pg_isready.exe" -p 5432 >nul 2>&1
if %errorlevel% neq 0 (
  echo   Starting PostgreSQL...
  start /b "postgres" "C:\pg17\pgsql\bin\pg_ctl.exe" -D "C:\pg17\data" -o "-p 5432" start
  timeout /t 5 /nobreak >nul
) else (
  echo   PostgreSQL already running.
)

echo [2/3] Starting Zovadri API on :4000...
start "zovadri-api" cmd /c "npm run start --workspace=@zovadri/api"

echo [3/3] Starting Zovadri Web on :3000...
start "zovadri-web" cmd /c "npm run start --workspace=@zovadri/web"

echo.
echo ============================================
echo   ZOVADRI IS RUNNING
echo   Store:   http://localhost:3000
echo   API:     http://localhost:4000
echo ============================================
pause
