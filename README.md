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
└── docker-compose.yml
```

## Features

- **Backend**: Express.js API with health check and user management endpoints
- **Frontend**: React.js application with modern UI
- **Docker**: Multi-container setup with docker-compose

## Quick Start

### Using Docker Compose (Recommended)

1. Build and start all services:
```bash
docker-compose up --build
```

2. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

3. Stop all services:
```bash
docker-compose down
```

### Individual Docker Commands

#### Backend

```bash
cd backend
docker build -t docker-test-backend .
docker run -p 5000:5000 docker-test-backend
```

#### Frontend

```bash
cd frontend
docker build -t docker-test-frontend .
docker run -p 3000:80 docker-test-frontend
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user

## Development

### Backend (without Docker)

```bash
cd backend
npm install
npm start
```

### Frontend (without Docker)

```bash
cd frontend
npm install
npm start
```

## Docker Commands

- Build images: `docker-compose build`
- Start services: `docker-compose up`
- Start in background: `docker-compose up -d`
- View logs: `docker-compose logs -f`
- Stop services: `docker-compose down`
- Rebuild and restart: `docker-compose up --build`

## Notes

- The frontend is served via Nginx in production mode
- Backend runs on port 5000
- Frontend runs on port 3000 (mapped to Nginx port 80 in container)
- Make sure ports 3000 and 5000 are available on your system

