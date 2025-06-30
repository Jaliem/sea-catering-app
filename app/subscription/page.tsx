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
import { Calculator, CheckCircle, Sparkles, Heart, Award, Shield } from "lucide-react"
import AuthGuard from "@/components/auth-guard"

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

function SubscriptionPageContent() {
	const [user, setUser] = useState<any>(null)
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

	useEffect(() => {
		// Fetch current user from backend
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/auth/me", { credentials: "include" })
				if (res.ok) {
					const data = await res.json()
					setUser(data.user)
					setFormData((prev) => ({ ...prev, name: data.user.name }))
				} else {
					setUser(null)
				}
			} catch {
				setUser(null)
			}
		}
		fetchUser()
	}, [])

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
			try {
				const res = await fetch("/api/subscription", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						...formData,
						totalPrice,
					}),
				})
				if (res.ok) {
					alert(`Subscription created successfully! Total: Rp${totalPrice.toLocaleString("id-ID")}`)
				} else {
					const data = await res.json()
					alert(data?.error || "Failed to create subscription.")
				}
			} catch {
				alert("Failed to create subscription. Please try again.")
			}
		}
		setIsSubmitting(false)
	}

	const formatPrice = (price: number) => {
		return `Rp${price.toLocaleString("id-ID")}`
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
			<div className="container mx-auto max-w-4xl">
				<div className="text-center mb-8 animate-fade-in-up">
					<h1 className="text-4xl font-bold text-gray-900 mb-4 animate-fade-in-up animation-delay-100">
						Subscribe to SEA Catering
					</h1>
					<p className="text-lg text-gray-600 animate-fade-in-up animation-delay-200">
						Customize your meal plan and start your healthy eating journey today
					</p>
					{user && (
						<div className="flex items-center justify-center gap-2 mt-4 animate-fade-in-up animation-delay-300">
							<Shield className="h-4 w-4 text-emerald-600" />
							<span className="text-sm text-emerald-600">Authenticated as {user.name}</span>
						</div>
					)}
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Subscription Form */}
					<div className="lg:col-span-2 animate-fade-in-left">
						<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<div className="hover:scale-110 transition-transform duration-200">
										<Sparkles className="h-6 w-6 text-emerald-600" />
									</div>
									Subscription Details
								</CardTitle>
								<CardDescription>Fill in your information and customize your meal plan</CardDescription>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									{/* Personal Information */}
									<div className="space-y-4 animate-fade-in-up animation-delay-200">
										<h3 className="text-lg font-semibold flex items-center gap-2">👤 Personal Information</h3>

										<div className="focus-within:scale-105 transition-transform duration-200">
											<Label htmlFor="name">Full Name *</Label>
											<Input
												id="name"
												value={formData.name}
												onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
												className={`transition-all duration-200 ${errors.name ? "border-red-500 animate-shake" : "focus:border-emerald-500"}`}
												placeholder="Enter your full name"
												disabled={!!user} // Disable if user is logged in
											/>
											{errors.name && <p className="text-sm text-red-500 mt-1 animate-fade-in">{errors.name}</p>}
										</div>

										<div className="focus-within:scale-105 transition-transform duration-200">
											<Label htmlFor="phone">Active Phone Number *</Label>
											<Input
												id="phone"
												placeholder="08123456789"
												value={formData.phone}
												onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
												className={`transition-all duration-200 ${errors.phone ? "border-red-500 animate-shake" : "focus:border-emerald-500"}`}
											/>
											{errors.phone && <p className="text-sm text-red-500 mt-1 animate-fade-in">{errors.phone}</p>}
										</div>
									</div>

									{/* Plan Selection */}
									<div className="space-y-4 animate-fade-in-up animation-delay-300">
										<h3 className="text-lg font-semibold flex items-center gap-2">🍽️ Plan Selection *</h3>
										<RadioGroup
											value={formData.selectedPlan}
											onValueChange={(value) => setFormData((prev) => ({ ...prev, selectedPlan: value }))}
										>
											{mealPlans.map((plan, index) => (
												<div
													key={plan.id}
													className={`flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 animate-fade-in-up`}
													style={{ animationDelay: `${400 + index * 100}ms` }}
												>
													<RadioGroupItem value={plan.id} id={plan.id} />
													<Label htmlFor={plan.id} className="flex-1 cursor-pointer">
														<div className="flex justify-between items-center">
															<div className="flex items-center gap-2">
																<div
																	className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white hover:scale-110 transition-transform duration-200`}
																>
																	{plan.icon}
																</div>
																<span className="font-medium">{plan.name}</span>
															</div>
															<Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
																{formatPrice(plan.price)} per meal
															</Badge>
														</div>
													</Label>
												</div>
											))}
										</RadioGroup>
										{errors.selectedPlan && (
											<p className="text-sm text-red-500 animate-fade-in">{errors.selectedPlan}</p>
										)}
									</div>

									{/* Meal Types */}
									<div className="space-y-4 animate-fade-in-up animation-delay-400">
										<h3 className="text-lg font-semibold flex items-center gap-2">
											🍴 Meal Types * (Select at least one)
										</h3>
										<div className="grid grid-cols-3 gap-4">
											{mealTypes.map((mealType, index) => (
												<div
													key={mealType.id}
													className={`flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 animate-fade-in-up`}
													style={{ animationDelay: `${500 + index * 100}ms` }}
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
												</div>
											))}
										</div>
										{errors.selectedMealTypes && (
											<p className="text-sm text-red-500 animate-fade-in">{errors.selectedMealTypes}</p>
										)}
									</div>

									{/* Delivery Days */}
									<div className="space-y-4 animate-fade-in-up animation-delay-500">
										<h3 className="text-lg font-semibold flex items-center gap-2">
											📅 Delivery Days * (Select any combination)
										</h3>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
											{deliveryDays.map((day, index) => (
												<div
													key={day.id}
													className={`flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 transition-all duration-200 hover:scale-105 animate-fade-in-up`}
													style={{ animationDelay: `${600 + index * 50}ms` }}
												>
													<Checkbox
														id={day.id}
														checked={formData.selectedDeliveryDays.includes(day.id)}
														onCheckedChange={(checked) => handleDeliveryDayChange(day.id, checked as boolean)}
													/>
													<Label htmlFor={day.id} className="cursor-pointer text-sm">
														<div className="font-medium">{day.short}</div>
													</Label>
												</div>
											))}
										</div>
										{errors.selectedDeliveryDays && (
											<p className="text-sm text-red-500 animate-fade-in">{errors.selectedDeliveryDays}</p>
										)}
									</div>

									{/* Allergies */}
									<div className="space-y-4 animate-fade-in-up animation-delay-600">
										<h3 className="text-lg font-semibold flex items-center gap-2">
											⚠️ Allergies & Dietary Restrictions (Optional)
										</h3>
										<div className="focus-within:scale-105 transition-transform duration-200">
											<Textarea
												placeholder="Please list any allergies or dietary restrictions..."
												value={formData.allergies}
												onChange={(e) => setFormData((prev) => ({ ...prev, allergies: e.target.value }))}
												rows={3}
												className="focus:border-emerald-500 transition-all duration-200"
											/>
										</div>
									</div>

									<Button
										type="submit"
										className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0 shadow-lg hover:scale-105 transition-all duration-200 animate-fade-in-up animation-delay-700"
										size="lg"
										disabled={isSubmitting}
									>
										{isSubmitting ? (
											<div className="flex items-center gap-2">
												<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
												Submitting...
											</div>
										) : (
											"Subscribe Now"
										)}
									</Button>
								</form>
							</CardContent>
						</Card>
					</div>

					{/* Price Calculator */}
					<div className="lg:col-span-1 animate-fade-in-right animation-delay-300">
						<div className="sticky top-24 hover:scale-105 transition-transform duration-200">
							<Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<div className="hover:scale-110 transition-transform duration-200">
											<Calculator className="h-5 w-5 text-emerald-600" />
										</div>
										Price Calculator
									</CardTitle>
									<CardDescription>Your subscription cost breakdown</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{formData.selectedPlan && (
										<div className="space-y-3 animate-fade-in">
											<div className="flex justify-between">
												<span>Selected Plan:</span>
												<span className="font-medium">
													{mealPlans.find((p) => p.id === formData.selectedPlan)?.name}
												</span>
											</div>
											<div className="flex justify-between">
												<span>Price per meal:</span>
												<span className="font-medium text-emerald-600 hover:scale-105 transition-transform duration-200">
													{formatPrice(mealPlans.find((p) => p.id === formData.selectedPlan)?.price || 0)}
												</span>
											</div>
										</div>
									)}

									{formData.selectedMealTypes.length > 0 && (
										<div className="flex justify-between animate-fade-in">
											<span>Meal types:</span>
											<span className="font-medium text-blue-600 hover:scale-105 transition-transform duration-200">
												{formData.selectedMealTypes.length}
											</span>
										</div>
									)}

									{formData.selectedDeliveryDays.length > 0 && (
										<div className="flex justify-between animate-fade-in">
											<span>Delivery days:</span>
											<span className="font-medium text-purple-600 hover:scale-105 transition-transform duration-200">
												{formData.selectedDeliveryDays.length}
											</span>
										</div>
									)}

									{totalPrice > 0 && (
										<div className="animate-fade-in">
											<hr className="my-4" />
											<div className="space-y-2">
												<div className="text-sm text-gray-600 animate-fade-in animation-delay-100">
													Calculation: {formatPrice(mealPlans.find((p) => p.id === formData.selectedPlan)?.price || 0)}{" "}
													× {formData.selectedMealTypes.length} × {formData.selectedDeliveryDays.length} × 4.3
												</div>
												<div className="flex justify-between text-lg font-bold text-emerald-600 hover:scale-105 transition-transform duration-200">
													<span>Monthly Total:</span>
													<span>{formatPrice(totalPrice)}</span>
												</div>
											</div>
										</div>
									)}

									{totalPrice === 0 && (
										<div className="animate-fade-in">
											<Alert className="border-emerald-200 bg-emerald-50">
												<div className="hover:scale-105 transition-transform duration-200">
													<CheckCircle className="h-4 w-4 text-emerald-600" />
												</div>
												<AlertDescription className="text-emerald-700">
													Select your plan, meal types, and delivery days to see the total price.
												</AlertDescription>
											</Alert>
										</div>
									)}

									<div className="text-xs text-gray-500 space-y-1 animate-fade-in animation-delay-500">
										<p>* Monthly calculation based on 4.3 weeks per month</p>
										<p>* Prices include delivery within major Indonesian cities</p>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function SubscriptionPage() {
	return (
		<AuthGuard requireAuth={true}>
			<SubscriptionPageContent />
		</AuthGuard>
	)
}
