import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Calendar, CreditCard, Gift } from "lucide-react"
import Link from "next/link"

interface CurrentSubscriptionProps {
  profile: {
    subscription_tier: string
    subscription_expires_at: string | null
  } | null
  transactions: {
    id: string
    transaction_type: string
    amount: number
    status: string
    created_at: string
    books: { title: string; authors: { name: string } | null } | null
  }[]
}

export function CurrentSubscription({ profile, transactions }: CurrentSubscriptionProps) {
  const isSubscribed = profile?.subscription_tier && profile.subscription_tier !== "free"
  const expiresAt = profile?.subscription_expires_at ? new Date(profile.subscription_expires_at) : null
  const isExpired = expiresAt && expiresAt < new Date()

  const getTierDisplay = (tier: string) => {
    switch (tier) {
      case "premium":
        return { name: "Premium", color: "bg-amber-600" }
      case "annual":
        return { name: "Premium Plus", color: "bg-purple-600" }
      default:
        return { name: "Free", color: "bg-gray-600" }
    }
  }

  const tierInfo = getTierDisplay(profile?.subscription_tier || "free")

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-amber-600" />
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>Your subscription status</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={tierInfo.color}>{tierInfo.name}</Badge>
            {isExpired && <Badge variant="destructive">Expired</Badge>}
          </div>

          {isSubscribed && expiresAt && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {isExpired ? "Expired on" : "Renews on"} {expiresAt.toLocaleDateString()}
            </div>
          )}

          {!isSubscribed && (
            <p className="text-sm text-muted-foreground">
              Upgrade to Premium to unlock unlimited reading and advanced features
            </p>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/subscription">{isSubscribed ? "Manage Plan" : "Upgrade Now"}</Link>
            </Button>
            {isSubscribed && (
              <Button variant="outline" size="sm">
                <Gift className="h-4 w-4 mr-2" />
                Gift Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CreditCard className="h-6 w-6 text-amber-600" />
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your purchase history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {transaction.transaction_type === "book_purchase"
                        ? transaction.books?.title || "Book Purchase"
                        : transaction.transaction_type === "subscription"
                          ? "Subscription"
                          : "Gift"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${transaction.amount}</div>
                    <Badge
                      variant={transaction.status === "completed" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {transactions.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full">
                  View All Transactions
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
