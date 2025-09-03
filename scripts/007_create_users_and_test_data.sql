-- Create users table for session-based authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    session_id UUID,
    session_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable password hashing extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert test users for development
-- Password for all test users is 'password123'
INSERT INTO users (email, password) VALUES 
    ('admin@test.com', crypt('password123', gen_salt('bf'))),
    ('user@test.com', crypt('password123', gen_salt('bf')))
ON CONFLICT (email) DO NOTHING;

-- Insert corresponding profiles for test users
INSERT INTO profiles (id, display_name, subscription_tier)
SELECT 
    u.id,
    CASE 
        WHEN u.email = 'admin@test.com' THEN 'Admin User'
        WHEN u.email = 'user@test.com' THEN 'Test User'
    END as display_name,
    CASE 
        WHEN u.email = 'admin@test.com' THEN 'admin'
        WHEN u.email = 'user@test.com' THEN 'free'
    END as subscription_tier
FROM users u
WHERE u.email IN ('admin@test.com', 'user@test.com')
ON CONFLICT (id) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    subscription_tier = EXCLUDED.subscription_tier;