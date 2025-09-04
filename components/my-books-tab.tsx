"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Play, Trash2 } from "lucide-react"
// Database operations moved to server actions
import Link from "next/link"

interface MyBooksTabProps {
  libraryBooks: {
    id: string
    access_type: string
    purchased_at: string
    books: {
      id: string
      title: string
      price: number
      authors: { name: string } | null
      genres: { name: string } | null
    }
  }[]
  readingProgress: {
    book_id: string
    current_page: number
    is_completed: boolean
    books: {
      title: string
      page_count: number
    }
  }[]
  userId: string
}

export function MyBooksTab({ libraryBooks, readingProgress, userId }: MyBooksTabProps) {
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const getProgress = (bookId: string) => {
    return readingProgress.find((p) => p.book_id === bookId)
  }

  const removeBook = async (bookId: string) => {
    // TODO: Implement server action for removing books
    console.log('Remove book functionality needs server action implementation')
    // window.location.reload()
  }

  const filteredBooks = libraryBooks.filter((book) => {
    if (filter === "all") return true
    if (filter === "reading") {
      const progress = getProgress(book.books.id)
      return progress && !progress.is_completed
    }
    if (filter === "completed") {
      const progress = getProgress(book.books.id)
      return progress && progress.is_completed
    }
    if (filter === "purchased") return book.access_type === "purchased"
    if (filter === "subscription") return book.access_type === "subscription"
    return true
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.purchased_at).getTime() - new Date(a.purchased_at).getTime()
    }
    if (sortBy === "title") {
      return a.books.title.localeCompare(b.books.title)
    }
    if (sortBy === "author") {
      return (a.books.authors?.name || "").localeCompare(b.books.authors?.name || "")
    }
    return 0
  })

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="reading">Currently Reading</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="purchased">Purchased</SelectItem>
            <SelectItem value="subscription">Subscription</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently Added</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="author">Author A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Books Grid */}
      {sortedBooks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No books found</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              {filter === "all"
                ? "Your library is empty. Start by browsing our collection!"
                : "No books match your current filter. Try adjusting your selection."}
            </p>
            <Button asChild>
              <Link href="/browse">Browse Books</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBooks.map((item) => {
            const book = item.books
            const progress = getProgress(book.id)
            const progressPercent = progress ? (progress.current_page / progress.books.page_count) * 100 : 0

            return (
              <Card key={item.id} className="card-clean hover:shadow-md">
                <CardHeader>
                  <div className="aspect-[3/4] bg-amber-500 rounded-lg mb-4 flex items-center justify-center relative">
                    <BookOpen className="h-16 w-16 text-amber-600" />

                    {/* Access Type Badge */}
                    <Badge
                      className="absolute top-2 left-2"
                      variant={item.access_type === "purchased" ? "default" : "secondary"}
                    >
                      {item.access_type === "purchased" ? "Owned" : "Subscription"}
                    </Badge>

                    {/* Completion Badge */}
                    {progress?.is_completed && <Badge className="absolute top-2 right-2 bg-green-600">Completed</Badge>}
                  </div>

                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription>by {book.authors?.name || "Unknown Author"}</CardDescription>

                  {/* Reading Progress */}
                  {progress && !progress.is_completed && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        Page {progress.current_page} of {progress.books.page_count}
                      </p>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/read/${book.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {progress?.is_completed ? "Read Again" : progress ? "Continue" : "Start Reading"}
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Management Actions */}
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      Added {new Date(item.purchased_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBook(book.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
