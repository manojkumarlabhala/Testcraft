"use client"

import Link from "next/link"
import Image from "next/image"

export function BlogHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <Image src="/testcraft-logo.svg" alt="Testcraft" width={36} height={36} />
          <div>
            <h1 className="font-bold">Testcraft Updates</h1>
            <p className="text-xs text-muted-foreground">News & Insights</p>
          </div>
        </Link>
        <nav>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-primary">Blog</Link>
        </nav>
      </div>
    </header>
  )
}
