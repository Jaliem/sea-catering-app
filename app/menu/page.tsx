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
import { CheckCircle, Star, Sparkles, Heart, Award } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function MenuPage() {
  const [mealPlans, setMealPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null)

  useEffect(() => {
    fetch("/api/meal-plan")
      .then(res => res.json())
      .then(data => {
        setMealPlans(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our Meal Plans
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose from our carefully crafted meal plans, each designed to meet different nutritional needs and
            lifestyle preferences.
          </motion.p>
        </motion.div>

        {/* Meal Plans Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {mealPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white/90 backdrop-blur-sm h-full">
                <div className="relative">
                  <motion.img
                    src={plan.image || "/placeholder.svg"}
                    alt={plan.name}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.div
                    className="absolute top-4 right-4"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Badge className={`bg-gradient-to-r ${plan.color} text-white border-0 shadow-lg`}>
                      {plan.price} / meal
                    </Badge>
                  </motion.div>
                  <motion.div
                    className={`absolute top-4 left-4 w-10 h-10 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {plan.icon}
                  </motion.div>
                </div>

                <CardHeader>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {Array.isArray(plan.features) && plan.features.slice(0, 3).map((feature: string, featureIndex: number) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + featureIndex * 0.1 }}
                      >
                        <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        </motion.div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white border-0 shadow-lg`}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          See More Details
                        </Button>
                      </motion.div>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <DialogHeader>
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <DialogTitle className="text-2xl flex items-center gap-2">
                                <motion.div
                                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white`}
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {plan.icon}
                                </motion.div>
                                {plan.name}
                              </DialogTitle>
                              <DialogDescription className="text-lg">{plan.description}</DialogDescription>
                            </motion.div>
                          </DialogHeader>

                          <div className="space-y-6">
                            <motion.img
                              src={plan.image || "/placeholder.svg"}
                              alt={plan.name}
                              className="w-full h-64 object-cover rounded-lg"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            />

                            <div className="grid md:grid-cols-2 gap-6">
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                              >
                                <h3 className="text-lg font-semibold mb-3">Features</h3>
                                <div className="space-y-2">
                                  {Array.isArray(plan.features) && plan.features.map((feature: string, index: number) => (
                                    <motion.div
                                      key={index}
                                      className="flex items-center gap-2"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                                    >
                                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                                      <span className="text-sm">{feature}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>

                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.25 }}
                              >
                                <h3 className="text-lg font-semibold mb-3">Nutritional Info</h3>
                                <div className="space-y-2 text-sm">
                                  {Object.entries(plan.nutritionalInfo || {}).map(([key, value]: [string, unknown], index: number) => (
                                    <motion.div
                                      key={key}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.2, delay: 0.3 + index * 0.05 }}
                                    >
                                      <strong className="capitalize">{key}:</strong> {String(value)}
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.35 }}
                            >
                              <h3 className="text-lg font-semibold mb-3">Sample Meals</h3>
                              <div className="grid gap-2">
                                {Array.isArray(plan.sampleMeals) && plan.sampleMeals.map((meal: string, index: number) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-center gap-2"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: 0.4 + index * 0.05 }}
                                    whileHover={{ x: 5 }}
                                  >
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    <span className="text-sm">{meal}</span>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>

                            <motion.div
                              className={`bg-gradient-to-r ${plan.color} p-6 rounded-lg text-white`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3, delay: 0.4 }}
                            >
                              <div className="text-center">
                                <div className="text-3xl font-bold mb-2">{plan.price}</div>
                                <div className="text-sm opacity-90 mb-4">per meal</div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                  <Button className="bg-white text-gray-900 hover:bg-gray-100">Choose This Plan</Button>
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
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border-0"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-2xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Healthy Journey?
          </motion.h2>
          <motion.p
            className="text-gray-600 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Subscribe to any of our meal plans and enjoy fresh, healthy meals delivered to your doorstep.
          </motion.p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0 shadow-lg"
            >
              Start Your Subscription
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
