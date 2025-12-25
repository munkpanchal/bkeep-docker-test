# Production Deployment Guide

This guide explains how to deploy the complete application with database, migrations, and seeds in production.

## Prerequisites

- Docker and Docker Compose installed on production server
- Domain/IP address configured (default: `72.62.161.70`)
- AWS SES credentials (for email functionality)
- Strong secrets for JWT tokens

## Quick Start

### 1. Prepare Environment Variables

```bash
# Copy the example file
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Important variables to set:**
- `DB_PASSWORD` - Strong PostgreSQL password
- `ACCESS_TOKEN_SECRET` - Random string for JWT access tokens
- `REFRESH_TOKEN_SECRET` - Random string for JWT refresh tokens
- `SESSION_SECRET` - Random string for sessions
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` - For email sending

### 2. Generate Secrets

```bash
# Generate random secrets
openssl rand -base64 32  # For ACCESS_TOKEN_SECRET
openssl rand -base64 32  # For REFRESH_TOKEN_SECRET
openssl rand -base64 32  # For SESSION_SECRET
```

### 3. Build and Start Services

```bash
# Build all images
docker compose -f docker-compose.production.yml build

# Start all services (database, redis, backend, frontend, mail-worker)
docker compose -f docker-compose.production.yml up -d

# View logs
docker compose -f docker-compose.production.yml logs -f
```

### 4. Run Database Seeds (First Time Only)

On first deployment, you may want to run seeds:

```bash
# Set RUN_SEEDS=true in .env.production, then restart backend
docker compose -f docker-compose.production.yml restart backend

# Or run seeds manually
docker compose -f docker-compose.production.yml exec backend \
  node_modules/.bin/knex seed:run --knexfile dist/config/knexfile.js --env production
```

## Architecture

The production setup includes:

1. **PostgreSQL** - Main database with persistent volume
2. **Redis** - Cache and session store with persistent volume
3. **Backend API** - Node.js/Express application
   - Automatically runs migrations on startup
   - Can run seeds if `RUN_SEEDS=true`
4. **Mail Worker** - Background worker for processing email queue
5. **Frontend** - React application served via Nginx

## Database Migrations

Migrations are automatically run when the backend container starts:

1. Backend waits for database to be ready
2. Runs all pending migrations
3. Optionally runs seeds if `RUN_SEEDS=true`
4. Starts the application server

## Health Checks

All services have health checks:

- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`
- **Backend**: `GET /api/v1/health`
- **Frontend**: `GET /` (Nginx)

## Volumes

Persistent data is stored in Docker volumes:

- `postgres_data` - Database files
- `redis_data` - Redis persistence
- `backend_public` - Public files/uploads

## Access Points

- **Frontend**: http://72.62.161.70/
- **Backend API**: http://72.62.161.70:8000/api/v1
- **Health Check**: http://72.62.161.70:8000/api/v1/health
- **PostgreSQL**: localhost:5432 (internal only)
- **Redis**: localhost:6379 (internal only)

## Maintenance Commands

### View Logs

```bash
# All services
docker compose -f docker-compose.production.yml logs -f

# Specific service
docker compose -f docker-compose.production.yml logs -f backend
docker compose -f docker-compose.production.yml logs -f postgres
```

### Database Operations

```bash
# Connect to database
docker compose -f docker-compose.production.yml exec postgres psql -U postgres -d bkeep

# Run migrations manually
docker compose -f docker-compose.production.yml exec backend \
  node_modules/.bin/knex migrate:latest --knexfile dist/config/knexfile.js --env production

# Rollback last migration
docker compose -f docker-compose.production.yml exec backend \
  node_modules/.bin/knex migrate:rollback --knexfile dist/config/knexfile.js --env production

# List migrations
docker compose -f docker-compose.production.yml exec backend \
  node_modules/.bin/knex migrate:list --knexfile dist/config/knexfile.js --env production
```

### Backup Database

```bash
# Create backup
docker compose -f docker-compose.production.yml exec postgres \
  pg_dump -U postgres bkeep > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
cat backup_20250101_120000.sql | \
  docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U postgres -d bkeep
```

### Update Application

```bash
# Pull latest code (if using git)
git pull

# Rebuild and restart
docker compose -f docker-compose.production.yml up -d --build

# Or restart specific service
docker compose -f docker-compose.production.yml restart backend
```

## Troubleshooting

### Database Connection Issues

```bash
# Check database is running
docker compose -f docker-compose.production.yml ps postgres

# Check database logs
docker compose -f docker-compose.production.yml logs postgres

# Test connection
docker compose -f docker-compose.production.yml exec backend \
  node -e "const knex = require('knex')(require('./dist/config/knexfile.js').production); knex.raw('SELECT 1').then(() => console.log('OK')).catch(e => console.error(e));"
```

### Migration Issues

```bash
# Check migration status
docker compose -f docker-compose.production.yml exec backend \
  node_modules/.bin/knex migrate:list --knexfile dist/config/knexfile.js --env production

# Force rollback if needed
docker compose -f docker-compose.production.yml exec backend \
  node_modules/.bin/knex migrate:rollback --all --knexfile dist/config/knexfile.js --env production
```

### Container Not Starting

```bash
# Check container status
docker compose -f docker-compose.production.yml ps

# Check logs
docker compose -f docker-compose.production.yml logs backend

# Check health
docker compose -f docker-compose.production.yml exec backend wget -q -O- http://localhost:8000/api/v1/health
```

## Security Checklist

- [ ] Strong database password set
- [ ] JWT secrets are random and secure
- [ ] AWS credentials are set correctly
- [ ] CORS_ORIGIN matches your domain
- [ ] FRONTEND_URL matches your domain
- [ ] Database port not exposed publicly (remove from ports if needed)
- [ ] Redis port not exposed publicly (remove from ports if needed)
- [ ] Firewall configured to allow only necessary ports (80, 8000)

## Monitoring

### Check Service Status

```bash
docker compose -f docker-compose.production.yml ps
```

### Resource Usage

```bash
docker stats
```

### Application Health

```bash
curl http://72.62.161.70:8000/api/v1/health
```

## Scaling

To scale services:

```bash
# Scale mail workers (if needed)
docker compose -f docker-compose.production.yml up -d --scale mail-worker=3
```

## Backup Strategy

1. **Database**: Daily automated backups
2. **Volumes**: Regular volume snapshots
3. **Code**: Version control (Git)

## Support

For issues:
1. Check logs: `docker compose -f docker-compose.production.yml logs`
2. Verify environment variables
3. Check health endpoints
4. Review documentation in `backend/docs/`

