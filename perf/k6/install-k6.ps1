# K6 Installation Script for Windows

$k6Version = "0.49.0"
$downloadUrl = "https://github.com/grafana/k6/releases/download/v$k6Version/k6-v$k6Version-windows-amd64.zip"
$installDir = "$PSScriptRoot\k6-$k6Version"
$zipFile = "$PSScriptRoot\k6-v$k6Version-windows-amd64.zip"
$k6Exe = "$installDir\k6.exe"

Write-Host "Downloading K6 v$k6Version..." -ForegroundColor Green

try {
    # Download K6
    Invoke-WebRequest -Uri $downloadUrl -OutFile $zipFile -ErrorAction Stop
    Write-Host "Download complete. Extracting..." -ForegroundColor Green
    
    # Extract
    Expand-Archive -Path $zipFile -DestinationPath $installDir -Force
    Write-Host "Extraction complete." -ForegroundColor Green
    
    # Verify
    if (Test-Path $k6Exe) {
        Write-Host "K6 installed successfully at: $k6Exe" -ForegroundColor Green
        & $k6Exe version
        
        # Add to PATH (local script reference)
        Write-Host "`nTo use k6 globally, run from this directory or add to PATH:" -ForegroundColor Yellow
        Write-Host "Usage: .\k6\k6-$k6Version\k6.exe run <script.js>" -ForegroundColor Cyan
    } else {
        Write-Host "Installation failed: k6.exe not found" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
