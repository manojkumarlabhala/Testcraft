import { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "About Us - Testcraft.in | Empowering India's Future Through Quality Education",
  description: "Learn about Testcraft.in's mission to democratize quality exam preparation across India. Discover our story, values, and impact on 50,000+ students.",
  keywords: ["about testcraft", "education platform", "exam preparation", "indian students", "online learning", "educational technology"],
  openGraph: {
    title: "About Testcraft.in - Empowering India's Future",
    description: "Discover how Testcraft.in is transforming exam preparation for 50,000+ students across India with innovative technology and quality content.",
    url: "https://testcraft.in/about",
    siteName: "Testcraft.in",
    images: [
      {
        url: "https://testcraft.in/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "About Testcraft.in - Empowering Students Across India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Testcraft.in - Empowering India's Future",
    description: "Learn about our mission to democratize quality exam preparation across India.",
    images: ["https://testcraft.in/og-about.jpg"],
  },
}
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Award, 
  BookOpen, 
  Target, 
  Heart, 
  Star,
  TrendingUp,
  Shield,
  Clock,
  Globe,
  Lightbulb,
  Zap,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutUsPage() {
  const stats = [
    { icon: Users, value: "50,000+", label: "Active Students", color: "text-blue-600" },
    { icon: BookOpen, value: "10,000+", label: "Question Papers", color: "text-green-600" },
    { icon: Award, value: "95%", label: "Success Rate", color: "text-yellow-600" },
    { icon: Globe, value: "28", label: "States Covered", color: "text-purple-600" }
  ]

  const team = [
    {
      name: "Manoj Kumar",
      role: "Founder & CEO",
      description: "Former IIT graduate with 10+ years in EdTech. Passionate about democratizing quality education.",
      image: "/team/manoj.jpg"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Head of Academics",
      description: "Ph.D. in Education, 15+ years experience in curriculum design and student assessment.",
      image: "/team/priya.jpg"
    },
    {
      name: "Rajesh Gupta",
      role: "Chief Technology Officer",
      description: "IIT Delhi alumnus, expert in AI/ML applications for educational technology.",
      image: "/team/rajesh.jpg"
    },
    {
      name: "Sneha Patel",
      role: "Head of Content",
      description: "Master's in English Literature, specializes in creating engaging educational content.",
      image: "/team/sneha.jpg"
    }
  ]

  const values = [
    {
      icon: Target,
      title: "Excellence in Education",
      description: "We strive to provide the highest quality educational resources and maintain the gold standard in exam preparation."
    },
    {
      icon: Heart,
      title: "Student-Centric Approach",
      description: "Every decision we make is guided by what's best for our students' learning journey and academic success."
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "We maintain complete transparency in our processes and ensure data security and privacy for all users."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously innovate our platform with cutting-edge technology to enhance the learning experience."
    }
  ]

  const milestones = [
    { year: "2020", title: "Founded", description: "Testcraft.in was founded with a vision to democratize quality exam preparation." },
    { year: "2021", title: "10,000 Students", description: "Reached our first major milestone of 10,000 registered students." },
    { year: "2022", title: "AI Integration", description: "Launched AI-powered personalized learning and assessment features." },
    { year: "2023", title: "Institution Partnerships", description: "Partnered with 100+ schools and coaching institutes across India." },
    { year: "2024", title: "50,000+ Community", description: "Built a thriving community of 50,000+ students and educators." },
    { year: "2025", title: "National Recognition", description: "Recognized as India's leading exam preparation platform." }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-lg">
              About Testcraft.in
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Empowering India's Future
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize quality education and make exam preparation accessible, 
              affordable, and effective for every student across India.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm border-white/20">
                  <IconComponent className={`h-10 w-10 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Story</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="mb-6">
                  Testcraft.in was born from a simple yet powerful vision: every student in India should have access 
                  to high-quality exam preparation resources, regardless of their geographic location or economic background.
                </p>
                <p className="mb-6">
                  Founded in 2020 by a team of IIT graduates and experienced educators, we recognized the significant 
                  gap between urban and rural educational opportunities. Too many bright minds were being limited by 
                  their circumstances rather than their potential.
                </p>
                <p className="mb-6">
                  Today, we're proud to serve over 50,000 students across 28 states, providing them with the same 
                  quality of preparation that was once available only in metropolitan cities. Our platform combines 
                  cutting-edge technology with time-tested pedagogical methods to deliver results that speak for themselves.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white">
                <Zap className="h-12 w-12 mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>95% of our students improve their scores</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>50,000+ students trust our platform</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>24/7 support in multiple languages</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-300" />
                    <span>Available in 28 states across India</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-4 bg-white/30 dark:bg-slate-800/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm border-white/20">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Milestones that mark our growth and impact
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-500 to-pink-500 h-full"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <Card className="p-6 bg-white/60 backdrop-blur-sm border-white/20 inline-block">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{milestone.year}</div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white mb-2">{milestone.title}</div>
                      <div className="text-muted-foreground">{milestone.description}</div>
                    </Card>
                  </div>
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative z-10"></div>
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-4 bg-white/30 dark:bg-slate-800/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              Passionate educators and technologists working to transform Indian education
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm border-white/20">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{member.name}</h3>
                <div className="text-purple-600 font-semibold mb-3">{member.role}</div>
                <p className="text-muted-foreground text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-12 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <h2 className="text-3xl font-bold mb-4">Want to Know More?</h2>
            <p className="text-xl text-purple-100 mb-8">
              We'd love to hear from you. Get in touch with our team for partnerships, 
              feedback, or any questions about our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-purple-100">
                <Mail className="h-5 w-5" />
                <span>support@testcraft.in</span>
              </div>
              <div className="flex items-center gap-2 text-purple-100">
                <Phone className="h-5 w-5" />
                <span>+91 720 720 7064</span>
              </div>
            </div>
            <Button className="mt-8 bg-white text-purple-600 hover:bg-gray-100 font-bold px-8 py-3">
              Contact Us Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}