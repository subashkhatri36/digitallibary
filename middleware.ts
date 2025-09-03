import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow public routes
  const publicPaths = ["/auth/login", "/auth/sign-up", "/api/auth", "/", "/browse", "/books"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check for session cookie
  const sessionId = request.cookies.get("session_id")?.value

  if (!sessionId) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
