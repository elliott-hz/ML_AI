#!/bin/bash

# AI Knowledge Learning System - Stop Script
# This script stops all running services

echo "Stopping all services..."

# Find and kill processes on port 8000 (backend)
BACKEND_PID=$(lsof -ti:8000 2>/dev/null || true)
if [ ! -z "$BACKEND_PID" ]; then
    echo "Stopping backend service (port 8000)..."
    kill $BACKEND_PID 2>/dev/null || true
    echo "✓ Backend stopped"
fi

# Find and kill processes on port 3000 (frontend)
FRONTEND_PID=$(lsof -ti:3000 2>/dev/null || true)
if [ ! -z "$FRONTEND_PID" ]; then
    echo "Stopping frontend service (port 3000)..."
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✓ Frontend stopped"
fi

echo "All services stopped"
