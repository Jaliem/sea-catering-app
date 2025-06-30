"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Sparkles, Heart, Award, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

// Default meal plans as fallback
const defaultMealPlans = [
  {
    id: 1,
    name: "Diet Plan",
    price: "Rp30,000",
    pricePerMeal: 30000,
    description: "Perfect for weight management and healthy lifestyle",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-green-400 to-emerald-500",
    icon: <Heart className="h-5 w-5" />,
    features: [
      "Low-calorie balanced meals",
      "High fiber content",
      "Portion-controlled servings",
      "Fresh vegetables and lean proteins",
      "Nutritionist approved recipes",
      "Weekly meal variety",
    ],
    nutritionalInfo: {
      calories: "400-500 per meal",
      protein: "25-30g",
      carbs: "40-50g",
      fat: "15-20g",
      fiber: "8-12g",
      sodium: "Less than 600mg",
    },
    sampleMeals: [
      "Grilled chicken with quinoa salad",
      "Steamed fish with brown rice",
      "Turkey wrap with mixed greens",
      "Vegetable stir-fry with tofu",
      "Lean beef with roasted vegetables",
    ],
  },
  {
    id: 2,
    name: "Protein Plan",
    price: "Rp40,000",
    pricePerMeal: 40000,
    description: "High-protein meals for active individuals and fitness enthusiasts",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-green-400 to-emerald-500",
    icon: <Award className="h-5 w-5" />,
    features: [
      "High-quality protein sources",
      "Muscle-building nutrients",
      "Post-workout recovery meals",
      "Balanced macronutrients",
      "Premium ingredients",
      "Fitness-focused nutrition",
    ],
    nutritionalInfo: {
      calories: "500-600 per meal",
      protein: "35-45g",
      carbs: "45-55g",
      fat: "20-25g",
      fiber: "6-10g",
      sodium: "Less than 700mg",
    },
    sampleMeals: [
      "Grilled salmon with sweet potato",
      "Beef stir-fry with brown rice",
      "Chicken breast with quinoa bowl",
      "Protein-packed lentil curry",
      "Turkey meatballs with pasta",
    ],
  },
  {
    id: 3,
    name: "Royal Plan",
    price: "Rp60,000",
    pricePerMeal: 60000,
    description: "Premium gourmet meals with the finest ingredients",
    image: "/placeholder.svg?height=300&width=400",
    color: "from-green-400 to-emerald-500",
    icon: <Sparkles className="h-5 w-5" />,
    features: [
      "Premium organic ingredients",
      "Gourmet chef preparations",
      "Exotic and diverse cuisines",
      "Restaurant-quality presentation",
      "Artisanal cooking techniques",
      "Luxury dining experience",
    ],
    nutritionalInfo: {
      calories: "600-700 per meal",
      protein: "30-40g",
      carbs: "50-60g",
      fat: "25-30g",
      fiber: "10-15g",
      sodium: "Less than 800mg",
    },
    sampleMeals: [
      "Wagyu beef with truffle risotto",
      "Pan-seared sea bass with asparagus",
      "Lamb chops with herb-crusted potatoes",
      "Duck confit with cherry sauce",
      "Lobster tail with garlic butter",
    ],
  },
]

export default function MenuPage() {
  const [mealPlans, setMealPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)

  useEffect(() => {
    // Try to fetch from API, fallback to default plans
    fetch("/api/meal-plan")
      .then((res) => {
        if (!res.ok) throw new Error("API not available")
        return res.json()
      })
      .then((data) => {
        setMealPlans(data && data.length > 0 ? data : defaultMealPlans)
        setLoading(false)
      })
      .catch(() => {
        // Use default meal plans if API fails
        setMealPlans(defaultMealPlans)
        setLoading(false)
      })
  }, [])

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

  const cardHoverVariants = {
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut" as any,
      },
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="mb-4"
          >
            <Loader2 className="h-12 w-12 text-emerald-600 mx-auto" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-700">Loading our delicious meal plans...</h2>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Our Meal Plans
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Choose from our carefully crafted meal plans, each designed to meet different nutritional needs and
            lifestyle preferences. Every meal is prepared with love and the finest ingredients.
          </motion.p>
        </motion.div>

        {/* Meal Plans Grid */}
        <motion.div
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mealPlans.map((plan, index) => (
            <motion.div key={plan.id} variants={itemVariants} whileHover="hover">
              <motion.div variants={cardHoverVariants}>
                <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white/95 backdrop-blur-sm h-full relative">
                  {/* Gradient overlay for premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

                  <div className="relative">
                    <div className="overflow-hidden">
                      <motion.img
                        src={plan.image}
                        alt={plan.name}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>

                    {/* Price Badge */}
                    <motion.div
                      className="absolute top-4 right-4"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Badge
                        className={`bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-xl px-3 py-1 text-sm font-semibold`}
                      >
                        {plan.price} / meal
                      </Badge>
                    </motion.div>
                  </div>

                  <CardHeader className="pb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-600 text-base leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </motion.div>
                  </CardHeader>

                  <CardContent className="space-y-6 pt-0">
                    {/* Features List */}
                    <div className="space-y-3">
                      {Array.isArray(plan.features) &&
                        plan.features.slice(0, 4).map((feature: string, featureIndex: number) => (
                          <motion.div
                            key={featureIndex}
                            className="flex items-center gap-3 group/feature"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 + featureIndex * 0.1 }}
                          >
                            <motion.div
                              className="flex-shrink-0"
                              whileHover={{ scale: 1.2 }}
                              transition={{ duration: 0.2 }}
                            >
                              <CheckCircle className="h-5 w-5 text-emerald-500" />
                            </motion.div>
                            <span className="text-gray-700 group-hover/feature:text-gray-900 transition-colors duration-200">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="pt-4">
                          <Button
                            className={`w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90 text-white border-0 shadow-lg py-3 text-base font-semibold transition-all duration-300`}
                            onClick={() => setSelectedPlan(plan)}
                          >
                            See More Details
                          </Button>
                        </motion.div>
                      </DialogTrigger>

                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                          >
                            <DialogHeader className="pb-6">
                              <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                              >
                                <DialogTitle className="text-3xl font-bold flex items-center gap-3 mb-2">
                                  {plan.name}
                                </DialogTitle>
                                <DialogDescription className="text-lg text-gray-600">
                                  {plan.description}
                                </DialogDescription>
                              </motion.div>
                            </DialogHeader>

                            <div className="space-y-8">
                              {/* Hero Image */}
                              <motion.div
                                className="overflow-hidden rounded-xl"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                              >
                                <img
                                  src={plan.image}
                                  alt={plan.name}
                                  className="w-full h-72 object-cover"
                                />
                              </motion.div>

                              {/* Pricing CTA */}
                              <motion.div
                                className={`bg-gradient-to-r from-green-400 to-emerald-500 p-8 rounded-2xl text-white shadow-xl`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                              >
                                <div className="text-center">
                                  <div className="text-4xl font-bold mb-2">{plan.price}</div>
                                  <div className="text-lg opacity-90 mb-6">per meal</div>
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      asChild
                                      className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold shadow-lg"
                                    >
                                      <Link href="/subscription">Choose This Plan</Link>
                                    </Button>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border-0 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-50" />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </motion.div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Ready to Start Your Healthy Journey?
            </motion.h2>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Subscribe to any of our meal plans and enjoy fresh, healthy meals delivered to your doorstep. Start your
              transformation today!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0 shadow-xl px-8 py-4 text-lg font-semibold"
                >
                  <Link href="/subscription">Start Your Subscription</Link>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold shadow-lg bg-transparent"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
