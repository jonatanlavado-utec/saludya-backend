-- Auth Service Tables

CREATE TABLE IF NOT EXISTS auth_service.auth_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_service.auth_users(email);
