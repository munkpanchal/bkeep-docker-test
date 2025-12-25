# Quick Start - Production Deployment

## 🚀 Deploy Complete Application with Database

### Step 1: Setup Environment

```bash
# Copy environment template
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

**Required values:**
- `DB_PASSWORD` - PostgreSQL password
- `ACCESS_TOKEN_SECRET` - Generate: `openssl rand -base64 32`
- `REFRESH_TOKEN_SECRET` - Generate: `openssl rand -base64 32`
- `SESSION_SECRET` - Generate: `openssl rand -base64 32`
- `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY` - For emails

### Step 2: Build and Deploy

```bash
# Build all services
docker compose -f docker-compose.production.yml build

# Start all services (includes database, redis, backend, frontend, mail-worker)
docker compose -f docker-compose.production.yml up -d

# Watch logs
docker compose -f docker-compose.production.yml logs -f
```

### Step 3: Run Seeds (First Time)

```bash
# Option 1: Set RUN_SEEDS=true in .env.production and restart
docker compose -f docker-compose.production.yml restart backend

# Option 2: Run manually
docker compose -f docker-compose.production.yml exec backend \
  node_modules/.bin/knex seed:run --knexfile dist/config/knexfile.js --env production
```

### Step 4: Verify

```bash
# Check all services are running
docker compose -f docker-compose.production.yml ps

# Test health endpoint
curl http://72.62.161.70:8000/api/v1/health

# Access frontend
open http://72.62.161.70
```

## 📦 What Gets Deployed

- ✅ **PostgreSQL** - Database with all migrations applied
- ✅ **Redis** - Cache and session store
- ✅ **Backend API** - Auto-runs migrations on startup
- ✅ **Mail Worker** - Background email processing
- ✅ **Frontend** - React app served via Nginx

## 🔧 Common Commands

```bash
# View logs
docker compose -f docker-compose.production.yml logs -f [service]

# Restart service
docker compose -f docker-compose.production.yml restart [service]

# Stop all
docker compose -f docker-compose.production.yml down

# Update and rebuild
docker compose -f docker-compose.production.yml up -d --build
```

## 📚 Full Documentation

See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for detailed guide.

