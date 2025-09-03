"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MyBooksTab } from "@/components/my-books-tab"
import { ReadingListsTab } from "@/components/reading-lists-tab"
import { WishlistTab } from "@/components/wishlist-tab"
import { BookOpen, List, Heart } from "lucide-react"

interface LibraryTabsProps {
  libraryBooks: any[]
  readingProgress: any[]
  readingLists: any[]
  wishlist: any[]
  userId: string
}

export function LibraryTabs({ libraryBooks, readingProgress, readingLists, wishlist, userId }: LibraryTabsProps) {
  return (
    <Tabs defaultValue="my-books" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="my-books" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          My Books ({libraryBooks.length})
        </TabsTrigger>
        <TabsTrigger value="reading-lists" className="flex items-center gap-2">
          <List className="h-4 w-4" />
          Reading Lists ({readingLists.length})
        </TabsTrigger>
        <TabsTrigger value="wishlist" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          Wishlist ({wishlist.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-books">
        <MyBooksTab libraryBooks={libraryBooks} readingProgress={readingProgress} userId={userId} />
      </TabsContent>

      <TabsContent value="reading-lists">
        <ReadingListsTab readingLists={readingLists} userId={userId} />
      </TabsContent>

      <TabsContent value="wishlist">
        <WishlistTab wishlist={wishlist} userId={userId} />
      </TabsContent>
    </Tabs>
  )
}
