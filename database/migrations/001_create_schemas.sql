-- Create separate schemas for each microservice
-- This ensures database-per-service isolation while using a single PostgreSQL instance

CREATE SCHEMA IF NOT EXISTS auth_service;
CREATE SCHEMA IF NOT EXISTS user_service;
CREATE SCHEMA IF NOT EXISTS catalog_service;
CREATE SCHEMA IF NOT EXISTS appointment_service;
CREATE SCHEMA IF NOT EXISTS ai_service;
CREATE SCHEMA IF NOT EXISTS payment_service;
