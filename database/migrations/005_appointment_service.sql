-- Appointment Service Tables

CREATE TABLE IF NOT EXISTS appointment_service.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    doctor_id UUID NOT NULL,
    doctor_name VARCHAR(255) NOT NULL,
    specialty_name VARCHAR(255) NOT NULL,
    appointment_date TIMESTAMP NOT NULL,
    price FLOAT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_id UUID NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_user ON appointment_service.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointment_service.appointments(appointment_date);
