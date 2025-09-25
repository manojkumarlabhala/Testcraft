"use client"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { ExamBoardsSection } from "@/components/exam-boards-section"
import { PapersSection } from "@/components/papers-section-new"
import { MockTestsSection } from "@/components/mock-tests-section"
import { AnalyticsSection } from "@/components/analytics-section"
import { PricingSection } from "@/components/pricing-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CommunityHomeSection } from "@/components/community-home-section"
import { useSubscription } from "@/hooks/use-subscription"
import { useEffect } from "react"

// Enhanced SEO component for better search visibility
function SEOEnhancements() {
  useEffect(() => {
    // Dynamic schema markup for education website
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Testcraft.in",
      "url": "https://testcraft.in",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://testcraft.in/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Testcraft Educational Technologies",
        "logo": "https://testcraft.in/testcraft-logo.svg"
      }
    });
    document.head.appendChild(script);

    // Add FAQ schema for better SERP features
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    faqScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What exam papers are available on Testcraft?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Testcraft offers 10,000+ previous year papers for CBSE, ICSE, State Boards, JEE, NEET, University exams, and competitive exams across India."
          }
        },
        {
          "@type": "Question", 
          "name": "Is Testcraft free for students?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Testcraft offers a free plan with access to 5 papers per month and basic mock tests. Premium plans start from ₹299/year for unlimited access."
          }
        },
        {
          "@type": "Question",
          "name": "How does AI-powered mock testing work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our AI analyzes your performance patterns and creates personalized mock tests focusing on your weak areas, helping you improve faster and score better."
          }
        }
      ]
    });
    document.head.appendChild(faqScript);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(faqScript);
    };
  }, []);

  return null;
}

export default function HomePage() {
  const { AdBanner } = require("@/components/ui/ad-banner");
  const { isPremium } = useSubscription()

  return (
    <>
      <SEOEnhancements />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30">
        <Navbar />
        
        {/* Strategic Ad Placement for Revenue */}
        {!isPremium && (
          <div className="w-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 px-4 py-3 border-b border-purple-200 dark:border-purple-800">
            <div className="container mx-auto">
              <AdBanner placement="home-top" size="leaderboard" />
            </div>
          </div>
        )}

        <main className="relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
            <div className="absolute top-96 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-teal-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
          </div>

          <HeroSection />
          <StatsSection />
          
          {/* Mid-content Ad for Better Revenue */}
          {!isPremium && (
            <section className="py-8 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10">
              <div className="container mx-auto px-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">📚 Sponsored Content - Supporting Free Education</p>
                </div>
                <AdBanner placement="home-mid" size="banner" />
              </div>
            </section>
          )}

          <ExamBoardsSection />
          <CommunityHomeSection />
          <PapersSection />
          <MockTestsSection />
          
          {/* Another strategic ad placement */}
          {!isPremium && (
            <section className="py-6 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10">
              <div className="container mx-auto px-4">
                <AdBanner placement="home-bottom" size="rectangle" />
              </div>
            </section>
          )}

          <AnalyticsSection />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </>
  )
}
