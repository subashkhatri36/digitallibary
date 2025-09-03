import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

// Load environment variables
config();

const sql = neon(process.env.DATABASE_URL);

const featuredBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "9780743273565",
    genre: "Classic Literature",
    publication_year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    cover_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    is_featured: true,
    average_rating: 4.2,
    total_pages: 180
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "9780061120084",
    genre: "Classic Literature",
    publication_year: 1960,
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    cover_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    is_featured: true,
    average_rating: 4.5,
    total_pages: 324
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "9780451524935",
    genre: "Dystopian Fiction",
    publication_year: 1949,
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    cover_url: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400&h=600&fit=crop",
    is_featured: true,
    average_rating: 4.3,
    total_pages: 328
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "9780141439518",
    genre: "Romance",
    publication_year: 1813,
    description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    cover_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    is_featured: true,
    average_rating: 4.4,
    total_pages: 432
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "9780316769174",
    genre: "Coming-of-age Fiction",
    publication_year: 1951,
    description: "A controversial novel about teenage rebellion and alienation in post-war America.",
    cover_url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    is_featured: true,
    average_rating: 3.8,
    total_pages: 277
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    isbn: "9780747532699",
    genre: "Fantasy",
    publication_year: 1997,
    description: "The first book in the beloved Harry Potter series about a young wizard's adventures.",
    cover_url: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    is_featured: true,
    average_rating: 4.7,
    total_pages: 223
  }
];

async function populateFeaturedBooks() {
  try {
    console.log('Starting to populate featured books...');
    
    // Clear existing featured books
    await sql`UPDATE books SET is_featured = false WHERE is_featured = true`;
    console.log('Cleared existing featured books');
    
    // Insert new featured books
    for (const book of featuredBooks) {
      try {
        // First, check if author exists, if not create one
        let authorResult = await sql`
          SELECT id FROM authors WHERE name = ${book.author}
        `;
        
        let authorId;
        if (authorResult.length === 0) {
          // Author doesn't exist, create new one
          const newAuthor = await sql`
            INSERT INTO authors (name) 
            VALUES (${book.author})
            RETURNING id;
          `;
          authorId = newAuthor[0].id;
        } else {
          authorId = authorResult[0].id;
        }
        
        // Get or create genre
        let genreResult = await sql`
          SELECT id FROM genres WHERE name = ${book.genre}
        `;
        
        let genreId;
        if (genreResult.length === 0) {
          const newGenre = await sql`
            INSERT INTO genres (name) 
            VALUES (${book.genre})
            RETURNING id;
          `;
          genreId = newGenre[0].id;
        } else {
          genreId = genreResult[0].id;
        }
        
        // Then insert the book with author_id and genre_id
        const result = await sql`
          INSERT INTO books (
            title, author_id, isbn, genre_id, publication_date, 
            description, cover_url, is_featured, average_rating, page_count
          ) VALUES (
            ${book.title}, ${authorId}, ${book.isbn}, ${genreId}, 
            ${book.publication_year + '-01-01'}, ${book.description}, ${book.cover_url}, 
            ${book.is_featured}, ${book.average_rating}, ${book.total_pages}
          )

          RETURNING id, title;
        `;
        console.log(`✓ Added/Updated: ${book.title}`);
      } catch (bookError) {
        console.error(`✗ Failed to add ${book.title}:`, bookError.message);
      }
    }
    
    // Verify the results
    const featuredCount = await sql`
      SELECT COUNT(*) as count FROM books WHERE is_featured = true
    `;
    
    console.log(`\n✅ Successfully populated ${featuredCount[0].count} featured books!`);
    
    // Show the featured books
    const featured = await sql`
      SELECT b.id, b.title, a.name as author_name, b.is_featured 
      FROM books b
      JOIN authors a ON b.author_id = a.id
      WHERE b.is_featured = true 
      ORDER BY b.title
    `;
    
    console.log('\nFeatured books in database:');
    featured.forEach(book => {
      console.log(`- ${book.title} by ${book.author_name}`);
    });
    
  } catch (error) {
    console.error('Error populating featured books:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

populateFeaturedBooks();