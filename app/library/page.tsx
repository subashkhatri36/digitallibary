import { createServerClient } from "@/lib/neon/database"
import { redirect } from "next/navigation"
import { LibraryTabs } from "@/components/library-tabs"
import { ReadingStats } from "@/components/reading-stats"
import { BookOpen, ArrowLeft, Sparkles, Heart, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AIRecommendations } from "@/components/ai-recommendations"
import { getPersonalizedRecommendations, getTrendingBooks } from "@/lib/ai-recommendations"

export default async function LibraryPage() {
  const db = await createServerClient()

  // Get user
  const {
    data: userData,
    error: authError,
  } = await db.auth.getUser()

  if (authError || !userData?.user) {
    redirect("/auth/login")
  }

  // Get user's library books
  const libraryBooks = await db
    .from("user_library")
    .select(`
      *,
      books(
        id, title, author, cover_image, description, price,
        publication_date, isbn, page_count, language, publisher
      )
    `)
    .eq("user_id", userData.user.id)
    .execute()

  // Get reading progress
  const readingProgress = await db
    .from("reading_progress")
    .select(`
      *,
      books(title, page_count, authors(name))
    `)
    .eq("user_id", userData.user.id)
    .execute()

  // Get user's reading lists
  const readingLists = await db
    .from("reading_lists")
    .select(`
      *,
      reading_list_books(
        book_id,
        books(
          id, title, author, cover_image
        )
      )
    `)
    .eq("user_id", userData.user.id)
    .execute()

  // Get wishlist
  const wishlist = await db
    .from("wishlist")
    .select(`
      *,
      books(
        id, title, author, cover_image, description, price
      )
    `)
    .eq("user_id", userData.user.id)
    .execute()

  // Get user profile for stats
  const { data: profile } = await db.from("profiles").select("*").eq("id", userData.user.id).single()

  const [personalizedBooks, trendingBooks] = await Promise.all([
    getPersonalizedRecommendations(userData.user.id, 6),
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
              Welcome back, {profile?.display_name || "Reader"}!
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
          profile={profile}
          readingProgress={readingProgress || []}
          totalBooks={libraryBooks?.length || 0}
        />

        <div className="mb-8">
          <AIRecommendations personalizedBooks={personalizedBooks} trendingBooks={trendingBooks} userId={userData.user.id} />
        </div>

        {/* Library Tabs */}
        <LibraryTabs
          libraryBooks={libraryBooks || []}
          readingProgress={readingProgress || []}
          readingLists={readingLists || []}
          wishlist={wishlist || []}
          userId={userData.user.id}
        />
      </div>
    </div>
  )
}
