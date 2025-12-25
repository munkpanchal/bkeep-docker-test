# Docker Test Application

A full-stack dummy application for Docker testing with Node.js backend and React.js frontend.

## Project Structure

```
.
├── backend/          # Node.js/Express API
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/         # React.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml        # Development configuration
└── docker-compose.prod.yml   # Production configuration
```

## Features

- **Backend**: Express.js API with health check and user management endpoints
- **Frontend**: React.js application with modern UI
- **Docker**: Multi-container setup with docker-compose
- **Environment Separation**: Separate configs for development and production

## Development Setup

### Using Docker Compose (Recommended)

1. Start development services:
```bash
docker compose up --build
```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

3. Stop services:
```bash
docker compose down
```

### Development Configuration

- **Frontend**: Port 3000, API URL: `http://localhost:5001`
- **Backend**: Port 5001, Environment: `development`
- **CORS**: Allows `http://localhost:3000` and `http://localhost:5001`

## Production Setup

### Using Production Docker Compose

1. Build and start production services:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

2. Access the application:
   - Frontend: http://72.62.161.70/
   - Backend API: http://72.62.161.70:5001

3. Stop services:
```bash
docker compose -f docker-compose.prod.yml down
```

### Production Configuration

- **Frontend**: Port 80, API URL: `http://72.62.161.70:5001`
- **Backend**: Port 5001, Environment: `production`
- **CORS**: Allows `http://72.62.161.70` and related URLs

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## Docker Commands

### Development
- Build images: `docker compose build`
- Start services: `docker compose up`
- Start in background: `docker compose up -d`
- View logs: `docker compose logs -f`
- Stop services: `docker compose down`
- Rebuild and restart: `docker compose up --build`

### Production
- Build images: `docker compose -f docker-compose.prod.yml build`
- Start services: `docker compose -f docker-compose.prod.yml up -d`
- View logs: `docker compose -f docker-compose.prod.yml logs -f`
- Stop services: `docker compose -f docker-compose.prod.yml down`
- Rebuild and restart: `docker compose -f docker-compose.prod.yml up --build`

## Development (without Docker)

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Environment Variables

### Development (docker-compose.yml)
- `NODE_ENV=development`
- `REACT_APP_API_URL=http://localhost:5001`
- `ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5001`

### Production (docker-compose.prod.yml)
- `NODE_ENV=production`
- `REACT_APP_API_URL=http://72.62.161.70:5001`
- `ALLOWED_ORIGINS=http://72.62.161.70,http://72.62.161.70:80,http://72.62.161.70:5001`

## CI/CD with GitHub Actions

This project includes GitHub Actions workflows for automated deployment:

- **Backend Workflow**: `.github/workflows/backend.yml` - Deploys backend on code changes
- **Frontend Workflow**: `.github/workflows/frontend.yml` - Deploys frontend on code changes

### Features
- ✅ Zero-downtime deployments
- ✅ Automatic builds on push
- ✅ Health checks before switching
- ✅ Separate repos for frontend/backend

See [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) for detailed setup instructions.

## Notes

- The frontend is served via Nginx in production mode
- React environment variables are baked into the build at build time
- CORS is configured differently for development and production
- Make sure ports 3000 and 5001 (dev) or 80 and 5001 (prod) are available on your system
- Production uses Docker Hub images (configured in `docker-compose.prod.yml`)
