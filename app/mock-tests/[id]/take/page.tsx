"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface Question {
  question: string
  options: string[]
  correct_answer: number
  explanation: string
  difficulty: string
  topic: string
}

interface MockTest {
  id: string
  title: string
  duration: number
  questions: Question[]
}

export default function TakeMockTestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [mockTest, setMockTest] = useState<MockTest | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const fetchMockTest = async () => {
      try {
        const response = await fetch(`/api/mock-tests/${resolvedParams.id}`)
        if (!response.ok) throw new Error("Failed to fetch test")

        const data = await response.json()
        setMockTest(data)
        setTimeLeft(data.duration * 60) // Convert minutes to seconds
        setAnswers(new Array(data.questions.length).fill(-1))
      } catch (error) {
        console.error("Error fetching test:", error)
        toast.error("Failed to load mock test")
        router.push("/mock-tests/create")
      }
    }

    fetchMockTest()
  }, [resolvedParams.id, router])

  useEffect(() => {
    if (timeLeft <= 0 || mockTest?.duration === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, mockTest?.duration])

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[questionIndex] = answerIndex
      return newAnswers
    })
  }

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    const timeSpent = Date.now() - startTime

    try {
      const response = await fetch("/api/ai/analyze-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: resolvedParams.id,
          answers,
          timeSpent,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || "Failed to submit test"
        throw new Error(`${response.status}: ${errorMessage}`)
      }

      const results = await response.json()
      
      if (results.error) {
        throw new Error(results.error)
      }
      
      // Check if we have the required data for results page
      if (!results.attemptId) {
        console.warn("No attemptId returned, redirecting to results with data")
      }
      
      router.push(`/mock-tests/${resolvedParams.id}/results?attemptId=${results.attemptId}`)
    } catch (error) {
      console.error("Error submitting test:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to submit test"
      toast.error(`Submit failed: ${errorMessage}`)
      setIsSubmitting(false)
    }
  }, [isSubmitting, startTime, resolvedParams.id, answers, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!mockTest) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading mock test...</div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / mockTest.questions.length) * 100
  const answeredCount = answers.filter((a) => a !== -1).length

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{mockTest.title}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {mockTest.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {mockTest.duration > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeLeft < 300 ? "text-red-500 font-semibold" : ""}>{formatTime(timeLeft)}</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Answered: {answeredCount}/{mockTest.questions.length}
            </div>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="mb-6" />

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{mockTest.questions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion, Number.parseInt(value))}
            >
              {mockTest.questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {currentQuestion < mockTest.questions.length - 1 ? (
              <Button onClick={() => setCurrentQuestion((prev) => prev + 1)}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {mockTest.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    answers[index] !== -1 ? "bg-green-100 border-green-300 text-green-700 hover:bg-green-200" : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                  {answers[index] !== -1 && <CheckCircle className="h-3 w-3 ml-1" />}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
