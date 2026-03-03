$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectDir = Split-Path -Parent $ScriptDir

if (-not (Test-Path "$ProjectDir\.env")) {
    Write-Host "No .env file found. Copying from .env.example..."
    Copy-Item "$ProjectDir\.env.example" "$ProjectDir\.env"
    Write-Host "Please edit $ProjectDir\.env with your values, then re-run this script."
    exit 1
}

Write-Host "Building and starting Prelegal..."
docker build -t prelegal:latest $ProjectDir
docker run -d `
    --name prelegal `
    --rm `
    -p 8000:8000 `
    --env-file "$ProjectDir\.env" `
    prelegal:latest

Write-Host "Prelegal is running at http://localhost:8000"
