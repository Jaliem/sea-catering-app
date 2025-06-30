"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, User, Send, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
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
            Contact Us
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Have questions about our meal plans or need assistance? We're here to help! Reach out to us through any of
            the channels below.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Contact Information */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <MessageCircle className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  Get in Touch
                </CardTitle>
                <CardDescription>Contact our team for any inquiries about SEA Catering services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    icon: <User className="h-6 w-6 text-emerald-600" />,
                    title: "Manager",
                    content: "Brian",
                    description: "Available for consultation and support",
                    color: "from-emerald-400 to-teal-500",
                  },
                  {
                    icon: <Phone className="h-6 w-6 text-blue-600" />,
                    title: "Phone Number",
                    content: "08123456789",
                    description: "Call or WhatsApp for immediate assistance",
                    color: "from-blue-400 to-indigo-500",
                  },
                  {
                    icon: <Mail className="h-6 w-6 text-purple-600" />,
                    title: "Email",
                    content: "info@seacatering.com",
                    description: "For detailed inquiries and support",
                    color: "from-purple-400 to-pink-500",
                  },
                  {
                    icon: <Clock className="h-6 w-6 text-orange-600" />,
                    title: "Business Hours",
                    content: "Monday - Friday: 8:00 AM - 6:00 PM",
                    description: "Saturday: 9:00 AM - 4:00 PM",
                    color: "from-orange-400 to-red-500",
                  },
                  {
                    icon: <MapPin className="h-6 w-6 text-green-600" />,
                    title: "Service Area",
                    content: "Major cities across Indonesia",
                    description: "Jakarta, Surabaya, Bandung, Medan, and more",
                    color: "from-green-400 to-emerald-500",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className={`bg-gradient-to-r ${item.color} p-3 rounded-full text-white`}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-gray-600">{item.content}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: <Phone className="h-4 w-4 mr-2" />,
                      text: "Call Now: 08123456789",
                      color: "from-emerald-500 to-teal-500",
                    },
                    {
                      icon: <Mail className="h-4 w-4 mr-2" />,
                      text: "Send Email",
                      color: "from-blue-500 to-indigo-500",
                    },
                    {
                      icon: <MapPin className="h-4 w-4 mr-2" />,
                      text: "Check Delivery Area",
                      color: "from-purple-500 to-pink-500",
                    },
                  ].map((action, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button
                        className={`w-full justify-start bg-gradient-to-r ${action.color} hover:opacity-90 text-white border-0 shadow-lg`}
                      >
                        <motion.div className="flex items-center">
                          {action.icon}
                          {action.text}
                        </motion.div>
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <Send className="h-6 w-6 text-emerald-600" />
                  </motion.div>
                  Send us a Message
                </CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you as soon as possible</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <motion.div
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.div whileFocus={{ scale: 1.01 }}>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="focus:border-emerald-500 transition-all duration-200"
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.01 }}>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="focus:border-emerald-500 transition-all duration-200"
                      />
                    </motion.div>
                  </motion.div>

                  {[
                    { id: "email", label: "Email", placeholder: "john@example.com", type: "email" },
                    { id: "phone", label: "Phone Number", placeholder: "08123456789", type: "tel" },
                    { id: "subject", label: "Subject", placeholder: "How can we help you?", type: "text" },
                  ].map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      whileFocus={{ scale: 1.01 }}
                    >
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        placeholder={field.placeholder}
                        className="focus:border-emerald-500 transition-all duration-200"
                      />
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="focus:border-emerald-500 transition-all duration-200"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0 shadow-lg"
                    >
                      <motion.div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </motion.div>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-center">
                Quick answers to common questions about SEA Catering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  {
                    question: "What areas do you deliver to?",
                    answer:
                      "We deliver to major cities across Indonesia including Jakarta, Surabaya, Bandung, Medan, and many more.",
                  },
                  {
                    question: "How fresh are the meals?",
                    answer:
                      "All meals are prepared fresh daily using premium ingredients and delivered within hours of preparation.",
                  },
                  {
                    question: "Can I customize my meal plan?",
                    answer:
                      "Yes! You can choose your meal types, delivery days, and specify any allergies or dietary restrictions.",
                  },
                  {
                    question: "What payment methods do you accept?",
                    answer: "We accept bank transfers, e-wallets, and major credit cards for your convenience.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100"
                  >
                    <h3 className="font-semibold mb-2 text-emerald-800">{faq.question}</h3>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
