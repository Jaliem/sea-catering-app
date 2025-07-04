"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Star, ChevronLeft, ChevronRight, Quote, Heart, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    message: "",
    rating: 5,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let didCancel = false;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // 7s timeout

    fetch("/api/testimonial", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!didCancel) {
          setTestimonials(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!didCancel) {
          setLoading(false);
          console.error("Failed to fetch testimonials:", err);
        }
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      didCancel = true;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleSubmitTestimonial = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/testimonial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      })
      if (!response.ok) throw new Error('Failed to submit testimonial')
      // Optionally, fetch the updated testimonials list
      // const updated = await fetch('/api/testimonial').then(res => res.json())
      // setTestimonials(updated)
      // setCurrentTestimonial(0)
      // setNewTestimonial({ name: '', message: '', rating: 5 })
      alert('Thank you for your testimonial! It will be reviewed and published soon.')
      setIsDialogOpen(false)
      // Force a full page reload to refresh testimonials
      window.location.reload()
    } catch (err) {
      alert('There was an error submitting your testimonial. Please try again.')
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.button
        key={i}
        type={interactive ? "button" : undefined}
        onClick={interactive && onRatingChange ? () => onRatingChange(i + 1) : undefined}
        className={interactive ? "focus:outline-none" : "cursor-default"}
        whileHover={interactive ? { scale: 1.1 } : {}}
        whileTap={interactive ? { scale: 0.9 } : {}}
      >
        <Star
          className={`h-4 w-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : interactive
                ? "text-gray-300 hover:text-yellow-400"
                : "text-gray-300"
          }`}
        />
      </motion.button>
    ))
  }

  if (loading) {
    return (
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loading Testimonials...</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.section
      className="py-20 px-4 bg-gradient-to-br from-white to-blue-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Don't just take our word for it - hear from our satisfied customers who have transformed their eating habits
            with SEA Catering.
          </motion.p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full bg-transparent hover:bg-emerald-50 border-emerald-200"
                  >
                    <ChevronLeft className="h-4 w-4 text-emerald-600" />
                  </Button>
                </motion.div>

                <div className="text-center flex-1 mx-8">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                      <Quote className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
                    </motion.div>
                    {testimonials.length > 0 && testimonials[currentTestimonial] ? (
                      <motion.p
                        className="text-lg text-gray-700 mb-6 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        "{testimonials[currentTestimonial].message}"
                      </motion.p>
                    ) : (
                      <motion.p
                        className="text-lg text-gray-700 mb-6 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        No testimonials available.
                      </motion.p>
                    )}
                    <motion.div
                      className="flex items-center justify-center gap-2 mb-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {renderStars(testimonials[currentTestimonial]?.rating)}
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-center gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <motion.span className="text-3xl" whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        {testimonials[currentTestimonial]?.avatar}
                      </motion.span>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {testimonials[currentTestimonial]?.name}
                        </h3>
                        <p className="text-sm text-gray-500">{testimonials[currentTestimonial]?.date}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full bg-transparent hover:bg-emerald-50 border-emerald-200"
                  >
                    <ChevronRight className="h-4 w-4 text-emerald-600" />
                  </Button>
                </motion.div>
              </div>

              {/* Testimonial indicators */}
              <div className="flex justify-center gap-2">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? "bg-emerald-600 w-8" : "bg-gray-300 hover:bg-emerald-300"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* All Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.span className="text-2xl" whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        {testimonial.avatar}
                      </motion.span>
                      <div>
                        <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.date}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">{renderStars(testimonial.rating)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">"{testimonial.message}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Testimonial Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0 shadow-lg"
                >
                  <motion.div className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Share Your Experience
                  </motion.div>
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                      </motion.div>
                      Share Your Testimonial
                    </DialogTitle>
                    <DialogDescription>Tell us about your experience with SEA Catering</DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmitTestimonial} className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <Label htmlFor="testimonial-name">Your Name</Label>
                      <Input
                        id="testimonial-name"
                        value={newTestimonial.name}
                        onChange={(e) => setNewTestimonial((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your name"
                        className="focus:border-emerald-500"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <Label htmlFor="testimonial-rating">Rating</Label>
                      <div className="flex gap-1 mt-2">
                        {renderStars(newTestimonial.rating, true, (rating) =>
                          setNewTestimonial((prev) => ({ ...prev, rating })),
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <Label htmlFor="testimonial-message">Your Review</Label>
                      <Textarea
                        id="testimonial-message"
                        value={newTestimonial.message}
                        onChange={(e) => setNewTestimonial((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Share your experience with SEA Catering..."
                        rows={4}
                        className="focus:border-emerald-500"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 text-white border-0"
                      >
                        Submit Testimonial
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </motion.section>
  )
}
