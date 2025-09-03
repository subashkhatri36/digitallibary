"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, ShoppingCart, Trash2, Star } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface WishlistTabProps {
  wishlist: {
    id: string
    added_at: string
    books: {
      id: string
      title: string
      description: string
      price: number
      average_rating: number
      total_ratings: number
      authors: { name: string } | null
      genres: { name: string } | null
    }
  }[]
  userId: string
}

export function WishlistTab({ wishlist, userId }: WishlistTabProps) {
  const supabase = createClient()

  const removeFromWishlist = async (bookId: string) => {
    await supabase.from("wishlist").delete().eq("user_id", userId).eq("book_id", bookId)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {wishlist.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Add books you want to read later to your wishlist
            </p>
            <Button asChild>
              <Link href="/browse">Browse Books</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => {
            const book = item.books

            return (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-[3/4] bg-gradient-to-br from-amber-100 to-orange-200 dark:from-amber-800 dark:to-orange-900 rounded-lg mb-4 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-amber-600" />
                  </div>

                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription>
                    <div>by {book.authors?.name || "Unknown Author"}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{book.genres?.name}</span>
                      {book.average_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">
                            {book.average_rating} ({book.total_ratings})
                          </span>
                        </div>
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{book.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-amber-600">${book.price}</span>
                    <Badge variant="outline">Wishlist</Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1" asChild>
                      <Link href={`/books/${book.id}`}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(book.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    Added {new Date(item.added_at).toLocaleDateString()}
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
