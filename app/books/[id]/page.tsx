import { createServerClient } from "@/lib/neon/database"
import { BookPreview } from "@/components/book-preview"
import { BookDetails } from "@/components/book-details"
import { BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const db = await createServerClient()

  // Get book details
  const { data: book, error } = await db
    .from("books")
    .select(
      `
      *,
      book_tags (
        id,
        name,
        color
      )
    `
    )
    .eq("id", id)
    .single()

  if (error || !book) {
    notFound()
  }

  // Get user if authenticated
  const {
    data: userData,
  } = await db.auth.getUser()

  let userLibrary = null
  let readingProgress = null
  let bookmarks = null

  if (userData?.user) {
    // Check if book is in user's library
    const { data: library } = await db
      .from("user_library")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("book_id", id)
      .single()

    userLibrary = library

    // Get reading progress
    const { data: progress } = await db
      .from("reading_progress")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("book_id", id)
      .single()

    readingProgress = progress

    // Get bookmarks
    const bookmarkData = await db
      .from("bookmarks")
      .select("*")
      .eq("user_id", userData.user.id)
      .eq("book_id", id)
      .order("page_number")
      .execute()

    bookmarks = bookmarkData
  }

  const hasFullAccess = !!userLibrary



  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/browse">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Browse
              </Link>
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">LibraryFlow</h1>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Book Details */}
          <BookDetails 
             book={book} 
             hasFullAccess={hasFullAccess}
           />

           {/* Book Preview */}
            <BookPreview 
              book={book} 
              hasFullAccess={hasFullAccess}
              previewPages={[]}
            />
        </div>
      </div>
    </div>
  )
}
