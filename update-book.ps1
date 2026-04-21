param(
  [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$runtimeRoot = Join-Path $projectRoot ".runtime"
$backupRoot = Join-Path $runtimeRoot "backups"
$dbFile = Join-Path $projectRoot "data\db.json"
$logFile = Join-Path $runtimeRoot "update-task.log"

function Write-Log {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Message,
    [string]$Level = "INFO"
  )

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  $line = "[{0}] [{1}] {2}" -f $timestamp, $Level.ToUpperInvariant(), $Message
  Write-Host $line
  Add-Content -Path $logFile -Value $line -Encoding utf8
}

function Invoke-Git {
  param(
    [Parameter(Mandatory = $true)]
    [string[]]$Arguments
  )

  $previousNativeErrorPreference = $null
  if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $previousNativeErrorPreference = $global:PSNativeCommandUseErrorActionPreference
    $global:PSNativeCommandUseErrorActionPreference = $false
  }

  try {
    $output = & git @Arguments 2>&1
    $exitCode = $LASTEXITCODE
  } finally {
    if ($null -ne $previousNativeErrorPreference) {
      $global:PSNativeCommandUseErrorActionPreference = $previousNativeErrorPreference
    }
  }

  if ($exitCode -ne 0) {
    throw ("Git command failed: git {0}`n{1}" -f ($Arguments -join " "), ($output -join [Environment]::NewLine))
  }

  return ($output -join [Environment]::NewLine).Trim()
}

Set-Location $projectRoot
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null
New-Item -ItemType Directory -Force -Path $backupRoot | Out-Null

try {
  Write-Log -Message "Auto-update check started."

  # The work laptop should stay deployment-only, so we abort on tracked local edits.
  $status = Invoke-Git -Arguments @("status", "--porcelain", "--untracked-files=no")
  if ($status) {
    throw "Working tree is not clean on the work laptop. Auto-update stopped to avoid overwriting local changes."
  }

  $branch = Invoke-Git -Arguments @("rev-parse", "--abbrev-ref", "HEAD")
  if (-not $branch) {
    throw "Could not determine the current git branch."
  }

  Write-Log -Message "Checking GitHub for updates on branch '$branch'."
  Invoke-Git -Arguments @("fetch", "--quiet", "origin", $branch) | Out-Null

  $localRevision = Invoke-Git -Arguments @("rev-parse", "HEAD")
  $remoteRevision = Invoke-Git -Arguments @("rev-parse", "origin/$branch")

  if ($localRevision -eq $remoteRevision) {
    Write-Log -Message "No updates found. Current version is already up to date."
    exit 0
  }

  Write-Log -Message "New revision detected: $remoteRevision"

  if (Test-Path $dbFile) {
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupFile = Join-Path $backupRoot "db-$timestamp.json"
    Copy-Item $dbFile $backupFile -Force
    Write-Log -Message "Database backup created: $backupFile"
  }

  Write-Log -Message "Stopping current server process."
  & (Join-Path $projectRoot "stop-book.ps1")

  Write-Log -Message "Pulling latest code from GitHub."
  Invoke-Git -Arguments @("pull", "--ff-only", "--quiet", "origin", $branch) | Out-Null

  Write-Log -Message "Starting updated server on port $Port."
  & (Join-Path $projectRoot "start-book.ps1") -Port $Port

  Write-Log -Message "Ferelden book updated to latest GitHub version."
} catch {
  Write-Log -Message $_.Exception.Message -Level "ERROR"
  throw
}
