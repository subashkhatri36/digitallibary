const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.NEON_POSTGRES_URL);

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Execute statements one by one
    console.log('Creating users table...');
    await sql`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          session_id UUID,
          session_expires TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    
    console.log('Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_users_session ON users(session_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`;
    
    console.log('Enabling pgcrypto extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;
    
    console.log('Inserting test users...');
    await sql`
      INSERT INTO users (email, password) VALUES 
          ('admin@test.com', crypt('password123', gen_salt('bf'))),
          ('user@test.com', crypt('password123', gen_salt('bf')))
      ON CONFLICT (email) DO NOTHING
    `;
    
    console.log('Creating profiles table if not exists...');
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
          id UUID PRIMARY KEY,
          display_name TEXT,
          avatar_url TEXT,
          subscription_tier TEXT DEFAULT 'free',
          subscription_expires_at TIMESTAMPTZ,
          reading_streak INTEGER DEFAULT 0,
          total_books_read INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    
    console.log('Inserting profiles for test users...');
    await sql`
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
          subscription_tier = EXCLUDED.subscription_tier
    `;
    
    console.log('Database setup completed successfully!');
    
    // Test the setup by querying users
    const users = await sql`SELECT email, id FROM users`;
    console.log('Test users created:', users);
    
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();