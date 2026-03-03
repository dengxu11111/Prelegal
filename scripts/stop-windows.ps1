$ErrorActionPreference = "SilentlyContinue"
docker stop prelegal
if ($LASTEXITCODE -eq 0) {
    Write-Host "Prelegal stopped."
} else {
    Write-Host "Container was not running."
}
