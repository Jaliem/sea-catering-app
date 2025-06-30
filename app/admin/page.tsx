"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, CreditCard, Shield, Trash2, Edit, Eye } from "lucide-react"
import AuthGuard from "@/components/auth-guard"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  createdAt: string
}

interface Subscription {
  id: string
  userId: string
  name: string
  selectedPlan: string
  selectedMealTypes: string[]
  selectedDeliveryDays: string[]
  totalPrice: number
  status: "active" | "paused" | "cancelled"
  createdAt: string
}

function AdminPageContent() {
  const [users, setUsers] = useState<User[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load users
    const storedUsers = localStorage.getItem("sea_catering_users")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }

    // Load subscriptions
    const storedSubscriptions = localStorage.getItem("sea_catering_subscriptions")
    if (storedSubscriptions) {
      setSubscriptions(JSON.parse(storedSubscriptions))
    }
  }

  const deleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)
      localStorage.setItem("sea_catering_users", JSON.stringify(updatedUsers))

      // Also remove their subscriptions
      const updatedSubscriptions = subscriptions.filter((sub) => sub.userId !== userId)
      setSubscriptions(updatedSubscriptions)
      localStorage.setItem("sea_catering_subscriptions", JSON.stringify(updatedSubscriptions))
    }
  }

  const toggleUserRole = (userId: string) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, role: user.role === "admin" ? "user" : ("admin" as "user" | "admin") } : user,
    )
    setUsers(updatedUsers)
    localStorage.setItem("sea_catering_users", JSON.stringify(updatedUsers))
  }

  const updateSubscriptionStatus = (subscriptionId: string, newStatus: "active" | "paused" | "cancelled") => {
    const updatedSubscriptions = subscriptions.map((sub) =>
      sub.id === subscriptionId ? { ...sub, status: newStatus } : sub,
    )
    setSubscriptions(updatedSubscriptions)
    localStorage.setItem("sea_catering_subscriptions", JSON.stringify(updatedSubscriptions))
  }

  const getUserSubscriptions = (userId: string) => {
    return subscriptions.filter((sub) => sub.userId === userId)
  }

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = subscriptions
    .filter((sub) => sub.status === "active")
    .reduce((sum, sub) => sum + sub.totalPrice, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">Manage users and subscriptions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in-up animation-delay-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter((u) => u.role === "admin").length} admins, {users.filter((u) => u.role === "user").length}{" "}
                users
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in-up animation-delay-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subscriptions.filter((s) => s.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">
                {subscriptions.filter((s) => s.status === "paused").length} paused,{" "}
                {subscriptions.filter((s) => s.status === "cancelled").length} cancelled
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in-up animation-delay-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From active subscriptions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Users Management */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in-left">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Users Management
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{user.name}</h3>
                        <Badge
                          className={user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                        >
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Joined: {formatDate(user.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className="hover:scale-105 transition-transform duration-200"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>User Details: {user.name}</DialogTitle>
                            <DialogDescription>View user information and subscriptions</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Name</Label>
                                <p className="font-medium">{user.name}</p>
                              </div>
                              <div>
                                <Label>Email</Label>
                                <p className="font-medium">{user.email}</p>
                              </div>
                              <div>
                                <Label>Role</Label>
                                <Badge
                                  className={
                                    user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {user.role}
                                </Badge>
                              </div>
                              <div>
                                <Label>Joined</Label>
                                <p className="font-medium">{formatDate(user.createdAt)}</p>
                              </div>
                            </div>

                            <div>
                              <Label>Subscriptions</Label>
                              <div className="space-y-2 mt-2">
                                {getUserSubscriptions(user.id).map((sub) => (
                                  <div key={sub.id} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">{sub.selectedPlan} Plan</p>
                                        <p className="text-sm text-gray-600">
                                          {sub.selectedMealTypes.join(", ")} • {sub.selectedDeliveryDays.length}{" "}
                                          days/week
                                        </p>
                                        <p className="text-sm font-medium text-emerald-600">
                                          {formatPrice(sub.totalPrice)}/month
                                        </p>
                                      </div>
                                      <Badge className={getStatusColor(sub.status)}>{sub.status}</Badge>
                                    </div>
                                  </div>
                                ))}
                                {getUserSubscriptions(user.id).length === 0 && (
                                  <p className="text-sm text-gray-500">No subscriptions</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleUserRole(user.id)}
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 hover:scale-105 transition-all duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {users.length === 0 && <p className="text-center text-gray-500 py-8">No users found</p>}
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Management */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl animate-fade-in-right">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Subscriptions Management
              </CardTitle>
              <CardDescription>Monitor and manage user subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((subscription) => {
                  const user = users.find((u) => u.id === subscription.userId)
                  return (
                    <div
                      key={subscription.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{user?.name || "Unknown User"}</h3>
                          <p className="text-sm text-gray-600">{subscription.selectedPlan} Plan</p>
                        </div>
                        <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Meals: {subscription.selectedMealTypes.join(", ")}</p>
                        <p>Delivery: {subscription.selectedDeliveryDays.length} days/week</p>
                        <p className="font-medium text-emerald-600">{formatPrice(subscription.totalPrice)}/month</p>
                        <p>Created: {formatDate(subscription.createdAt)}</p>
                      </div>

                      <div className="flex gap-2 mt-3">
                        {subscription.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscriptionStatus(subscription.id, "paused")}
                            className="text-yellow-600 hover:text-yellow-700 hover:scale-105 transition-all duration-200"
                          >
                            Pause
                          </Button>
                        )}

                        {subscription.status === "paused" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscriptionStatus(subscription.id, "active")}
                            className="text-green-600 hover:text-green-700 hover:scale-105 transition-all duration-200"
                          >
                            Activate
                          </Button>
                        )}

                        {subscription.status !== "cancelled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubscriptionStatus(subscription.id, "cancelled")}
                            className="text-red-600 hover:text-red-700 hover:scale-105 transition-all duration-200"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {subscriptions.length === 0 && <p className="text-center text-gray-500 py-8">No subscriptions found</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      <AdminPageContent />
    </AuthGuard>
  )
}
