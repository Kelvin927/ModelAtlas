#!/bin/zsh
# Kill all processes using port 8000

echo "🔍 Checking port 8000..."
PIDS=$(lsof -ti :8000)

if [ -z "$PIDS" ]; then
  echo "✅ Port 8000 is free."
else
  echo "⚠️  Port 8000 is in use by PID(s): $PIDS"
  echo "🛑 Killing process(es)..."
  kill -9 $PIDS
  echo "✅ Port 8000 is now free."
fi

