"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CreditCard,
  CalendarIcon,
  Pause,
  Play,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Package,
} from "lucide-react"
import { format } from "date-fns"
import AuthGuard from "@/components/auth-guard"
import { motion, AnimatePresence } from "framer-motion"

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
  pausedFrom?: string
  pausedUntil?: string
  cancelledAt?: string
}

function UserDashboardContent() {
  const [user, setUser] = useState<any>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [pauseFromDate, setPauseFromDate] = useState<Date>()
  const [pauseUntilDate, setPauseUntilDate] = useState<Date>()
  const [showPauseDialog, setShowPauseDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("success")

  useEffect(() => {
    loadData()
  }, [])

  const mapSubscriptionFields = (sub: any): Subscription => ({
    ...sub,
    selectedPlan: sub.plan || sub.selectedPlan,
    selectedMealTypes: sub.mealTypes || sub.selectedMealTypes || [],
    selectedDeliveryDays: sub.deliveryDays || sub.selectedDeliveryDays || [],
  })

  const loadData = async () => {
    setLoading(true)
    try {
      // Fetch user info
      const userRes = await fetch("/api/auth/me", { credentials: "include" })
      const userData = await userRes.json()
      setUser(userData.user)
      // Fetch subscriptions for this user
      const subRes = await fetch("/api/subscription", { credentials: "include" })
      if (!subRes.ok) throw new Error("Failed to fetch subscriptions")
      const subData = await subRes.json()
      const mapped = Array.isArray(subData) ? subData.map(mapSubscriptionFields) : []
      setSubscriptions(mapped)
    } catch (error) {
      setMessage("Failed to load dashboard data.")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  const handlePauseSubscription = async () => {
    if (!selectedSubscription || !pauseFromDate || !pauseUntilDate) return
    try {
      const res = await fetch(`/api/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedSubscription.id,
          action: "pause",
          pausedFrom: pauseFromDate.toISOString(),
          pausedUntil: pauseUntilDate.toISOString(),
        }),
      })
      if (!res.ok) throw new Error("Failed to pause subscription")
      await loadData()
      setShowPauseDialog(false)
      setSelectedSubscription(null)
      setPauseFromDate(undefined)
      setPauseUntilDate(undefined)
      setMessage("Subscription paused successfully!")
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to pause subscription. Please try again.")
      setMessageType("error")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      const res = await fetch(`/api/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: subscriptionId,
          action: "resume",
        }),
      })
      if (!res.ok) throw new Error("Failed to resume subscription")
      await loadData()
      setMessage("Subscription resumed successfully!")
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to resume subscription. Please try again.")
      setMessageType("error")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return
    try {
      const res = await fetch(`/api/subscription`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: selectedSubscription.id,
          action: "cancel",
        }),
      })
      if (!res.ok) throw new Error("Failed to cancel subscription")
      await loadData()
      setShowCancelDialog(false)
      setSelectedSubscription(null)
      setMessage("Subscription cancelled successfully!")
      setMessageType("success")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Failed to cancel subscription. Please try again.")
      setMessageType("error")
      setTimeout(() => setMessage(""), 3000)
    }
  }

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "paused":
        return <Clock className="h-4 w-4" />
      case "cancelled":
        return <Trash2 className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const activeSubscriptions = subscriptions.filter((sub) => sub.status === "active")
  const totalMonthlySpend = activeSubscriptions.reduce((sum, sub) => sum + sub.totalPrice, 0)

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-12 px-4">
      <motion.div
        className="container mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}! 👋</h1>
          <p className="text-lg text-gray-600">Manage your meal subscriptions and track your healthy journey</p>
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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
                <Package className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeSubscriptions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {subscriptions.length - activeSubscriptions.length} inactive
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(totalMonthlySpend)}</div>
                <p className="text-xs text-muted-foreground">From active subscriptions</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
                <CalendarIcon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Tomorrow</div>
                <p className="text-xs text-muted-foreground">Diet Plan • Lunch</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subscriptions */}
        <motion.div variants={itemVariants}>
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                My Subscriptions
              </CardTitle>
              <CardDescription>Manage your active meal subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {subscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
                  <p className="text-gray-600 mb-6">Start your healthy journey by subscribing to a meal plan</p>
                  <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500">
                    <a href="/subscription">Browse Meal Plans</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {subscriptions.map((subscription, index) => (
                    <motion.div
                      key={subscription.id}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">{subscription.selectedPlan} Plan</h3>
                            <Badge className={getStatusColor(subscription.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(subscription.status)}
                                {subscription.status}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">
                            Meals: {(subscription.selectedMealTypes || []).join(", ")}
                          </p>
                          <p className="text-gray-600 mb-2">
                            Delivery: {subscription.selectedDeliveryDays}
                          </p>
                          <p className="text-lg font-semibold text-emerald-600">
                            {formatPrice(subscription.totalPrice)}/month
                          </p>
                        </div>

                        <div className="flex gap-2">
                          {subscription.status === "active" && (
                            <>
                              <Dialog open={showPauseDialog} onOpenChange={setShowPauseDialog}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedSubscription(subscription)}
                                    className="hover:scale-105 transition-transform duration-200"
                                  >
                                    <Pause className="h-4 w-4 mr-2" />
                                    Pause
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Pause Subscription</DialogTitle>
                                    <DialogDescription>
                                      Select the date range for pausing your subscription. No charges will be applied
                                      during this period.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Pause From</label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal bg-transparent"
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {pauseFromDate ? format(pauseFromDate, "PPP") : "Select date"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={pauseFromDate}
                                            onSelect={setPauseFromDate}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>

                                    <div>
                                      <label className="text-sm font-medium">Resume On</label>
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal bg-transparent"
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {pauseUntilDate ? format(pauseUntilDate, "PPP") : "Select date"}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                          <Calendar
                                            mode="single"
                                            selected={pauseUntilDate}
                                            onSelect={setPauseUntilDate}
                                            disabled={(date) => date <= (pauseFromDate || new Date())}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    </div>

                                    <Button
                                      onClick={handlePauseSubscription}
                                      disabled={!pauseFromDate || !pauseUntilDate}
                                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                                    >
                                      Confirm Pause
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedSubscription(subscription)}
                                    className="text-red-600 hover:text-red-700 hover:scale-105 transition-all duration-200"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      <AlertTriangle className="h-5 w-5 text-red-600" />
                                      Cancel Subscription
                                    </DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to cancel this subscription? This action cannot be undone.
                                      You will lose access to your meal deliveries immediately.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="flex gap-2 justify-end">
                                    <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                                      Keep Subscription
                                    </Button>
                                    <Button onClick={handleCancelSubscription} className="bg-red-600 hover:bg-red-700">
                                      Yes, Cancel Subscription
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}

                          {subscription.status === "paused" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResumeSubscription(subscription.id)}
                              className="text-green-600 hover:text-green-700 hover:scale-105 transition-all duration-200"
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="text-sm text-gray-500 space-y-1">
                        <p>Started: {new Date(subscription.createdAt).toLocaleDateString()}</p>
                        {subscription.status === "paused" && subscription.pausedFrom && subscription.pausedUntil && (
                          <p className="text-yellow-600">
                            Paused from {new Date(subscription.pausedFrom).toLocaleDateString()} to{" "}
                            {new Date(subscription.pausedUntil).toLocaleDateString()}
                          </p>
                        )}
                        {subscription.status === "cancelled" && subscription.cancelledAt && (
                          <p className="text-red-600">
                            Cancelled on {new Date(subscription.cancelledAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default function UserDashboard() {
  return (
    <AuthGuard requireAuth={true}>
      <UserDashboardContent />
    </AuthGuard>
  )
}
