import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BookRecommendation } from "@/lib/ai-recommendations"

interface AIRecommendationsProps {
  personalizedBooks: BookRecommendation[]
  trendingBooks: any[]
  userId?: string
}

export function AIRecommendations({ personalizedBooks, trendingBooks, userId }: AIRecommendationsProps) {
  return (
    <div className="space-y-8">
      {/* Personalized Recommendations */}
      {userId && personalizedBooks.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <CardTitle>Recommended for You</CardTitle>
            </div>
            <CardDescription>AI-powered recommendations based on your reading history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalizedBooks.slice(0, 6).map(({ book, reason }) => (
                <div key={book.id} className="group relative">
                  <Link href={`/books/${book.id}`}>
                    <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden mb-3">
                      <Image
                        src={book.cover_url || "/placeholder.svg?height=400&width=300&query=book cover"}
                        alt={book.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">by {book.authors?.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {reason}
                    </Badge>
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/browse?ai=true">
                  <Sparkles className="w-4 h-4 mr-2" />
                  More AI Recommendations
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trending Books */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <CardTitle>Trending Now</CardTitle>
          </div>
          <CardDescription>Popular books that readers are loving right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingBooks.slice(0, 6).map((book) => (
              <div key={book.id} className="group relative">
                <Link href={`/books/${book.id}`}>
                  <div className="aspect-[3/4] relative bg-muted rounded-lg overflow-hidden mb-3">
                    <Image
                      src={book.cover_url || "/placeholder.svg?height=400&width=300&query=book cover"}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {book.is_trending && <Badge className="absolute top-2 right-2 bg-orange-500">Trending</Badge>}
                  </div>
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">by {book.author_name || 'Unknown Author'}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {book.genres?.name || 'Fiction'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">★ {book.average_rating ? Number(book.average_rating).toFixed(1) : "N/A"}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
