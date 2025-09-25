// ...existing code...
import React from "react";
import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Testcraft.in | India's #1 Exam Paper Hub for Students & Teachers",
  description:
    "🎯 India's most trusted exam platform! Access 10,000+ previous year papers, AI-powered mock tests, detailed analytics & study tools. Perfect for CBSE, ICSE, State Boards, JEE, NEET, and University exams. Join 50,000+ students achieving success!",
  keywords: [
    "exam papers India",
    "CBSE previous year papers",
    "ICSE sample papers", 
    "JEE mock tests",
    "NEET practice papers",
    "state board exam papers",
    "university previous papers",
    "AI mock tests",
    "exam preparation India",
    "study materials India",
    "online test platform",
    "educational technology India",
    "student assessment tools",
    "teacher resources India"
  ],
  authors: [{ name: "Testcraft Team" }],
  creator: "Testcraft.in",
  publisher: "Testcraft Educational Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://testcraft.in",
    title: "Testcraft.in | India's #1 Exam Paper Hub for Students & Teachers",
    description: "🎯 India's most trusted exam platform! Access 10,000+ papers, AI mock tests & analytics. Perfect for CBSE, ICSE, JEE, NEET & more. Join 50,000+ students!",
    siteName: "Testcraft.in",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Testcraft.in - India's Leading Exam Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Testcraft.in | India's #1 Exam Paper Hub",
    description: "🎯 Access 10,000+ exam papers, AI mock tests & detailed analytics. Perfect for Indian students & teachers!",
    images: ["/twitter-image.png"],
    creator: "@testcraftin",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
  alternates: {
    canonical: "https://testcraft.in",
    languages: {
      "en-IN": "https://testcraft.in",
      "hi-IN": "https://testcraft.in/hi",
    },
  },
  category: "Education",
  classification: "Educational Technology Platform",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "google-adsense-account": "ca-pub-4612529845456699",
    "google-site-verification": "your-google-verification-code",
    "theme-color": "#8B5CF6",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "format-detection": "telephone=no",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning={true}>
      <head>
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "Testcraft.in",
              "url": "https://testcraft.in",
              "logo": "https://testcraft.in/testcraft-logo.svg",
              "description": "India's leading exam preparation platform offering previous year papers, mock tests, and AI-powered analytics for students and teachers.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN"
              },
              "sameAs": [
                "https://twitter.com/testcraftin",
                "https://linkedin.com/company/testcraft",
                "https://instagram.com/testcraft.in"
              ],
              "offers": {
                "@type": "Offer",
                "category": "Educational Services",
                "availability": "https://schema.org/InStock"
              }
            })
          }}
        />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: 'Testcraft.in - India\\'s #1 Exam Platform',
                custom_map: {'dimension1': 'user_type'}
              });
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">T</span>
                  </div>
                </div>
                <p className="text-lg font-medium text-gray-600">Loading Testcraft...</p>
              </div>
            </div>
          }>
            {children}
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
