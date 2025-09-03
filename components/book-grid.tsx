import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Star, Sparkles, Heart, Zap } from "lucide-react"
import Link from "next/link"

interface Book {
  id: string
  title: string
  description: string
  price: number
  average_rating: number
  total_ratings: number
  is_featured: boolean
  is_trending: boolean
  is_new_release: boolean
  authors: { name: string } | null
  genres: { name: string } | null
  book_tags: { tag_name: string; tag_type: string }[]
}

interface BookGridProps {
  books: Book[]
}

export function BookGrid({ books }: BookGridProps) {
  const colors = [
    'bg-pink-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500'
  ]

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <Card key={book.id} className="card-clean hover:shadow-md">
          <CardHeader className="pb-4">
            {/* Book Cover Placeholder */}
            <div className={`aspect-[3/4] ${colors[index % colors.length]} rounded-lg mb-4 flex items-center justify-center relative`}>
              <BookOpen className="h-16 w-16 text-white" />

              {/* Status Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {book.is_featured && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {book.is_trending && (
                  <Badge variant="destructive" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {book.is_new_release && (
                  <Badge className="text-xs bg-green-600 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    New
                  </Badge>
                )}
              </div>
            </div>

            <CardTitle className="text-lg line-clamp-2">
              {book.title}
            </CardTitle>

            <CardDescription className="space-y-1">
              <div className="text-foreground/70">by {book.authors?.name || "Unknown Author"}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{book.genres?.name}</Badge>
                {book.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-600">
                      {book.average_rating} ({book.total_ratings})
                    </span>
                  </div>
                )}
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0">
            <p className="text-sm text-foreground/70 mb-4 line-clamp-3">{book.description}</p>

            {/* Tags */}
            {book.book_tags && book.book_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {book.book_tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="outline" className="text-xs">
                    <Heart className="h-2 w-2 mr-1 text-pink-500" />
                    {tag.tag_name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-green-600">${book.price}</span>
              <Button size="sm" asChild>
                <Link href={`/books/${book.id}`}>Preview</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
