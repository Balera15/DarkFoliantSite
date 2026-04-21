$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeRoot = Join-Path $projectRoot ".runtime"
$pidFile = Join-Path $runtimeRoot "book-server.pid"

if (-not (Test-Path $pidFile)) {
  Write-Host "Ferelden book is not running." -ForegroundColor Yellow
  exit 0
}

$rawPid = (Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
if (-not $rawPid) {
  Remove-Item $pidFile -ErrorAction SilentlyContinue
  Write-Host "PID file was empty and has been cleaned up." -ForegroundColor Yellow
  exit 0
}

try {
  $process = Get-Process -Id ([int]$rawPid) -ErrorAction Stop
  Stop-Process -Id $process.Id -Force -ErrorAction Stop
  Write-Host "Ferelden book stopped. PID: $($process.Id)" -ForegroundColor Cyan
} catch {
  Write-Host "Process $rawPid was already stopped." -ForegroundColor Yellow
} finally {
  Remove-Item $pidFile -ErrorAction SilentlyContinue
}
