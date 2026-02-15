#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting Bird Dog..."

# Check for .env
if [ ! -f "$DIR/.env" ]; then
  echo "Error: .env file not found. Copy .env.example to .env and add your ANTHROPIC_API_KEY."
  exit 1
fi

# Install backend deps if needed
if [ ! -d "$DIR/.venv" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv "$DIR/.venv"
fi
source "$DIR/.venv/bin/activate"
pip install -q -r "$DIR/backend/requirements.txt"

# Install frontend deps if needed
if [ ! -d "$DIR/frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  (cd "$DIR/frontend" && npm install)
fi

# Start backend
echo "Starting backend on :8000..."
uvicorn backend.main:app --reload --port 8000 --app-dir "$DIR" &
BACKEND_PID=$!

# Start frontend
echo "Starting frontend on :5173..."
(cd "$DIR/frontend" && npm run dev) &
FRONTEND_PID=$!

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

echo ""
echo "Bird Dog is running!"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
echo ""

wait
