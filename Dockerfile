# Stage 1: Build Next.js static export
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 2: Python backend + static frontend
FROM python:3.12-slim AS final

COPY --from=ghcr.io/astral-sh/uv:0.5 /uv /uvx /usr/local/bin/

WORKDIR /app

# Install Python dependencies
COPY backend/pyproject.toml backend/uv.lock* ./backend/
WORKDIR /app/backend
RUN uv sync --frozen --no-dev 2>/dev/null || uv sync --no-dev

# Copy backend code
COPY backend/app/ ./app/

# Copy built frontend to /app/static
COPY --from=frontend-builder /app/frontend/out/ /app/static/

# Copy templates and catalog
COPY templates/ /app/templates/
COPY catalog.json /app/catalog.json

ENV DATABASE_URL="sqlite:////app/prelegal.db"
ENV PYTHONPATH="/app/backend"

WORKDIR /app/backend
EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
