import { createServerClient } from "@/lib/neon/database"

export interface BookRecommendation {
  book: any
  score: number
  reason: string
}

export async function getPersonalizedRecommendations(userId: string, limit = 6): Promise<BookRecommendation[]> {
  const db = await createServerClient()

  // For now, return some mock recommendations since we don't have full user data
  const books = await db.from("books").select("*").limit(limit).execute()
  
  return books.map((book: any, index: number) => ({
    book,
    score: 0.9 - (index * 0.1),
    reason: "Based on your reading preferences"
  }))

}

export async function getTrendingBooks(limit = 6) {
  const db = await createServerClient()
  const books = await db.from("books").select("*").limit(limit).execute()
  return books
}

export async function getSimilarBooks(bookId: string, limit = 4) {
  const db = await createServerClient()
  const books = await db.from("books").select("*").limit(limit).execute()
  return books
}
