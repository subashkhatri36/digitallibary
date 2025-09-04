import { sql } from "@/lib/neon/client"
import { requireAuth } from "@/lib/auth"
import { LibraryTabs } from "@/components/library-tabs"
import { ReadingStats } from "@/components/reading-stats"
import { BookOpen, ArrowLeft, Sparkles, Heart, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AIRecommendations } from "@/components/ai-recommendations"
import { getPersonalizedRecommendations, getTrendingBooks } from "@/lib/ai-recommendations"

export default async function LibraryPage() {
  // Get authenticated user
  const user = await requireAuth()

  // Get user's library books
  const libraryBooks = await sql`
    SELECT ul.*, b.id, b.title, a.name as author, b.cover_url as cover_image, b.description, b.price,
           b.publication_date, b.isbn, b.page_count
    FROM user_library ul
    JOIN books b ON ul.book_id = b.id
    LEFT JOIN authors a ON b.author_id = a.id
    WHERE ul.user_id = ${user.id}
  `

  // Get reading progress
  const readingProgress = await sql`
    SELECT rp.*, b.title, b.page_count, a.name as author
    FROM reading_progress rp
    JOIN books b ON rp.book_id = b.id
    LEFT JOIN authors a ON b.author_id = a.id
    WHERE rp.user_id = ${user.id}
  `

  // Get user's reading lists
  const readingLists = await sql`
    SELECT rl.*, 
           COALESCE(
             json_agg(
               json_build_object(
                 'id', b.id,
                 'title', b.title,
                 'author', a.name,
                 'cover_image', b.cover_url
               )
             ) FILTER (WHERE b.id IS NOT NULL), 
             '[]'::json
           ) as books
    FROM reading_lists rl
    LEFT JOIN reading_list_items rli ON rl.id = rli.list_id
    LEFT JOIN books b ON rli.book_id = b.id
    LEFT JOIN authors a ON b.author_id = a.id
    WHERE rl.user_id = ${user.id}
    GROUP BY rl.id
  `

  // Get user's wishlist
  const wishlist = await sql`
    SELECT w.*, b.id, b.title, a.name as author, b.cover_url as cover_image, b.price
    FROM wishlist w
    JOIN books b ON w.book_id = b.id
    LEFT JOIN authors a ON b.author_id = a.id
    WHERE w.user_id = ${user.id}
  `

  // Get user profile for stats
  const profile = await sql`
    SELECT * FROM profiles WHERE id = ${user.id}
  `

  const [personalizedBooks, trendingBooks] = await Promise.all([
    getPersonalizedRecommendations(user.id, 6),
    getTrendingBooks(6),
  ])

  return (
    <div className="min-h-screen animate-gradient" style={{background: 'var(--background)'}}>
      {/* Header */}
      <header className="border-b glass-effect backdrop-blur-md sticky top-0 z-50 animate-slide-up">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hover-lift glass-effect animate-bounce-in btn-ripple btn-magnetic">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2 animate-float icon-spin-hover" />
                Home
              </Link>
            </Button>
            <div className="flex items-center gap-2 animate-slide-up">
              <div className="relative">
                <BookOpen className="h-8 w-8 text-primary animate-float" />
                <Heart className="h-4 w-4 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-shimmer">My Library</h1>
            </div>
          </div>
          <Button asChild className="hover-glow animate-gradient hover-lift btn-ripple btn-magnetic">
            <Link href="/browse">
              <Search className="h-4 w-4 mr-2 animate-rotate icon-spin-hover" />
              Browse Books
            </Link>
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-8 w-8 text-yellow-500 animate-pulse" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-shimmer">
              Welcome back, {profile[0]?.display_name || "Reader"}!
            </h2>
            <Sparkles className="h-6 w-6 text-purple-500 animate-bounce" />
          </div>
          <p className="text-foreground/70 text-lg flex items-center gap-2">
            <Heart className="h-4 w-4 text-pink-500 animate-pulse" />
            Continue your reading journey or discover something new
          </p>
        </div>

        {/* Reading Stats */}
        <ReadingStats
           profile={profile[0] as any}
           readingProgress={readingProgress as any || []}
           totalBooks={libraryBooks?.length || 0}
         />

        <div className="mb-8">
          <AIRecommendations personalizedBooks={personalizedBooks} trendingBooks={trendingBooks} userId={user.id} />
        </div>

        {/* Library Tabs */}
        <LibraryTabs
          libraryBooks={libraryBooks || []}
          readingProgress={readingProgress || []}
          readingLists={readingLists || []}
          wishlist={wishlist || []}
          userId={user.id}
        />
      </div>
    </div>
  )
}
