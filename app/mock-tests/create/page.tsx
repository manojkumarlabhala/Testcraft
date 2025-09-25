"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, BookOpen, Target, Clock, Trophy, GraduationCap, Briefcase, Award, Zap, ArrowLeft, Home } from "lucide-react"
import { toast } from "sonner"

const examBoards = [
  // School Education
  "CBSE", "ICSE", "State Board", "IB", "Cambridge IGCSE",
  // Competitive Exams
  "JEE Main", "JEE Advanced", "NEET", "AIIMS", "JIPMER", "BITSAT", "VITEEE", "SRMJEEE",
  "CAT", "MAT", "XAT", "CMAT", "GMAT", "GRE", "SAT", "ACT",
  "UPSC Civil Services", "SSC CGL", "SSC CHSL", "IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk",
  "RRB NTPC", "RRB Group D", "CTET", "UGC NET", "CSIR NET",
  // Entrance Exams
  "IIT JAM", "GATE", "NDA", "CDS", "AFCAT", "DRDO", "ISRO",
  "CLAT", "AILET", "LSAT", "DU LLB", "IPU CET",
  "NIFT", "NID", "UCEED", "CEED", "NATA",
  "ICAR AIEEA", "ICAR AICE JRF/SRF",
  // University Exams
  "UGC Universities", "State Universities", "Deemed Universities", "Private Universities",
  // Professional Courses
  "CA Foundation", "CA Intermediate", "CA Final", "CS Foundation", "CS Executive", "CS Professional",
  "CMA Foundation", "CMA Intermediate", "CMA Final",
  // Other
  "Olympiads", "NTSE", "KVPY", "Scholarships", "General Knowledge"
]

const subjects = [
  // Academic Subjects
  "Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Sanskrit",
  "History", "Geography", "Economics", "Political Science", "Sociology", "Psychology",
  "Accountancy", "Business Studies", "Computer Science", "Information Technology",
  "Physical Education", "Fine Arts", "Music", "Dance",
  // Competitive Exam Subjects
  "Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation",
  "General Knowledge", "Current Affairs", "General Science", "Indian Polity", "Geography",
  "History", "Economics", "Environment & Ecology", "Science & Technology",
  // Entrance Exam Subjects
  "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry",
  "Mechanics", "Electricity & Magnetism", "Optics", "Modern Physics",
  "Calculus", "Algebra", "Geometry", "Trigonometry", "Statistics", "Probability",
  "Botany", "Zoology", "Microbiology", "Biotechnology", "Genetics",
  // Professional Subjects
  "Financial Accounting", "Cost Accounting", "Management Accounting", "Auditing",
  "Business Law", "Corporate Law", "Taxation", "Financial Management",
  "Marketing Management", "Human Resource Management", "Operations Management",
  "Strategic Management", "Entrepreneurship", "Business Ethics",
  // Language Subjects
  "English Literature", "English Grammar", "Hindi Literature", "Hindi Grammar",
  "Regional Languages", "Foreign Languages",
  // Other
  "General Studies", "Aptitude", "Reasoning", "Mental Ability"
]

const categories = [
  { name: "School Education (Class 1-12)", icon: BookOpen },
  { name: "Undergraduate Courses", icon: GraduationCap },
  { name: "Postgraduate Courses", icon: Award },
  { name: "Competitive Exams", icon: Trophy },
  { name: "Entrance Exams", icon: Target },
  { name: "Professional Courses", icon: Briefcase },
  { name: "Government Jobs", icon: Zap },
  { name: "Banking & Finance", icon: Trophy },
  { name: "Teaching Exams", icon: BookOpen },
  { name: "Research Exams", icon: Award },
  { name: "Olympiads & Scholarships", icon: Trophy },
  { name: "General Knowledge", icon: Zap }
]

const classLevels = {
  "School Education (Class 1-12)": [
    "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12",
    "Primary (1-5)", "Middle (6-8)", "Secondary (9-10)", "Senior Secondary (11-12)"
  ],
  "Undergraduate Courses": [
    "B.A", "B.Sc", "B.Com", "B.Tech", "B.E", "BBA", "BCA", "B.Pharm", "B.Arch", "B.Ed", "B.P.Ed", "BFA", "B.Music",
    "B.A (Hons)", "B.Sc (Hons)", "B.Com (Hons)", "B.Tech (CSE)", "B.Tech (ECE)", "B.Tech (ME)", "B.Tech (CE)",
    "1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"
  ],
  "Postgraduate Courses": [
    "M.A", "M.Sc", "M.Com", "M.Tech", "M.E", "MBA", "MCA", "M.Pharm", "M.Arch", "M.Ed", "M.P.Ed", "MFA", "M.Music",
    "M.A (English)", "M.A (History)", "M.A (Economics)", "M.Sc (Physics)", "M.Sc (Chemistry)", "M.Sc (Mathematics)",
    "M.Tech (CSE)", "M.Tech (ECE)", "M.Tech (ME)", "M.Tech (CE)", "PG Diploma", "M.Phil"
  ],
  "Competitive Exams": [
    "Preliminary", "Mains", "General Studies", "CSAT", "Paper 1", "Paper 2", "Paper 3", "Tier 1", "Tier 2", "Tier 3",
    "Phase 1", "Phase 2", "Phase 3", "Section A", "Section B", "Section C"
  ],
  "Entrance Exams": [
    "JEE Main", "JEE Advanced", "NEET", "AIIMS", "JIPMER", "BITSAT", "VITEEE", "SRMJEEE", "CET", "EAMCET", "KEAM",
    "IIT JAM", "GATE", "NDA", "CDS", "AFCAT", "CLAT", "AILET", "LSAT", "NIFT", "NID", "UCEED", "CEED", "NATA",
    "ICAR AIEEA", "DU LLB", "IPU CET", "Foundation", "Intermediate", "Advanced"
  ],
  "Professional Courses": [
    "Foundation", "Intermediate", "Final", "Executive", "Professional", "Module 1", "Module 2", "Module 3", "Module 4",
    "Group 1", "Group 2", "Level 1", "Level 2", "Level 3", "Stage 1", "Stage 2", "Stage 3"
  ],
  "Government Jobs": [
    "Preliminary", "Mains", "Interview", "Skill Test", "Medical Test", "Physical Test", "Written Test", "Computer Test",
    "Tier 1", "Tier 2", "Paper 1", "Paper 2", "General", "OBC", "SC/ST", "PWD"
  ],
  "Banking & Finance": [
    "Preliminary", "Mains", "Interview", "Group Discussion", "Computer Test", "Descriptive Test",
    "Phase 1", "Phase 2", "Phase 3", "Scale 1", "Scale 2", "Scale 3", "Scale 4", "Scale 5"
  ],
  "Teaching Exams": [
    "Paper 1", "Paper 2", "PRT", "TGT", "PGT", "Principal", "Vice Principal", "Lecturer", "Assistant Professor",
    "Child Development", "Teaching Methodology", "Educational Psychology"
  ],
  "Research Exams": [
    "Paper 1", "Paper 2", "Paper 3", "Subject Paper", "Research Methodology", "General Paper",
    "Life Sciences", "Physical Sciences", "Chemical Sciences", "Mathematical Sciences", "Earth Sciences"
  ],
  "Olympiads & Scholarships": [
    "Level 1", "Level 2", "Level 3", "Regional", "National", "International", "Junior", "Senior",
    "Class 1-4", "Class 5-8", "Class 9-12", "Undergraduate", "Postgraduate"
  ],
  "General Knowledge": [
    "Beginner", "Intermediate", "Advanced", "Current Affairs", "Static GK", "Mixed", "Monthly", "Weekly", "Daily"
  ]
}

const commonTopics = {
  "Mathematics": [
    "Algebra", "Geometry", "Trigonometry", "Calculus", "Statistics", "Probability", "Number Theory", "Coordinate Geometry",
    "Quadratic Equations", "Linear Equations", "Matrices", "Determinants", "Vectors", "3D Geometry", "Integration", "Differentiation",
    "Limits", "Continuity", "Differential Equations", "Complex Numbers", "Permutations & Combinations", "Binomial Theorem"
  ],
  "Physics": [
    "Mechanics", "Optics", "Electricity", "Magnetism", "Modern Physics", "Thermodynamics", "Waves", "Sound",
    "Light", "Electromagnetic Waves", "Nuclear Physics", "Quantum Physics", "Relativity", "Fluid Mechanics", "Heat Transfer",
    "Electrostatics", "Current Electricity", "Magnetic Effects", "Electromagnetic Induction", "Alternating Current"
  ],
  "Chemistry": [
    "Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry", "Analytical Chemistry", "Biochemistry",
    "Atomic Structure", "Chemical Bonding", "States of Matter", "Chemical Equilibrium", "Ionic Equilibrium", "Thermodynamics",
    "Electrochemistry", "Chemical Kinetics", "Surface Chemistry", "Coordination Compounds", "p-Block Elements", "d-Block Elements",
    "Hydrocarbons", "Alcohols & Phenols", "Aldehydes & Ketones", "Carboxylic Acids", "Amines", "Polymers", "Biomolecules"
  ],
  "Biology": [
    "Cell Biology", "Genetics", "Evolution", "Ecology", "Human Physiology", "Plant Physiology", "Microbiology", "Biotechnology",
    "Molecular Biology", "Immunology", "Endocrinology", "Reproduction", "Developmental Biology", "Neurobiology", "Anatomy",
    "Botany", "Zoology", "Biochemistry", "Bioinformatics", "Environmental Biology"
  ],
  "English": [
    "Grammar", "Vocabulary", "Reading Comprehension", "Writing Skills", "Literature", "Poetry", "Drama", "Prose",
    "Synonyms & Antonyms", "Idioms & Phrases", "One Word Substitution", "Sentence Correction", "Para Jumbles", "Cloze Test",
    "Error Spotting", "Active & Passive Voice", "Direct & Indirect Speech", "Tenses", "Prepositions", "Articles"
  ],
  "History": [
    "Ancient India", "Medieval India", "Modern India", "World History", "Indian Freedom Struggle", "Post Independence India",
    "Ancient Civilizations", "Medieval History", "Modern World History", "Indian National Movement", "Constitutional Development",
    "Socio-Religious Reform Movements", "Economic History", "Cultural History", "Art & Architecture"
  ],
  "Geography": [
    "Physical Geography", "Human Geography", "Economic Geography", "Political Geography", "Climatology", "Oceanography",
    "Geomorphology", "Population Geography", "Settlement Geography", "Regional Geography", "Map Reading", "GIS",
    "Natural Resources", "Environmental Geography", "Disaster Management", "Agricultural Geography"
  ],
  "Economics": [
    "Microeconomics", "Macroeconomics", "Indian Economy", "International Economics", "Development Economics", "Public Finance",
    "Money & Banking", "International Trade", "Economic Planning", "Agriculture Economics", "Industrial Economics",
    "Labour Economics", "Environmental Economics", "Econometric Methods", "Economic Theory"
  ],
  "Political Science": [
    "Political Theory", "Indian Government & Politics", "Comparative Politics", "International Relations", "Public Administration",
    "Western Political Thought", "Indian Political Thought", "Constitutional Law", "Administrative Law", "International Law",
    "Political Sociology", "Political Economy", "Public Policy", "Governance", "Human Rights"
  ],
  "Computer Science": [
    "Programming Fundamentals", "Data Structures", "Algorithms", "Database Management", "Operating Systems", "Computer Networks",
    "Software Engineering", "Web Development", "Mobile Development", "Cyber Security", "Artificial Intelligence", "Machine Learning",
    "Cloud Computing", "Big Data", "Internet of Things", "Blockchain", "System Design", "Object Oriented Programming"
  ],
  "General Knowledge": [
    "Current Affairs", "Static GK", "Indian Polity", "Geography", "History", "Science & Technology", "Economy", "Sports",
    "Awards & Honours", "Books & Authors", "Important Days", "International Organizations", "Constitutions", "Defence",
    "Environment", "Space", "IT & Computers", "Miscellaneous"
  ]
}

const questionTypes = [
  "Multiple Choice Questions (MCQ)",
  "True/False",
  "Fill in the Blanks",
  "Short Answer",
  "Long Answer",
  "Match the Following",
  "Assertion & Reason",
  "Case Study Based",
  "Mixed (All Types)"
]

const difficulties = ["easy", "medium", "hard", "mixed"]

const languages = [
  "English",
  "Hindi",
  "Bilingual (English + Hindi)",
  "Regional Language",
  "Mixed Languages"
]

const timerOptions = [
  { label: "No Timer", value: 0 },
  { label: "30 seconds per question", value: 0.5 },
  { label: "1 minute per question", value: 1 },
  { label: "2 minutes per question", value: 2 },
  { label: "3 minutes per question", value: 3 },
  { label: "5 minutes per question", value: 5 },
  { label: "10 minutes per question", value: 10 },
  { label: "Custom time", value: -1 }
]

export default function CreateMockTestPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    examBoard: "",
    class: "",
    topic: "",
    difficulty: "medium",
    questionCount: 10,
    timerPerQuestion: 2, // minutes per question
    customTimer: 0, // total minutes for custom
    questionType: "Multiple Choice Questions (MCQ)",
    language: "English",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.category || !formData.subject || !formData.examBoard || !formData.class) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsGenerating(true)

    try {
      const payload = {
        ...formData,
        questionCount: Number(formData.questionCount),
        timerPerQuestion: Number(formData.timerPerQuestion),
        customTimer: Number(formData.customTimer),
        questionType: formData.questionType,
        language: formData.language,
      }

      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

  const { mockTest } = await response.json()
  toast.success("AI Mock Test generated successfully!")
  router.push(`/mock-tests/${mockTest.id}/take`)
    } catch (error) {
      console.error("Error generating test:", error)
      toast.error("Failed to generate mock test. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="group flex items-center space-x-2 hover:scale-105 transition-all duration-300 ease-out"
              >
                <h1 className="text-xl font-bold">
                  <span className="relative">
                    <span className="text-slate-800 dark:text-slate-200">Test</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-800 dark:bg-slate-200 group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <span className="relative">
                    <span className="text-emerald-800 dark:text-emerald-300">craft</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-800 dark:bg-emerald-300 group-hover:w-full transition-all duration-300 delay-100"></span>
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">.in</span>
                </h1>
              </button>
              <span className="text-muted-foreground">Create Mock Test</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push("/")}
                className="hidden sm:flex"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Create AI Mock Test
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Generate personalized mock tests for all courses, competitive exams, and entrance exams using advanced AI technology
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              Test Configuration
            </CardTitle>
            <CardDescription className="text-base">
              Configure your AI-generated mock test parameters for optimal learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                >
                  <option value="">Select test category</option>
                  {categories.map((category, i) => (
                    <option key={`${category.name}-${i}`} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    <option value="">Select subject</option>
                    {subjects.map((subject, i) => (
                      <option key={`${subject}-${i}`} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examBoard">Exam Board/Type *</Label>
                  <select
                    id="examBoard"
                    value={formData.examBoard}
                    onChange={(e) => setFormData((prev) => ({ ...prev, examBoard: e.target.value }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    <option value="">Select exam board/type</option>
                    {examBoards.map((board, i) => (
                      <option key={`${board}-${i}`} value={board}>
                        {board}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class/Level *</Label>
                  <select
                    id="class"
                    value={formData.class}
                    onChange={(e) => setFormData((prev) => ({ ...prev, class: e.target.value }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    <option value="">Select class/level</option>
                    {formData.category && classLevels[formData.category as keyof typeof classLevels]
                      ? classLevels[formData.category as keyof typeof classLevels].map((level, i) => (
                          <option key={`${level}-${i}`} value={level}>
                            {level}
                          </option>
                        ))
                      : null}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={formData.difficulty}
                    onChange={(e) => setFormData((prev) => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    {difficulties.map((diff, i) => (
                      <option key={`${diff}-${i}`} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Specific Topic (Optional)</Label>
                  <select
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData((prev) => ({ ...prev, topic: e.target.value }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    <option value="">All Topics (General)</option>
                    {formData.subject && commonTopics[formData.subject as keyof typeof commonTopics]
                      ? commonTopics[formData.subject as keyof typeof commonTopics].map((topic, i) => (
                          <option key={`${topic}-${i}`} value={topic}>
                            {topic}
                          </option>
                        ))
                      : null}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionCount">Number of Questions</Label>
                  <select
                    id="questionCount"
                    value={formData.questionCount.toString()}
                    onChange={(e) => setFormData((prev) => ({ ...prev, questionCount: Number.parseInt(e.target.value) }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    <option value="5">5 Questions</option>
                    <option value="10">10 Questions</option>
                    <option value="15">15 Questions</option>
                    <option value="20">20 Questions</option>
                    <option value="25">25 Questions</option>
                    <option value="30">30 Questions</option>
                    <option value="50">50 Questions</option>
                  </select>
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="questionType">Question Type</Label>
                  <select
                    id="questionType"
                    value={formData.questionType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, questionType: e.target.value }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    {questionTypes.map((type, i) => (
                      <option key={`${type}-${i}`} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    value={formData.language}
                    onChange={(e) => setFormData((prev) => ({ ...prev, language: e.target.value }))}
                    className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                  >
                    {languages.map((lang, i) => (
                      <option key={`${lang}-${i}`} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Timer Selection */}
              <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Label htmlFor="timer" className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Timer Settings
                </Label>
                <select
                  id="timerPerQuestion"
                  value={formData.timerPerQuestion.toString()}
                  onChange={(e) => setFormData((prev) => ({ ...prev, timerPerQuestion: Number.parseFloat(e.target.value) }))}
                  className="w-full rounded border px-3 py-2 bg-white dark:bg-gray-800"
                >
                  {timerOptions.map((option, i) => (
                    <option key={`${option.value}-${i}`} value={option.value.toString()}>{option.label}</option>
                  ))}
                </select>
                {formData.timerPerQuestion === -1 && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-md border">
                    <Label htmlFor="customTimer" className="text-sm font-medium">Total Time (minutes)</Label>
                    <Input
                      id="customTimer"
                      type="number"
                      min="1"
                      placeholder="e.g., 60"
                      value={formData.customTimer}
                      onChange={(e) => setFormData((prev) => ({ ...prev, customTimer: Number.parseInt(e.target.value) || 0 }))}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating AI Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Mock Test
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
