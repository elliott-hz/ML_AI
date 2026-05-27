#!/bin/bash

# AI Knowledge Learning System - Quick Development Script
# Installs dependencies and starts services in one command

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Quick Start: Installing dependencies and starting services..."
echo ""

# Install and start with the main script
"$PROJECT_ROOT/start.sh" --install
