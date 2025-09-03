import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, DollarSign, TrendingUp, Plus, Settings } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
  const { supabase } = await requireAdmin()

  // Fetch dashboard metrics
  const [{ count: totalBooks }, { count: totalUsers }, { data: recentTransactions }, { data: popularBooks }] =
    await Promise.all([
      supabase.from("books").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("transactions").select("amount").eq("status", "completed").limit(100),
      supabase
        .from("books")
        .select("title, total_ratings, average_rating")
        .order("total_ratings", { ascending: false })
        .limit(5),
    ])

  const totalRevenue = recentTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your digital library platform</p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/admin/books/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Book
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/admin/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBooks || 0}</div>
              <p className="text-xs text-muted-foreground">Books in library</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All-time revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Popular Books</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{popularBooks?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Highly rated books</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Management</CardTitle>
              <CardDescription>Add, edit, and organize your book collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/books">Manage Books</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/admin/authors">Manage Authors</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/admin/genres">Manage Genres</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Monitor users and subscriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/users">View Users</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/admin/subscriptions">Subscriptions</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/admin/transactions">Transactions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content & Analytics</CardTitle>
              <CardDescription>Monitor engagement and moderate content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/admin/analytics">View Analytics</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/admin/reviews">Moderate Reviews</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/admin/ai-tools">AI Tools</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
