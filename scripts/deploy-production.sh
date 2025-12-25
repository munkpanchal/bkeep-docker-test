#!/bin/bash

# Production deployment script
# This script ensures clean deployment by removing old containers first

set -e

COMPOSE_FILE="docker-compose.production.yml"

echo "🚀 Starting production deployment..."

# Stop and remove old containers with conflicting names
echo "🧹 Cleaning up old containers..."
docker stop docker-test-backend docker-test-frontend docker-test-postgres 2>/dev/null || true
docker rm docker-test-backend docker-test-frontend docker-test-postgres 2>/dev/null || true

# Stop and remove production containers if they exist (for clean restart)
echo "🔄 Stopping existing production containers..."
docker compose -f "$COMPOSE_FILE" down 2>/dev/null || true

# Build and start production containers
echo "🏗️  Building and starting production containers..."
docker compose -f "$COMPOSE_FILE" up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check container status
echo "📊 Container status:"
docker compose -f "$COMPOSE_FILE" ps

# Verify backend health
echo "🏥 Checking backend health..."
MAX_WAIT=60
WAIT_TIME=0
while [ $WAIT_TIME -lt $MAX_WAIT ]; do
  if docker compose -f "$COMPOSE_FILE" exec -T backend wget --quiet --tries=1 --spider http://localhost:8000/health 2>/dev/null; then
    echo "✅ Backend is healthy!"
    break
  fi
  echo "⏳ Waiting for backend... ($WAIT_TIME/$MAX_WAIT seconds)"
  sleep 5
  WAIT_TIME=$((WAIT_TIME + 5))
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
  echo "⚠️  Backend health check timeout"
  docker compose -f "$COMPOSE_FILE" logs backend --tail=30
  exit 1
fi

echo "✅ Production deployment completed successfully!"
echo ""
echo "📋 Access points:"
echo "   Frontend: http://72.62.161.70"
echo "   Backend: http://72.62.161.70:8000"
echo "   Health: http://72.62.161.70:8000/health"

