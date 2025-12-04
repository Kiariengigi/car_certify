# K6 Performance Test Runner
# Usage: .\run-k6-test.ps1 [-outputFormat json|csv|html]

param(
    [ValidateSet('json', 'csv')]
    [string]$outputFormat = 'json'
)

$k6Path = "$PSScriptRoot\k6-0.49.0\k6-v0.49.0-windows-amd64\k6.exe"
$testScript = "$PSScriptRoot\performance-test.js"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outputFile = "$PSScriptRoot\results_$timestamp.$outputFormat"

if (-not (Test-Path $k6Path)) {
    Write-Host "Error: K6 not found at $k6Path" -ForegroundColor Red
    Write-Host "Please run install-k6.ps1 first." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $testScript)) {
    Write-Host "Error: Test script not found at $testScript" -ForegroundColor Red
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "K6 Performance Test" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Script: $testScript" -ForegroundColor Yellow
Write-Host "Output: $outputFile" -ForegroundColor Yellow
Write-Host "Starting test at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Run K6 test
& $k6Path run `
    --out "$outputFormat=$outputFile" `
    $testScript

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test completed at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Green
Write-Host "Results saved to: $outputFile" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
