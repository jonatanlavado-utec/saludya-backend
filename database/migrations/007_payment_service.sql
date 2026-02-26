-- Payment Service Tables

CREATE TABLE IF NOT EXISTS payment_service.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    amount FLOAT NOT NULL,
    card_last_four VARCHAR(4) NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payment_service.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction ON payment_service.payments(transaction_id);
