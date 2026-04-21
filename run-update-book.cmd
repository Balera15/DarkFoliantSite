@echo off
setlocal

cd /d "%~dp0"

if not exist ".runtime" mkdir ".runtime"

set "BOOK_PORT=%~1"
if "%BOOK_PORT%"=="" set "BOOK_PORT=8000"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0update-book.ps1" -Port %BOOK_PORT% >> "%~dp0.runtime\update-task.log" 2>&1

endlocal
