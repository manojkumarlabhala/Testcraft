import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BookOpen, Brain, Search, Star } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Browse Papers",
      description: "Find exam papers by board and subject",
      icon: BookOpen,
      href: "/#papers",
    },
    {
      title: "Take Mock Test",
      description: "Practice with AI-generated tests",
      icon: Brain,
      href: "/mock-tests/create",
    },
    {
      title: "Search Papers",
      description: "Search for specific papers",
      icon: Search,
      href: "/#papers",
    },
    {
      title: "View Favorites",
      description: "Access your saved papers",
      icon: Star,
      href: "/favorites",
    },
    {
      title: "Create Blog Post",
      description: "Publish updates, jobs and tech articles",
      icon: Star,
      href: "/dashboard/blog-admin",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => (
            <Button key={action.title} variant="outline" className="justify-start h-auto p-4 bg-transparent" asChild>
              <Link href={action.href}>
                <div className="flex items-center space-x-3">
                  <action.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
