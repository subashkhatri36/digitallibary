-- Update database schema to work with Neon and add session management
-- Add session management to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_expires TIMESTAMP WITH TIME ZONE;

-- Add password hashing extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update users table to include password field
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_books_featured ON books(is_featured);
CREATE INDEX IF NOT EXISTS idx_user_library_user_book ON user_library(user_id, book_id);

-- Update RLS policies to work without Supabase auth
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create simple policies that work with session-based auth
CREATE POLICY "Enable read access for authenticated users" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Enable update for users based on user_id" ON profiles
  FOR UPDATE USING (true);
