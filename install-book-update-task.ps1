param(
  [int]$Port = 8000,
  [int]$IntervalMinutes = 5
)

$ErrorActionPreference = "Stop"

if ($IntervalMinutes -lt 1) {
  throw "IntervalMinutes must be 1 or greater."
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$updateScript = Join-Path $projectRoot "update-book.ps1"
$taskName = "FereldenBookAutoUpdate"

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$updateScript`" -Port $Port"

$trigger = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1)
$trigger.RepetitionInterval = (New-TimeSpan -Minutes $IntervalMinutes)
$trigger.RepetitionDuration = (New-TimeSpan -Days 3650)

$settings = New-ScheduledTaskSettingsSet `
  -StartWhenAvailable `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -MultipleInstances IgnoreNew

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Auto-updates and restarts Ferelden book from GitHub." `
  -Force | Out-Null

Write-Host "Scheduled task '$taskName' has been installed." -ForegroundColor Green
Write-Host "It will check GitHub every $IntervalMinutes minute(s)." -ForegroundColor Cyan
