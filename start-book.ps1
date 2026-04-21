param(
  [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeRoot = Join-Path $projectRoot ".runtime"
$pidFile = Join-Path $runtimeRoot "book-server.pid"
$stdoutLogFile = Join-Path $runtimeRoot "book-server.out.log"
$stderrLogFile = Join-Path $runtimeRoot "book-server.err.log"

function Test-RunningProcess {
  param(
    [string]$PidPath
  )

  if (-not (Test-Path $PidPath)) {
    return $null
  }

  $rawPid = (Get-Content $PidPath -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
  if (-not $rawPid) {
    return $null
  }

  try {
    $process = Get-Process -Id ([int]$rawPid) -ErrorAction Stop
    return $process
  } catch {
    Remove-Item $PidPath -ErrorAction SilentlyContinue
    return $null
  }
}

New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null

$runningProcess = Test-RunningProcess -PidPath $pidFile
if ($runningProcess) {
  Write-Host "Ferelden book is already running on PID $($runningProcess.Id)." -ForegroundColor Yellow
  Write-Host "Stdout log: $stdoutLogFile" -ForegroundColor DarkGray
  Write-Host "Stderr log: $stderrLogFile" -ForegroundColor DarkGray
  exit 0
}

$previousPort = $env:PORT
$env:PORT = "$Port"

try {
  $process = Start-Process node `
    -ArgumentList @("server.js") `
    -WorkingDirectory $projectRoot `
    -RedirectStandardOutput $stdoutLogFile `
    -RedirectStandardError $stderrLogFile `
    -PassThru

  Set-Content -Path $pidFile -Value $process.Id -Encoding ascii

  Write-Host ""
  Write-Host "Ferelden book started in background." -ForegroundColor Cyan
  Write-Host "URL: http://localhost:$Port" -ForegroundColor Cyan
  Write-Host "PID: $($process.Id)" -ForegroundColor DarkGray
  Write-Host "Stdout log: $stdoutLogFile" -ForegroundColor DarkGray
  Write-Host "Stderr log: $stderrLogFile" -ForegroundColor DarkGray
  Write-Host ""
} finally {
  if ($null -eq $previousPort) {
    Remove-Item Env:PORT -ErrorAction SilentlyContinue
  } else {
    $env:PORT = $previousPort
  }
}
