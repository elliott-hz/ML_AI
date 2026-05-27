#!/bin/bash

# AI Knowledge Learning System - Service Startup Script
# This script starts both frontend and backend services

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_ROOT/code-base/frontend"
BACKEND_DIR="$PROJECT_ROOT/code-base/backend"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AI Knowledge Learning System${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}Error: Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}Error: npm is not installed. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists python3; then
    echo -e "${RED}Error: Python 3 is not installed. Please install Python 3.9+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Parse command line arguments
START_FRONTEND=true
START_BACKEND=true
INSTALL_DEPS=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --frontend-only)
            START_BACKEND=false
            shift
            ;;
        --backend-only)
            START_FRONTEND=false
            shift
            ;;
        --install)
            INSTALL_DEPS=true
            shift
            ;;
        --help)
            echo "Usage: ./start.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --frontend-only    Start only frontend service"
            echo "  --backend-only     Start only backend service"
            echo "  --install          Install dependencies before starting"
            echo "  --help             Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Install dependencies if requested
if [ "$INSTALL_DEPS" = true ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    cd "$FRONTEND_DIR"
    if [ ! -d "node_modules" ]; then
        npm install
        echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
    else
        echo -e "${GREEN}✓ Frontend dependencies already installed${NC}"
    fi
    echo ""

    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    cd "$BACKEND_DIR"
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        deactivate
        echo -e "${GREEN}✓ Backend dependencies installed${NC}"
    else
        echo -e "${GREEN}✓ Backend dependencies already installed${NC}"
    fi
    echo ""
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down services...${NC}"
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        echo -e "${GREEN}✓ Backend stopped${NC}"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        echo -e "${GREEN}✓ Frontend stopped${NC}"
    fi
    echo -e "${BLUE}All services stopped${NC}"
    exit 0
}

# Trap SIGINT and SIGTERM to cleanup
trap cleanup SIGINT SIGTERM

# Start backend service
if [ "$START_BACKEND" = true ]; then
    echo -e "${YELLOW}Starting backend service...${NC}"
    cd "$BACKEND_DIR"
    
    # Activate virtual environment
    if [ ! -d "venv" ]; then
        echo -e "${RED}Error: Backend virtual environment not found. Run with --install flag first.${NC}"
        exit 1
    fi
    
    # Start backend in background (activate venv first)
    (
        source venv/bin/activate
        exec uvicorn app.main:app --host 0.0.0.0 --port 8000
    ) &
    BACKEND_PID=$!
    
    echo -e "${GREEN}✓ Backend started (PID: $BACKEND_PID)${NC}"
    echo -e "${BLUE}  → API: http://localhost:8000${NC}"
    echo -e "${BLUE}  → Docs: http://localhost:8000/docs${NC}"
    echo ""
    
    # Wait a bit for backend to start
    sleep 2
fi

# Start frontend service
if [ "$START_FRONTEND" = true ]; then
    echo -e "${YELLOW}Starting frontend service...${NC}"
    cd "$FRONTEND_DIR"
    
    if [ ! -d "node_modules" ]; then
        echo -e "${RED}Error: Frontend dependencies not found. Run with --install flag first.${NC}"
        exit 1
    fi
    
    # Start frontend in background
    npm run dev &
    FRONTEND_PID=$!
    
    echo -e "${GREEN}✓ Frontend started (PID: $FRONTEND_PID)${NC}"
    echo -e "${BLUE}  → App: http://localhost:3000${NC}"
    echo ""
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All services are running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}Backend API:${NC} http://localhost:8000"
echo -e "${BLUE}API Docs:${NC} http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for background processes
wait
