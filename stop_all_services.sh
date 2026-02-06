#!/bin/bash

# Script to stop all SaludYa microservices

echo "Stopping all SaludYa microservices..."

# Kill all Python processes running main.py
pkill -f "python.*main.py"

echo "All services stopped!"
