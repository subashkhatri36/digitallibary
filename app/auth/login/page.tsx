"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (result.success) {
        router.push("/library")
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = async (userType: 'admin' | 'user') => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/quick-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userType }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/library')
      } else {
        setError(data.error || 'Quick login failed')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full hover-glow animate-gradient hover-lift" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span className="animate-pulse">Logging in...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2 animate-float" />
                        Login
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </form>

              {/* Development-only quick login buttons */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center mb-4">
                    Development Quick Login
                  </p>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleQuickLogin('admin')}
                      disabled={isLoading}
                    >
                      Quick Login as Admin
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleQuickLogin('user')}
                      disabled={isLoading}
                    >
                      Quick Login as User
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
