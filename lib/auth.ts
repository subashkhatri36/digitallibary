import { cookies } from "next/headers"
import { sql } from "./neon/client"
import { redirect } from "next/navigation"
import crypto from "crypto"

export interface User {
  id: string
  email: string
  display_name: string
  subscription_tier: string
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (!sessionId) return null

  try {
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `

    if (!tableCheck[0]?.exists) {
      console.log("[v0] Database tables not set up yet")
      return null
    }

    const result = await sql`
      SELECT u.id, u.email, p.display_name, p.subscription_tier
      FROM users u
      JOIN profiles p ON u.id = p.id
      WHERE u.session_id = ${sessionId}
      AND u.session_expires > NOW()
    `

    return (result[0] as User) || null
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function requireAdmin(): Promise<User> {
  const user = await requireAuth()
  if (user.subscription_tier !== "admin") {
    redirect("/")
  }
  return user
}

export async function signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `

    if (!tableCheck[0]?.exists) {
      return { success: false, error: "Database not set up yet. Please contact administrator." }
    }

    // Simple password check (in production, use proper hashing)
    const result = await sql`
      SELECT id FROM users 
      WHERE email = ${email} AND password = crypt(${password}, password)
    `

    if (result.length === 0) {
      return { success: false, error: "Invalid credentials" }
    }

    // Create session
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await sql`
      UPDATE users 
      SET session_id = ${sessionId}, session_expires = ${expiresAt}
      WHERE id = ${result[0].id}
    `

    const cookieStore = await cookies()
    cookieStore.set("session_id", sessionId, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    return { success: false, error: "Sign in failed" }
  }
}

export async function signUp(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `

    if (!tableCheck[0]?.exists) {
      return { success: false, error: "Database not set up yet. Please contact administrator." }
    }

    const userId = crypto.randomUUID()
    const sessionId = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Create user
    await sql`
      INSERT INTO users (id, email, password, session_id, session_expires)
      VALUES (${userId}, ${email}, crypt(${password}, gen_salt('bf')), ${sessionId}, ${expiresAt})
    `

    // Create profile
    await sql`
      INSERT INTO profiles (id, display_name, subscription_tier)
      VALUES (${userId}, ${email.split("@")[0]}, 'free')
    `

    const cookieStore = await cookies()
    cookieStore.set("session_id", sessionId, {
      expires: expiresAt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return { success: true }
  } catch (error) {
    console.error("Sign up error:", error)
    return { success: false, error: "Sign up failed" }
  }
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value

  if (sessionId) {
    try {
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'users'
        )
      `

      if (tableCheck[0]?.exists) {
        await sql`UPDATE users SET session_id = NULL, session_expires = NULL WHERE session_id = ${sessionId}`
      }
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  cookieStore.delete("session_id")
}
