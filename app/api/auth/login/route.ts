import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/neon/database"
import { signIn } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 })
    }

    const result = await signIn(email, password)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
