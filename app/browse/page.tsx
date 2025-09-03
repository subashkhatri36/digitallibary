
import { createServerClient } from "@/lib/neon/database"
import { Suspense } from "react"
import { BookGrid } from "@/components/book-grid"
import { SearchFilters } from "@/components/search-filters"
import { AIRecommendations } from "@/components/ai-recommendations"
import { getPersonalizedRecommendations, getTrendingBooks } from "@/lib/ai-recommendations"
import { BookOpen } from "lucide-react"
import Link from "next/link"
interface SearchParams {
  search?: string
  genre?: string
  tag?: string
  sort?: string
  page?: string
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  const db = await createServerClient()
  
  // Mock user for now
  const user = { id: 'mock-user-id' }

  // Build query based on search parameters
  let query = db.from("books").select(`
      *,
      authors(name),
      genres(name),
      book_tags(tag_name, tag_type)
    `)

  // Apply search filter
  if (params.search) {
    // For now, we'll use a simple title match since ilike isn't available
    // In a real implementation, you'd want to add ilike support to QueryBuilder
    query = query.eq('title', params.search)
  }

  // Apply genre filter
  if (params.genre) {
    query = query.eq("genres.name", params.genre)
  }

  // Apply sorting
  const sortBy = params.sort || "created_at"
  const sortOrder = sortBy === "price" ? "asc" : "desc"
  query = query.order(sortBy, { ascending: sortOrder === "asc" })

  // Pagination
  const page = Number.parseInt(params.page || "1")
  const itemsPerPage = 12
  const from = (page - 1) * itemsPerPage
  const to = from + itemsPerPage - 1

  // Execute query with pagination
  const books = await query
    .limit(itemsPerPage)
    .execute()
  
  const error = null

  // Get genres for filter dropdown
  const genres = await db.from("genres").select("name").order("name").execute()

  let personalizedBooks: any[] = []
  let trendingBooks: any[] = []

  if (!params.search && !params.genre && !params.tag && user) {
    const [personalized, trending] = await Promise.all([
      getPersonalizedRecommendations(user.id, 6),
      getTrendingBooks(6),
    ])
    personalizedBooks = personalized
    trendingBooks = trending
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LibraryFlow</h1>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Discover Books</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore our vast collection of books across all genres
          </p>
        </div>

        {/* Search and Filters */}
        <Suspense fallback={<div>Loading filters...</div>}>
          <SearchFilters genres={genres || []} />
        </Suspense>

        {!params.search &&
          !params.genre &&
          !params.tag &&
          (personalizedBooks.length > 0 || trendingBooks.length > 0) && (
            <div className="mt-8 mb-8">
              <AIRecommendations
                personalizedBooks={personalizedBooks}
                trendingBooks={trendingBooks}
                userId={user?.id}
              />
            </div>
          )}

        {/* Results */}
        <div className="mt-8">
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading books. Please try again.</p>
            </div>
          ) : books && books.length > 0 ? (
            <div>
              {(params.search || params.genre || params.tag) && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search Results</h2>
              )}
              <BookGrid books={books} />
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No books found</h3>
              <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or browse all books</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
