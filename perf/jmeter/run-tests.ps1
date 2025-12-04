#!/usr/bin/env pwsh
# PowerShell script to run the JMeter test-plan in non-GUI mode.
# Usage examples (PowerShell):
#   ./run-tests.ps1            # uses defaults
#   ./run-tests.ps1 -Threads 200 -Ramp 60 -Duration 180

param(
  [int]$Threads = 50,
  [int]$Ramp = 30,
  [int]$Duration = 60,
  [string]$Host = 'car-certify.onrender.com',
  [int]$Port = 443,
  [string]$Protocol = 'https',
  [string]$JMeterPath = 'jmeter'
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $scriptDir

$jmx = Join-Path $scriptDir 'test-plan.jmx'
$results = Join-Path $scriptDir "results_${([datetime]::UtcNow.ToString('yyyyMMdd_HHmmss'))}.jtl"

Write-Host "Running JMeter test plan:" $jmx
Write-Host "Threads:$Threads Ramp:$Ramp Duration:$Duration Host:$Host"

# Ensure JMeter is on PATH or provide full path in -JMeterPath
& $JMeterPath -n -t $jmx -l $results -Jthreads=$Threads -Jramp=$Ramp -Jduration=$Duration -Jhost=$Host -Jport=$Port -Jprotocol=$Protocol

if ($LASTEXITCODE -eq 0) {
  Write-Host "JMeter finished successfully. Results: $results"
} else {
  Write-Host "JMeter exited with code $LASTEXITCODE"
}

Pop-Location
