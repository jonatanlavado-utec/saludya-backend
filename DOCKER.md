# Docker Deployment Guide for SaludYa Backend

Complete guide for running SaludYa services with Docker and Docker Compose.

## Prerequisites

- Docker 20.10 or higher
- Docker Compose 2.0 or higher

### Installation

**macOS** (using Homebrew):
```bash
brew install docker
brew install docker-compose
```

**Ubuntu/Debian**:
```bash
sudo apt-get install docker.io docker-compose
sudo usermod -aG docker $USER
```

**Windows**:
Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

Verify installation:
```bash
docker --version
docker-compose --version
```

## Quick Start (30 seconds)

```bash
# Clone/navigate to project
cd saludya-backend

# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Done! Access services at localhost:8001-8006
```

## Common Docker Commands

### Start Services

```bash
# Start in detached mode (background)
docker-compose up -d

# Start with logs visible
docker-compose up

# Rebuild images and start
docker-compose up -d --build

# Start specific service
docker-compose up -d auth-service
```

### Check Status

```bash
# List running containers
docker-compose ps

# View logs from all services
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# View logs from specific service
docker-compose logs -f auth-service

# View last 100 lines
docker-compose logs --tail=100
```

### Stop Services

```bash
# Stop running containers
docker-compose stop

# Stop specific service
docker-compose stop auth-service

# Stop and remove containers
docker-compose down

# Stop and remove with volumes (data loss!)
docker-compose down -v
```

### Rebuild

```bash
# Rebuild all images
docker-compose build

# Rebuild specific service
docker-compose build auth-service

# Build without cache
docker-compose build --no-cache
```

### Access Services

```bash
# Access service logs
docker-compose logs service-name

# Execute command in container
docker-compose exec service-name ls -la

# Open shell in container
docker-compose exec auth-service /bin/bash

# Restart service
docker-compose restart auth-service
```

## Database Management

### Access PostgreSQL

```bash
# Connect to PostgreSQL inside container
docker-compose exec postgres psql -U saludya -d saludya_db

# Run SQL command
docker-compose exec postgres psql -U saludya -d saludya_db -c "SELECT * FROM auth_service.auth_users;"

# Restore from dump
docker-compose exec -T postgres psql -U saludya -d saludya_db < backup.sql
```

### Reset Database

```bash
# Stop services
docker-compose down

# Remove database volume
docker volume rm saludya-backend_postgres_data

# Start services (database will be recreated)
docker-compose up -d
```

### Backup Database

```bash
# Create backup
docker-compose exec postgres pg_dump -U saludya saludya_db > backup.sql

# Verify backup
ls -lh backup.sql
```

## Network Access

### From Host Machine

Services are accessible at:
- Auth Service: http://localhost:8001
- User Service: http://localhost:8002
- Catalog Service: http://localhost:8003
- Appointment Service: http://localhost:8004
- AI Orientation Service: http://localhost:8005
- Payment Service: http://localhost:8006

Swagger UI: `http://localhost:PORT/docs`

### From Container to Container

Containers communicate using service names:
```
Database URL: postgresql://saludya:saludya123@postgres:5432/saludya_db
Service URLs: http://service-name:port
```

## Configuration

### Environment Variables

Edit `docker-compose.yml` to modify:

```yaml
environment:
  DATABASE_URL: postgresql://user:password@postgres:5432/saludya_db
```

### Ports

Change port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8001:8001"  # Change first 8001 to different port
```

### Database Credentials

Edit `docker-compose.yml` PostgreSQL section:

```yaml
postgres:
  environment:
    POSTGRES_USER: saludya
    POSTGRES_PASSWORD: saludya123
    POSTGRES_DB: saludya_db
```

## Troubleshooting

### Services won't start

**Check logs:**
```bash
docker-compose logs
```

**Common issues:**
- Port already in use: Change port in docker-compose.yml
- Image build failed: Run `docker-compose build --no-cache`
- Permission denied: Add user to docker group: `sudo usermod -aG docker $USER`

### Database connection failed

```bash
# Verify database is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres

# Wait for health check to pass (observe "healthy" status)
docker-compose ps
```

### Can't access service from browser

```bash
# Verify container is running
docker-compose ps auth-service

# Verify port mapping
docker-compose port auth-service 8001

# Test connection from host
curl http://localhost:8001/docs
```

### Out of disk space

```bash
# Clean up unused containers/images
docker system prune

# Remove dangling volumes
docker volume prune

# Remove all unused resources
docker system prune -a --volumes
```

## Performance Tips

### Reduce Docker Resource Usage

Edit docker-compose.yml to limit resources:

```yaml
services:
  auth-service:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### Speed Up Database

Increase `shared_buffers` in PostgreSQL:

```yaml
postgres:
  command:
    - "postgres"
    - "-c"
    - "shared_buffers=256MB"
    - "-c"
    - "effective_cache_size=1GB"
```

## Production Deployment

### Before Deploying

```bash
# Run tests
docker-compose exec auth-service pytest

# Verify all services are healthy
docker-compose ps

# Check logs for errors
docker-compose logs
```

### Push to Registry

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag saludya-auth:latest username/saludya-auth:1.0.0

# Push to registry
docker push username/saludya-auth:1.0.0
```

### Use Environment Files

Create `.env.production`:
```
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://user:password@db.example.com/saludya
```

Reference in docker-compose.yml:
```yaml
env_file: .env.production
```

## Development Workflow

### Hot Reload Code

To enable code changes without rebuilding, mount volumes:

Edit docker-compose.yml:
```yaml
auth-service:
  volumes:
    - ./services/auth_service:/app
```

Restart service:
```bash
docker-compose restart auth-service
```

### Debug Mode

Run service with interactive terminal:

```bash
docker-compose run --rm auth-service /bin/bash
```

## Compose File Reference

Key sections in docker-compose.yml:

```yaml
version: '3.8'                    # Compose format version

services:                         # Containers to run
  postgres:
    image: postgres:15-alpine     # Image to use
    environment: {}               # Environment variables
    volumes: []                   # Data persistence
    ports: []                     # Port mapping
    depends_on: {}                # Service dependencies
    healthcheck: {}               # Health checks
    networks: []                  # Network connectivity

volumes:                          # Named volumes
  postgres_data:

networks:                         # Custom networks
  saludya-network:
```

## Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

## Support

For issues:
1. Check logs: `docker-compose logs`
2. Review docker-compose.yml syntax
3. Verify Docker and Docker Compose versions
4. Check network connectivity between containers
5. Review this guide's troubleshooting section

## License

Same as main project - MIT License
