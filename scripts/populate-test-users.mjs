import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';

// Load environment variables
config();

const sql = neon(process.env.DATABASE_URL);

const testUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    email: 'test@example.com',
    password: 'test123',
    role: 'user'
  },
  {
    email: 'demo@example.com',
    password: 'demo123',
    role: 'user'
  }
];

async function populateTestUsers() {
  try {
    console.log('Starting to populate test users...');
    
    // Check if users already exist
    const existingUsers = await sql`
      SELECT email FROM users WHERE email = ANY(${testUsers.map(u => u.email)})
    `;
    
    if (existingUsers.length > 0) {
      console.log('Some test users already exist:');
      existingUsers.forEach(user => console.log(`- ${user.email}`));
      console.log('Skipping user creation to avoid duplicates.');
      return;
    }
    
    // Create test users
    for (const user of testUsers) {
      try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(user.password, 10);
        
        const result = await sql`
          INSERT INTO users (email, password) 
          VALUES (${user.email}, ${hashedPassword})
          RETURNING id, email;
        `;
        
        console.log(`✓ Created user: ${user.email} (password: ${user.password})`);
      } catch (userError) {
        console.error(`✗ Failed to create ${user.email}:`, userError.message);
      }
    }
    
    // Verify the results
    const userCount = await sql`
      SELECT COUNT(*) as count FROM users
    `;
    
    console.log(`\n✅ Total users in database: ${userCount[0].count}`);
    
    // Show all users
    const allUsers = await sql`
      SELECT id, email, created_at 
      FROM users 
      ORDER BY created_at DESC
    `;
    
    console.log('\nUsers in database:');
    allUsers.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`);
    });
    
    console.log('\n📝 Test Login Credentials:');
    testUsers.forEach(user => {
      console.log(`- Email: ${user.email}, Password: ${user.password}`);
    });
    
  } catch (error) {
    console.error('Error populating test users:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

populateTestUsers();