import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Neon client
const sql = neon(process.env.DATABASE_URL);

// List of SQL files to execute in order
const sqlFiles = [
  '001_create_neon_schema.sql',
  '008_insert_sample_books.sql'
];

async function executeSqlFile(filename) {
  try {
    console.log(`\n📄 Executing ${filename}...`);
    const filePath = join(__dirname, filename);
    const sqlContent = readFileSync(filePath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      if (statement.trim()) {
        await sql.query(statement);
      }
    }
    
    console.log(`✅ Successfully executed ${filename}`);
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error.message);
    throw error;
  }
}

async function setupCompleteDatabase() {
  try {
    console.log('🚀 Starting complete database setup...');
    
    // Execute all SQL files in order
    for (const sqlFile of sqlFiles) {
      await executeSqlFile(sqlFile);
    }
    
    // Verify tables were created
    console.log('\n🔍 Verifying database setup...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('\n📊 Created tables:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Check books count
    const booksCount = await sql`SELECT COUNT(*) as count FROM books`;
    console.log(`\n📚 Total books in database: ${booksCount[0].count}`);
    
    // Check authors count
    const authorsCount = await sql`SELECT COUNT(*) as count FROM authors`;
    console.log(`👥 Total authors in database: ${authorsCount[0].count}`);
    
    // Check genres count
    const genresCount = await sql`SELECT COUNT(*) as count FROM genres`;
    console.log(`🏷️ Total genres in database: ${genresCount[0].count}`);
    
    console.log('\n🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  }
}

// Run the setup
setupCompleteDatabase();