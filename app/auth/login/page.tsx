"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, Utensils, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LoginPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loginError, setLoginError] = useState("")
    const [loginSuccess, setLoginSuccess] = useState("")

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoginError("")
        setLoginSuccess("")

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            // Call backend API
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setLoginError(data?.error || "Login failed. Please try again.")
                return
            }

            setLoginSuccess("Login successful! Redirecting...")
            router.refresh();
            // Optionally: fetch user info or set state if needed
            setTimeout(() => {
                router.push("/");
            }, 1500)
        } catch (error) {
            setLoginError("An error occurred during login. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
        setLoginError("")
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    const logoVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring" as any,
                stiffness: 260,
                damping: 20,
            },
        },
    }

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8, rotateX: -15 },
        visible: {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            transition: {
                type: "spring" as any,
                stiffness: 300,
                damping: 30,
            },
        },
    }

    const inputVariants = {
        focus: {
            scale: 1.02,
            transition: { duration: 0.2 },
        },
        tap: {
            scale: 0.98,
            transition: { duration: 0.1 },
        },
    }

    const buttonVariants = {
        hover: {
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            transition: { duration: 0.2 },
        },
        tap: {
            scale: 0.95,
            transition: { duration: 0.1 },
        },
    }

    const shakeVariants = {
        shake: {
            x: [-10, 10, -10, 10, 0],
            transition: { duration: 0.5 },
        },
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-center py-12 px-4">
            <motion.div className="w-full max-w-md" variants={containerVariants} initial="hidden" animate="visible">
                {/* Header */}
                <motion.div className="text-center mb-8" variants={itemVariants}>
                    <motion.div variants={logoVariants}>
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <motion.div
                                className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center"
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Utensils className="h-6 w-6 text-white" />
                            </motion.div>
                            <motion.span
                                className="text-2xl font-bold text-gray-900"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                SEA Catering
                            </motion.span>
                        </Link>
                    </motion.div>
                    <motion.h1 className="text-3xl font-bold text-gray-900 mb-2" variants={itemVariants}>
                        Welcome Back
                    </motion.h1>
                    <motion.p className="text-gray-600" variants={itemVariants}>
                        Sign in to your account to continue
                    </motion.p>
                </motion.div>

                {/* Login Form */}
                <motion.div variants={cardVariants}>
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
                        <CardHeader className="text-center">
                            <motion.div variants={itemVariants}>
                                <CardTitle className="text-2xl">Sign In</CardTitle>
                                <CardDescription>Enter your credentials to access your account</CardDescription>
                            </motion.div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Success Alert */}
                                {loginSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Alert className="border-green-200 bg-green-50">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-700">{loginSuccess}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}

                                {/* Error Alert */}
                                {loginError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={loginError ? { opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] } : { opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="mb-2"
                                    >
                                        <Alert className="border-red-200 bg-red-50">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <AlertDescription className="text-red-700">{loginError}</AlertDescription>
                                        </Alert>
                                    </motion.div>
                                )}

                                {/* Email Field */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <Label htmlFor="email">Email Address</Label>
                                    <motion.div className="relative" variants={inputVariants} whileFocus="focus" whileTap="tap">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className={`pl-10 transition-all duration-200 ${errors.email ? "border-red-500 focus:border-red-500" : "focus:border-emerald-500"
                                                }`}
                                            disabled={isLoading}
                                        />
                                    </motion.div>
                                    {errors.email && (
                                        <motion.p
                                            className="text-sm text-red-500"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {errors.email}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Password Field */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <Label htmlFor="password">Password</Label>
                                    <motion.div className="relative" variants={inputVariants} whileFocus="focus" whileTap="tap">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            className={`pl-10 pr-10 transition-all duration-200 ${errors.password ? "border-red-500 focus:border-red-500" : "focus:border-emerald-500"
                                                }`}
                                            disabled={isLoading}
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </motion.button>
                                    </motion.div>
                                    {errors.password && (
                                        <motion.p
                                            className="text-sm text-red-500"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {errors.password}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Forgot Password Link */}
                                <motion.div className="text-right" variants={itemVariants}>
                                    <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors duration-200"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </motion.div>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.div variants={itemVariants}>
                                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0 shadow-lg"
                                            size="lg"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <motion.div
                                                    className="flex items-center gap-2"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    <motion.div
                                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                                    />
                                                    Signing In...
                                                </motion.div>
                                            ) : (
                                                "Sign In"
                                            )}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </form>

                            {/* Register Link */}
                            <motion.div className="mt-6 text-center" variants={itemVariants}>
                                <p className="text-gray-600">
                                    Don't have an account?{" "}
                                    <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                                        <Link
                                            href="/auth/register"
                                            className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors duration-200"
                                        >
                                            Create one here
                                        </Link>
                                    </motion.span>
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Demo Credentials */}
                <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    <Card className="mt-6 bg-blue-50/80 backdrop-blur-sm border-blue-200">
                        <CardContent className="pt-6">
                            <motion.h3
                                className="font-semibold text-blue-900 mb-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Demo Credentials
                            </motion.h3>
                            <motion.div
                                className="space-y-1 text-sm text-blue-700"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <p>
                                    <strong>User:</strong> Test@gmail.com / Test123!
                                </p>
                                <p>
                                    <strong>Admin:</strong> admin@example.com / adminpassword
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}
