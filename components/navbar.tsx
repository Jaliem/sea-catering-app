"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Utensils, X } from "lucide-react"
import { cn } from "@/lib/utils"
import UserMenu from "@/components/user-menu"
import { motion, AnimatePresence } from "framer-motion"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Subscription", href: "/subscription", requireAuth: true },
  { name: "Contact Us", href: "/contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as any,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const logoVariants = {
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  const linkVariants = {
    hover: {
      y: -2,
      transition: { duration: 0.2 },
    },
    tap: {
      y: 0,
      transition: { duration: 0.1 },
    },
  }

  const underlineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 0.3 },
    },
  }

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm"
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <motion.div variants={itemVariants}>
          <Link href="/" className="flex items-center space-x-2">
            <motion.div variants={logoVariants} whileHover="hover" whileTap="tap">
              <motion.div className="p-1" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <Utensils className="h-6 w-6 text-emerald-600" />
              </motion.div>
            </motion.div>
            <motion.span
              className="text-xl font-bold text-gray-900"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              SEA Catering
            </motion.span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigation.map((item, index) => (
            <motion.div key={item.name} variants={itemVariants} custom={index}>
              <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-all duration-200 py-2 px-1 group",
                    pathname === item.href ? "text-emerald-600" : "text-gray-600 hover:text-emerald-600",
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600"
                      variants={underlineVariants}
                      initial="hidden"
                      animate="visible"
                      layoutId="activeTab"
                    />
                  )}
                  {pathname !== item.href && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  )}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </nav>

        {/* User Menu */}
        <motion.div className="hidden md:flex items-center" variants={itemVariants}>
          <UserMenu />
        </motion.div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="icon">
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <motion.div
              className="flex flex-col space-y-4 mt-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, staggerChildren: 0.1 }}
            >
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Link href="/" className="flex items-center space-x-2 mb-8">
                  <motion.div whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                    <Utensils className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  <span className="text-xl font-bold text-gray-900">SEA Catering</span>
                </Link>
              </motion.div>
              {navigation.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium py-3 px-4 rounded-md transition-all duration-200 block",
                        pathname === item.href
                          ? "bg-emerald-100 text-emerald-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-100 hover:text-emerald-600",
                      )}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                </motion.div>
              ))}

              {/* Mobile User Menu */}
              <motion.div
                className="pt-4 border-t"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <UserMenu />
              </motion.div>
            </motion.div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  )
}
