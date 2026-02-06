# SaludYa Backend - Quick Start Guide

Get SaludYa backend running in 5 minutes!

## Option 1: Docker (Easiest - 30 seconds)

```bash
# 1. Make sure Docker and Docker Compose are installed
docker --version
docker-compose --version

# 2. Start all services
docker-compose up -d

# 3. Verify services are running
docker-compose ps

# 4. Access services:
# - Auth Service: http://localhost:8001/docs
# - User Service: http://localhost:8002/docs
# - Catalog Service: http://localhost:8003/docs
# - Appointment Service: http://localhost:8004/docs
# - AI Service: http://localhost:8005/docs
# - Payment Service: http://localhost:8006/docs

# 5. Stop services when done
docker-compose down
```

For more Docker commands, see [DOCKER.md](DOCKER.md)

---

## Option 2: Local Development Setup

### Step 1: Install PostgreSQL

Make sure PostgreSQL is installed and running on your machine.

## Step 2: Create Database

```bash
createdb saludya_db
```

## Step 3: Run Migrations

```bash
cd database/migrations
for f in *.sql; do psql -d saludya_db -f "$f"; done
```

## Step 4: Configure Environment

Create a `.env` file in each service directory:

```bash
# For each service directory
cd services/auth_service
cp .env.example .env
```

Edit each `.env` file and update with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/saludya_db
```

Replace `your_username` and `your_password` with your actual PostgreSQL credentials.

## Step 5: Install Dependencies

For each service:

```bash
cd services/auth_service
pip install -r requirements.txt

cd ../user_service
pip install -r requirements.txt

cd ../catalog_service
pip install -r requirements.txt

cd ../appointment_service
pip install -r requirements.txt

cd ../ai_orientation_service
pip install -r requirements.txt

cd ../payment_service
pip install -r requirements.txt
```

## Step 6: Start Services

Open 6 terminal windows and run each service:

### Terminal 1 - Auth Service
```bash
cd services/auth_service
python main.py
```

### Terminal 2 - User Service
```bash
cd services/user_service
python main.py
```

### Terminal 3 - Catalog Service
```bash
cd services/catalog_service
python main.py
```

### Terminal 4 - Appointment Service
```bash
cd services/appointment_service
python main.py
```

### Terminal 5 - AI Orientation Service
```bash
cd services/ai_orientation_service
python main.py
```

### Terminal 6 - Payment Service
```bash
cd services/payment_service
python main.py
```

## Step 7: Verify Services

Open your browser and check these URLs:

- http://localhost:8001/docs - Auth Service
- http://localhost:8002/docs - User Service
- http://localhost:8003/docs - Catalog Service
- http://localhost:8004/docs - Appointment Service
- http://localhost:8005/docs - AI Orientation Service
- http://localhost:8006/docs - Payment Service

## Step 8: Test the API

### Quick Test Flow

1. Register a user:
```bash
curl -X POST http://localhost:8001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

2. Get specialties:
```bash
curl http://localhost:8003/specialties
```

3. Get doctors:
```bash
curl http://localhost:8003/doctors
```

4. Get AI orientation:
```bash
curl -X POST http://localhost:8005/ai/orient \
  -H "Content-Type: application/json" \
  -d '{"symptoms":"dolor de pecho y palpitaciones"}'
```

## Alternative: Use Postman

Import the `postman_collection.json` file into Postman for a complete set of API requests.

## Troubleshooting

### "Database does not exist"
Run: `createdb saludya_db`

### "Port already in use"
Another process is using the port. Kill it or change the port in main.py

### "Connection refused"
Make sure PostgreSQL is running

### "Module not found"
Install requirements: `pip install -r requirements.txt`

## Next Steps

Read the full `README.md` for:
- Complete API documentation
- Architecture details
- Advanced configuration
- Development guidelines

## Support

For detailed documentation, see `README.md`
