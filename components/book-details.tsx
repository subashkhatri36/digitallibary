"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Star, Heart, ShoppingCart, Play, Gift } from "lucide-react"
import { PaymentDialog } from "@/components/payment-dialog"
import { createClient } from "@/lib/neon/database"
import Link from "next/link"

interface BookDetailsProps {
  book: {
    id: string
    title: string
    description: string
    price: number
    average_rating: number
    total_ratings: number
    page_count: number
    preview_pages: number
    is_premium: boolean
    subscription_discount: number
    authors: { name: string; bio?: string } | null
    genres: { name: string } | null
    book_tags: { tag_name: string; tag_type: string }[]
    book_reviews: { rating: number; review_text: string; profiles: { display_name: string } }[]
  }
  hasFullAccess: boolean
  userTier?: string
}

export function BookDetails({ book, hasFullAccess, userTier = "free" }: BookDetailsProps) {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [showWishlistDialog, setShowWishlistDialog] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const db = createClient()

  const bookTags = book.book_tags || []
  const bookReviews = book.book_reviews || []

  const moodTags = bookTags.filter((tag) => tag.tag_type === "mood")
  const topicTags = bookTags.filter((tag) => tag.tag_type === "topic")
  const themeTags = bookTags.filter((tag) => tag.tag_type === "theme")

  // Calculate discounted price for subscribers
  const discountedPrice = userTier !== "free" ? book.price * (1 - book.subscription_discount / 100) : book.price
  const savings = book.price - discountedPrice

  const addToWishlist = async () => {
    const {
      data: userData,
    } = await db.auth.getUser()
    if (!userData?.user) return

    await db.from("wishlist").insert({
      user_id: userData.user.id,
      book_id: book.id,
    }).execute()
    setIsInWishlist(true)
  }

  return (
    <div className="space-y-6">
      {/* Main Book Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-24 h-32 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-12 w-12 text-amber-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{book.title}</CardTitle>
              <CardDescription className="text-base">by {book.authors?.name || "Unknown Author"}</CardDescription>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">{book.genres?.name}</span>
                {book.average_rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {book.average_rating} ({book.total_ratings} reviews)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{book.description}</p>

          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-6">
            <div>Pages: {book.page_count}</div>
            <div>Preview: {book.preview_pages} pages</div>
            <div>Price: ${book.price}</div>
            <div>Type: {book.is_premium ? "Premium" : "Standard"}</div>
          </div>

          {/* Pricing */}
          {!hasFullAccess && (
            <div className="bg-amber-50 dark:bg-amber-950 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    ${discountedPrice.toFixed(2)}
                  </div>
                  {savings > 0 && (
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                      <span className="line-through">${book.price}</span> • Save ${savings.toFixed(2)} with subscription
                    </div>
                  )}
                </div>
                {userTier === "free" && book.subscription_discount > 0 && (
                  <Badge variant="secondary">{book.subscription_discount}% off for subscribers</Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {hasFullAccess ? (
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <Link href={`/read/${book.id}`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Now
                  </Link>
                </Button>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Listen
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => setShowPaymentDialog(true)}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy for ${discountedPrice.toFixed(2)}
                  </Button>
                  <Button variant="outline" size="icon" onClick={addToWishlist} disabled={isInWishlist}>
                    <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>

                {/* Gift Option */}
                <Button variant="outline" className="w-full bg-transparent">
                  <Gift className="h-4 w-4 mr-2" />
                  Gift This Book
                </Button>

                {/* Subscription Upsell */}
                {userTier === "free" && (
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      Get unlimited access to all books with a subscription
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/subscription">View Plans</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {(moodTags.length > 0 || topicTags.length > 0 || themeTags.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {moodTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Mood</h4>
                <div className="flex flex-wrap gap-2">
                  {moodTags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.tag_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {topicTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {topicTags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag.tag_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {themeTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {themeTags.map((tag, index) => (
                    <Badge key={index}>{tag.tag_name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Author Info */}
      {book.authors?.bio && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About the Author</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">{book.authors.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      {bookReviews && bookReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reader Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookReviews.slice(0, 3).map((review, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.profiles.display_name}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{review.review_text}</p>
                {index < bookReviews.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        planId=""
        isAnnual={false}
        userId=""
        currentTier={userTier}
        bookId={book.id}
        bookPrice={discountedPrice}
      />
    </div>
  )
}
