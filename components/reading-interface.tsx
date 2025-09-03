"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Bookmark,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  Menu,
  Play,
  Pause,
  Sun,
  Moon,
  Palette,
  X,
} from "lucide-react"
import { createClient } from "@/lib/neon/database"
import { useRouter } from "next/navigation"

interface ReadingInterfaceProps {
  book: {
    id: string
    title: string
    page_count: number
    authors: { name: string } | null
  }
  pages: {
    page_number: number
    content: string
    audio_url?: string
  }[]
  initialPage: number
  bookmarks: {
    page_number: number
    note?: string
    created_at: string
  }[]
  userId: string
}

export function ReadingInterface({ book, pages, initialPage, bookmarks, userId }: ReadingInterfaceProps) {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(initialPage - 1) // Convert to 0-based index
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [readingSettings, setReadingSettings] = useState({
    fontSize: 16,
    fontFamily: "serif",
    theme: "light",
    background: "cream",
    lineHeight: 1.6,
  })
  const [bookmarkNote, setBookmarkNote] = useState("")
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [readingStartTime, setReadingStartTime] = useState<number>(Date.now())

  const db = createClient()
  const currentPageData = pages[currentPage]
  const isBookmarked = bookmarks.some((b) => b.page_number === currentPageData?.page_number)

  // Save reading progress periodically
  const saveProgress = useCallback(async () => {
    if (!currentPageData) return

    const readingTime = Math.floor((Date.now() - readingStartTime) / 60000) // Convert to minutes

    await db.from("reading_progress").insert({
      user_id: userId,
      book_id: book.id,
      current_page: currentPageData.page_number,
      total_pages_read: currentPage + 1,
      reading_time_minutes: readingTime,
      last_read_at: new Date().toISOString(),
      is_completed: currentPage === pages.length - 1,
    }).execute()
  }, [currentPageData, currentPage, pages.length, readingStartTime, userId, book.id, db])

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000)
    return () => clearInterval(interval)
  }, [saveProgress])

  // Save progress when page changes
  useEffect(() => {
    saveProgress()
  }, [currentPage, saveProgress])

  // Save progress when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProgress()
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [saveProgress])

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const addBookmark = async () => {
    if (!currentPageData) return

    await db.from("bookmarks").insert({
      user_id: userId,
      book_id: book.id,
      page_number: currentPageData.page_number,
      note: bookmarkNote || null,
    }).execute()

    setBookmarkNote("")
    setShowBookmarkDialog(false)
    // Refresh bookmarks (in a real app, you'd update state)
    window.location.reload()
  }

  const removeBookmark = async () => {
    if (!currentPageData) return

    await db
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("book_id", book.id)
      .eq("page_number", currentPageData.page_number)
      .execute()

    // Refresh bookmarks (in a real app, you'd update state)
    window.location.reload()
  }

  const getThemeClasses = () => {
    const themes = {
      light: "bg-white text-gray-900",
      dark: "bg-gray-900 text-white",
      sepia: "bg-amber-50 text-amber-900",
    }
    return themes[readingSettings.theme as keyof typeof themes] || themes.light
  }

  const getBackgroundClasses = () => {
    const backgrounds = {
      white: "bg-white",
      cream: "bg-amber-50",
      gray: "bg-gray-100",
    }
    return backgrounds[readingSettings.background as keyof typeof backgrounds] || backgrounds.cream
  }

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevPage()
      } else if (e.key === "ArrowRight") {
        nextPage()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentPage, pages.length])

  if (!currentPageData) {
    return <div>Loading...</div>
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${getThemeClasses()}`}>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="font-semibold text-lg">{book.title}</h1>
              <p className="text-sm text-muted-foreground">by {book.authors?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Progress */}
            <span className="text-sm text-muted-foreground">
              {currentPageData.page_number} / {book.page_count}
            </span>

            {/* Menu Toggle */}
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
          <div
            className="bg-amber-600 h-1 transition-all duration-300"
            style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Reading Controls Sidebar */}
      {isMenuOpen && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-l shadow-lg z-40 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Reading Settings</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Font Size */}
              <div>
                <label className="text-sm font-medium mb-2 block">Font Size</label>
                <Slider
                  value={[readingSettings.fontSize]}
                  onValueChange={([value]) => setReadingSettings((prev) => ({ ...prev, fontSize: value }))}
                  min={12}
                  max={24}
                  step={1}
                  className="mb-2"
                />
                <span className="text-xs text-muted-foreground">{readingSettings.fontSize}px</span>
              </div>

              {/* Font Family */}
              <div>
                <label className="text-sm font-medium mb-2 block">Font Family</label>
                <div className="grid grid-cols-2 gap-2">
                  {["serif", "sans-serif", "monospace"].map((font) => (
                    <Button
                      key={font}
                      variant={readingSettings.fontFamily === font ? "default" : "outline"}
                      size="sm"
                      onClick={() => setReadingSettings((prev) => ({ ...prev, fontFamily: font }))}
                    >
                      {font}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Theme */}
              <div>
                <label className="text-sm font-medium mb-2 block">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "light", icon: Sun, label: "Light" },
                    { key: "dark", icon: Moon, label: "Dark" },
                    { key: "sepia", icon: Palette, label: "Sepia" },
                  ].map(({ key, icon: Icon, label }) => (
                    <Button
                      key={key}
                      variant={readingSettings.theme === key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setReadingSettings((prev) => ({ ...prev, theme: key }))}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Bookmarks */}
              <div>
                <h3 className="text-sm font-medium mb-2">Bookmarks</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {bookmarks.map((bookmark) => (
                    <Button
                      key={bookmark.page_number}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setCurrentPage(bookmark.page_number - 1)
                        setIsMenuOpen(false)
                      }}
                    >
                      <Bookmark className="h-4 w-4 mr-2" />
                      Page {bookmark.page_number}
                      {bookmark.note && <span className="ml-2 text-xs text-muted-foreground">📝</span>}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Area */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="relative">
          {/* Book Page */}
          <Card
            className={`${getBackgroundClasses()} shadow-2xl min-h-[600px] transition-all duration-500 transform hover:shadow-3xl`}
          >
            <div className="p-8 md:p-12">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Page {currentPageData.page_number}</span>
                <div className="flex items-center gap-2">
                  {/* Bookmark Button */}
                  {isBookmarked ? (
                    <Button variant="ghost" size="sm" onClick={removeBookmark}>
                      <Bookmark className="h-4 w-4 fill-amber-600 text-amber-600" />
                    </Button>
                  ) : (
                    <Dialog open={showBookmarkDialog} onOpenChange={setShowBookmarkDialog}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <BookmarkPlus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Bookmark</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">Bookmark page {currentPageData.page_number}</p>
                          <Textarea
                            placeholder="Add a note (optional)"
                            value={bookmarkNote}
                            onChange={(e) => setBookmarkNote(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Button onClick={addBookmark}>Add Bookmark</Button>
                            <Button variant="outline" onClick={() => setShowBookmarkDialog(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Audio Controls */}
                  {currentPageData.audio_url && (
                    <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}
                </div>
              </div>

              {/* Page Content */}
              <div
                className="prose prose-lg max-w-none leading-relaxed"
                style={{
                  fontSize: `${readingSettings.fontSize}px`,
                  fontFamily: readingSettings.fontFamily,
                  lineHeight: readingSettings.lineHeight,
                }}
              >
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{currentPageData.content}</p>
              </div>
            </div>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous Page
            </Button>

            <div className="flex items-center gap-2">
              {/* Page Dots */}
              <div className="flex gap-1">
                {pages.slice(Math.max(0, currentPage - 2), currentPage + 3).map((_, index) => {
                  const pageIndex = Math.max(0, currentPage - 2) + index
                  return (
                    <button
                      key={pageIndex}
                      onClick={() => setCurrentPage(pageIndex)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        pageIndex === currentPage ? "bg-amber-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )
                })}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={nextPage}
              disabled={currentPage === pages.length - 1}
              className="flex items-center gap-2 bg-transparent"
            >
              Next Page
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Keyboard Navigation */}
      <div className="fixed bottom-4 right-4 text-xs text-muted-foreground bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-lg">
        Use ← → arrow keys to navigate
      </div>
    </div>
  )
}
