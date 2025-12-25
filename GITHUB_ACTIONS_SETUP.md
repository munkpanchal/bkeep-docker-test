# GitHub Actions Setup Guide

This guide explains how to set up GitHub Actions for automated CI/CD deployment of the backend and frontend services.

## Overview

The project includes two GitHub Actions workflows:
- **Backend CI/CD** (`.github/workflows/backend.yml`) - Builds and deploys the backend service
- **Frontend CI/CD** (`.github/workflows/frontend.yml`) - Builds and deploys the frontend service

## Required GitHub Secrets

You need to configure the following secrets in your GitHub repository:

### Docker Hub Secrets
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub password or access token

### Server Deployment Secrets
- `SERVER_HOST` - IP address or hostname of your production server
- `SERVER_USER` - SSH username for the production server
- `SERVER_SSH_KEY` - Private SSH key for authentication (the entire key, including `-----BEGIN` and `-----END` lines)
- `DEPLOY_PATH` - Path on the server where the project is located (e.g., `/opt/bkeep` or `/home/user/docker`)

### Frontend Build Secret (Optional)
- `VITE_API_ENDPOINT` - API endpoint URL for the frontend (defaults to `http://72.62.161.70:8000/api/v1` if not set)

## How to Add Secrets

1. Go to your GitHub repository
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its corresponding value

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
2. **Set up Docker Buildx** - Prepares Docker for multi-platform builds
3. **Log in to Docker Hub** - Authenticates with Docker Hub
4. **Extract metadata** - Generates image tags (latest, branch name, commit SHA)
5. **Build and push Docker image** - Builds the backend image and pushes to Docker Hub
6. **Deploy to server** - SSH into the server and:
   - Pulls the latest image
   - Creates a docker-compose override file to use the Docker Hub image
   - Updates the backend container with zero-downtime
   - Waits for health check (up to 90 seconds)
   - Verifies the deployment
7. **Verify deployment** - Checks container status and logs

### Frontend Workflow
1. **Checkout code** - Gets the latest code from the repository
2. **Set up Docker Buildx** - Prepares Docker for multi-platform builds
3. **Log in to Docker Hub** - Authenticates with Docker Hub
4. **Extract metadata** - Generates image tags (latest, branch name, commit SHA)
5. **Build and push Docker image** - Builds the frontend image with API endpoint and pushes to Docker Hub
6. **Deploy to server** - SSH into the server and:
   - Pulls the latest image
   - Creates a docker-compose override file to use the Docker Hub image
   - Updates the frontend container with zero-downtime
   - Waits for health check (up to 60 seconds)
   - Verifies the deployment
7. **Verify deployment** - Checks container status and logs

## Server Requirements

Your production server must have:
- Docker and Docker Compose installed
- SSH access configured
- The `docker-compose.production.yml` file in the deployment path
- Network access to pull images from Docker Hub

## Docker Hub Image Names

The workflows push images to Docker Hub with these names:
- Backend: `{DOCKER_USERNAME}/bkeep-backend:latest`
- Frontend: `{DOCKER_USERNAME}/bkeep-frontend:latest`

## Zero-Downtime Deployment

The deployment process ensures zero downtime by:
1. Pulling the new image
2. Creating a temporary docker-compose override file
3. Recreating the container with the new image
4. Waiting for health checks to pass
5. Only then removing the old container

If the health check fails, the deployment is rolled back automatically.

## Troubleshooting

### Workflow fails at "Deploy to server"
- Check that `SERVER_HOST`, `SERVER_USER`, and `SERVER_SSH_KEY` are correctly set
- Verify SSH key has proper permissions on the server
- Ensure the server is accessible from the internet

### Health check fails
- Check container logs: `docker compose -f docker-compose.production.yml logs backend` (or `frontend`)
- Verify the health endpoint is accessible: `curl http://localhost:8000/health` (backend) or `curl http://localhost:80` (frontend)
- Check if the container is running: `docker compose -f docker-compose.production.yml ps`

### Image not found
- Verify `DOCKER_USERNAME` and `DOCKER_PASSWORD` are correct
- Check that the image was successfully pushed to Docker Hub
- Ensure the image name matches: `{DOCKER_USERNAME}/bkeep-backend:latest` or `{DOCKER_USERNAME}/bkeep-frontend:latest`

### Build fails
- Check the build logs in GitHub Actions
- Verify all required files are present in the repository
- Ensure Dockerfile paths are correct

## Manual Deployment

You can also manually trigger deployments:
1. Go to **Actions** tab in GitHub
2. Select the workflow (Backend CI/CD or Frontend CI/CD)
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Notes

- The workflows use `docker-compose.production.yml` for deployment
- A temporary `docker-compose.override.yml` file is created during deployment to use Docker Hub images
- The override file is automatically removed after deployment
- Old Docker images are pruned after 24 hours to save disk space
