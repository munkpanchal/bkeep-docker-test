#!/bin/bash

# Zero-downtime deployment script for frontend
# This script ensures the new container is healthy before removing the old one

set -e

IMAGE_NAME="${DOCKER_USERNAME}/docker-test-frontend:latest"
CONTAINER_NAME="docker-test-frontend-prod"
COMPOSE_FILE="docker-compose.prod.yml"

echo "Starting frontend deployment..."

# Pull latest image
echo "Pulling latest frontend image..."
docker pull "$IMAGE_NAME"

# Create a new container with a temporary name
TEMP_CONTAINER="${CONTAINER_NAME}-new"
echo "Creating new container: $TEMP_CONTAINER"

# Stop and remove temporary container if it exists
docker stop "$TEMP_CONTAINER" 2>/dev/null || true
docker rm "$TEMP_CONTAINER" 2>/dev/null || true

# Start new container with temporary name
docker run -d \
  --name "$TEMP_CONTAINER" \
  --network docker_app-network-prod \
  -p 8080:80 \
  "$IMAGE_NAME"

# Wait for health check
echo "Waiting for new container to be healthy..."
MAX_WAIT=60
WAIT_TIME=0
while [ $WAIT_TIME -lt $MAX_WAIT ]; do
  if docker exec "$TEMP_CONTAINER" wget --quiet --tries=1 --spider http://localhost:80 2>/dev/null; then
    echo "New container is healthy!"
    break
  fi
  echo "Waiting for health check... ($WAIT_TIME/$MAX_WAIT seconds)"
  sleep 5
  WAIT_TIME=$((WAIT_TIME + 5))
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
  echo "ERROR: New container failed health check"
  docker stop "$TEMP_CONTAINER"
  docker rm "$TEMP_CONTAINER"
  exit 1
fi

# Stop old container
echo "Stopping old container..."
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

# Rename new container to production name
echo "Promoting new container to production..."
docker rename "$TEMP_CONTAINER" "$CONTAINER_NAME"

# Update port mapping (stop, remove, recreate with correct ports)
docker stop "$CONTAINER_NAME"
docker rm "$CONTAINER_NAME"

# Use docker-compose to start with correct configuration
docker compose -f "$COMPOSE_FILE" up -d --no-deps frontend

# Verify deployment
echo "Verifying deployment..."
sleep 5
if docker ps | grep -q "$CONTAINER_NAME"; then
  echo "✅ Frontend deployed successfully!"
  docker compose -f "$COMPOSE_FILE" ps frontend
else
  echo "❌ Deployment verification failed"
  exit 1
fi

# Clean up old images
echo "Cleaning up old images..."
docker image prune -f

echo "Deployment complete!"

