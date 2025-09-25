"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  Users,
  Building,
  CheckCircle,
  Play,
  Star,
  ArrowRight,
  BookOpen
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    preferredTime: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          organization: "",
          role: "",
          preferredTime: "",
          message: ""
        })
        toast({
          title: "Demo Booked!",
          description: "We'll contact you within 24 hours to schedule your demo.",
        })
      } else {
        throw new Error('Failed to book demo')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book demo. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    {
      icon: Play,
      title: "Live Platform Demo",
      description: "See how our platform works in real-time with your specific use case"
    },
    {
      icon: Users,
      title: "Personalized Consultation",
      description: "Discuss your requirements and get tailored recommendations"
    },
    {
      icon: BookOpen,
      title: "Implementation Guidance",
      description: "Learn how to integrate our platform into your workflow"
    },
    {
      icon: Star,
      title: "Success Stories",
      description: "Hear from other institutions who've transformed their teaching"
    }
  ]

  const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM"
  ]

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-xl">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Demo Request Submitted!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for your interest in Testcraft! Our team will contact you within 24 hours to schedule your personalized demo.
              </p>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  What happens next?
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
                    <span>We'll review your request</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">2</div>
                    <span>Contact you to schedule</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">3</div>
                    <span>Personalized demo session</span>
                  </div>
                </div>
              </div>
              <Button onClick={() => setIsSubmitted(false)} className="mt-8 bg-blue-600 hover:bg-blue-700">
                Book Another Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 text-purple-800">
            🎯 Free Demo Session
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Experience Testcraft Live
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Testcraft can transform your teaching and student assessment process.
            Book a personalized demo and discover the perfect solution for your institution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Benefits Section */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-purple-600" />
                  What You'll Get in Your Demo
                </CardTitle>
                <CardDescription>
                  A comprehensive walkthrough of our platform tailored to your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <IconComponent className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                        <p className="text-gray-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Testcraft?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">50,000+</div>
                    <div className="text-sm text-gray-600">Students Using Platform</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600">Schools & Institutions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>What Our Partners Say</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-gray-600 italic mb-2">
                      "Testcraft transformed our assessment process. Student engagement increased by 300%!"
                    </p>
                    <div className="text-sm font-medium">Dr. Priya Sharma</div>
                    <div className="text-xs text-gray-500">Principal, Delhi Public School</div>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-gray-600 italic mb-2">
                      "The AI-powered analytics helped us identify struggling students early and provide timely support."
                    </p>
                    <div className="text-sm font-medium">Prof. Rajesh Kumar</div>
                    <div className="text-xs text-gray-500">HOD, IIT Coaching Center</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demo Booking Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Your Free Demo
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll schedule a personalized demo for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization/Institution *</Label>
                      <Input
                        id="organization"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        placeholder="School/College name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="role">Your Role *</Label>
                      <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="principal">Principal/Director</SelectItem>
                          <SelectItem value="teacher">Teacher/Faculty</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                          <SelectItem value="counselor">Counselor</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="preferredTime">Preferred Time</Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your specific requirements, number of students, current assessment methods, etc."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Booking Demo..."
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Free Demo
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    🔒 Your information is secure • No spam • Free demo session
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}