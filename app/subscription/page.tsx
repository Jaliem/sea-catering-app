"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calculator, CheckCircle, Sparkles, Heart, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const mealPlans = [
  {
    id: "diet",
    name: "Diet Plan",
    price: 30000,
    icon: <Heart className="h-5 w-5" />,
    color: "from-green-400 to-emerald-500",
  },
  {
    id: "protein",
    name: "Protein Plan",
    price: 40000,
    icon: <Award className="h-5 w-5" />,
    color: "from-blue-400 to-indigo-500",
  },
  {
    id: "royal",
    name: "Royal Plan",
    price: 60000,
    icon: <Sparkles className="h-5 w-5" />,
    color: "from-purple-400 to-pink-500",
  },
]

const mealTypes = [
  { id: "breakfast", name: "Breakfast", emoji: "🌅" },
  { id: "lunch", name: "Lunch", emoji: "☀️" },
  { id: "dinner", name: "Dinner", emoji: "🌙" },
]

const deliveryDays = [
  { id: "monday", name: "Monday", short: "Mon" },
  { id: "tuesday", name: "Tuesday", short: "Tue" },
  { id: "wednesday", name: "Wednesday", short: "Wed" },
  { id: "thursday", name: "Thursday", short: "Thu" },
  { id: "friday", name: "Friday", short: "Fri" },
  { id: "saturday", name: "Saturday", short: "Sat" },
  { id: "sunday", name: "Sunday", short: "Sun" },
]

export default function SubscriptionPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    selectedPlan: "",
    selectedMealTypes: [] as string[],
    selectedDeliveryDays: [] as string[],
    allergies: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [totalPrice, setTotalPrice] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate total price whenever form data changes
  useEffect(() => {
    if (formData.selectedPlan && formData.selectedMealTypes.length > 0 && formData.selectedDeliveryDays.length > 0) {
      const selectedPlanData = mealPlans.find((plan) => plan.id === formData.selectedPlan)
      if (selectedPlanData) {
        const planPrice = selectedPlanData.price
        const mealTypesCount = formData.selectedMealTypes.length
        const deliveryDaysCount = formData.selectedDeliveryDays.length
        const calculatedPrice = planPrice * mealTypesCount * deliveryDaysCount * 4.3
        setTotalPrice(calculatedPrice)
      }
    } else {
      setTotalPrice(0)
    }
  }, [formData.selectedPlan, formData.selectedMealTypes, formData.selectedDeliveryDays])

  const handleMealTypeChange = (mealTypeId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedMealTypes: checked
        ? [...prev.selectedMealTypes, mealTypeId]
        : prev.selectedMealTypes.filter((id) => id !== mealTypeId),
    }))
  }

  const handleDeliveryDayChange = (dayId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedDeliveryDays: checked
        ? [...prev.selectedDeliveryDays, dayId]
        : prev.selectedDeliveryDays.filter((id) => id !== dayId),
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^08\d{8,11}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Indonesian phone number (08xxxxxxxxx)"
    }

    if (!formData.selectedPlan) {
      newErrors.selectedPlan = "Please select a meal plan"
    }

    if (formData.selectedMealTypes.length === 0) {
      newErrors.selectedMealTypes = "Please select at least one meal type"
    }

    if (formData.selectedDeliveryDays.length === 0) {
      newErrors.selectedDeliveryDays = "Please select at least one delivery day"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (validateForm()) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert(`Subscription submitted successfully! Total: Rp${totalPrice.toLocaleString("id-ID")}`)
      console.log("Form data:", formData)
      console.log("Total price:", totalPrice)
    }

    setIsSubmitting(false)
  }

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as any,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Subscribe to SEA Catering
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Customize your meal plan and start your healthy eating journey today
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subscription Form */}
          <motion.div className="lg:col-span-2" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants}>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                      <Sparkles className="h-6 w-6 text-emerald-600" />
                    </motion.div>
                    Subscription Details
                  </CardTitle>
                  <CardDescription>Fill in your information and customize your meal plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <motion.div className="space-y-4" variants={itemVariants}>
                      <h3 className="text-lg font-semibold flex items-center gap-2">👤 Personal Information</h3>

                      <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                          className={`transition-all duration-200 ${errors.name ? "border-red-500" : "focus:border-emerald-500"}`}
                          placeholder="Enter your full name"
                        />
                        <AnimatePresence>
                          {errors.name && (
                            <motion.p
                              className="text-sm text-red-500 mt-1"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {errors.name}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Label htmlFor="phone">Active Phone Number *</Label>
                        <Input
                          id="phone"
                          placeholder="08123456789"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          className={`transition-all duration-200 ${errors.phone ? "border-red-500" : "focus:border-emerald-500"}`}
                        />
                        <AnimatePresence>
                          {errors.phone && (
                            <motion.p
                              className="text-sm text-red-500 mt-1"
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              {errors.phone}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.div>

                    {/* Plan Selection */}
                    <motion.div className="space-y-4" variants={itemVariants}>
                      <h3 className="text-lg font-semibold flex items-center gap-2">🍽️ Plan Selection *</h3>
                      <RadioGroup
                        value={formData.selectedPlan}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, selectedPlan: value }))}
                      >
                        {mealPlans.map((plan, index) => (
                          <motion.div
                            key={plan.id}
                            className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <RadioGroupItem value={plan.id} id={plan.id} />
                            <Label htmlFor={plan.id} className="flex-1 cursor-pointer">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <motion.div
                                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {plan.icon}
                                  </motion.div>
                                  <span className="font-medium">{plan.name}</span>
                                </div>
                                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                                  {formatPrice(plan.price)} per meal
                                </Badge>
                              </div>
                            </Label>
                          </motion.div>
                        ))}
                      </RadioGroup>
                      <AnimatePresence>
                        {errors.selectedPlan && (
                          <motion.p
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {errors.selectedPlan}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Meal Types */}
                    <motion.div className="space-y-4" variants={itemVariants}>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        🍴 Meal Types * (Select at least one)
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {mealTypes.map((mealType, index) => (
                          <motion.div
                            key={mealType.id}
                            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-all duration-200"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Checkbox
                              id={mealType.id}
                              checked={formData.selectedMealTypes.includes(mealType.id)}
                              onCheckedChange={(checked) => handleMealTypeChange(mealType.id, checked as boolean)}
                            />
                            <Label htmlFor={mealType.id} className="cursor-pointer flex items-center gap-2">
                              <span className="text-lg">{mealType.emoji}</span>
                              <span className="text-sm font-medium">{mealType.name}</span>
                            </Label>
                          </motion.div>
                        ))}
                      </div>
                      <AnimatePresence>
                        {errors.selectedMealTypes && (
                          <motion.p
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {errors.selectedMealTypes}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Delivery Days */}
                    <motion.div className="space-y-4" variants={itemVariants}>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        📅 Delivery Days * (Select any combination)
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {deliveryDays.map((day, index) => (
                          <motion.div
                            key={day.id}
                            className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-all duration-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Checkbox
                              id={day.id}
                              checked={formData.selectedDeliveryDays.includes(day.id)}
                              onCheckedChange={(checked) => handleDeliveryDayChange(day.id, checked as boolean)}
                            />
                            <Label htmlFor={day.id} className="cursor-pointer text-sm">
                              <div className="font-medium">{day.short}</div>
                            </Label>
                          </motion.div>
                        ))}
                      </div>
                      <AnimatePresence>
                        {errors.selectedDeliveryDays && (
                          <motion.p
                            className="text-sm text-red-500"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            {errors.selectedDeliveryDays}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Allergies */}
                    <motion.div className="space-y-4" variants={itemVariants}>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        ⚠️ Allergies & Dietary Restrictions (Optional)
                      </h3>
                      <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                        <Textarea
                          placeholder="Please list any allergies or dietary restrictions..."
                          value={formData.allergies}
                          onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
                          rows={3}
                          className="focus:border-emerald-500 transition-all duration-200"
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0 shadow-lg"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        <AnimatePresence mode="wait">
                          {isSubmitting ? (
                            <motion.div
                              key="submitting"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-2"
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                              />
                              Submitting...
                            </motion.div>
                          ) : (
                            <motion.span
                              key="submit"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              Subscribe Now
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Price Calculator */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.div className="sticky top-24" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                      <Calculator className="h-5 w-5 text-emerald-600" />
                    </motion.div>
                    Price Calculator
                  </CardTitle>
                  <CardDescription>Your subscription cost breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {formData.selectedPlan && (
                      <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex justify-between">
                          <span>Selected Plan:</span>
                          <span className="font-medium">
                            {mealPlans.find((p) => p.id === formData.selectedPlan)?.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price per meal:</span>
                          <motion.span
                            className="font-medium text-emerald-600"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {formatPrice(mealPlans.find((p) => p.id === formData.selectedPlan)?.price || 0)}
                          </motion.span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {formData.selectedMealTypes.length > 0 && (
                      <motion.div
                        className="flex justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>Meal types:</span>
                        <motion.span
                          className="font-medium text-blue-600"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {formData.selectedMealTypes.length}
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {formData.selectedDeliveryDays.length > 0 && (
                      <motion.div
                        className="flex justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>Delivery days:</span>
                        <motion.span
                          className="font-medium text-purple-600"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          {formData.selectedDeliveryDays.length}
                        </motion.span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {totalPrice > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                      >
                        <hr className="my-4" />
                        <div className="space-y-2">
                          <motion.div
                            className="text-sm text-gray-600"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            Calculation:{" "}
                            {formatPrice(mealPlans.find((p) => p.id === formData.selectedPlan)?.price || 0)} ×{" "}
                            {formData.selectedMealTypes.length} × {formData.selectedDeliveryDays.length} × 4.3
                          </motion.div>
                          <motion.div
                            className="flex justify-between text-lg font-bold text-emerald-600"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>Monthly Total:</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {totalPrice === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      <Alert className="border-emerald-200 bg-emerald-50">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        </motion.div>
                        <AlertDescription className="text-emerald-700">
                          Select your plan, meal types, and delivery days to see the total price.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}

                  <motion.div
                    className="text-xs text-gray-500 space-y-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <p>* Monthly calculation based on 4.3 weeks per month</p>
                    <p>* Prices include delivery within major Indonesian cities</p>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
