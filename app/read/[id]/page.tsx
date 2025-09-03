import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ReadingInterface } from "@/components/reading-interface"

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get book details
  const { data: book, error } = await supabase
    .from("books")
    .select(`
      *,
      authors(name),
      genres(name)
    `)
    .eq("id", id)
    .single()

  if (error || !book) {
    notFound()
  }

  // Check if user has access to this book
  const { data: userLibrary } = await supabase
    .from("user_library")
    .select("access_type")
    .eq("user_id", user.id)
    .eq("book_id", id)
    .single()

  const hasAccess = userLibrary?.access_type === "purchased" || userLibrary?.access_type === "subscription"

  if (!hasAccess) {
    redirect(`/books/${id}`)
  }

  // Get all book pages
  const { data: pages } = await supabase
    .from("book_pages")
    .select("page_number, content, audio_url")
    .eq("book_id", id)
    .order("page_number")

  // Get user's reading progress
  const { data: progress } = await supabase
    .from("reading_progress")
    .select("current_page, reading_time_minutes, last_read_at")
    .eq("user_id", user.id)
    .eq("book_id", id)
    .single()

  // Get user's bookmarks for this book
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("page_number, note, created_at")
    .eq("user_id", user.id)
    .eq("book_id", id)
    .order("page_number")

  return (
    <ReadingInterface
      book={book}
      pages={pages || []}
      initialPage={progress?.current_page || 1}
      bookmarks={bookmarks || []}
      userId={user.id}
    />
  )
}
