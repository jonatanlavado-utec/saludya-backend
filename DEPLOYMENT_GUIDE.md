# SaludYa Backend - Complete Deployment Guide

Comprehensive guide for deploying SaludYa backend infrastructure.

## Documentation Map

Choose your path based on your needs:

### Quick Start (New Users)
- **Time**: 5 minutes
- **File**: `QUICKSTART.md`
- **Best for**: Getting services running quickly
- **Includes**: Docker and local setup options

### Docker Deployment (Recommended)
- **Time**: 2 minutes
- **File**: `DOCKER.md`
- **Best for**: Production, staging, and development
- **Includes**: 70+ Docker commands and best practices
- **Requirements**: Docker 20.10+, Docker Compose 2.0+

### Docker Setup Summary
- **Time**: 1 minute
- **File**: `DOCKER_SETUP.md`
- **Best for**: Understanding what was added
- **Includes**: File list, requirements, next steps

### Complete API Documentation
- **Time**: 30 minutes
- **File**: `README.md`
- **Best for**: Understanding all endpoints and features
- **Includes**: API specs, Postman examples, troubleshooting

### Architecture & Design
- **Time**: 15 minutes
- **File**: `ARCHITECTURE.md`
- **Best for**: Understanding system design
- **Includes**: Diagrams, schemas, scalability notes

## Deployment Methods

### Method 1: Docker Compose (Easiest)

```bash
# Install Docker and Docker Compose
# (See DOCKER.md for installation)

# Navigate to project directory
cd saludya-backend

# Start all services
docker-compose up -d

# Done! Services ready in ~30 seconds
```

**Advantages:**
- One command to start everything
- Automatic database migrations
- Services communicate via network
- Persistent data in volumes
- Easy scaling

**Disadvantages:**
- Requires Docker installation
- Network isolation from host (sort of)
- Image building takes time on first run

### Method 2: Local Development

```bash
# Install PostgreSQL, Python 3.9+, pip

# Create database
createdb saludya_db

# Run migrations
for f in database/migrations/*.sql; do
  psql -d saludya_db -f "$f"
done

# For each service, in separate terminals:
cd services/auth_service
pip install -r requirements.txt
python main.py

# Repeat for each service (6 terminals total)
```

**Advantages:**
- Full control and visibility
- Direct debugging
- No Docker overhead
- Native performance

**Disadvantages:**
- Manual management
- 6 terminal windows
- PostgreSQL required
- Requires environment setup

## Production Checklist

### Pre-Deployment

- [ ] All services tested locally
- [ ] Database backups verified
- [ ] Environment variables configured
- [ ] Security credentials secured
- [ ] Load testing completed
- [ ] Documentation reviewed
- [ ] Team trained on operations

### Deployment

- [ ] Use Docker for consistency
- [ ] Configure environment variables
- [ ] Set resource limits
- [ ] Enable monitoring
- [ ] Set up backups
- [ ] Configure health checks
- [ ] Load test in staging first

### Post-Deployment

- [ ] Verify all services running
- [ ] Check service logs
- [ ] Monitor resource usage
- [ ] Test all endpoints
- [ ] Verify database connectivity
- [ ] Set up alerting
- [ ] Document runbooks

## Performance Tuning

### Docker Performance

1. **Database Optimization**
   ```yaml
   postgres:
     command:
       - "postgres"
       - "-c"
       - "shared_buffers=256MB"
       - "-c"
       - "effective_cache_size=1GB"
   ```

2. **Resource Limits**
   ```yaml
   auth-service:
     deploy:
       resources:
         limits:
           cpus: '0.5'
           memory: 512M
   ```

3. **Image Size**
   - Current: ~200-300 MB per service
   - Base: python:3.9-slim (~120 MB)
   - Dependencies: ~80 MB
   - Application: ~1 MB

### Local Development Performance

1. **Connection Pooling**
   - SQLAlchemy handles automatically
   - Default pool size: 5 connections

2. **Database Indexing**
   - Pre-configured in migrations
   - Foreign key indexes included

3. **Query Optimization**
   - Use `select()` statements
   - Avoid N+1 queries
   - Use pagination

## Scaling Strategies

### Horizontal Scaling (More Servers)

1. **Load Balancer**
   ```
   Client → Load Balancer → Multiple Service Instances
   ```

2. **Database Replication**
   ```
   Primary Database → Standby Replicas → Failover
   ```

3. **Container Orchestration**
   - Kubernetes for production
   - Docker Swarm as alternative

### Vertical Scaling (More Resources)

1. **Increase Service Resources**
   - CPU allocation
   - Memory allocation
   - Disk space

2. **Database Optimization**
   - Increase buffer pool
   - Add indexes
   - Archive old data

## Monitoring & Logging

### Essential Metrics

1. **Service Health**
   - Container status
   - Memory usage
   - CPU usage
   - Response times

2. **Database Health**
   - Connection count
   - Query performance
   - Disk usage
   - Replication lag

3. **Application Health**
   - Request rate
   - Error rate
   - API response time
   - Business metrics

### Logging Strategy

1. **Centralized Logging**
   ```bash
   # View all logs
   docker-compose logs -f

   # View specific service
   docker-compose logs -f auth-service

   # Export logs
   docker-compose logs > all-services.log
   ```

2. **Log Levels**
   - DEBUG: Development only
   - INFO: Normal operations
   - WARNING: Potential issues
   - ERROR: Failures
   - CRITICAL: System down

## Backup & Recovery

### Database Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U saludya saludya_db > backup.sql

# Backup PostgreSQL data volume
docker cp saludya_postgres:/var/lib/postgresql/data /backups/postgres_data

# Backup configuration files
cp docker-compose.yml .env* /backups/
```

### Recovery

```bash
# Restore from SQL dump
docker-compose exec -T postgres psql -U saludya saludya_db < backup.sql

# Restore volume
docker cp /backups/postgres_data saludya_postgres:/var/lib/postgresql/data

# Restart services
docker-compose restart
```

### Backup Schedule

- **Daily**: Automated SQL dumps
- **Weekly**: Full volume backups
- **Monthly**: Offsite backup copies
- **Test Recovery**: Monthly restore test

## Security Best Practices

### In Docker

1. **Secret Management**
   ```bash
   # Use .env files (but don't commit!)
   # Use Docker secrets in Swarm
   # Use environment variables in production
   ```

2. **Image Security**
   ```bash
   # Scan for vulnerabilities
   docker scan auth-service:latest

   # Use specific versions, not latest
   FROM python:3.9.1-slim
   ```

3. **Network Security**
   ```yaml
   # Internal network only
   networks:
     - saludya-network

   # No external network access
   ```

### Database Security

1. **Credentials**
   - Strong passwords
   - Rotate regularly
   - Use environment variables
   - Never commit to git

2. **Access Control**
   - Separate read/write permissions
   - Limit network access
   - Use SSL/TLS for connections

3. **Encryption**
   - Encrypt data at rest
   - Encrypt data in transit
   - Encrypt backups

## Troubleshooting Deployment

### Services Won't Start

```bash
# Check logs
docker-compose logs

# Verify images built
docker images

# Rebuild if needed
docker-compose build --no-cache

# Restart specific service
docker-compose restart auth-service
```

### Database Won't Connect

```bash
# Test database
docker-compose exec postgres pg_isready

# Check credentials
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
```

### Network Issues

```bash
# Check network
docker network ls

# Inspect network
docker network inspect saludya-backend_saludya-network

# Test connectivity
docker-compose exec auth-service ping postgres
```

## Cost Optimization

### Cloud Deployment

1. **Compute**
   - Use spot instances for dev/staging
   - Reserved instances for production
   - Auto-scaling for variable load

2. **Storage**
   - Managed databases (RDS, Cloud SQL)
   - Object storage for backups (S3)
   - Archive old data

3. **Networking**
   - Use VPC for isolation
   - CDN for static content
   - Load balancer (managed)

### Local Deployment

1. **Hardware**
   - Start small, scale up
   - Reuse existing hardware
   - Monitor utilization

2. **Software**
   - Open source (free)
   - PostgreSQL (free)
   - Python (free)

## Maintenance Plan

### Daily
- Monitor logs for errors
- Check service health
- Verify database connectivity

### Weekly
- Review performance metrics
- Check disk usage
- Test backup/restore

### Monthly
- Update dependencies
- Review security logs
- Capacity planning
- Performance optimization

### Quarterly
- Major version updates
- Architecture review
- Security audit
- Disaster recovery drill

## Support & Resources

- **Docker**: https://docs.docker.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **FastAPI**: https://fastapi.tiangolo.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/

## Next Steps

1. Choose deployment method (Docker recommended)
2. Follow QUICKSTART.md for setup
3. Read DOCKER.md for advanced usage
4. Review README.md for API details
5. Study ARCHITECTURE.md for design decisions

## Questions?

- Check relevant documentation file
- Review troubleshooting sections
- Consult logs: `docker-compose logs -f`
- Test endpoints in Swagger UI
