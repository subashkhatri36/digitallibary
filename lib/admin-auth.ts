import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).single()

  if (!profile || profile.subscription_tier !== "admin") {
    redirect("/")
  }

  return { user, supabase }
}

export async function isAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).single()

  return profile?.subscription_tier === "admin"
}
