import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CreateMockTestForm() {
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Medium")
  const [count, setCount] = useState(10)
  const [questionType, setQuestionType] = useState("mcq")
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<any[]>([])
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setQuestions([])
    try {
      const res = await fetch("/api/mock-tests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topic, difficulty, count, questionType })
      })
      const data = await res.json()
      if (res.ok) {
        setQuestions(data.questions)
      } else {
        setError(data.error || "Failed to generate questions")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4 p-4 border rounded-lg" onSubmit={handleSubmit}>
      <h3 className="text-xl font-bold mb-2">Generate AI Mock Test</h3>
      <div className="grid grid-cols-2 gap-4">
        <input className="input" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
        <input className="input" placeholder="Topic" value={topic} onChange={e => setTopic(e.target.value)} required />
        <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <input className="input" type="number" min={1} max={50} value={count} onChange={e => setCount(Number(e.target.value))} required />
        <select className="input" value={questionType} onChange={e => setQuestionType(e.target.value)}>
          <option value="mcq">MCQ</option>
          <option value="descriptive">Descriptive</option>
        </select>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Generating..." : "Generate Test"}
      </Button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {questions.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Generated Questions</h4>
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="p-2 border rounded">
                <div className="font-medium">Q{i + 1}: {q.question}</div>
                {q.options && (
                  <ul className="ml-4 list-disc">
                    {q.options.map((opt: string, idx: number) => (
                      <li key={idx}>{opt}</li>
                    ))}
                  </ul>
                )}
                <div className="text-sm text-muted-foreground">Answer: {q.correctAnswer}</div>
                <div className="text-sm text-muted-foreground">Explanation: {q.explanation}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  )
}
