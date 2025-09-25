import { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Privacy Policy - Testcraft.in | Your Privacy Matters to Us",
  description: "Read our comprehensive privacy policy to understand how Testcraft.in collects, uses, and protects your personal information and educational data.",
  keywords: ["privacy policy", "data protection", "user privacy", "testcraft privacy", "student data security", "educational privacy"],
  openGraph: {
    title: "Privacy Policy - Testcraft.in",
    description: "Comprehensive privacy policy explaining how we protect your personal information and educational data on Testcraft.in.",
    url: "https://testcraft.in/privacy",
    siteName: "Testcraft.in",
  },
  robots: {
    index: true,
    follow: true,
  },
}
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  FileText, 
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  User,
  Settings
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2025"

  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: Database,
      content: [
        {
          subtitle: "Personal Information",
          details: [
            "Name, email address, phone number when you register",
            "Educational details like school, class, subjects of interest",
            "Profile information including photo and preferences",
            "Payment information for premium subscriptions (processed securely)"
          ]
        },
        {
          subtitle: "Usage Information",
          details: [
            "Test scores, progress tracking, and performance analytics",
            "Time spent on different sections and question types",
            "Learning patterns and study behavior data",
            "Device information, IP address, and browser details"
          ]
        },
        {
          subtitle: "Communication Data",
          details: [
            "Messages sent through our support system",
            "Feedback and reviews provided on our platform",
            "Communications with our team and customer support",
            "Survey responses and feature requests"
          ]
        }
      ]
    },
    {
      id: "information-usage",
      title: "How We Use Your Information",
      icon: Settings,
      content: [
        {
          subtitle: "Educational Services",
          details: [
            "Provide personalized learning experiences and recommendations",
            "Track your progress and generate performance reports",
            "Create customized study plans based on your learning patterns",
            "Offer targeted content and practice materials"
          ]
        },
        {
          subtitle: "Platform Improvement",
          details: [
            "Analyze usage patterns to improve our services and features",
            "Conduct research to develop better educational tools",
            "Test new features and functionalities with user consent",
            "Optimize platform performance and user experience"
          ]
        },
        {
          subtitle: "Communication",
          details: [
            "Send important updates about your account and our services",
            "Provide customer support and respond to your inquiries",
            "Share educational content, tips, and study materials",
            "Notify you about new features, exams, and opportunities (with opt-out option)"
          ]
        }
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: Eye,
      content: [
        {
          subtitle: "We DO NOT Sell Your Data",
          details: [
            "We never sell, rent, or trade your personal information to third parties",
            "Your educational progress and performance data remains confidential",
            "We do not share individual student data with educational institutions without explicit consent",
            "Marketing partnerships do not involve sharing personal student information"
          ]
        },
        {
          subtitle: "Limited Sharing Scenarios",
          details: [
            "With service providers who help us operate our platform (under strict confidentiality agreements)",
            "When required by law, court order, or government regulation",
            "To protect our rights, safety, or property, or that of our users",
            "In case of business merger or acquisition (users will be notified in advance)"
          ]
        },
        {
          subtitle: "Anonymous Data Usage",
          details: [
            "We may share aggregated, anonymized statistics about user performance trends",
            "Educational research may use de-identified data to improve learning outcomes",
            "Platform usage statistics may be shared with partners for service improvement",
            "All shared data is stripped of personally identifiable information"
          ]
        }
      ]
    },
    {
      id: "data-security",
      title: "Data Security and Protection",
      icon: Lock,
      content: [
        {
          subtitle: "Security Measures",
          details: [
            "Industry-standard encryption for all data transmission and storage",
            "Secure servers with 24/7 monitoring and regular security audits",
            "Multi-factor authentication options for enhanced account protection",
            "Regular security updates and vulnerability assessments"
          ]
        },
        {
          subtitle: "Access Controls",
          details: [
            "Strict access controls ensuring only authorized personnel can access user data",
            "Employee training on data protection and privacy best practices",
            "Regular audits of data access and usage within our organization",
            "Immediate revocation of access for former employees"
          ]
        },
        {
          subtitle: "Data Backup and Recovery",
          details: [
            "Regular encrypted backups to prevent data loss",
            "Disaster recovery procedures to ensure service continuity",
            "Geographic distribution of data centers for redundancy",
            "Regular testing of backup and recovery systems"
          ]
        }
      ]
    },
    {
      id: "user-rights",
      title: "Your Rights and Choices",
      icon: User,
      content: [
        {
          subtitle: "Account Control",
          details: [
            "Access and update your personal information anytime through your account settings",
            "Download your data in a portable format upon request",
            "Delete your account and associated data (some data may be retained for legal compliance)",
            "Control privacy settings and data sharing preferences"
          ]
        },
        {
          subtitle: "Communication Preferences",
          details: [
            "Opt-out of marketing emails while keeping essential service communications",
            "Choose notification preferences for study reminders and updates",
            "Control how often you receive educational content and tips",
            "Unsubscribe from all non-essential communications"
          ]
        },
        {
          subtitle: "Data Portability",
          details: [
            "Request a copy of your personal data in machine-readable format",
            "Transfer your learning progress to compatible educational platforms",
            "Export your test scores and performance analytics",
            "Access historical data about your learning journey"
          ]
        }
      ]
    }
  ]

  const cookieTypes = [
    {
      type: "Essential Cookies",
      description: "Required for basic platform functionality and security",
      examples: ["Login sessions", "Security tokens", "Platform preferences"]
    },
    {
      type: "Analytics Cookies",
      description: "Help us understand how users interact with our platform",
      examples: ["Page views", "Feature usage", "Performance metrics"]
    },
    {
      type: "Functional Cookies",
      description: "Enable enhanced features and personalization",
      examples: ["Language preferences", "Study settings", "Theme choices"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-lg">
              <Shield className="mr-2 h-5 w-5" />
              Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Your Privacy Matters to Us
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              At Testcraft.in, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Applicable in India</span>
              </div>
            </div>
          </div>

          {/* Key Principles */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-white/20">
              <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Data Protection</h3>
              <p className="text-muted-foreground text-sm">We use industry-leading security measures to protect your information</p>
            </Card>
            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-white/20">
              <Eye className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Transparency</h3>
              <p className="text-muted-foreground text-sm">Clear communication about how your data is collected and used</p>
            </Card>
            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-white/20">
              <User className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Your Control</h3>
              <p className="text-muted-foreground text-sm">You have full control over your personal information and privacy settings</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <Card key={index} className="mb-8 p-8 bg-white/60 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                </div>
                
                <div className="space-y-6">
                  {section.content.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{subsection.subtitle}</h3>
                      <ul className="space-y-2">
                        {subsection.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-16 px-4 bg-white/30 dark:bg-slate-800/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Cookie Policy</h2>
            <p className="text-xl text-muted-foreground">
              How we use cookies to improve your experience on our platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {cookieTypes.map((cookie, index) => (
              <Card key={index} className="p-6 bg-white/60 backdrop-blur-sm border-white/20">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{cookie.type}</h3>
                <p className="text-muted-foreground mb-4">{cookie.description}</p>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Examples:</p>
                  {cookie.examples.map((example, exampleIndex) => (
                    <p key={exampleIndex} className="text-sm text-muted-foreground">• {example}</p>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">Cookie Control</h3>
                <p className="text-amber-700 dark:text-amber-300 mb-4">
                  You can control cookie settings in your browser preferences. Note that disabling certain cookies may affect platform functionality.
                </p>
                <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                  Manage Cookie Preferences
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-teal-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Children's Privacy Protection</h2>
            </div>
            
            <div className="prose prose-lg text-muted-foreground max-w-none">
              <p className="mb-4">
                We take special care to protect the privacy of users under 18 years of age. For students under 18, 
                we require parental consent before collecting any personal information beyond what's necessary for educational services.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Parental consent required for users under 18</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Limited data collection for educational purposes only</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>No behavioral advertising to children</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span>Parents can review and delete their child's information</span>
                </li>
              </ul>
              <p>
                If you believe we have collected information from a child under 18 without proper consent, 
                please contact us immediately at privacy@testcraft.in.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-white/30 dark:bg-slate-800/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-xl text-blue-100 mb-8">
              We're here to help. Contact our privacy team if you have any questions or concerns about how we handle your data.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center justify-center gap-3">
                <Mail className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-blue-100">privacy@testcraft.in</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Phone className="h-6 w-6" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-blue-100">+91 720 720 7064</div>
                </div>
              </div>
            </div>
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3">
              <Mail className="mr-2 h-5 w-5" />
              Contact Privacy Team
            </Button>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}