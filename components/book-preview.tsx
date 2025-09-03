"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"

interface BookPreviewProps {
  book: {
    title: string
    preview_pages: number
    page_count: number
  }
  previewPages: {
    page_number: number
    content: string
  }[]
  hasFullAccess: boolean
}

export function BookPreview({ book, previewPages, hasFullAccess }: BookPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => {
    if (currentPage < previewPages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (!previewPages || previewPages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No preview available for this book.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Book Preview</CardTitle>
          <span className="text-sm text-muted-foreground">
            Page {previewPages[currentPage]?.page_number} of {hasFullAccess ? book.page_count : book.preview_pages}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {/* Page Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-4 min-h-[400px] shadow-inner border">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{previewPages[currentPage]?.content}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {previewPages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentPage ? "bg-amber-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === previewPages.length - 1}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Access Message */}
        {!hasFullAccess && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">Preview limited to {book.preview_pages} pages</span>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Purchase this book to read all {book.page_count} pages
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
