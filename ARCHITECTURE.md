# SaludYa Backend Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Not Included)                  │
└────────────┬────────────────────────────────────────────────────┘
             │
             │ HTTP/REST API Calls
             │
┌────────────▼────────────────────────────────────────────────────┐
│                      Microservices Layer                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ Auth Service   │  │ User Service   │  │ Catalog Service │  │
│  │   Port 8001    │  │   Port 8002    │  │   Port 8003     │  │
│  │                │  │                │  │                 │  │
│  │ - Register     │  │ - Create User  │  │ - Specialties   │  │
│  │ - Login        │  │ - Get User     │  │ - Doctors       │  │
│  │ - Auth Tokens  │  │ - Update User  │  │ - Filter        │  │
│  └───────┬────────┘  └───────┬────────┘  └────────┬────────┘  │
│          │                   │                     │            │
│          │                   │                     │            │
│  ┌───────▼────────┐  ┌───────▼────────┐  ┌────────▼────────┐  │
│  │ Appointment    │  │ AI Orientation │  │ Payment Service │  │
│  │   Service      │  │    Service     │  │   Port 8006     │  │
│  │   Port 8004    │  │   Port 8005    │  │                 │  │
│  │                │  │                │  │                 │  │
│  │ - Book         │  │ - Analyze      │  │ - Process       │  │
│  │ - Cancel       │  │   Symptoms     │  │ - Validate Card │  │
│  │ - History      │  │ - Recommend    │  │ - Transaction   │  │
│  └───────┬────────┘  └───────┬────────┘  └────────┬────────┘  │
│          │                   │                     │            │
└──────────┼───────────────────┼─────────────────────┼────────────┘
           │                   │                     │
           │                   │                     │
┌──────────▼───────────────────▼─────────────────────▼────────────┐
│                    PostgreSQL Database                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ auth_service   │  │ user_service   │  │catalog_service  │  │
│  │   schema       │  │   schema       │  │   schema        │  │
│  └────────────────┘  └────────────────┘  └─────────────────┘  │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐  │
│  │ appointment_   │  │  ai_service    │  │payment_service  │  │
│  │  service schema│  │   schema       │  │   schema        │  │
│  └────────────────┘  └────────────────┘  └─────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Containerization with Docker

All services are containerized using Docker and orchestrated with Docker Compose:

### Container Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Docker Compose Network (saludya-network)       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │ postgres:15      │  │ auth-service     │  Port 8001      │
│  │  container       │  │  (Python 3.9)    │                │
│  │                  │  └──────────────────┘                │
│  │  Volume:         │                                       │
│  │  postgres_data   │  ┌──────────────────┐                │
│  └────────┬─────────┘  │ user-service     │  Port 8002      │
│           │            │  (Python 3.9)    │                │
│           │            └──────────────────┘                │
│           │                                                │
│           │            ┌──────────────────┐                │
│           │            │ catalog-service  │  Port 8003      │
│           │            │  (Python 3.9)    │                │
│           │            └──────────────────┘                │
│           │                                                │
│           │            ┌──────────────────┐                │
│           │            │appointment-service│ Port 8004      │
│           └───────────►│  (Python 3.9)    │                │
│                        └──────────────────┘                │
│                                                              │
│                        ┌──────────────────┐                │
│                        │ai-orientation-   │  Port 8005      │
│                        │  service         │                │
│                        │  (Python 3.9)    │                │
│                        └──────────────────┘                │
│                                                              │
│                        ┌──────────────────┐                │
│                        │ payment-service  │  Port 8006      │
│                        │  (Python 3.9)    │                │
│                        └──────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Docker Images

Each service uses:
- **Base Image**: `python:3.9-slim` (80MB)
- **OS**: Alpine Linux (lightweight)
- **Pre-installed**: gcc, postgresql-client

### Docker Compose Features

1. **Service Orchestration**: All 7 containers managed together
2. **Networking**: Services communicate via `saludya-network` bridge
3. **Volume Management**: PostgreSQL data persisted in named volume
4. **Health Checks**: Database health verified before services start
5. **Dependency Management**: Services wait for PostgreSQL
6. **Environment Variables**: Database credentials shared across services
7. **Auto-migrations**: SQL migrations run during PostgreSQL startup
8. **Restart Policy**: `unless-stopped` for container persistence

### Building and Running

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f service-name

# Stop services
docker-compose stop

# Remove containers and volumes
docker-compose down -v
```

## Service Communication Flow

### User Registration & Authentication Flow
```
1. Frontend → Auth Service (POST /auth/register)
2. Auth Service → Database (auth_service schema)
3. Auth Service → Frontend (User ID + Token)
```

### Complete Appointment Booking Flow
```
1. Frontend → AI Service (POST /ai/orient)
   - User enters symptoms
   - AI analyzes and recommends specialty

2. Frontend → Catalog Service (GET /specialties)
   - Get all medical specialties

3. Frontend → Catalog Service (GET /doctors?specialty_id=X)
   - Get doctors for recommended specialty

4. Frontend → User Service (POST /users or GET /users/{id})
   - Create or retrieve user profile

5. Frontend → Appointment Service (POST /appointments)
   - Book appointment with selected doctor

6. Frontend → Payment Service (POST /payments)
   - Process payment for appointment

7. Frontend → Appointment Service (GET /appointments/user/{id})
   - View appointment confirmation
```

## Database Schema per Service

### auth_service
```sql
auth_users
- id (UUID)
- email
- password_hash
- created_at
- last_login
```

### user_service
```sql
users
- id (UUID)
- first_name
- last_name
- dni
- email
- phone
- birth_date
- created_at
- updated_at
```

### catalog_service
```sql
specialties
- id (UUID)
- name
- description
- created_at

doctors
- id (UUID)
- name
- specialty_id (FK)
- rating
- experience_years
- price
- photo_url
- created_at
```

### appointment_service
```sql
appointments
- id (UUID)
- user_id
- doctor_id
- doctor_name
- specialty_name
- appointment_date
- price
- status (ENUM)
- payment_id
- notes
- created_at
- updated_at
```

### ai_service
```sql
orientation_queries
- id (UUID)
- user_id
- symptoms
- recommended_specialty
- confidence
- created_at
```

### payment_service
```sql
payments
- id (UUID)
- user_id
- appointment_id
- amount
- card_last_four
- card_type
- status (ENUM)
- transaction_id
- created_at
- updated_at
```

## Technology Stack

| Component        | Technology      | Version |
|------------------|-----------------|---------|
| Framework        | FastAPI         | 0.109   |
| Database         | PostgreSQL      | 13+     |
| ORM              | SQLAlchemy      | 2.0     |
| Validation       | Pydantic        | 2.5     |
| Password Hashing | bcrypt          | 4.1     |
| Server           | Uvicorn         | 0.27    |
| Language         | Python          | 3.9+    |

## Design Principles

### 1. Microservices Architecture
- Each service is independent
- Each service has its own database schema
- Services communicate via REST APIs
- No direct database access between services

### 2. Database-per-Service Pattern
- Logical separation using PostgreSQL schemas
- Maintains data isolation
- Allows independent scaling
- Single database for simplicity

### 3. REST API Design
- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Proper HTTP status codes
- OpenAPI/Swagger documentation

### 4. Stateless Services
- No session management
- Token-based authentication
- Each request is independent

### 5. Separation of Concerns
- Models (database layer)
- Schemas (validation layer)
- Routers (API layer)
- Database (connection layer)

## Security Considerations

### Implemented
- Password hashing with bcrypt
- Input validation with Pydantic
- SQL injection protection (SQLAlchemy ORM)
- CORS configuration

### Not Implemented (Future)
- JWT token validation
- Rate limiting
- API authentication middleware
- Encryption at rest
- HTTPS/TLS

## Scalability Considerations

### Current State
- Monolithic database
- No caching layer
- Synchronous processing
- No load balancing

### Future Improvements
- Add Redis for caching
- Implement message queues (RabbitMQ/Kafka)
- Add API Gateway
- Container orchestration (Kubernetes)
- Database sharding
- Read replicas

## API Gateway Pattern (Future)

```
                    ┌──────────────┐
                    │              │
Frontend ───────────► API Gateway  │
                    │   (Future)   │
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────▼─────┐    ┌─────▼─────┐   ┌─────▼─────┐
    │  Service  │    │  Service  │   │  Service  │
    │     1     │    │     2     │   │     3     │
    └───────────┘    └───────────┘   └───────────┘
```

Benefits:
- Single entry point
- Authentication/Authorization
- Rate limiting
- Request routing
- Load balancing
- API versioning

## Service Dependencies

```
Auth Service
└─ No dependencies

User Service
└─ No dependencies

Catalog Service
└─ No dependencies

Appointment Service
├─ References User Service (user_id)
├─ References Catalog Service (doctor_id)
└─ References Payment Service (payment_id)

AI Orientation Service
└─ References User Service (user_id, optional)

Payment Service
├─ References User Service (user_id)
└─ References Appointment Service (appointment_id)
```

## Error Handling Strategy

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

### Error Response Format
```json
{
  "detail": "Error message here"
}
```

## Testing Strategy (Future)

### Unit Tests
- Test individual functions
- Mock database calls
- Test business logic

### Integration Tests
- Test API endpoints
- Test database operations
- Test service communication

### End-to-End Tests
- Test complete user flows
- Test multiple services
- Test error scenarios

## Monitoring & Logging (Future)

### Logging
- Request/response logging
- Error logging
- Performance metrics

### Monitoring
- Service health checks
- Database connection pools
- API response times
- Error rates

### Tools
- Prometheus (metrics)
- Grafana (visualization)
- ELK Stack (logging)
- Sentry (error tracking)

## Deployment Strategy

### Development (Current)
- Docker Compose with local containers
- PostgreSQL in container
- All services in shared network
- Data persisted in Docker volume
- Direct localhost access

### Staging
- Docker containers on staging server
- Managed Docker registry
- CI/CD pipeline to build/push images
- Environment-specific .env files
- Database backups

### Production
- Kubernetes cluster
- Container registry (ECR, DockerHub)
- Managed PostgreSQL (AWS RDS, Azure Database)
- Load balancers and ingress controllers
- Horizontal pod autoscaling
- Service mesh (optional)
- CI/CD pipeline with automated testing

## API Versioning (Future)

```
/v1/auth/register
/v1/users
/v1/appointments
```

Benefits:
- Backward compatibility
- Gradual migration
- Multiple versions support
