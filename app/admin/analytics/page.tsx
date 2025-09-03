import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BookOpen, DollarSign, Eye, Star } from "lucide-react"

export default async function AdminAnalytics() {
  const { supabase } = await requireAdmin()

  // Fetch analytics data
  const [{ data: popularBooks }, { data: recentTransactions }, { data: userStats }, { data: readingProgress }] =
    await Promise.all([
      supabase
        .from("books")
        .select("title, total_ratings, average_rating, authors(name)")
        .order("total_ratings", { ascending: false })
        .limit(10),
      supabase
        .from("transactions")
        .select("amount, transaction_type, created_at")
        .eq("status", "completed")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("profiles")
        .select("subscription_tier, total_books_read, reading_streak")
        .neq("subscription_tier", "admin"),
      supabase
        .from("reading_progress")
        .select("book_id, current_page, total_pages_read, is_completed, books(title, page_count)")
        .order("last_read_at", { ascending: false })
        .limit(20),
    ])

  // Calculate metrics
  const totalRevenue = recentTransactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
  const monthlyRevenue =
    recentTransactions
      ?.filter((t) => new Date(t.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      .reduce((sum, t) => sum + Number(t.amount), 0) || 0

  const subscriptionStats =
    userStats?.reduce(
      (acc, user) => {
        acc[user.subscription_tier] = (acc[user.subscription_tier] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  const avgBooksRead = userStats?.reduce((sum, user) => sum + user.total_books_read, 0) / (userStats?.length || 1) || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform performance and user engagement</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">All-time earnings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${monthlyRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Books/User</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgBooksRead.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Books read per user</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>User subscription tiers breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(subscriptionStats).map(([tier, count]) => (
                <div key={tier} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={tier === "free" ? "secondary" : "default"}>
                      {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{count} users</span>
                  </div>
                  <Progress value={(count / (userStats?.length || 1)) * 100} className="w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Books</CardTitle>
            <CardDescription>Books with highest ratings and engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks?.slice(0, 5).map((book, index) => (
                <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">by {book.authors?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{book.average_rating?.toFixed(1) || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>{book.total_ratings}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reading Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reading Activity</CardTitle>
            <CardDescription>Latest user reading progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {readingProgress?.slice(0, 8).map((progress) => (
                <div key={progress.book_id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <h5 className="font-medium text-sm">{progress.books?.title}</h5>
                    <p className="text-xs text-muted-foreground">
                      Page {progress.current_page} of {progress.books?.page_count}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={((progress.current_page || 0) / (progress.books?.page_count || 1)) * 100}
                      className="w-16"
                    />
                    {progress.is_completed && (
                      <Badge variant="outline" className="text-xs">
                        Completed
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
