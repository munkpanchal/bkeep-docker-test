# GitHub Actions Setup Guide for Hostinger VPS

This guide explains how to set up GitHub Actions for automated CI/CD deployment directly to your Hostinger VPS without using Docker Hub.

## Overview

The project includes two GitHub Actions workflows that build Docker images and deploy them directly to your VPS:
- **Backend CI/CD** (`.github/workflows/backend.yml`) - Builds and deploys the backend service
- **Frontend CI/CD** (`.github/workflows/frontend.yml`) - Builds and deploys the frontend service

## How It Works

1. **Build**: GitHub Actions builds the Docker image on GitHub's runners
2. **Export**: The image is saved as a tar file
3. **Transfer**: The tar file is transferred to your VPS via SCP
4. **Load**: The image is loaded into Docker on your VPS
5. **Deploy**: Docker Compose updates the container with zero-downtime
6. **Verify**: Health checks ensure the deployment was successful

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### VPS Connection Secrets
- `VPS_HOST` - IP address or hostname of your Hostinger VPS (e.g., `123.45.67.89` or `vps.example.com`)
- `VPS_USER` - SSH username for your VPS (usually `root` or your username)
- `VPS_SSH_KEY` - Private SSH key for authentication (the entire key, including `-----BEGIN` and `-----END` lines)
- `VPS_PORT` - SSH port (optional, defaults to `22` if not set)
- `DEPLOY_PATH` - Path on the VPS where the project is located (e.g., `/opt/bkeep` or `/home/user/docker`)

### Frontend Build Secret (Optional)
- `VITE_API_ENDPOINT` - API endpoint URL for the frontend (defaults to `http://72.62.161.70:8000/api/v1` if not set)

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value

## Setting Up SSH Key

### Generate SSH Key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_vps
```

### Copy Public Key to VPS

```bash
ssh-copy-id -i ~/.ssh/github_actions_vps.pub user@your-vps-ip
```

Or manually:
```bash
cat ~/.ssh/github_actions_vps.pub | ssh user@your-vps-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Add Private Key to GitHub Secrets

```bash
cat ~/.ssh/github_actions_vps
```

Copy the entire output (including `-----BEGIN` and `-----END` lines) and add it as `VPS_SSH_KEY` secret in GitHub.

## Workflow Triggers

### Backend Workflow
- Triggers on push to `main` or `master` branch when files in `backend/**` change
- Can also be manually triggered via `workflow_dispatch`

### Frontend Workflow
- Triggers on push to `main` or `master` branch when files in `frontend/**` change
- Can also be manually triggered via `workflow_dispatch`

## What the Workflows Do

### Backend Workflow
1. **Checkout code** - Gets the latest code from the repository
2. **Set up Docker Buildx** - Prepares Docker for builds
3. **Build Docker image** - Builds the backend image and saves it as a tar file
4. **Transfer image to VPS** - Uses SCP to transfer the tar file to your VPS
5. **Deploy to VPS** - SSH into the VPS and:
   - Loads the Docker image from the tar file
   - Tags it as `bkeep-production-backend:latest`
   - Updates the backend container with zero-downtime
   - Waits for health check (up to 90 seconds)
   - Verifies the deployment
6. **Verify deployment** - Checks container status and logs

### Frontend Workflow
1. **Checkout code** - Gets the latest code from the repository
2. **Set up Docker Buildx** - Prepares Docker for builds
3. **Build Docker image** - Builds the frontend image with API endpoint and saves it as a tar file
4. **Transfer image to VPS** - Uses SCP to transfer the tar file to your VPS
5. **Deploy to VPS** - SSH into the VPS and:
   - Loads the Docker image from the tar file
   - Tags it as `bkeep-production-frontend:latest`
   - Updates the frontend container with zero-downtime
   - Waits for health check (up to 60 seconds)
   - Verifies the deployment
6. **Verify deployment** - Checks container status and logs

## VPS Requirements

Your Hostinger VPS must have:
- Docker and Docker Compose installed
- SSH access configured
- The `docker-compose.production.yml` file in the deployment path
- Sufficient disk space for Docker images (at least 5GB free recommended)
- Ports open: 80 (frontend), 8000 (backend), 5432 (PostgreSQL), 6379 (Redis)

### Installing Docker on VPS

If Docker is not installed on your VPS:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Add user to docker group (if not root)
sudo usermod -aG docker $USER

# Verify installation
docker --version
docker compose version
```

## Initial Setup on VPS

1. **Create deployment directory**:
   ```bash
   mkdir -p /opt/bkeep
   cd /opt/bkeep
   ```

2. **Clone or upload your repository**:
   ```bash
   git clone <your-repo-url> .
   # Or upload files manually
   ```

3. **Copy docker-compose.production.yml**:
   ```bash
   # Make sure docker-compose.production.yml is in the deployment path
   ```

4. **Create .env file** (optional, for environment variables):
   ```bash
   nano .env
   # Add your environment variables here
   ```

5. **Start services for the first time**:
   ```bash
   docker compose -f docker-compose.production.yml up -d
   ```

## Zero-Downtime Deployment

The deployment process ensures zero downtime by:
1. Building the new image on GitHub Actions
2. Transferring it to the VPS
3. Loading it into Docker
4. Recreating the container with the new image
5. Waiting for health checks to pass
6. Only then removing the old container

If the health check fails, the deployment stops and you can check the logs.

## Troubleshooting

### Workflow fails at "Transfer image to VPS"
- Check that `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, and `VPS_PORT` are correctly set
- Verify SSH key has proper permissions on the VPS
- Ensure the VPS is accessible from the internet
- Check firewall settings on Hostinger VPS

### Workflow fails at "Deploy to VPS"
- Verify SSH connection works: `ssh -i ~/.ssh/your_key user@vps-ip`
- Check that `DEPLOY_PATH` exists and is accessible
- Ensure Docker and Docker Compose are installed on the VPS
- Check disk space: `df -h`

### Health check fails
- Check container logs: `docker compose -f docker-compose.production.yml logs backend` (or `frontend`)
- Verify the health endpoint is accessible: `curl http://localhost:8000/health` (backend) or `curl http://localhost:80` (frontend)
- Check if the container is running: `docker compose -f docker-compose.production.yml ps`
- Verify database and Redis are running: `docker compose -f docker-compose.production.yml ps`

### Image load fails
- Check disk space: `df -h`
- Verify the tar file was transferred: `ls -lh /tmp/*.tar`
- Check Docker daemon is running: `sudo systemctl status docker`

### Build fails
- Check the build logs in GitHub Actions
- Verify all required files are present in the repository
- Ensure Dockerfile paths are correct
- Check for syntax errors in Dockerfiles

## Manual Deployment

You can also manually trigger deployments:
1. Go to **Actions** tab in GitHub
2. Select the workflow (Backend CI/CD or Frontend CI/CD)
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Security Best Practices

1. **SSH Key Security**:
   - Use a dedicated SSH key for GitHub Actions
   - Never commit private keys to the repository
   - Rotate keys periodically

2. **VPS Security**:
   - Use SSH key authentication (disable password auth)
   - Keep SSH port non-standard (if possible)
   - Use firewall (UFW) to restrict access
   - Keep system and Docker updated

3. **Secrets Management**:
   - Never expose secrets in logs
   - Use GitHub Secrets for all sensitive data
   - Rotate secrets regularly

## Notes

- The workflows build images on GitHub Actions and transfer them to your VPS
- No Docker Hub account is required
- Images are tagged as `bkeep-production-backend:latest` and `bkeep-production-frontend:latest`
- Old Docker images are pruned after 24 hours to save disk space
- The `docker-compose.production.yml` file uses `image:` instead of `build:` for production deployments

## Cost Considerations

- GitHub Actions provides 2,000 free minutes/month for private repos
- VPS storage: Each image transfer uses network bandwidth
- Consider image size optimization to reduce transfer time
