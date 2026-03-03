#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

if [ ! -f "$PROJECT_DIR/.env" ]; then
  echo "No .env file found. Copying from .env.example..."
  cp "$PROJECT_DIR/.env.example" "$PROJECT_DIR/.env"
  echo "Please edit $PROJECT_DIR/.env with your values, then re-run this script."
  exit 1
fi

echo "Building and starting Prelegal..."
docker build -t prelegal:latest "$PROJECT_DIR"
docker run -d \
  --name prelegal \
  --rm \
  -p 8000:8000 \
  --env-file "$PROJECT_DIR/.env" \
  prelegal:latest

echo "Prelegal is running at http://localhost:8000"
