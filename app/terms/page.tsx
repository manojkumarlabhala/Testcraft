import { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Terms of Service - Testcraft.in | Platform Usage Guidelines",
  description: "Read our terms of service to understand your rights and responsibilities when using Testcraft.in's exam preparation platform and educational services.",
  keywords: ["terms of service", "user agreement", "platform rules", "testcraft terms", "educational platform guidelines", "subscription terms"],
  openGraph: {
    title: "Terms of Service - Testcraft.in",
    description: "Understand your rights and responsibilities when using Testcraft.in's comprehensive exam preparation platform.",
    url: "https://testcraft.in/terms",
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
  FileText, 
  Scale, 
  AlertTriangle, 
  Shield, 
  CreditCard, 
  RefreshCw,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  User,
  BookOpen,
  Ban,
  AlertCircle
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2025"
  const effectiveDate = "January 15, 2025"

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: FileText,
      content: [
        "By accessing or using Testcraft.in, you agree to be bound by these Terms of Service and all applicable laws and regulations.",
        "If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
        "These terms apply to all visitors, users, and others who access or use the service.",
        "We may update these terms from time to time, and continued use constitutes acceptance of the updated terms."
      ]
    },
    {
      id: "eligibility",
      title: "User Eligibility",
      icon: User,
      content: [
        "You must be at least 13 years old to use our services independently.",
        "Users under 18 must have parental consent and supervision while using our platform.",
        "You must provide accurate and complete information when creating your account.",
        "You are responsible for maintaining the confidentiality of your account credentials.",
        "One person may not maintain multiple accounts without our express permission."
      ]
    },
    {
      id: "services",
      title: "Description of Services",
      icon: BookOpen,
      content: [
        "Testcraft.in provides online exam preparation services including practice tests, study materials, and performance analytics.",
        "We offer both free and premium subscription services with different levels of access.",
        "Our services include question papers from various educational boards, mock tests, and personalized learning recommendations.",
        "We strive to provide accurate and up-to-date content, but make no warranties about the completeness or accuracy of all materials.",
        "Services may be modified, suspended, or discontinued at any time with reasonable notice."
      ]
    },
    {
      id: "user-conduct",
      title: "User Conduct and Responsibilities",
      icon: Shield,
      content: [
        "You agree to use our services only for lawful purposes and in accordance with these terms.",
        "You will not attempt to gain unauthorized access to any part of our platform or systems.",
        "You will not share your account credentials with others or allow others to use your account.",
        "You will not copy, distribute, or modify our content without explicit written permission.",
        "You will not use our services to cheat on actual exams or engage in academic dishonesty.",
        "You will treat other users and our staff with respect and courtesy."
      ]
    }
  ]

  const prohibitedActions = [
    "Sharing or distributing copyrighted content without permission",
    "Creating multiple accounts to circumvent usage limits",
    "Using automated tools or scripts to access our services",
    "Attempting to reverse engineer or hack our platform",
    "Posting inappropriate, offensive, or harmful content",
    "Impersonating other users or misrepresenting your identity",
    "Using our services for commercial purposes without authorization",
    "Violating any applicable laws or regulations"
  ]

  const subscriptionTerms = [
    {
      title: "Subscription Plans",
      details: [
        "We offer various subscription plans with different features and pricing",
        "Subscription fees are charged in advance on a recurring basis",
        "All fees are non-refundable except as required by law",
        "We reserve the right to change subscription prices with 30-day notice"
      ]
    },
    {
      title: "Payment Terms",
      details: [
        "Payment is due immediately upon subscription or renewal",
        "We accept various payment methods including credit cards and digital wallets",
        "Failed payments may result in service suspension or cancellation",
        "You authorize us to charge your payment method for all applicable fees"
      ]
    },
    {
      title: "Cancellation and Refunds",
      details: [
        "You may cancel your subscription at any time through your account settings",
        "Cancellation takes effect at the end of your current billing period",
        "No refunds for partial months or unused portions of subscription periods",
        "We may offer refunds at our discretion for exceptional circumstances"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 text-lg">
              <Scale className="mr-2 h-5 w-5" />
              Terms of Service
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              These terms govern your use of Testcraft.in. Please read them carefully before using our platform. 
              By using our services, you agree to these terms and conditions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last Updated: {lastUpdated}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Effective Date: {effectiveDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Governed by Indian Law</span>
              </div>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-white/20">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Fair Usage</h3>
              <p className="text-muted-foreground text-sm">Use our platform responsibly for educational purposes</p>
            </Card>
            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-white/20">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Account Security</h3>
              <p className="text-muted-foreground text-sm">Keep your account secure and don't share credentials</p>
            </Card>
            <Card className="p-6 text-center bg-white/60 backdrop-blur-sm border-white/20">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Clear Billing</h3>
              <p className="text-muted-foreground text-sm">Transparent pricing with no hidden fees</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Terms Sections */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {sections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <Card key={index} className="mb-8 p-8 bg-white/60 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{section.title}</h2>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Prohibited Actions */}
      <section className="py-16 px-4 bg-white/30 dark:bg-slate-800/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Prohibited Actions</h2>
            <p className="text-xl text-muted-foreground">
              The following actions are strictly prohibited on our platform
            </p>
          </div>

          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <Ban className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">What You Cannot Do</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {prohibitedActions.map((action, index) => (
                <div key={index} className="flex items-start gap-3 text-muted-foreground">
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>

            <Card className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">Consequences of Violations</h4>
                  <p className="text-red-700 dark:text-red-300 text-sm">
                    Violations of these terms may result in warnings, temporary suspension, or permanent termination of your account. 
                    Serious violations may also result in legal action.
                  </p>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </section>

      {/* Subscription and Payment Terms */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Subscription and Payment Terms</h2>
            <p className="text-xl text-muted-foreground">
              Important information about our billing and subscription policies
            </p>
          </div>

          <div className="space-y-8">
            {subscriptionTerms.map((section, index) => (
              <Card key={index} className="p-6 bg-white/60 backdrop-blur-sm border-white/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>  
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Intellectual Property */}
      <section className="py-16 px-4 bg-white/30 dark:bg-slate-800/30">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Intellectual Property Rights</h2>
            </div>
            
            <div className="prose prose-lg text-muted-foreground max-w-none">
              <div className="space-y-4">
                <p>
                  All content on Testcraft.in, including but not limited to text, graphics, logos, images, question papers, 
                  study materials, and software, is the property of Testcraft Educational Technologies Pvt. Ltd. or its licensors 
                  and is protected by Indian and international copyright laws.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 my-6">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What You Can Do</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Use our content for personal study purposes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Print materials for your own use</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <span className="text-sm">Share your scores with others</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">What You Cannot Do</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm">Redistribute or sell our content</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm">Create derivative works</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm">Remove copyright notices</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <p>
                  If you believe any content on our platform infringes your intellectual property rights, 
                  please contact us immediately at legal@testcraft.in with details of the alleged infringement.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Disclaimers and Limitation of Liability</h2>
            </div>
            
            <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
              <p>
                <strong>Educational Purpose:</strong> Our services are designed to supplement, not replace, traditional education and exam preparation. 
                We make no guarantees about exam results or academic performance.
              </p>
              
              <p>
                <strong>Service Availability:</strong> While we strive for 100% uptime, we cannot guarantee uninterrupted service. 
                We are not liable for any losses resulting from service outages or technical issues.
              </p>
              
              <p>
                <strong>Content Accuracy:</strong> We work to ensure the accuracy of our educational content, but we cannot guarantee 
                that all information is error-free or up-to-date. Users should verify important information from official sources.
              </p>
              
              <p>
                <strong>Limitation of Damages:</strong> To the maximum extent permitted by law, our total liability for any claims 
                related to our services shall not exceed the amount you have paid us in the 12 months preceding the claim.
              </p>
            </div>

            <Card className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Important Note</h4>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability for damages. 
                    In such cases, our liability will be limited to the maximum extent permitted by law.
                  </p>
                </div>
              </div>
            </Card>
          </Card>
        </div>
      </section>

      {/* Contact and Governing Law */}
      <section className="py-16 px-4 bg-white/30 dark:bg-slate-800/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-r from-green-500 to-blue-500 text-white">
              <h3 className="text-2xl font-bold mb-4">Questions About Terms?</h3>
              <p className="text-green-100 mb-6">
                If you have any questions about these terms of service, please don't hesitate to contact us.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span>legal@testcraft.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+91 720 720 7064</span>
                </div>
              </div>
              <Button className="bg-white text-green-600 hover:bg-gray-100 font-bold w-full">
                Contact Legal Team
              </Button>
            </Card>

            <Card className="p-8 bg-white/60 backdrop-blur-sm border-white/20">
              <div className="flex items-center gap-4 mb-4">
                <Scale className="h-8 w-8 text-purple-600" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Governing Law</h3>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These terms are governed by the laws of India, without regard to conflict of law principles.
                </p>
                <p>
                  Any disputes arising from these terms or your use of our services will be subject to the 
                  exclusive jurisdiction of the courts in Visakhapatnam, Andhra Pradesh, India.
                </p>
                <p>
                  If any provision of these terms is found to be unenforceable, the remaining provisions 
                  will remain in full force and effect.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}