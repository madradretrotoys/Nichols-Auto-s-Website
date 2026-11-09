#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm ci --cache /tmp/nichols-npm-cache --no-audit --no-fund
npm run check
npm run build
