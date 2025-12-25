# GitHub Actions Setup Guide

This guide explains how to set up automated CI/CD for separate frontend and backend repositories.

## Overview

- **Backend Repository**: Contains only backend code, triggers deployment on backend changes
- **Frontend Repository**: Contains only frontend code, triggers deployment on frontend changes
- **Zero-Downtime**: New containers are health-checked before replacing old ones

## Quick Start

### Step 1: Prepare Your Repositories

#### Backend Repository Structure

```
backend-repo/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
└── .github/
    └── workflows/
        └── backend.yml
```

#### Frontend Repository Structure

```
frontend-repo/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── .github/
    └── workflows/
        └── frontend.yml
```

### Step 2: Copy Workflow Files

1. **For Backend Repo**: Copy `.github/workflows/backend.yml` to your backend repository
2. **For Frontend Repo**: Copy `.github/workflows/frontend.yml` to your frontend repository

### Step 3: Configure GitHub Secrets

In each repository, go to **Settings → Secrets and variables → Actions** and add:

#### Backend Repository Secrets

- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Docker Hub access token
- `SERVER_HOST` - `72.62.161.70`
- `SERVER_USER` - SSH username (e.g., `root`, `ubuntu`)
- `SERVER_SSH_KEY` - Private SSH key for server access
- `DEPLOY_PATH` - `/opt/docker` (or your deployment path)

#### Frontend Repository Secrets

- All of the above, plus:
- `REACT_APP_API_URL` - `http://72.62.161.70:5001`

### Step 4: Docker Hub Setup

1. Create Docker Hub account
2. Create repositories:
   - `yourusername/docker-test-backend`
   - `yourusername/docker-test-frontend`
3. Generate access token (Account Settings → Security → New Access Token)
4. Use token as `DOCKER_PASSWORD` secret

### Step 5: Server Preparation

On your production server:

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 2. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 3. Create deployment directory
mkdir -p /opt/docker
cd /opt/docker

# 4. Create docker-compose.prod.yml (copy from this repo)

# 5. Create .env file
echo "DOCKER_USERNAME=yourusername" > .env

# 6. Set up SSH access for GitHub Actions
# Generate key pair on your local machine:
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions

# Copy public key to server:
ssh-copy-id -i ~/.ssh/github-actions.pub user@72.62.161.70

# Copy private key to GitHub secret SERVER_SSH_KEY:
cat ~/.ssh/github-actions
```

### Step 6: Initial Server Deployment

```bash
# On server
cd /opt/docker
docker compose -f docker-compose.prod.yml up -d
```

## How It Works

### Backend Deployment Flow

1. Developer pushes code to `main` branch in backend repo
2. GitHub Actions detects changes in `backend/**`
3. Builds Docker image with latest code
4. Pushes image to Docker Hub
5. SSH into production server
6. Pulls latest image
7. Creates new container alongside old one
8. Health checks new container
9. If healthy, stops old container and promotes new one
10. Cleans up old images

### Frontend Deployment Flow

Same as backend, but:

- Triggers on `frontend/**` changes
- Builds with `REACT_APP_API_URL` environment variable
- Deploys frontend container

## Zero-Downtime Strategy

The deployment uses a **blue-green** approach:

1. **Blue (Old)**: Current production container running
2. **Green (New)**: New container created and tested
3. **Switch**: Only after green is healthy, blue is stopped
4. **Promote**: Green becomes the new production

This ensures:

- ✅ No service interruption
- ✅ Automatic rollback if new container fails
- ✅ Health checks before switching
- ✅ Old container kept as backup during transition

## Testing

### Test Backend Deployment

```bash
# 1. Make a change to backend code
echo "// Test change" >> backend/server.js

# 2. Commit and push
git add backend/server.js
git commit -m "Test backend deployment"
git push origin main

# 3. Watch GitHub Actions
# Go to your repo → Actions tab

# 4. Verify on server
ssh user@72.62.161.70
cd /opt/docker
docker compose -f docker-compose.prod.yml logs -f backend
```

### Test Frontend Deployment

Same process, but change frontend code instead.

## Troubleshooting

### "Permission denied (publickey)"

- Verify `SERVER_SSH_KEY` secret contains the full private key
- Ensure public key is in server's `~/.ssh/authorized_keys`
- Test SSH manually: `ssh -i ~/.ssh/github-actions user@72.62.161.70`

### "Image not found"

- Check Docker Hub repository exists
- Verify `DOCKER_USERNAME` matches your Docker Hub username
- Ensure image was pushed (check Docker Hub)

### "Container failed health check"

- Check container logs: `docker logs docker-test-backend-prod`
- Verify health endpoint: `curl http://localhost:5000/api/health`
- Increase wait time in workflow if server is slow

### "Port already in use"

- Check what's using the port: `sudo lsof -i :80`
- Stop conflicting services
- Or change port in docker-compose.prod.yml

## Advanced Configuration

### Custom Health Check Endpoints

Update `docker-compose.prod.yml` healthcheck:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### Multiple Environments

Create separate workflows for staging/production:

- `.github/workflows/backend-staging.yml`
- `.github/workflows/backend-production.yml`

Use different `SERVER_HOST` secrets for each.

### Slack Notifications

Add to workflow:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Security Best Practices

1. **Use Docker Hub access tokens** instead of passwords
2. **Rotate SSH keys** regularly
3. **Limit SSH access** to specific IPs if possible
4. **Use secrets** for all sensitive data
5. **Review workflow logs** regularly
6. **Enable branch protection** on main/master

## Monitoring

### View Deployment History

- GitHub Actions tab in repository
- Each run shows build logs and deployment status

### Server Monitoring

```bash
# Container status
docker compose -f docker-compose.prod.yml ps

# Resource usage
docker stats

# Recent logs
docker compose -f docker-compose.prod.yml logs --tail=100
```

## Support

For issues:

1. Check GitHub Actions logs
2. Check server logs: `docker compose logs`
3. Verify all secrets are set correctly
4. Test SSH connection manually
5. Verify Docker Hub access
