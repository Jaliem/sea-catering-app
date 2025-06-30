"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface UserMenuProps {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export default function UserMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserMenuProps | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [pathname])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    setUser(null)
    router.push("/")
    router.refresh()
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut" as any,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15,
        ease: "easeIn" as any,
      },
    },
  }

  if (loading) {
    return null // or a spinner if you want
  }

  if (!user) {
    return (
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button asChild variant="ghost">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90">
            <Link href="/auth/register">Sign Up</Link>
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <motion.div whileHover={{ rotate: 5 }} transition={{ duration: 0.2 }}>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <AnimatePresence>
        <DropdownMenuContent className="w-56" align="end" forceMount asChild>
          <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="exit">
            <DropdownMenuLabel className="font-normal">
              <motion.div
                className="flex flex-col space-y-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                {user.role === "admin" && (
                  <motion.div
                    className="flex items-center gap-1 mt-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Shield className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">Admin</span>
                  </motion.div>
                )}
              </motion.div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <DropdownMenuItem asChild className="hover:bg-gray-50 cursor-pointer">
                <Link href="/profile" className="flex items-center">
                  <span className="mr-2 h-4 w-4">👤</span>
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="hover:bg-gray-50 cursor-pointer">
                <Link href="/subscription" className="flex items-center">
                  <span className="mr-2 h-4 w-4">📋</span>
                  <span>My Subscriptions</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="hover:bg-gray-50 cursor-pointer">
                <Link href="/settings" className="flex items-center">
                  <span className="mr-2 h-4 w-4">⚙️</span>
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              {user.role === "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="hover:bg-blue-50 cursor-pointer">
                    <Link href="/admin" className="flex items-center text-blue-600">
                      <span className="mr-2 h-4 w-4">🛡️</span>
                      <span>Admin Panel</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="hover:bg-red-50 cursor-pointer text-red-600 focus:text-red-600"
              >
                <span className="mr-2 h-4 w-4">🚪</span>
                <span>Log out</span>
              </DropdownMenuItem>
            </motion.div>
          </motion.div>
        </DropdownMenuContent>
      </AnimatePresence>
    </DropdownMenu>
  )
}
