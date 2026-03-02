#!/bin/bash

# Exit immediately if any command fails
set -e

echo "📦 Loading environment variables from .env..."
# This line reads the .env file and exports the variables to this script
export $(grep -v '^#' .env | xargs)

# Safety check: Ensure the prefix was actually loaded
if [ -z "$REGISTRY_PREFIX" ]; then
  echo "❌ Error: REGISTRY_PREFIX is not set in your .env file!"
  exit 1
fi

echo "🔑 Logging into Docker Hub..."
docker login

echo "🏗️ Building images locally..."
# If you renamed your local file, change this to: docker compose -f docker-compose.local.yml build
docker compose -f docker-compose.yml build --no-cache --pull

echo "🏷️ Tagging images with prefix: ${REGISTRY_PREFIX}"
docker tag saludya-backend-auth-service ${REGISTRY_PREFIX}/saludya-auth:latest
docker tag saludya-backend-user-service ${REGISTRY_PREFIX}/saludya-user:latest
docker tag saludya-backend-catalog-service ${REGISTRY_PREFIX}/saludya-catalog:latest
docker tag saludya-backend-appointment-service ${REGISTRY_PREFIX}/saludya-appointment:latest
docker tag saludya-backend-ai-orientation-service ${REGISTRY_PREFIX}/saludya-ai:latest
docker tag saludya-backend-payment-service ${REGISTRY_PREFIX}/saludya-payment:latest

echo "🚀 Pushing images to the registry..."
docker push ${REGISTRY_PREFIX}/saludya-auth:latest
docker push ${REGISTRY_PREFIX}/saludya-user:latest
docker push ${REGISTRY_PREFIX}/saludya-catalog:latest
docker push ${REGISTRY_PREFIX}/saludya-appointment:latest
docker push ${REGISTRY_PREFIX}/saludya-ai:latest
docker push ${REGISTRY_PREFIX}/saludya-payment:latest

echo "✅ All done! Your images are now in the registry."


echo "🌐 Connecting to EC2 to deploy..."

echo "🌐 Connecting to EC2 to deploy..."
ssh -o StrictHostKeyChecking=no -i "${EC2_KEY_PATH}" "${EC2_USER}@${EC2_IP}" << EOF
  echo "--> Successfully connected to EC2!"
  
  # Navigate to your project directory
  cd ${PROJECT_DIR} || { echo "❌ Directory not found!"; exit 1; }

  echo "--> Fetching latest configuration from Git branch: ${GIT_BRANCH}..."
  # Discard any local modifications on the server to prevent merge conflicts
  git fetch origin
  git reset --hard origin/${GIT_BRANCH}

  echo "--> Tearing down environment AND deleting all volumes..."
  docker compose -f docker-compose.prod.yml down -v
  
  echo "--> Pulling latest Docker images..."
  docker compose -f docker-compose.prod.yml pull
  
  echo "--> Starting completely fresh services..."
  docker compose -f docker-compose.prod.yml up -d
  
  echo "--> Cleaning up old, unused images..."
  docker image prune -f

EOF

echo "🎉 Deployment Complete! Your EC2 instance is running the latest code and configuration."
