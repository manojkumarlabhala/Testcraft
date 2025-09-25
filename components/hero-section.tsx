"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Star, Users, BookOpen, TrendingUp, Award, Zap, IndianRupee, Trophy } from "lucide-react"
import { useState, useEffect } from "react"

export function HeroSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [typedText, setTypedText] = useState("")
  const fullText = "India's Most Trusted Exam Platform"

  const testimonials = [
    { name: "Priya Sharma", grade: "Class 12, CBSE", text: "Scored 95% in Physics using Testcraft papers!", location: "Delhi" },
    { name: "Arjun Patel", grade: "JEE Aspirant", text: "AI mock tests helped me crack JEE Mains!", location: "Mumbai" },
    { name: "Ms. Kavitha", role: "Mathematics Teacher", text: "Perfect resource for my students' practice", location: "Bangalore" }
  ]

  const scrollToSection = (href: string) => {
    if (typeof window !== "undefined") {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  // Typing animation effect
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  // Testimonial rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="home" className="relative py-16 md:py-24 overflow-hidden">
      {/* Trust Indicators Bar - Enhanced for Mobile */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center space-x-4 md:space-x-8 text-xs md:text-sm font-medium overflow-x-auto">
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
              <Users className="h-3 w-3 md:h-4 md:w-4" />
              <span>50,000+ Students</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
              <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
              <span>10,000+ Papers</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
              <Trophy className="h-3 w-3 md:h-4 md:w-4" />
              <span>95% Success Rate</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 whitespace-nowrap">
              <Star className="h-3 w-3 md:h-4 md:w-4 fill-current" />
              <span>4.9★ Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero Content */}
          <div className="text-center mb-16">
            {/* Trust Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 px-4 py-2 text-sm font-semibold">
              🏆 {typedText}
            </Badge>

            <h1 className="text-4xl md:text-7xl font-black text-foreground mb-6 leading-tight">
              Score Higher in{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-pulse">
                Every Exam
              </span>
              <br />
              <span className="text-2xl md:text-4xl font-bold text-muted-foreground">
                with India's Smart Study Platform
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              🎯 <strong>Join 50,000+ students</strong> who've improved their scores by 40% on average using our{" "}
              <span className="text-primary font-semibold">AI-powered mock tests</span> and{" "}
              <span className="text-primary font-semibold">10,000+ previous year papers</span>
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-blue-900 dark:text-blue-100">All Boards Covered</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300">CBSE, ICSE, State Boards</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-green-900 dark:text-green-100">AI-Powered Tests</h3>
                    <p className="text-sm text-green-700 dark:text-green-300">Personalized practice</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <IndianRupee className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-purple-900 dark:text-purple-100">Affordable Plans</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">Starting ₹299/year</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => scrollToSection("#papers")} 
                className="text-base px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Start Practicing Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = "/mock-tests/create"}
                className="text-base px-8 py-4 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/20 transform hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Take AI Mock Test
              </Button>
            </div>
          </div>

          {/* Social Proof Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Success Stories */}
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
                <span className="font-bold text-yellow-900 dark:text-yellow-100">Student Success Story</span>
              </div>
              <div className="space-y-2">
                <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  - {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].grade || testimonials[currentTestimonial].role}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  📍 {testimonials[currentTestimonial].location}
                </p>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200 dark:border-rose-800">
                <Award className="h-8 w-8 text-rose-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">95%</p>
                <p className="text-sm text-rose-700 dark:text-rose-300">Score Improvement</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border-teal-200 dark:border-teal-800">
                <Users className="h-8 w-8 text-teal-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">50K+</p>
                <p className="text-sm text-teal-700 dark:text-teal-300">Happy Students</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
