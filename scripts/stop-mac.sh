#!/usr/bin/env bash
set -euo pipefail
docker stop prelegal 2>/dev/null && echo "Prelegal stopped." || echo "Container was not running."
