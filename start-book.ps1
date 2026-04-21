$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

if (-not $env:PORT) {
  $env:PORT = "8000"
}

Write-Host ""
Write-Host "Ferelden server starting on http://localhost:$($env:PORT)" -ForegroundColor Cyan
Write-Host "Keep this window open while the site is running." -ForegroundColor DarkGray
Write-Host ""

node server.js
