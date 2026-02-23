-- AI Orientation Service Tables

CREATE TABLE IF NOT EXISTS ai_service.orientation_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    symptoms TEXT NOT NULL,
    recommended_specialty VARCHAR(255) NOT NULL,
    confidence VARCHAR(50) NOT NULL,
    inference_method VARCHAR(50) NOT NULL DEFAULT 'logic',
    comment TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orientation_user ON ai_service.orientation_queries(user_id);
