-- Auth tokens for session validation (e.g. GET /auth/me)

CREATE TABLE IF NOT EXISTS auth_service.auth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(64) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth_service.auth_users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_tokens_token ON auth_service.auth_tokens(token);
CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_id ON auth_service.auth_tokens(user_id);
