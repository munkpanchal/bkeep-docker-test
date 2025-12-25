# GitHub Actions CI/CD Setup

This directory contains GitHub Actions workflows for automated deployment of the frontend and backend services.

## Workflows

### Backend Workflow (`.github/workflows/backend.yml`)
- Triggers on pushes to `main`/`master` branch when `backend/**` files change
- Builds Docker image and pushes to Docker Hub
- Deploys to production server with zero-downtime

### Frontend Workflow (`.github/workflows/frontend.yml`)
- Triggers on pushes to `main`/`master` branch when `frontend/**` files change
- Builds Docker image with production API URL
- Deploys to production server with zero-downtime

## Setup Instructions

### 1. Repository Structure

You need **two separate repositories**:

#### Backend Repository
```
backend-repo/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
└── .github/
    └── workflows/
        └── backend.yml  (copy from this repo)
```

#### Frontend Repository
```
frontend-repo/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
└── .github/
    └── workflows/
        └── frontend.yml  (copy from this repo)
```

### 2. GitHub Secrets Configuration

For **each repository**, add the following secrets in GitHub Settings → Secrets and variables → Actions:

#### Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `DOCKER_USERNAME` | Docker Hub username | `yourusername` |
| `DOCKER_PASSWORD` | Docker Hub access token | `dckr_pat_...` |
| `SERVER_HOST` | Production server IP/hostname | `72.62.161.70` |
| `SERVER_USER` | SSH username for server | `root` or `ubuntu` |
| `SERVER_SSH_KEY` | Private SSH key for server access | `-----BEGIN RSA PRIVATE KEY-----...` |
| `DEPLOY_PATH` | Path to docker-compose files on server | `/opt/docker` |

#### Frontend Additional Secret

| Secret Name | Description | Example |
|------------|-------------|---------|
| `REACT_APP_API_URL` | Production API URL | `http://72.62.161.70:5001` |

### 3. Docker Hub Setup

1. Create a Docker Hub account
2. Create two repositories:
   - `yourusername/docker-test-backend`
   - `yourusername/docker-test-frontend`
3. Generate an access token:
   - Go to Docker Hub → Account Settings → Security
   - Create a new access token
   - Use this as `DOCKER_PASSWORD` secret

### 4. Server Setup

On your production server (`72.62.161.70`):

1. **Install Docker and Docker Compose**:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

2. **Create deployment directory**:
```bash
mkdir -p /opt/docker
cd /opt/docker
```

3. **Copy docker-compose.prod.yml**:
```bash
# Copy docker-compose.prod.yml to server
scp docker-compose.prod.yml user@72.62.161.70:/opt/docker/
```

4. **Create .env file**:
```bash
# On server
cd /opt/docker
cat > .env << EOF
DOCKER_USERNAME=yourusername
EOF
```

5. **Set up SSH key for GitHub Actions**:
```bash
# Generate SSH key pair (on your local machine)
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions

# Copy public key to server
ssh-copy-id -i ~/.ssh/github-actions.pub user@72.62.161.70

# Copy private key content to GitHub secret
cat ~/.ssh/github-actions
# Copy the entire output to SERVER_SSH_KEY secret in GitHub
```

6. **Initial deployment**:
```bash
# On server
cd /opt/docker
docker compose -f docker-compose.prod.yml up -d
```

### 5. Update Workflow Files

In each repository's workflow file, update the image names if needed:

**Backend workflow** (`.github/workflows/backend.yml`):
```yaml
env:
  IMAGE_NAME: ${{ secrets.DOCKER_USERNAME }}/docker-test-backend
```

**Frontend workflow** (`.github/workflows/frontend.yml`):
```yaml
env:
  IMAGE_NAME: ${{ secrets.DOCKER_USERNAME }}/docker-test-frontend
```

### 6. Testing the Workflow

1. Make a change to backend code
2. Commit and push to `main` branch
3. Check GitHub Actions tab to see the workflow running
4. Verify deployment on server:
```bash
ssh user@72.62.161.70
cd /opt/docker
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

## Zero-Downtime Deployment

The workflows implement zero-downtime deployment by:

1. **Building new image** with latest code
2. **Pulling image** on production server
3. **Creating new container** alongside existing one
4. **Health checking** new container
5. **Switching traffic** to new container
6. **Removing old container** only after new one is healthy

This ensures your service remains available during deployments.

## Troubleshooting

### Workflow fails at "Deploy to server"
- Check SSH key is correct in GitHub secrets
- Verify server is accessible: `ssh user@72.62.161.70`
- Check DEPLOY_PATH exists on server

### Container fails health check
- Check container logs: `docker logs docker-test-backend-prod`
- Verify health check endpoint is working
- Increase wait time in workflow if needed

### Image not found
- Verify Docker Hub repository exists
- Check DOCKER_USERNAME and DOCKER_PASSWORD secrets
- Ensure image was pushed successfully

### Port conflicts
- Check if ports 80 and 5001 are available
- Verify no other containers are using these ports

## Manual Deployment

If you need to deploy manually:

```bash
# On server
cd /opt/docker

# Backend
docker pull yourusername/docker-test-backend:latest
docker compose -f docker-compose.prod.yml up -d --no-deps backend

# Frontend
docker pull yourusername/docker-test-frontend:latest
docker compose -f docker-compose.prod.yml up -d --no-deps frontend
```

## Monitoring

Check deployment status:
```bash
# View running containers
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check resource usage
docker stats
```

