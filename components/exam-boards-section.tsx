"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"

const examBoards = [
  {
    id: 1,
    name: "CBSE",
    type: "School Board",
    description: "Central Board of Secondary Education",
    totalPapers: 2500,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Science"],
  },
  {
    id: 2,
    name: "ICSE",
    type: "School Board",
    description: "Indian Certificate of Secondary Education",
    totalPapers: 1800,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography"],
  },
  {
    id: 3,
    name: "Maharashtra Board",
    type: "State Board",
    description: "Maharashtra State Board of Secondary & Higher Secondary Education",
    totalPapers: 1200,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Marathi", "History"],
  },
  {
    id: 4,
    name: "Karnataka Board",
    type: "State Board",
    description: "Karnataka Secondary Education Examination Board",
    totalPapers: 950,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Kannada", "Social Science"],
  },
  {
    id: 5,
    name: "Tamil Nadu Board",
    type: "State Board",
    description: "Tamil Nadu State Board Education",
    totalPapers: 1100,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Tamil", "History"],
  },
  {
    id: 6,
    name: "Uttar Pradesh Board",
    type: "State Board",
    description: "Uttar Pradesh Madhyamik Shiksha Parishad",
    totalPapers: 1300,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Geography"],
  },
  {
    id: 7,
    name: "West Bengal Board",
    type: "State Board",
    description: "West Bengal Council of Higher Secondary Education",
    totalPapers: 1000,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Bengali", "History"],
  },
  {
    id: 8,
    name: "Rajasthan Board",
    type: "State Board",
    description: "Rajasthan Board of Secondary Education",
    totalPapers: 850,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Social Science"],
  },
  {
    id: 9,
    name: "Gujarat Board",
    type: "State Board",
    description: "Gujarat Secondary and Higher Secondary Education Board",
    totalPapers: 900,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Gujarati", "History"],
  },
  {
    id: 14,
    name: "Andhra Pradesh Board",
    type: "State Board",
    description: "Board of Intermediate Education, Andhra Pradesh",
    totalPapers: 1100,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Telugu", "Social Studies"],
  },
  {
    id: 15,
    name: "Telangana Board",
    type: "State Board",
    description: "Telangana State Board of Intermediate Education",
    totalPapers: 1050,
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Telugu", "Social Studies"],
  },
  {
    id: 16,
    name: "Andhra University",
    type: "University",
    description: "Andhra University, Visakhapatnam - UG & PG Question Papers",
    totalPapers: 2800,
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science", "Mechanical Engineering", "Civil Engineering", "MBA", "MCA"],
  },
  {
    id: 17,
    name: "Osmania University",
    type: "University",
    description: "Osmania University, Hyderabad - UG & PG Question Papers",
    totalPapers: 3200,
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science", "Mechanical Engineering", "Civil Engineering", "MBA", "MCA"],
  },
  {
    id: 18,
    name: "JNTU Hyderabad",
    type: "University",
    description: "Jawaharlal Nehru Technological University, Hyderabad",
    totalPapers: 3500,
    subjects: ["Computer Science", "Information Technology", "Electronics", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
  },
  {
    id: 19,
    name: "JNTU Kakinada",
    type: "University",
    description: "Jawaharlal Nehru Technological University, Kakinada",
    totalPapers: 2900,
    subjects: ["Computer Science", "Information Technology", "Electronics", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
  },
  {
    id: 20,
    name: "JNTU Ananthapur",
    type: "University",
    description: "Jawaharlal Nehru Technological University, Ananthapur",
    totalPapers: 2600,
    subjects: ["Computer Science", "Information Technology", "Electronics", "Mechanical Engineering", "Civil Engineering", "Electrical Engineering"],
  },
  {
    id: 21,
    name: "Shri Venkateshwara University",
    type: "University",
    description: "Shri Venkateshwara University, Tirupati - UG & PG Question Papers",
    totalPapers: 1800,
    subjects: ["Mathematics", "Physics", "Chemistry", "Computer Science", "Mechanical Engineering", "Civil Engineering", "MBA", "MCA"],
  },
  {
    id: 10,
    name: "UPSC",
    type: "Competitive Exam",
    description: "Union Public Service Commission",
    totalPapers: 500,
    subjects: ["General Studies", "History", "Geography", "Polity", "Economics", "Science & Technology"],
  },
  {
    id: 11,
    name: "SSC",
    type: "Competitive Exam",
    description: "Staff Selection Commission",
    totalPapers: 800,
    subjects: ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English"],
  },
  {
    id: 12,
    name: "JEE",
    type: "Entrance Exam",
    description: "Joint Entrance Examination",
    totalPapers: 600,
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    id: 13,
    name: "NEET",
    type: "Entrance Exam",
    description: "National Eligibility cum Entrance Test",
    totalPapers: 400,
    subjects: ["Physics", "Chemistry", "Biology"],
  },
]

export function ExamBoardsSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const scrollToPapers = (boardName: string) => {
    // This would trigger filtering in the papers section
    const event = new CustomEvent("selectBoard", { detail: boardName })
    window.dispatchEvent(event)

    const element = document.querySelector("#papers")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Featured Exam Boards & Universities</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive coverage of India's major educational institutions, universities, and competitive examination boards
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examBoards.map((board) => (
            <Card
              key={board.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/50"
              onClick={() => scrollToPapers(board.name)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">{board.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {board.type}
                  </Badge>
                </div>
                <CardDescription>{board.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium text-primary mb-2">
                  {isClient ? board.totalPapers.toLocaleString() : board.totalPapers}+ Papers Available
                </div>
                <div className="flex flex-wrap gap-1">
                  {board.subjects.slice(0, 3).map((subject) => (
                    <Badge key={subject} variant="outline" className="text-xs">
                      {subject}
                    </Badge>
                  ))}
                  {board.subjects.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{board.subjects.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
