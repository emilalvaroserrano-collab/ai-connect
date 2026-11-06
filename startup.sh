#!/bin/sh
cd /workspace
set -a
if [ -f .env ]; then
  . ./.env
fi
set +a
if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >/tmp/daily-connect-dev.log 2>&1 &
exit 0
