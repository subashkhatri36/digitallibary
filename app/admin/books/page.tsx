import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Eye, BookOpen } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function AdminBooks() {
  const { supabase } = await requireAdmin()

  const { data: books } = await supabase
    .from("books")
    .select(`
      *,
      authors(name),
      genres(name),
      book_tags(tag_name, tag_type)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Book Management</h1>
              <p className="text-muted-foreground">Manage your book collection</p>
            </div>
            <Button asChild>
              <Link href="/admin/books/new">
                <Plus className="w-4 h-4 mr-2" />
                Add New Book
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search books by title, author, or ISBN..." className="pl-10" />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </CardContent>
        </Card>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books?.map((book) => (
            <Card key={book.id} className="overflow-hidden">
              <div className="aspect-[3/4] relative bg-muted">
                {book.cover_url ? (
                  <Image src={book.cover_url || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-muted-foreground">No Cover</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">by {book.authors?.name || "Unknown Author"}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{book.genres?.name}</Badge>
                    {book.is_premium && <Badge variant="outline">Premium</Badge>}
                    {book.is_featured && <Badge>Featured</Badge>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>${book.price}</span>
                    <span>{book.page_count} pages</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/books/${book.id}`}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/books/${book.id}/edit`}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!books?.length && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No books found</h3>
              <p className="text-muted-foreground mb-4">Start building your library by adding your first book.</p>
              <Button asChild>
                <Link href="/admin/books/new">Add Your First Book</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
