"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  ArrowRight,
  Heart,
  Shield,
  Award,
  Clock,
  Globe
} from "lucide-react"

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const currentYear = new Date().getFullYear()

  const footerLinks = {
    students: [
      { name: "CBSE Papers", href: "/papers/cbse" },
      { name: "ICSE Papers", href: "/papers/icse" },
      { name: "JEE Mock Tests", href: "/mock-tests/jee" },
      { name: "NEET Practice", href: "/mock-tests/neet" },
      { name: "Study Tips", href: "/blog/category/study-tips" },
      { name: "Success Stories", href: "/blog/category/success-stories" }
    ],
    teachers: [
      { name: "Teacher Dashboard", href: "/teacher-dashboard" },
      { name: "Question Bank", href: "/question-bank" },
      { name: "Analytics Tools", href: "/analytics" },
      { name: "Classroom Management", href: "/classroom" },
      { name: "Bulk Assignments", href: "/bulk-assignments" },
      { name: "Progress Tracking", href: "/progress-tracking" }
    ],
    examBoards: [
      { name: "State Board Papers", href: "/papers/state-board" },
      { name: "Maharashtra Board", href: "/papers/maharashtra" },
      { name: "UP Board", href: "/papers/up-board" },
      { name: "Bihar Board", href: "/papers/bihar" },
      { name: "West Bengal Board", href: "/papers/wb-board" },
      { name: "All Boards", href: "/papers/all-boards" }
    ],
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press Kit", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" }
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
      { name: "Refund Policy", href: "/refund" },
      { name: "Academic Integrity", href: "/integrity" },
      { name: "Community Guidelines", href: "/guidelines" }
    ]
  }

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/testcraft.in", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/testcraftin", color: "hover:text-blue-400" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/testcraft.in", color: "hover:text-pink-600" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@testcraft", color: "hover:text-red-600" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/testcraft", color: "hover:text-blue-700" }
  ]

  const trustIndicators = [
    { icon: Users, text: "50,000+ Happy Students", color: "text-blue-600" },
    { icon: Award, text: "95% Success Rate", color: "text-green-600" },
    { icon: Star, text: "4.9/5 Average Rating", color: "text-yellow-600" },
    { icon: Shield, text: "100% Secure Platform", color: "text-purple-600" }
  ]

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated with Latest Study Tips</h2>
            <p className="text-purple-100 mb-8 text-lg">
              Join 50,000+ students getting weekly study tips, exam strategies, and career guidance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 border-0 focus:ring-4 focus:ring-white/20"
              />
              <Button className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-full">
                Subscribe Free
              </Button>
            </div>
            <p className="text-xs text-purple-200 mt-4">
              📧 No spam, unsubscribe anytime • Join our community of achievers
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Trust Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {trustIndicators.map((item, index) => {
            const IconComponent = item.icon
            return (
              <Card key={index} className="bg-white/10 border-white/20 text-center p-6 hover:bg-white/15 transition-all duration-300">
                <IconComponent className={`h-8 w-8 mx-auto mb-3 ${item.color}`} />
                <p className="text-sm font-medium text-white/90">{item.text}</p>
              </Card>
            )
          })}
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-3xl font-black mb-3">
                <span className="text-white">Test</span>
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">craft</span>
                <span className="text-gray-300">.in</span>
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                India's most trusted exam preparation platform. Helping students achieve their dreams since 2020.
              </p>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                🏆 Trusted by 50K+ Students
              </Badge>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-purple-400" />
                <span>support@testcraft.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-purple-400" />
                <span>+91 720 720 7064</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-purple-400" />
                <span>Visakhapatnam, India</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>24/7 Student Support</span>
              </div>
            </div>
          </div>

          {/* For Students */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-purple-400" />
              For Students
            </h4>
            <ul className="space-y-3">
              {footerLinks.students.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Teachers */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              For Teachers
            </h4>
            <ul className="space-y-3">
              {footerLinks.teachers.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Boards */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              Exam Boards
            </h4>
            <ul className="space-y-3">
              {footerLinks.examBoards.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-400" />
              Company
            </h4>
            <ul className="space-y-3 mb-6">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="h-3 w-3 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h5 className="text-sm font-semibold mb-3 text-gray-200">Legal</h5>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-gray-200 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm mr-4">Follow us:</span>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 ${social.color} transition-all duration-300 hover:scale-110`}
                    aria-label={social.name}
                  >
                    <IconComponent className="h-6 w-6" />
                  </a>
                )
              })}
            </div>

            {/* Made with Love */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for Indian Students</span>
            </div>

            {/* App Download */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm">Download App:</span>
              <Badge className="bg-green-600 hover:bg-green-700 transition-colors cursor-pointer">
                Play Store
              </Badge>
              <Badge className="bg-gray-600 hover:bg-gray-700 transition-colors cursor-pointer">
                App Store
              </Badge>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              © {currentYear} Testcraft Educational Technologies Pvt. Ltd. All rights reserved.
              <br />
              <span className="text-xs">
                Empowering Indian students to achieve academic excellence • Registered in India • GST: 29XXXXX1234X1ZX
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
