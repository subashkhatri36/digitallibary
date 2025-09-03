import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SubscriptionPlans } from "@/components/subscription-plans"
import { CurrentSubscription } from "@/components/current-subscription"
import { BookOpen, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SubscriptionPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile with subscription info
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's transaction history
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      *,
      books(title, authors(name))
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

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
              <BookOpen className="h-8 w-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Manage Your Subscription</h2>
          <p className="text-gray-600 dark:text-gray-300">Choose the perfect plan for your reading journey</p>
        </div>

        {/* Current Subscription Status */}
        <CurrentSubscription profile={profile} transactions={transactions || []} />

        {/* Subscription Plans */}
        <SubscriptionPlans currentTier={profile?.subscription_tier || "free"} userId={user.id} />
      </div>
    </div>
  )
}
