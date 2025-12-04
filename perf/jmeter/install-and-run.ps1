#!/usr/bin/env pwsh
# This script downloads Apache JMeter (if not present), installs it locally, and runs the test plan.

param(
  [int]$Threads = 50,
  [int]$Ramp = 30,
  [int]$Duration = 60,
  [string]$TargetHost = 'car-certify.onrender.com',
  [int]$Port = 443,
  [string]$Protocol = 'https'
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$jmeterDir = Join-Path $scriptDir 'apache-jmeter'
$jmeterBin = Join-Path (Join-Path $jmeterDir 'bin') 'jmeter.bat'

# Download and extract JMeter if not present
if (-not (Test-Path $jmeterBin)) {
  Write-Host "JMeter not found. Downloading Apache JMeter 5.6.3..."
  $jmeterUrl = 'https://archive.apache.org/dist/jmeter/binaries/apache-jmeter-5.6.3.zip'
  $zipFile = Join-Path $scriptDir 'jmeter.zip'
  
  try {
    $ProgressPreference = 'SilentlyContinue'  # Suppress progress bar for faster download
    Invoke-WebRequest -Uri $jmeterUrl -OutFile $zipFile -TimeoutSec 300
    Write-Host "Download complete. Extracting..."
    
    Expand-Archive -Path $zipFile -DestinationPath $scriptDir -Force
    Remove-Item $zipFile -Force
    
    # Rename extracted folder to 'apache-jmeter'
    $extractedName = Get-ChildItem -Path $scriptDir -Directory -Filter 'apache-jmeter-*' | Select-Object -First 1 -ExpandProperty Name
    if ($extractedName) {
      Rename-Item -Path (Join-Path $scriptDir $extractedName) -NewName 'apache-jmeter' -Force
    }
    
    Write-Host "JMeter installed successfully at $jmeterDir"
  } catch {
    Write-Error "Failed to download/extract JMeter: $_"
    exit 1
  }
}

# Run the test plan
$jmx = Join-Path $scriptDir 'test-plan.jmx'
$results = Join-Path $scriptDir "results_$([datetime]::UtcNow.ToString('yyyyMMdd_HHmmss')).jtl"

Write-Host "Running JMeter test plan: $jmx"
Write-Host "Threads: $Threads | Ramp-up: ${Ramp}s | Duration: ${Duration}s | Host: $TargetHost"
Write-Host ""

# Run JMeter in non-GUI mode
& $jmeterBin -n -t $jmx -l $results `
  -Jthreads=$Threads `
  -Jramp=$Ramp `
  -Jduration=$Duration `
  -Jhost=$TargetHost `
  -Jport=$Port `
  -Jprotocol=$Protocol

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "[OK] JMeter finished successfully."
  Write-Host "Results file: $results"
  Write-Host ""
  Write-Host "To view results in JMeter GUI:"
  Write-Host "  $jmeterBin"
  Write-Host "  Then: File > Open > $results"
} else {
  Write-Host "[FAIL] JMeter exited with code $LASTEXITCODE"
  exit $LASTEXITCODE
}
