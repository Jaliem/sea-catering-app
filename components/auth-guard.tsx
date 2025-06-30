"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Utensils, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export default function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
          // Check authorization
          if (requireAdmin && data.user.role !== "admin") {
            setIsAuthorized(false)
          } else if (requireAuth && !data.user) {
            setIsAuthorized(false)
          } else {
            setIsAuthorized(true)
          }
        } else {
          setUser(null)
          setIsAuthorized(!requireAuth && !requireAdmin)
        }
      } catch (error) {
        setUser(null)
        setIsAuthorized(!requireAuth && !requireAdmin)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [requireAuth, requireAdmin])

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      if (requireAuth && !user) {
        // Redirect to login if authentication is required
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
      } else if (requireAdmin && user?.role !== "admin") {
        // Redirect to home if admin access is required but user is not admin
        router.push("/")
      }
    }
  }, [isLoading, isAuthorized, requireAuth, requireAdmin, user, router, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8 text-white animate-pulse" />
            </div>
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthorized) {
    if (requireAdmin && user?.role !== "admin") {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-6">
                You don't have permission to access this page. Admin privileges are required.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity duration-200"
              >
                Go to Home
              </button>
            </CardContent>
          </Card>
        </div>
      )
    }

    return null // Will redirect to login
  }

  return <>{children}</>
}
