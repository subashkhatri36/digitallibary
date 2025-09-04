import { sql } from "@/lib/neon/client"

export interface BookRecommendation {
  book: any
  score: number
  reason: string
}

export async function getPersonalizedRecommendations(userId: string, limit = 6): Promise<BookRecommendation[]> {
  // For now, return some mock recommendations since we don't have full user data
  const books = await sql`
    SELECT b.*, a.name as author_name
    FROM books b
    LEFT JOIN authors a ON b.author_id = a.id
    WHERE b.is_featured = true OR b.is_trending = true
    LIMIT ${limit}
  `
  
  return books.map((book: any, index: number) => ({
    book,
    score: 0.9 - (index * 0.1),
    reason: "Based on your reading preferences"
  }))

}

export async function getTrendingBooks(limit = 6) {
  const books = await sql`
    SELECT b.*, a.name as author_name
    FROM books b
    LEFT JOIN authors a ON b.author_id = a.id
    WHERE b.is_trending = true
    LIMIT ${limit}
  `
  return books
}

export async function getSimilarBooks(bookId: string, limit = 4) {
  const books = await sql`
    SELECT b.*, a.name as author_name
    FROM books b
    LEFT JOIN authors a ON b.author_id = a.id
    WHERE b.id != ${bookId}
    LIMIT ${limit}
  `
  return books
}
