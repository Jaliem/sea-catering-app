"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin, Phone, User, Utensils, Clock, Shield, Sparkles, Heart, Award } from "lucide-react"
import Link from "next/link"
import TestimonialsSection from "@/components/testimonials-section"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Utensils className="h-8 w-8" />,
      title: "Meal Customization",
      description: "Personalize your meals according to your dietary preferences and nutritional needs",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Indonesia-Wide Delivery",
      description: "We deliver fresh, healthy meals to major cities across Indonesia",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Flexible Scheduling",
      description: "Choose your delivery days and meal times that fit your lifestyle",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Nutritional Information",
      description: "Detailed nutritional breakdown for every meal to help you stay on track",
      color: "from-orange-500 to-red-500",
    },
  ]

  const stats = [
    { number: "1000+", label: "Happy Customers", icon: <Heart className="h-6 w-6" /> },
    { number: "50+", label: "Cities Covered", icon: <MapPin className="h-6 w-6" /> },
    { number: "99%", label: "Satisfaction Rate", icon: <Award className="h-6 w-6" /> },
    { number: "24/7", label: "Customer Support", icon: <Phone className="h-6 w-6" /> },
  ]

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-20 px-4">
        <motion.div
          className="container mx-auto max-w-6xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-8" variants={itemVariants}>
              <motion.div className="space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Badge
                    variant="secondary"
                    className="text-sm px-4 py-2 bg-emerald-100 text-emerald-700 border-emerald-200"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Fresh & Healthy
                  </Badge>
                </motion.div>

                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <motion.span className="inline-block" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                    SEA Catering
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-xl md:text-2xl text-emerald-600 font-medium"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  "Healthy Meals, Anytime, Anywhere"
                </motion.p>

                <motion.p
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Welcome to SEA Catering, your trusted partner for customizable healthy meal services. We deliver
                  nutritious, delicious meals across Indonesia, making healthy eating convenient and accessible for
                  everyone.
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
                    <Link href="/menu">Explore Meal Plans</Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild variant="outline" size="lg" className="shadow-lg bg-transparent">
                    <Link href="/subscription">Start Subscription</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2"
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Healthy meal preparation"
                  className="w-full h-80 object-cover rounded-xl"
                />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 bg-emerald-500 text-white p-4 rounded-xl shadow-lg"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl font-bold">1000+</div>
                <div className="text-sm">Happy Customers</div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="py-16 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center" variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <motion.div
                  className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  className="text-3xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        className="py-20 px-4 bg-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SEA Catering?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best healthy meal experience, tailored to your needs and
              delivered right to your doorstep.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="text-center hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <motion.div
                      className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center text-white mb-4 bg-gradient-to-r ${feature.color}`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Services Overview */}
      <motion.section
        className="py-20 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.img
                src="/placeholder.svg?height=400&width=500"
                alt="Meal preparation process"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
              <div className="space-y-4">
                {[
                  {
                    title: "Custom Meal Planning",
                    description: "Personalized meal plans based on your dietary goals and preferences",
                  },
                  {
                    title: "Fresh Daily Preparation",
                    description: "All meals are prepared fresh daily using premium ingredients",
                  },
                  {
                    title: "Reliable Delivery",
                    description: "On-time delivery to major cities across Indonesia",
                  },
                  {
                    title: "Nutritional Transparency",
                    description: "Complete nutritional information for every meal",
                  },
                ].map((service, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                      <CheckCircle className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">{service.title}</h3>
                      <p className="text-gray-600">{service.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <motion.section
        className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Start Your Healthy Journey?
          </motion.h2>
          <motion.p
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Contact us today to learn more about our meal plans and get started with SEA Catering
          </motion.p>

          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <CardHeader>
                  <motion.div className="flex items-center gap-3 justify-center" whileHover={{ scale: 1.05 }}>
                    <User className="h-6 w-6" />
                    <CardTitle>Manager</CardTitle>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">Brian</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
              <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <CardHeader>
                  <motion.div className="flex items-center gap-3 justify-center" whileHover={{ scale: 1.05 }}>
                    <Phone className="h-6 w-6" />
                    <CardTitle>Phone Number</CardTitle>
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">08123456789</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-emerald-600 bg-transparent"
              >
                <Link href="/subscription">Subscribe Now</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
