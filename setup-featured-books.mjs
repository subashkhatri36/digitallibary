import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sql = neon(process.env.DATABASE_URL);

async function setupFeaturedBooks() {
  try {
    console.log('🚀 Setting up featured books database...');
    
    // Read and execute SQL scripts in order
    const scripts = [
      '001_create_neon_schema.sql',
      '007_create_users_and_test_data.sql',
      '008_insert_sample_books.sql'
    ];
    
    for (const scriptName of scripts) {
      const scriptPath = join(__dirname, 'scripts', scriptName);
      console.log(`📄 Executing ${scriptName}...`);
      
      try {
        const scriptContent = readFileSync(scriptPath, 'utf8');
        
        // Split by semicolon and execute each statement
        const statements = scriptContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            await sql`${statement}`;
          }
        }
        
        console.log(`✅ ${scriptName} executed successfully`);
      } catch (error) {
        console.log(`⚠️  ${scriptName} may have already been executed or had conflicts: ${error.message}`);
      }
    }
    
    // Verify featured books exist
    console.log('\n🔍 Checking featured books...');
    const featuredBooks = await sql`SELECT id, title, is_featured FROM books WHERE is_featured = true`;
    
    if (featuredBooks.length > 0) {
      console.log(`✅ Found ${featuredBooks.length} featured books:`);
      featuredBooks.forEach(book => {
        console.log(`   - ${book.title} (ID: ${book.id})`);
      });
    } else {
      console.log('❌ No featured books found. Creating some manually...');
      
      // Create featured books manually if none exist
      await sql`
        INSERT INTO books (title, description, page_count, price, is_featured, is_trending, is_new_release)
        VALUES 
          ('The Great Gatsby', 'A classic American novel about the Jazz Age', 180, 12.99, true, false, false),
          ('To Kill a Mockingbird', 'A gripping tale of racial injustice and childhood innocence', 376, 13.99, true, true, false),
          ('The Catcher in the Rye', 'A controversial novel about teenage rebellion', 234, 11.99, true, false, false)
        ON CONFLICT DO NOTHING
      `;
      
      console.log('✅ Created 3 featured books manually');
    }
    
    console.log('\n🎉 Featured books setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up featured books:', error);
    process.exit(1);
  }
}

setupFeaturedBooks();