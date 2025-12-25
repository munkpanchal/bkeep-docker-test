# Production Deployment Guide

## Container Name Conflict Fix

The production deployment uses unique container names to avoid conflicts with development containers:

- **Development containers**: `docker-test-*`
- **Production containers**: `bkeep-*-prod`

## Production Docker Compose

Use `docker-compose.production.yml` for production deployments:

```bash
# Build and start production containers
docker compose -f docker-compose.production.yml up -d --build

# Stop production containers
docker compose -f docker-compose.production.yml down

# View logs
docker compose -f docker-compose.production.yml logs -f

# Rebuild and restart
docker compose -f docker-compose.production.yml up -d --build --force-recreate
```

## Container Names

| Service | Container Name | Port |
|---------|---------------|------|
| PostgreSQL | `bkeep-postgres-prod` | 5432 |
| Backend | `bkeep-backend-prod` | 8000 |
| Frontend | `bkeep-frontend-prod` | 80 |

## Fixing Container Name Conflicts

If you encounter the error:
```
Error response from daemon: Conflict. The container name "/docker-test-backend" is already in use
```

### Solution 1: Remove old containers
```bash
# Stop and remove old containers
docker stop docker-test-backend docker-test-frontend docker-test-postgres 2>/dev/null || true
docker rm docker-test-backend docker-test-frontend docker-test-postgres 2>/dev/null || true

# Then start production
docker compose -f docker-compose.production.yml up -d --build
```

### Solution 2: Use production compose file (Recommended)
The production compose file uses different container names (`bkeep-*-prod`), so it won't conflict with development containers.

## Environment Variables

Create a `.env` file or set environment variables:

```bash
# Database
DB_NAME=bkeep
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_PORT=5432

# Backend
BACKEND_PORT=8000
CORS_ORIGIN=http://72.62.161.70,http://72.62.161.70:80,http://72.62.161.70:8000
FRONTEND_URL=http://72.62.161.70

# Frontend
FRONTEND_PORT=80
VITE_API_ENDPOINT=http://72.62.161.70:8000/api/v1

# Security (Change these!)
ACCESS_TOKEN_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-secret-key
SESSION_SECRET=your-secret-key

# Optional
RUN_SEEDS=false
```

## Deployment Steps

1. **Stop any conflicting containers:**
   ```bash
   docker compose down
   docker stop docker-test-backend docker-test-frontend 2>/dev/null || true
   docker rm docker-test-backend docker-test-frontend 2>/dev/null || true
   ```

2. **Build and start production:**
   ```bash
   docker compose -f docker-compose.production.yml up -d --build
   ```

3. **Verify deployment:**
   ```bash
   docker compose -f docker-compose.production.yml ps
   docker compose -f docker-compose.production.yml logs backend --tail=20
   ```

4. **Check health:**
   ```bash
   curl http://localhost:8000/health
   ```

## Troubleshooting

### Container name conflict
- Use `docker compose -f docker-compose.production.yml` (uses different names)
- Or remove old containers first: `docker rm -f docker-test-backend docker-test-frontend`

### Port already in use
- Check what's using the port: `lsof -i :8000`
- Stop conflicting containers: `docker ps | grep 8000`

### Database connection errors
- Ensure PostgreSQL container is healthy: `docker compose -f docker-compose.production.yml ps postgres`
- Check database logs: `docker compose -f docker-compose.production.yml logs postgres`

### Migrations not running
- Check backend logs: `docker compose -f docker-compose.production.yml logs backend`
- Manually run migrations: `docker compose -f docker-compose.production.yml exec backend pnpm run db:migrate:prod`

