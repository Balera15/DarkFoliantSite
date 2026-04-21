param(
  [int]$Port = 8000,
  [int]$IntervalMinutes = 5
)

$ErrorActionPreference = "Stop"

if ($IntervalMinutes -lt 1) {
  throw "IntervalMinutes must be 1 or greater."
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$taskRunner = Join-Path $projectRoot "run-update-book.cmd"
$taskName = "FereldenBookAutoUpdate"
$startTime = (Get-Date).AddMinutes(1).ToString("HH:mm")

if (-not (Test-Path $taskRunner)) {
  throw "Task runner not found: $taskRunner"
}

$createArgs = @(
  "/Create",
  "/F",
  "/SC", "MINUTE",
  "/MO", "$IntervalMinutes",
  "/TN", $taskName,
  "/TR", "`"$taskRunner`" $Port",
  "/ST", $startTime
)

$output = & schtasks.exe @createArgs 2>&1
if ($LASTEXITCODE -ne 0) {
  throw ("Failed to create scheduled task '{0}'.`n{1}" -f $taskName, ($output -join [Environment]::NewLine))
}

Write-Host "Scheduled task '$taskName' has been installed." -ForegroundColor Green
Write-Host "It will check GitHub every $IntervalMinutes minute(s)." -ForegroundColor Cyan
Write-Host "Start time: $startTime" -ForegroundColor DarkGray
