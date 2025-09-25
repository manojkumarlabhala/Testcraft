"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Trophy, Users } from "lucide-react"

const mockTests = [
  {
    id: 1,
    name: "CBSE Class 12 Physics Mock Test",
    examBoard: "CBSE",
    subject: "Physics",
    difficulty: "Medium",
    duration: 180,
    totalQuestions: 35,
    maxMarks: 70,
    attempts: 15420,
    avgScore: 58.5,
  },
  {
    id: 2,
    name: "UPSC Prelims GS Mock Test",
    examBoard: "UPSC",
    subject: "General Studies",
    difficulty: "Hard",
    duration: 120,
    totalQuestions: 100,
    maxMarks: 200,
    attempts: 28500,
    avgScore: 112.3,
  },
  {
    id: 3,
    name: "JEE Main Mathematics Mock",
    examBoard: "JEE",
    subject: "Mathematics",
    difficulty: "Hard",
    duration: 180,
    totalQuestions: 30,
    maxMarks: 300,
    attempts: 42300,
    avgScore: 185.7,
  },
]

export function MockTestsSection() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Check real user authentication status with Supabase
  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setIsLoggedIn(!!data?.user);
      } catch (err) {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
    setIsClient(true);
  }, []);

  const handleStartTest = (test: (typeof mockTests)[0]) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    alert(`Starting: ${test.name}\nDuration: ${test.duration} minutes\nQuestions: ${test.totalQuestions}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "hard":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const CreateMockTestForm = require("@/components/mock-tests/create-mock-test-form").CreateMockTestForm;
  return (
    <section id="mock-tests" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">AI-Powered Mock Tests</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice with intelligent mock tests that adapt to your learning style and provide detailed analytics
          </p>
        </div>
        <div className="mb-12">
          <CreateMockTestForm />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTests.map((test) => (
            <Card key={test.id} className="border-border/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-balance">{test.name}</CardTitle>
                  <Badge className={getDifficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{test.examBoard}</Badge>
                  <Badge variant="secondary">{test.subject}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{test.duration} mins</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{test.totalQuestions} questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="h-4 w-4 text-muted-foreground" />
                      <span>{test.maxMarks} marks</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{isClient ? test.attempts.toLocaleString() : test.attempts} attempts</span>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Average Score</div>
                    <div className="text-lg font-semibold text-primary">
                      {test.avgScore}/{test.maxMarks} ({Math.round((test.avgScore / test.maxMarks) * 100)}%)
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => handleStartTest(test)}>
                    Start Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Login/Signup Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-primary">Login Required</h3>
              <p className="mb-6 text-muted-foreground">Please login or sign up to start a mock test.</p>
              <div className="flex flex-col gap-4">
                <Button onClick={() => window.location.href = '/login'} className="w-full">Login</Button>
                <Button variant="outline" onClick={() => window.location.href = '/auth/signup'} className="w-full">Sign Up</Button>
                <Button variant="ghost" onClick={() => setShowLoginModal(false)} className="w-full">Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
