param(
  [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeRoot = Join-Path $projectRoot ".runtime"
$backupRoot = Join-Path $runtimeRoot "backups"
$dbFile = Join-Path $projectRoot "data\db.json"

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $output = & git @Arguments 2>&1
  if ($LASTEXITCODE -ne 0) {
    throw ("Git command failed: git {0}`n{1}" -f ($Arguments -join " "), ($output -join [Environment]::NewLine))
  }
  return ($output -join [Environment]::NewLine).Trim()
}

Set-Location $projectRoot
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

$status = Invoke-Git -Arguments @("status", "--porcelain", "--untracked-files=no")
if ($status) {
  throw "Working tree is not clean on the work laptop. Auto-update stopped to avoid overwriting local changes."
}

$branch = Invoke-Git -Arguments @("rev-parse", "--abbrev-ref", "HEAD")
if (-not $branch) {
  throw "Could not determine the current git branch."
}

Write-Host "Checking GitHub for updates on branch '$branch'..." -ForegroundColor Cyan
Invoke-Git -Arguments @("fetch", "origin", $branch) | Out-Null

$localRevision = Invoke-Git -Arguments @("rev-parse", "HEAD")
$remoteRevision = Invoke-Git -Arguments @("rev-parse", "origin/$branch")

if ($localRevision -eq $remoteRevision) {
  Write-Host "No updates found. Current version is already up to date." -ForegroundColor Green
  exit 0
}

if (Test-Path $dbFile) {
  $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $backupFile = Join-Path $backupRoot "db-$timestamp.json"
  Copy-Item $dbFile $backupFile -Force
  Write-Host "Database backup created: $backupFile" -ForegroundColor DarkGray
}

& (Join-Path $projectRoot "stop-book.ps1")
Invoke-Git -Arguments @("pull", "--ff-only", "origin", $branch) | Out-Null
& (Join-Path $projectRoot "start-book.ps1") -Port $Port

Write-Host "Ferelden book updated to latest GitHub version." -ForegroundColor Green
