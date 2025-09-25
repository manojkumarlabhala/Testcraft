"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CommunityHomeSection() {
  return (
    <section id="community" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Join the Community</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with students and teachers, share knowledge, ask questions, and help each other grow. All users can participate. Free users will see ads.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button asChild size="lg" className="w-full max-w-xs">
            <Link href="/community">Go to Community</Link>
          </Button>
          {/* Ad for free users */}
          <div className="w-full max-w-xs mt-4">
            <div className="bg-white border rounded shadow p-4 text-center">
              <span className="text-muted-foreground">Sponsored Ad</span>
              <div className="mt-2">
                <iframe
                  width="220"
                  height="120"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Ad"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
