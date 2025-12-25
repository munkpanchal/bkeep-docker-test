# Production URL Configuration

## Production URLs

All production services are configured to use: **http://72.62.161.70**

### Service URLs

| Service | URL | Port |
|---------|-----|------|
| **Frontend** | http://72.62.161.70 | 80 |
| **Backend API** | http://72.62.161.70:8000 | 8000 |
| **Health Check** | http://72.62.161.70:8000/health | 8000 |
| **API Docs** | http://72.62.161.70:8000/api-docs | 8000 |
| **PostgreSQL** | localhost:5432 (internal only) | 5432 |

### Configuration

The production configuration (`docker-compose.production.yml`) is set up with:

- **CORS_ORIGIN**: `http://72.62.161.70,http://72.62.161.70:80,http://72.62.161.70:8000`
- **FRONTEND_URL**: `http://72.62.161.70`
- **VITE_API_ENDPOINT**: `http://72.62.161.70:8000/api/v1`
- **WEBAUTHN_RP_ID**: `72.62.161.70`

### Important Notes

1. **HOST environment variable**: Set to `0.0.0.0` (not the IP address)
   - This allows the server to listen on all network interfaces
   - The production URL is used for logging and external access

2. **Health checks**: Use `localhost` internally (this is correct)
   - Health checks run inside containers and use localhost
   - External access uses the production IP

3. **Database connections**: Use service names (`postgres`) not IPs
   - Containers communicate via Docker network using service names
   - Port 5432 is the internal container port

### Deployment

```bash
# Deploy production
docker compose -f docker-compose.production.yml up -d --build

# Verify
curl http://72.62.161.70:8000/health
curl http://72.62.161.70
```

