import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"

export default async function TransactionsPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      books(title, authors(name))
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const totalSpent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/library">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <CreditCard className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Spending Summary</CardTitle>
            <CardDescription>Your total spending on LibraryFlow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">${totalSpent.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">{transactions?.length || 0} transactions</p>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <div className="space-y-4">
          {!transactions || transactions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No transactions yet</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
                  Your purchase history will appear here
                </p>
                <Button asChild>
                  <Link href="/browse">Browse Books</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                      {transaction.transaction_type === "book_purchase" ? (
                        <BookOpen className="h-5 w-5 text-amber-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {transaction.transaction_type === "book_purchase"
                          ? transaction.books?.title || "Book Purchase"
                          : transaction.transaction_type === "subscription"
                            ? "Subscription Payment"
                            : "Gift Purchase"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction.books?.authors?.name && `by ${transaction.books.authors.name} • `}
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold">${Number(transaction.amount).toFixed(2)}</div>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "secondary"
                          : transaction.status === "pending"
                            ? "outline"
                            : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
