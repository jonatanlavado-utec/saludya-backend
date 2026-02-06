-- Catalog Service Tables

CREATE TABLE IF NOT EXISTS catalog_service.specialties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_service.doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    specialty_id UUID NOT NULL REFERENCES catalog_service.specialties(id),
    rating FLOAT DEFAULT 0.0,
    experience_years INTEGER DEFAULT 0,
    price FLOAT NOT NULL,
    photo_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON catalog_service.doctors(specialty_id);
