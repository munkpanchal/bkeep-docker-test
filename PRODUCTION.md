# Production Deployment Guide

## Production Configuration

The application is configured for production deployment at: **http://72.62.161.70/**

### Current Setup

- **Frontend**: Running on port 80 (accessible at http://72.62.161.70/)
- **Backend API**: Running on port 5001 (accessible at http://72.62.161.70:5001)
- **API URL**: Frontend is configured to call `http://72.62.161.70:5001`

### Configuration Files

1. **docker-compose.yml** - Main production configuration
   - Frontend API URL: `http://72.62.161.70:5001`
   - Frontend port: 80
   - Backend port: 5001

2. **docker-compose.prod.yml** - Alternative production configuration file

3. **backend/server.js** - CORS configured to allow:
   - `http://72.62.161.70`
   - `http://72.62.161.70:80`
   - `http://72.62.161.70:5001`

### Deployment Commands

#### Start Production Services
```bash
docker compose up -d
```

#### Rebuild and Start (after code changes)
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

#### View Logs
```bash
docker compose logs -f
```

#### Stop Services
```bash
docker compose down
```

### API Endpoints

- **Health Check**: http://72.62.161.70:5001/api/health
- **Get Users**: http://72.62.161.70:5001/api/users
- **Create User**: POST http://72.62.161.70:5001/api/users

### Network Configuration

- Both services are on the same Docker network (`app-network`)
- Frontend can communicate with backend using service name `backend:5000` internally
- External access uses the production IP with mapped ports

### Security Notes

1. **CORS**: Currently configured to allow requests from the production IP
2. **Ports**:
   - Port 80 (HTTP) - Frontend
   - Port 5001 - Backend API
3. **Firewall**: Ensure ports 80 and 5001 are open on the server

### Troubleshooting

1. **Frontend not loading**: Check if port 80 is accessible
2. **API calls failing**:
   - Verify backend is running: `docker compose ps`
   - Check backend logs: `docker compose logs backend`
   - Verify CORS settings in `backend/server.js`
3. **Connection refused**: Ensure firewall allows ports 80 and 5001

### Environment Variables

Backend environment variables (set in docker-compose.yml):
- `NODE_ENV=production`
- `PORT=5000`
- `ALLOWED_ORIGINS=http://72.62.161.70,http://localhost:3000,http://localhost:5001`

Frontend build argument:
- `REACT_APP_API_URL=http://72.62.161.70:5001`

