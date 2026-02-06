# SaludYa Backend - Microservices Architecture

A complete microservices-based backend for SaludYa telemedicine MVP platform. This system provides REST APIs for patient management, appointment booking, AI symptom orientation, and payment processing.

## Architecture Overview

This backend implements a microservices architecture with 6 independent services:

1. **Auth Service** (Port 8001) - User authentication
2. **User Service** (Port 8002) - User profile management
3. **Catalog Service** (Port 8003) - Medical specialties and doctors catalog
4. **Appointment Service** (Port 8004) - Appointment booking and management
5. **AI Orientation Service** (Port 8005) - Symptom analysis and specialty recommendation
6. **Payment Service** (Port 8006) - Simulated payment processing

Each service:
- Runs independently on its own port
- Has its own database schema
- Exposes REST APIs with Swagger documentation
- Is built with FastAPI and PostgreSQL

## Project Structure

```
saludya-backend/
├── docker-compose.yml              # Orchestrate all services
├── .dockerignore                   # Docker build exclusions
├── Dockerfile                      # Base Dockerfile
├── services/
│   ├── auth_service/
│   │   ├── Dockerfile
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routers.py
│   │   ├── requirements.txt
│   │   └── .env.example
│   ├── user_service/
│   │   ├── Dockerfile
│   │   └── [same structure]
│   ├── catalog_service/
│   │   ├── Dockerfile
│   │   └── [same structure]
│   ├── appointment_service/
│   │   ├── Dockerfile
│   │   └── [same structure]
│   ├── ai_orientation_service/
│   │   ├── Dockerfile
│   │   └── [same structure]
│   └── payment_service/
│       ├── Dockerfile
│       └── [same structure]
└── database/
    └── migrations/
        ├── 001_create_schemas.sql
        ├── 002_auth_service.sql
        ├── 003_user_service.sql
        ├── 004_catalog_service.sql
        ├── 005_appointment_service.sql
        ├── 006_ai_service.sql
        └── 007_payment_service.sql
```

## Prerequisites

### Option 1: Docker (Recommended)
- Docker 20.10+
- Docker Compose 2.0+

### Option 2: Local Development
- Python 3.9+
- PostgreSQL 13+
- pip (Python package manager)

## Quick Start with Docker

The fastest way to get all services running:

```bash
# Start all services
docker-compose up -d

# Verify all services are running
docker-compose ps

# View logs from all services
docker-compose logs -f

# Stop all services
docker-compose down
```

All services will be automatically available:
- Auth Service: http://localhost:8001/docs
- User Service: http://localhost:8002/docs
- Catalog Service: http://localhost:8003/docs
- Appointment Service: http://localhost:8004/docs
- AI Orientation Service: http://localhost:8005/docs
- Payment Service: http://localhost:8006/docs

PostgreSQL will be available at:
- Host: localhost
- Port: 5432
- Username: saludya
- Password: saludya123
- Database: saludya_db

## Database Setup

### 1. Create PostgreSQL Database

```bash
createdb saludya_db
```

### 2. Run Migrations

Connect to your PostgreSQL database and run the migration files in order:

```bash
psql -d saludya_db -f database/migrations/001_create_schemas.sql
psql -d saludya_db -f database/migrations/002_auth_service.sql
psql -d saludya_db -f database/migrations/003_user_service.sql
psql -d saludya_db -f database/migrations/004_catalog_service.sql
psql -d saludya_db -f database/migrations/005_appointment_service.sql
psql -d saludya_db -f database/migrations/006_ai_service.sql
psql -d saludya_db -f database/migrations/007_payment_service.sql
```

Or run them all at once:

```bash
for f in database/migrations/*.sql; do psql -d saludya_db -f "$f"; done
```

## Installation & Running

### With Docker Compose (Recommended)

This is the simplest approach for development and testing:

```bash
# 1. Clone or navigate to project directory
cd saludya-backend

# 2. Start all services and database
docker-compose up -d

# 3. Verify services are healthy
docker-compose ps

# 4. View logs (optional)
docker-compose logs -f

# 5. Stop services when done
docker-compose down
```

The database migrations run automatically during container startup.

### Manual Setup (Local Development)

#### Install and Run Each Service

Each service needs to be installed and run separately. Open a terminal for each service:

#### Auth Service (Port 8001)

```bash
cd services/auth_service
cp .env.example .env
# Edit .env with your database credentials
pip install -r requirements.txt
python main.py
```

#### User Service (Port 8002)

```bash
cd services/user_service
cp .env.example .env
# Edit .env with your database credentials
pip install -r requirements.txt
python main.py
```

#### Catalog Service (Port 8003)

```bash
cd services/catalog_service
cp .env.example .env
# Edit .env with your database credentials
pip install -r requirements.txt
python main.py
```

#### Appointment Service (Port 8004)

```bash
cd services/appointment_service
cp .env.example .env
# Edit .env with your database credentials
pip install -r requirements.txt
python main.py
```

#### AI Orientation Service (Port 8005)

```bash
cd services/ai_orientation_service
cp .env.example .env
# Edit .env with your database credentials
pip install -r requirements.txt
python main.py
```

#### Payment Service (Port 8006)

```bash
cd services/payment_service
cp .env.example .env
# Edit .env with your database credentials
pip install -r requirements.txt
python main.py
```

### Environment Variables

Each service needs a `.env` file with the database connection string:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/saludya_db
```

Replace `username` and `password` with your PostgreSQL credentials.

## API Documentation

Each service provides interactive Swagger documentation at `/docs`:

- Auth Service: http://localhost:8001/docs
- User Service: http://localhost:8002/docs
- Catalog Service: http://localhost:8003/docs
- Appointment Service: http://localhost:8004/docs
- AI Orientation Service: http://localhost:8005/docs
- Payment Service: http://localhost:8006/docs

## API Endpoints

### Auth Service (Port 8001)

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "patient@example.com",
  "token": "generated-token",
  "created_at": "2024-01-01T00:00:00"
}
```

#### POST /auth/login
Authenticate user and get token.

**Request Body:**
```json
{
  "email": "patient@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "patient@example.com",
  "token": "generated-token",
  "message": "Login successful"
}
```

### User Service (Port 8002)

#### POST /users
Create a new user profile.

**Request Body:**
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "phone": "+51987654321",
  "birth_date": "1990-01-15"
}
```

**Response:**
```json
{
  "id": "uuid",
  "first_name": "Juan",
  "last_name": "Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "phone": "+51987654321",
  "birth_date": "1990-01-15",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### GET /users/{user_id}
Get user profile by ID.

**Response:**
```json
{
  "id": "uuid",
  "first_name": "Juan",
  "last_name": "Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "phone": "+51987654321",
  "birth_date": "1990-01-15",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### PUT /users/{user_id}
Update user profile.

**Request Body:**
```json
{
  "first_name": "Juan Carlos",
  "phone": "+51912345678"
}
```

### Catalog Service (Port 8003)

#### GET /specialties
Get all medical specialties.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Cardiología",
    "description": "Especialista en corazón y sistema cardiovascular",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

#### GET /doctors
Get all doctors or filter by specialty.

**Query Parameters:**
- `specialty_id` (optional): Filter by specialty UUID

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Dr. Carlos Mendoza",
    "specialty_id": "uuid",
    "specialty_name": "Cardiología",
    "rating": 4.8,
    "experience_years": 15,
    "price": 80.0,
    "photo_url": "https://example.com/photo.jpg",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

#### GET /doctors/{doctor_id}
Get specific doctor details.

### Appointment Service (Port 8004)

#### POST /appointments
Create a new appointment.

**Request Body:**
```json
{
  "user_id": "uuid",
  "doctor_id": "uuid",
  "doctor_name": "Dr. Carlos Mendoza",
  "specialty_name": "Cardiología",
  "appointment_date": "2024-02-15T10:00:00",
  "price": 80.0,
  "notes": "Primera consulta"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "doctor_id": "uuid",
  "doctor_name": "Dr. Carlos Mendoza",
  "specialty_name": "Cardiología",
  "appointment_date": "2024-02-15T10:00:00",
  "price": 80.0,
  "status": "confirmed",
  "payment_id": null,
  "notes": "Primera consulta",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### GET /appointments/user/{user_id}
Get all appointments for a user.

**Response:**
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "doctor_id": "uuid",
    "doctor_name": "Dr. Carlos Mendoza",
    "specialty_name": "Cardiología",
    "appointment_date": "2024-02-15T10:00:00",
    "price": 80.0,
    "status": "confirmed",
    "payment_id": "uuid",
    "notes": "Primera consulta",
    "created_at": "2024-01-01T00:00:00",
    "updated_at": "2024-01-01T00:00:00"
  }
]
```

#### GET /appointments/{appointment_id}
Get specific appointment details.

#### PUT /appointments/{appointment_id}/cancel
Cancel an appointment.

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "doctor_id": "uuid",
  "doctor_name": "Dr. Carlos Mendoza",
  "specialty_name": "Cardiología",
  "appointment_date": "2024-02-15T10:00:00",
  "price": 80.0,
  "status": "cancelled",
  "payment_id": "uuid",
  "notes": "Primera consulta",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

### AI Orientation Service (Port 8005)

#### POST /ai/orient
Analyze symptoms and get specialty recommendation.

**Request Body:**
```json
{
  "symptoms": "Tengo dolor de pecho y palpitaciones",
  "user_id": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "symptoms": "Tengo dolor de pecho y palpitaciones",
  "recommended_specialty": "Cardiología",
  "confidence": "alta",
  "explanation": "Los síntomas descritos tienen una fuerte relación con Cardiología",
  "created_at": "2024-01-01T00:00:00"
}
```

**Symptom Keywords by Specialty:**
- **Cardiología**: dolor de pecho, palpitaciones, corazón, presión arterial
- **Pediatría**: niño, bebé, infantil, vacuna, fiebre en niños
- **Dermatología**: piel, sarpullido, acné, manchas, picazón
- **Psicología**: ansiedad, depresión, estrés, insomnio, tristeza
- **Traumatología**: fractura, hueso, dolor muscular, esguince, dolor de espalda
- **Ginecología**: menstruación, embarazo, útero, ovario
- **Oftalmología**: ojo, visión, vista, conjuntivitis
- **Neurología**: dolor de cabeza, migraña, mareo, vértigo
- **Nutrición**: dieta, peso, obesidad, alimentación
- **Medicina General**: fiebre, gripe, tos, resfriado (default)

### Payment Service (Port 8006)

#### POST /payments
Process a payment (simulated).

**Request Body:**
```json
{
  "user_id": "uuid",
  "appointment_id": "uuid",
  "amount": 80.0,
  "card_number": "4532123456789012",
  "card_holder": "Juan Pérez",
  "expiry_date": "12/25",
  "cvv": "123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "appointment_id": "uuid",
  "amount": 80.0,
  "card_last_four": "9012",
  "card_type": "Visa",
  "status": "completed",
  "transaction_id": "TXN-1234567890ABCDEF",
  "created_at": "2024-01-01T00:00:00",
  "message": "Payment processed successfully"
}
```

#### GET /payments/{payment_id}
Get payment details.

## Postman Collection Examples

### 1. Complete User Flow

#### Step 1: Register User
```
POST http://localhost:8001/auth/register
Content-Type: application/json

{
  "email": "maria.lopez@example.com",
  "password": "SecurePass123!"
}
```

#### Step 2: Create User Profile
```
POST http://localhost:8002/users
Content-Type: application/json

{
  "first_name": "María",
  "last_name": "López",
  "dni": "87654321",
  "email": "maria.lopez@example.com",
  "phone": "+51987654321",
  "birth_date": "1992-05-20"
}
```

#### Step 3: Get AI Orientation
```
POST http://localhost:8005/ai/orient
Content-Type: application/json

{
  "symptoms": "Tengo dolor de cabeza intenso y mareos",
  "user_id": "{user_id_from_step_2}"
}
```

#### Step 4: Get Specialties
```
GET http://localhost:8003/specialties
```

#### Step 5: Get Doctors by Specialty
```
GET http://localhost:8003/doctors?specialty_id={specialty_id}
```

#### Step 6: Create Appointment
```
POST http://localhost:8004/appointments
Content-Type: application/json

{
  "user_id": "{user_id}",
  "doctor_id": "{doctor_id}",
  "doctor_name": "Dra. Patricia Ortiz",
  "specialty_name": "Neurología",
  "appointment_date": "2024-02-20T15:00:00",
  "price": 92.0,
  "notes": "Consulta por dolor de cabeza"
}
```

#### Step 7: Process Payment
```
POST http://localhost:8006/payments
Content-Type: application/json

{
  "user_id": "{user_id}",
  "appointment_id": "{appointment_id}",
  "amount": 92.0,
  "card_number": "4532123456789012",
  "card_holder": "María López",
  "expiry_date": "08/26",
  "cvv": "456"
}
```

#### Step 8: Get User Appointments
```
GET http://localhost:8004/appointments/user/{user_id}
```

## Technology Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Password Hashing**: bcrypt
- **Python Version**: 3.9+

## Features

### Authentication
- User registration with email and password
- Login with JWT-like token generation
- Password hashing with bcrypt

### User Management
- Create, read, and update user profiles
- DNI and email uniqueness validation
- Profile fields: name, DNI, email, phone, birth date

### Medical Catalog
- Pre-seeded medical specialties
- Pre-seeded doctor profiles with:
  - Name, photo, specialty
  - Rating, experience years
  - Consultation price
- Filter doctors by specialty

### Appointments
- Create appointments with doctor selection
- View user appointment history
- Cancel appointments
- Appointment statuses: pending, confirmed, cancelled, completed

### AI Symptom Orientation
- Keyword-based symptom analysis
- Specialty recommendation with confidence level
- Support for 10 medical specialties
- Stores query history

### Payment Processing
- Simulated credit card processing
- Card validation (number, CVV, expiry)
- Card type detection (Visa, Mastercard, Amex)
- Payment status tracking
- 95% success rate simulation

## Database Schema Highlights

Each microservice has its own schema in PostgreSQL:

- `auth_service`: User credentials
- `user_service`: User profiles
- `catalog_service`: Specialties and doctors
- `appointment_service`: Appointments
- `ai_service`: Symptom queries
- `payment_service`: Payment transactions

This provides logical separation while using a single database instance.

## Development Notes

- No authentication middleware (as per requirements)
- No external API calls
- Simple business logic for MVP
- All data is simulated/mocked
- Payment gateway is simulated
- 95% payment success rate

## Testing

You can test each endpoint using:
1. Swagger UI at each service's `/docs` endpoint
2. Postman with the example requests above
3. cURL commands
4. Any HTTP client

## Troubleshooting

### Docker Issues

#### Services won't start
```bash
# Check service logs
docker-compose logs service-name

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Remove dangling containers/images
docker system prune -a
```

#### Database connection failed
```bash
# Ensure database is healthy
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### Port already in use
Modify port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8001:8001"  # Change first number to unused port
```

### Local Development Issues

#### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env files
- Ensure database exists and migrations are run

#### Port Already in Use
- Check if another service is using the port
- Change port in main.py if needed

#### Module Not Found
- Ensure you're in the correct service directory
- Verify requirements.txt is installed

## Future Enhancements

- API Gateway for unified entry point
- JWT authentication middleware
- Service-to-service communication
- Message queue for async operations
- Docker containerization
- CI/CD pipeline
- Monitoring and logging
- Rate limiting
- API versioning

## License

MIT License - Free for educational and commercial use.

## Contact

For questions or issues, please open an issue in the repository.
