"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Save, X, CheckCircle } from "lucide-react"
import AuthGuard from "@/components/auth-guard"
import { motion, AnimatePresence } from "framer-motion"

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  dateOfBirth?: string
  role: "user" | "admin"
  createdAt: string
  preferences?: {
    dietaryRestrictions?: string
    allergies?: string
    favoriteFood?: string
  }
}

function ProfilePageContent() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch user profile")
      const userData = await res.json()
      setUser(userData)
      setFormData(userData)
    } catch (error) {
      setUser(null)
      setMessage("Failed to load profile. Please login again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      // Update profile via backend API
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to update profile")
      const updatedUser = await res.json()
      setUser(updatedUser)
      setFormData(updatedUser)
      setIsEditing(false)
      setMessage("Profile updated successfully!")
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
      setMessageType("error")
      setTimeout(() => setMessage(""), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(user || {})
    setIsEditing(false)
    setMessage("")
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <motion.div
        className="container mx-auto max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-lg text-gray-600">Manage your personal information and preferences</p>
          {user.role === "admin" && (
            <Badge className="mt-2 bg-blue-100 text-blue-800">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          )}
        </motion.div>

        {/* Success/Error Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Alert
                className={messageType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
              >
                <CheckCircle className={`h-4 w-4 ${messageType === "success" ? "text-green-600" : "text-red-600"}`} />
                <AlertDescription className={messageType === "success" ? "text-green-700" : "text-red-700"}>
                  {message}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and preferences</CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" disabled={isLoading}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    Basic Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          className="focus:border-emerald-500"
                        />
                      ) : (
                        <p className="mt-1 p-2 bg-gray-50 rounded-md">{user.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {user.email}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="08123456789"
                          className="focus:border-emerald-500"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {user.phone || "Not provided"}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth || ""}
                          onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                          className="focus:border-emerald-500"
                        />
                      ) : (
                        <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : "Not provided"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                        placeholder="Enter your full address"
                        rows={3}
                        className="focus:border-emerald-500"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span>{user.address || "Not provided"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dietary Preferences</h3>

                  <div>
                    <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                    {isEditing ? (
                      <Textarea
                        id="dietaryRestrictions"
                        value={formData.preferences?.dietaryRestrictions || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              dietaryRestrictions: e.target.value,
                            },
                          }))
                        }
                        placeholder="e.g., Vegetarian, Vegan, Keto, etc."
                        rows={2}
                        className="focus:border-emerald-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded-md">
                        {user.preferences?.dietaryRestrictions || "None specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    {isEditing ? (
                      <Textarea
                        id="allergies"
                        value={formData.preferences?.allergies || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              allergies: e.target.value,
                            },
                          }))
                        }
                        placeholder="List any food allergies"
                        rows={2}
                        className="focus:border-emerald-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded-md">
                        {user.preferences?.allergies || "None specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="favoriteFood">Favorite Foods</Label>
                    {isEditing ? (
                      <Textarea
                        id="favoriteFood"
                        value={formData.preferences?.favoriteFood || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              favoriteFood: e.target.value,
                            },
                          }))
                        }
                        placeholder="Tell us about your favorite foods"
                        rows={2}
                        className="focus:border-emerald-500"
                      />
                    ) : (
                      <p className="mt-1 p-2 bg-gray-50 rounded-md">
                        {user.preferences?.favoriteFood || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Summary */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Type</span>
                  <Badge className={user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                    {user.role === "admin" ? "Administrator" : "Customer"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <a href="/dashboard">View Dashboard</a>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                  >
                    <a href="/subscription">Manage Subscriptions</a>
                  </Button>
                  {user.role === "admin" && (
                    <Button
                      asChild
                      variant="secondary"
                      className="w-full justify-start bg-white/20 hover:bg-white/30 text-white border-0"
                    >
                      <a href="/admin">Admin Panel</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <AuthGuard requireAuth={true}>
      <ProfilePageContent />
    </AuthGuard>
  )
}