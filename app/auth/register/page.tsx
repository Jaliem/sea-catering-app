"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, User, Utensils, AlertCircle, CheckCircle, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface PasswordStrength {
    score: number
    feedback: string[]
    color: string
}

export default function RegisterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [registerError, setRegisterError] = useState("")
    const [registerSuccess, setRegisterSuccess] = useState("")

    const checkPasswordStrength = (password: string): PasswordStrength => {
        let score = 0
        const feedback: string[] = []

        if (password.length >= 8) score++
        else feedback.push("At least 8 characters")

        if (/[A-Z]/.test(password)) score++
        else feedback.push("One uppercase letter")

        if (/[a-z]/.test(password)) score++
        else feedback.push("One lowercase letter")

        if (/\d/.test(password)) score++
        else feedback.push("One number")

        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
        else feedback.push("One special character")

        let color = "red"
        if (score >= 4) color = "green"
        else if (score >= 3) color = "yellow"
        else if (score >= 2) color = "orange"

        return { score, feedback, color }
    }

    const passwordStrength = checkPasswordStrength(formData.password)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Full name is required"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (passwordStrength.score < 5) {
            newErrors.password = "Password does not meet security requirements"
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        // Terms agreement validation
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms and conditions"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setRegisterError("")
        setRegisterSuccess("")

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            // Call backend API
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setRegisterError(data?.error || "Registration failed. Please try again.")
                return
            }

            setRegisterSuccess("Account created successfully! Redirecting...")
            setTimeout(() => {
                router.push("/auth/login")
            }, 1500)
        } catch (error) {
            setRegisterError("An error occurred during registration. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
        setRegisterError("")
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

    const strengthBarVariants = {
        hidden: { scaleX: 0 },
        visible: (level: number) => ({
            scaleX: level <= passwordStrength.score ? 1 : 0,
            transition: { duration: 0.3, delay: level * 0.1 },
        }),
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
                        Create Account
                    </motion.h1>
                    <motion.p className="text-gray-600" variants={itemVariants}>
                        Join SEA Catering for healthy meal delivery
                    </motion.p>
                </motion.div>

                {/* Registration Form */}
                <motion.div variants={cardVariants}>
                    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
                        <CardHeader className="text-center">
                            <motion.div variants={itemVariants}>
                                <CardTitle className="text-2xl">Sign Up</CardTitle>
                                <CardDescription>Create your account to get started</CardDescription>
                            </motion.div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Success Alert */}
                                <AnimatePresence>
                                    {registerSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Alert className="border-green-200 bg-green-50">
                                                <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                </motion.div>
                                                <AlertDescription className="text-green-700">{registerSuccess}</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Error Alert */}
                                <AnimatePresence>
                                    {registerError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={registerError ? { opacity: 1, y: 0, x: [0, -10, 10, -10, 10, 0] } : { opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="mb-2"
                                        >
                                            <Alert className="border-red-200 bg-red-50">
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                                <AlertDescription className="text-red-700">{registerError}</AlertDescription>
                                            </Alert>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Full Name Field */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <Label htmlFor="name">Full Name</Label>
                                    <motion.div className="relative" variants={inputVariants} whileFocus="focus" whileTap="tap">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className={`pl-10 transition-all duration-200 ${errors.name ? "border-red-500 focus:border-red-500" : "focus:border-emerald-500"
                                                }`}
                                            disabled={isLoading}
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {errors.name && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {errors.name}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

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
                                    <AnimatePresence>
                                        {errors.email && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Password Field */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <Label htmlFor="password">Password</Label>
                                    <motion.div className="relative" variants={inputVariants} whileFocus="focus" whileTap="tap">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
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

                                    {/* Password Strength Indicator */}
                                    <AnimatePresence>
                                        {formData.password && (
                                            <motion.div
                                                className="space-y-2"
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((level) => (
                                                        <motion.div
                                                            key={level}
                                                            className={`h-1 flex-1 rounded transition-all duration-200 ${level <= passwordStrength.score
                                                                    ? passwordStrength.color === "green"
                                                                        ? "bg-green-500"
                                                                        : passwordStrength.color === "yellow"
                                                                            ? "bg-yellow-500"
                                                                            : passwordStrength.color === "orange"
                                                                                ? "bg-orange-500"
                                                                                : "bg-red-500"
                                                                    : "bg-gray-200"
                                                                }`}
                                                            variants={strengthBarVariants}
                                                            initial="hidden"
                                                            animate="visible"
                                                            custom={level}
                                                        />
                                                    ))}
                                                </div>
                                                {passwordStrength.feedback.length > 0 && (
                                                    <motion.div
                                                        className="text-xs text-gray-600"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        <p className="font-medium mb-1">Password must include:</p>
                                                        <ul className="space-y-1">
                                                            {passwordStrength.feedback.map((item, index) => (
                                                                <motion.li
                                                                    key={index}
                                                                    className="flex items-center gap-1"
                                                                    initial={{ opacity: 0, x: -10 }}
                                                                    animate={{ opacity: 1, x: 0 }}
                                                                    transition={{ delay: index * 0.1 }}
                                                                >
                                                                    <motion.div
                                                                        className="w-1 h-1 bg-gray-400 rounded-full"
                                                                        animate={{ scale: [1, 1.5, 1] }}
                                                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                                                    />
                                                                    {item}
                                                                </motion.li>
                                                            ))}
                                                        </ul>
                                                    </motion.div>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <AnimatePresence>
                                        {errors.password && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Confirm Password Field */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <motion.div className="relative" variants={inputVariants} whileFocus="focus" whileTap="tap">
                                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                            className={`pl-10 pr-10 transition-all duration-200 ${errors.confirmPassword
                                                    ? "border-red-500 focus:border-red-500"
                                                    : formData.confirmPassword && formData.password === formData.confirmPassword
                                                        ? "border-green-500 focus:border-green-500"
                                                        : "focus:border-emerald-500"
                                                }`}
                                            disabled={isLoading}
                                        />
                                        <motion.button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            disabled={isLoading}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </motion.button>
                                    </motion.div>
                                    <AnimatePresence>
                                        {errors.confirmPassword && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {errors.confirmPassword}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                    <AnimatePresence>
                                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                            <motion.p
                                                className="text-sm text-green-600 flex items-center gap-1"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                                                    <CheckCircle className="h-3 w-3" />
                                                </motion.div>
                                                Passwords match
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Terms and Conditions */}
                                <motion.div className="space-y-2" variants={itemVariants}>
                                    <motion.div
                                        className="flex items-start space-x-2"
                                        whileHover={{ x: 2 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Checkbox
                                            id="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                                            className="mt-1"
                                            disabled={isLoading}
                                        />
                                        <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed cursor-pointer">
                                            I agree to the{" "}
                                            <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                                                <Link href="/terms" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                                                    Terms of Service
                                                </Link>
                                            </motion.span>{" "}
                                            and{" "}
                                            <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                                                <Link href="/privacy" className="text-emerald-600 hover:text-emerald-700 hover:underline">
                                                    Privacy Policy
                                                </Link>
                                            </motion.span>
                                        </Label>
                                    </motion.div>
                                    <AnimatePresence>
                                        {errors.agreeToTerms && (
                                            <motion.p
                                                className="text-sm text-red-500"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {errors.agreeToTerms}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
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
                                                    Creating Account...
                                                </motion.div>
                                            ) : (
                                                "Create Account"
                                            )}
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </form>

                            {/* Login Link */}
                            <motion.div className="mt-6 text-center" variants={itemVariants}>
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    <motion.span whileHover={{ scale: 1.05 }} className="inline-block">
                                        <Link
                                            href="/auth/login"
                                            className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline transition-colors duration-200"
                                        >
                                            Sign in here
                                        </Link>
                                    </motion.span>
                                </p>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    )
}
