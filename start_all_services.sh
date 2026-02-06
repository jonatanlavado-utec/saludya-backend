#!/bin/bash

# Script to start all SaludYa microservices
# This script opens a new terminal tab for each service

echo "Starting all SaludYa microservices..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Python is installed
if ! command_exists python && ! command_exists python3; then
    echo "Error: Python is not installed"
    exit 1
fi

PYTHON_CMD="python3"
if command_exists python; then
    PYTHON_CMD="python"
fi

# Array of services with their directories and ports
declare -a services=(
    "auth_service:8001"
    "user_service:8002"
    "catalog_service:8003"
    "appointment_service:8004"
    "ai_orientation_service:8005"
    "payment_service:8006"
)

# Start each service
for service_info in "${services[@]}"; do
    IFS=':' read -r service port <<< "$service_info"
    echo "Starting $service on port $port..."

    # Check if service directory exists
    if [ ! -d "services/$service" ]; then
        echo "Warning: Directory services/$service not found"
        continue
    fi

    # Start service in background
    cd "services/$service" || continue

    # Check if .env file exists
    if [ ! -f ".env" ]; then
        echo "Warning: .env file not found for $service. Copying from .env.example"
        if [ -f ".env.example" ]; then
            cp .env.example .env
        fi
    fi

    # Start the service in background
    $PYTHON_CMD main.py > "../../logs/${service}.log" 2>&1 &
    SERVICE_PID=$!
    echo "$service started with PID $SERVICE_PID"

    cd ../..
done

echo ""
echo "All services started!"
echo "Check the following URLs for Swagger documentation:"
echo "  - Auth Service:        http://localhost:8001/docs"
echo "  - User Service:        http://localhost:8002/docs"
echo "  - Catalog Service:     http://localhost:8003/docs"
echo "  - Appointment Service: http://localhost:8004/docs"
echo "  - AI Service:          http://localhost:8005/docs"
echo "  - Payment Service:     http://localhost:8006/docs"
echo ""
echo "Logs are saved in the logs/ directory"
echo "To stop all services, run: ./stop_all_services.sh"
