@echo off
setlocal

cd /d "%~dp0"

echo.
echo === Ferelden book update started ===
echo.

git pull origin main
if errorlevel 1 (
  echo Git pull failed.
  exit /b 1
)

echo.
echo Stopping current server on port 8000 if it is running...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

echo.
echo Starting updated server...
start "Ferelden Book" powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-book.ps1"

echo.
echo === Ferelden book update finished ===
echo.

endlocal
