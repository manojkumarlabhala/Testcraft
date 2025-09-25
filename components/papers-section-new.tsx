"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Crown, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExamPaper {
  id: string;
  title: string;
  year: number;
  class_level: string;
  paper_type: string;
  is_premium: boolean;
  download_count: number;
  file_url: string;
  subjects?: { name: string };
  exam_boards?: { name: string };
}

export function PapersSection() {
  const [papers, setPapers] = useState<ExamPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [showAd, setShowAd] = useState(false)
  const [adCompleted, setAdCompleted] = useState(false)
  const [pendingDownloadId, setPendingDownloadId] = useState<string | null>(null)
  const [downloadingPaperId, setDownloadingPaperId] = useState<string | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userSubscription, setUserSubscription] = useState<{ plan: string; isActive: boolean } | null>(null)
  const { toast } = useToast()

  // Fetch papers from API with focus on state boards and 10th class
  useEffect(() => {
    async function fetchPapers() {
      try {
        // First try to get state board papers, especially 10th class
        const stateBoardResponse = await fetch('/api/papers?classLevel=10th&examBoardId=state')
        let statePapers = []

        if (stateBoardResponse.ok) {
          const stateData = await stateBoardResponse.json()
          statePapers = stateData.papers || []
        }

        // If no state papers found, get general papers
        if (statePapers.length === 0) {
          const generalResponse = await fetch('/api/papers')
          if (generalResponse.ok) {
            const generalData = await generalResponse.json()
            statePapers = generalData.papers || []
          }
        }

        // Add some sample state board papers if none exist
        if (statePapers.length === 0) {
          statePapers = [
            // 10th Class Papers - Most Popular
            {
              id: 'sample-maharashtra-10th-math-2023',
              title: 'Maharashtra Board 10th Mathematics 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 1250,
              file_url: 'https://example.com/maharashtra-10th-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Maharashtra Board' }
            },
            {
              id: 'sample-maharashtra-10th-math-2022',
              title: 'Maharashtra Board 10th Mathematics 2022',
              year: 2022,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 1100,
              file_url: 'https://example.com/maharashtra-10th-math-2022.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Maharashtra Board' }
            },
            {
              id: 'sample-karnataka-10th-science-2023',
              title: 'Karnataka Board 10th Science 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 980,
              file_url: 'https://example.com/karnataka-10th-science-2023.pdf',
              subjects: { name: 'Science' },
              exam_boards: { name: 'Karnataka Board' }
            },
            {
              id: 'sample-karnataka-10th-math-2023',
              title: 'Karnataka Board 10th Mathematics 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 920,
              file_url: 'https://example.com/karnataka-10th-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Karnataka Board' }
            },
            {
              id: 'sample-tamilnadu-10th-social-2023',
              title: 'Tamil Nadu Board 10th Social Science 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 750,
              file_url: 'https://example.com/tamilnadu-10th-social-2023.pdf',
              subjects: { name: 'Social Science' },
              exam_boards: { name: 'Tamil Nadu Board' }
            },
            {
              id: 'sample-tamilnadu-10th-tamil-2023',
              title: 'Tamil Nadu Board 10th Tamil 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 680,
              file_url: 'https://example.com/tamilnadu-10th-tamil-2023.pdf',
              subjects: { name: 'Tamil' },
              exam_boards: { name: 'Tamil Nadu Board' }
            },
            {
              id: 'sample-up-board-10th-hindi-2023',
              title: 'UP Board 10th Hindi 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 1100,
              file_url: 'https://example.com/up-board-10th-hindi-2023.pdf',
              subjects: { name: 'Hindi' },
              exam_boards: { name: 'Uttar Pradesh Board' }
            },
            {
              id: 'sample-up-board-10th-math-2023',
              title: 'UP Board 10th Mathematics 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 1050,
              file_url: 'https://example.com/up-board-10th-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Uttar Pradesh Board' }
            },
            {
              id: 'sample-rajasthan-10th-english-2023',
              title: 'Rajasthan Board 10th English 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 650,
              file_url: 'https://example.com/rajasthan-10th-english-2023.pdf',
              subjects: { name: 'English' },
              exam_boards: { name: 'Rajasthan Board' }
            },
            {
              id: 'sample-gujarat-10th-gujarati-2023',
              title: 'Gujarat Board 10th Gujarati 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 520,
              file_url: 'https://example.com/gujarat-10th-gujarati-2023.pdf',
              subjects: { name: 'Gujarati' },
              exam_boards: { name: 'Gujarat Board' }
            },
            {
              id: 'sample-gujarat-10th-math-2023',
              title: 'Gujarat Board 10th Mathematics 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 580,
              file_url: 'https://example.com/gujarat-10th-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Gujarat Board' }
            },
            {
              id: 'sample-wb-board-10th-bengali-2023',
              title: 'West Bengal Board 10th Bengali 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'Final Exam',
              is_premium: false,
              download_count: 450,
              file_url: 'https://example.com/wb-board-10th-bengali-2023.pdf',
              subjects: { name: 'Bengali' },
              exam_boards: { name: 'West Bengal Board' }
            },
            // Andhra Pradesh Board Papers
            {
              id: 'sample-andhra-10th-math-2023',
              title: 'Andhra Pradesh Board 10th Mathematics 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 890,
              file_url: 'https://example.com/andhra-10th-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            {
              id: 'sample-andhra-10th-science-2023',
              title: 'Andhra Pradesh Board 10th Physical Science 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 780,
              file_url: 'https://example.com/andhra-10th-science-2023.pdf',
              subjects: { name: 'Physical Science' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            {
              id: 'sample-andhra-10th-social-2023',
              title: 'Andhra Pradesh Board 10th Social Studies 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 720,
              file_url: 'https://example.com/andhra-10th-social-2023.pdf',
              subjects: { name: 'Social Studies' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            {
              id: 'sample-andhra-10th-telugu-2023',
              title: 'Andhra Pradesh Board 10th Telugu 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 650,
              file_url: 'https://example.com/andhra-10th-telugu-2023.pdf',
              subjects: { name: 'Telugu' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            {
              id: 'sample-andhra-ipe-1st-year-math-2023',
              title: 'Andhra Pradesh IPE 1st Year Mathematics 2023',
              year: 2023,
              class_level: '+1',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 580,
              file_url: 'https://example.com/andhra-ipe-1st-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            {
              id: 'sample-andhra-ipe-1st-year-physics-2023',
              title: 'Andhra Pradesh IPE 1st Year Physics 2023',
              year: 2023,
              class_level: '+1',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 520,
              file_url: 'https://example.com/andhra-ipe-1st-physics-2023.pdf',
              subjects: { name: 'Physics' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            {
              id: 'sample-andhra-ipe-2nd-year-math-2023',
              title: 'Andhra Pradesh IPE 2nd Year Mathematics 2023',
              year: 2023,
              class_level: '+2',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 610,
              file_url: 'https://example.com/andhra-ipe-2nd-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            {
              id: 'sample-andhra-ipe-2nd-year-chemistry-2023',
              title: 'Andhra Pradesh IPE 2nd Year Chemistry 2023',
              year: 2023,
              class_level: '+2',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 550,
              file_url: 'https://example.com/andhra-ipe-2nd-chemistry-2023.pdf',
              subjects: { name: 'Chemistry' },
              exam_boards: { name: 'Andhra Pradesh Board' }
            },
            // Telangana Board Papers
            {
              id: 'sample-telangana-10th-math-2023',
              title: 'Telangana Board 10th Mathematics 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 920,
              file_url: 'https://example.com/telangana-10th-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Telangana Board' }
            },
            {
              id: 'sample-telangana-10th-science-2023',
              title: 'Telangana Board 10th Physical Science 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 810,
              file_url: 'https://example.com/telangana-10th-science-2023.pdf',
              subjects: { name: 'Physical Science' },
              exam_boards: { name: 'Telangana Board' }
            },
            {
              id: 'sample-telangana-10th-social-2023',
              title: 'Telangana Board 10th Social Studies 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 750,
              file_url: 'https://example.com/telangana-10th-social-2023.pdf',
              subjects: { name: 'Social Studies' },
              exam_boards: { name: 'Telangana Board' }
            },
            {
              id: 'sample-telangana-10th-telugu-2023',
              title: 'Telangana Board 10th Telugu 2023',
              year: 2023,
              class_level: '10th',
              paper_type: 'SSC Final Exam',
              is_premium: false,
              download_count: 680,
              file_url: 'https://example.com/telangana-10th-telugu-2023.pdf',
              subjects: { name: 'Telugu' },
              exam_boards: { name: 'Telangana Board' }
            },
            {
              id: 'sample-telangana-ipe-1st-year-math-2023',
              title: 'Telangana IPE 1st Year Mathematics 2023',
              year: 2023,
              class_level: '+1',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 620,
              file_url: 'https://example.com/telangana-ipe-1st-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Telangana Board' }
            },
            {
              id: 'sample-telangana-ipe-1st-year-physics-2023',
              title: 'Telangana IPE 1st Year Physics 2023',
              year: 2023,
              class_level: '+1',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 560,
              file_url: 'https://example.com/telangana-ipe-1st-physics-2023.pdf',
              subjects: { name: 'Physics' },
              exam_boards: { name: 'Telangana Board' }
            },
            {
              id: 'sample-telangana-ipe-2nd-year-math-2023',
              title: 'Telangana IPE 2nd Year Mathematics 2023',
              year: 2023,
              class_level: '+2',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 650,
              file_url: 'https://example.com/telangana-ipe-2nd-math-2023.pdf',
              subjects: { name: 'Mathematics' },
              exam_boards: { name: 'Telangana Board' }
            },
            {
              id: 'sample-telangana-ipe-2nd-year-chemistry-2023',
              title: 'Telangana IPE 2nd Year Chemistry 2023',
              year: 2023,
              class_level: '+2',
              paper_type: 'IPE Final Exam',
              is_premium: false,
              download_count: 590,
              file_url: 'https://example.com/telangana-ipe-2nd-chemistry-2023.pdf',
              subjects: { name: 'Chemistry' },
              exam_boards: { name: 'Telangana Board' }
            },
            // Andhra University Papers
            {
              id: 'sample-andhra-univ-btech-cse-2023',
              title: 'Andhra University B.Tech CSE Data Structures 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1250,
              file_url: 'https://example.com/andhra-univ-btech-cse-ds-2023.pdf',
              subjects: { name: 'Data Structures' },
              exam_boards: { name: 'Andhra University' }
            },
            {
              id: 'sample-andhra-univ-btech-mech-2023',
              title: 'Andhra University B.Tech Mechanical Engineering 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 980,
              file_url: 'https://example.com/andhra-univ-btech-mech-2023.pdf',
              subjects: { name: 'Mechanical Engineering' },
              exam_boards: { name: 'Andhra University' }
            },
            {
              id: 'sample-andhra-univ-mba-2023',
              title: 'Andhra University MBA Financial Management 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 750,
              file_url: 'https://example.com/andhra-univ-mba-finance-2023.pdf',
              subjects: { name: 'Financial Management' },
              exam_boards: { name: 'Andhra University' }
            },
            {
              id: 'sample-andhra-univ-mca-2023',
              title: 'Andhra University MCA Object Oriented Programming 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 680,
              file_url: 'https://example.com/andhra-univ-mca-oop-2023.pdf',
              subjects: { name: 'Object Oriented Programming' },
              exam_boards: { name: 'Andhra University' }
            },
            {
              id: 'sample-andhra-univ-mtech-cse-2023',
              title: 'Andhra University M.Tech CSE Advanced Algorithms 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 520,
              file_url: 'https://example.com/andhra-univ-mtech-cse-algo-2023.pdf',
              subjects: { name: 'Advanced Algorithms' },
              exam_boards: { name: 'Andhra University' }
            },
            // Osmania University Papers
            {
              id: 'sample-osmania-univ-btech-cse-2023',
              title: 'Osmania University B.Tech CSE Operating Systems 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1450,
              file_url: 'https://example.com/osmania-univ-btech-cse-os-2023.pdf',
              subjects: { name: 'Operating Systems' },
              exam_boards: { name: 'Osmania University' }
            },
            {
              id: 'sample-osmania-univ-btech-ece-2023',
              title: 'Osmania University B.Tech ECE Digital Electronics 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1100,
              file_url: 'https://example.com/osmania-univ-btech-ece-digital-2023.pdf',
              subjects: { name: 'Digital Electronics' },
              exam_boards: { name: 'Osmania University' }
            },
            {
              id: 'sample-osmania-univ-mba-2023',
              title: 'Osmania University MBA Marketing Management 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 890,
              file_url: 'https://example.com/osmania-univ-mba-marketing-2023.pdf',
              subjects: { name: 'Marketing Management' },
              exam_boards: { name: 'Osmania University' }
            },
            {
              id: 'sample-osmania-univ-mca-2023',
              title: 'Osmania University MCA Database Management 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 780,
              file_url: 'https://example.com/osmania-univ-mca-dbms-2023.pdf',
              subjects: { name: 'Database Management' },
              exam_boards: { name: 'Osmania University' }
            },
            {
              id: 'sample-osmania-univ-mtech-civil-2023',
              title: 'Osmania University M.Tech Civil Structural Engineering 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 650,
              file_url: 'https://example.com/osmania-univ-mtech-civil-struct-2023.pdf',
              subjects: { name: 'Structural Engineering' },
              exam_boards: { name: 'Osmania University' }
            },
            // JNTU Hyderabad Papers
            {
              id: 'sample-jntu-hyderabad-btech-cse-2023',
              title: 'JNTU Hyderabad B.Tech CSE Computer Networks 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1650,
              file_url: 'https://example.com/jntu-hyderabad-btech-cse-networks-2023.pdf',
              subjects: { name: 'Computer Networks' },
              exam_boards: { name: 'JNTU Hyderabad' }
            },
            {
              id: 'sample-jntu-hyderabad-btech-it-2023',
              title: 'JNTU Hyderabad B.Tech IT Web Technologies 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1320,
              file_url: 'https://example.com/jntu-hyderabad-btech-it-web-2023.pdf',
              subjects: { name: 'Web Technologies' },
              exam_boards: { name: 'JNTU Hyderabad' }
            },
            {
              id: 'sample-jntu-hyderabad-btech-ece-2023',
              title: 'JNTU Hyderabad B.Tech ECE Microprocessors 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1180,
              file_url: 'https://example.com/jntu-hyderabad-btech-ece-micro-2023.pdf',
              subjects: { name: 'Microprocessors' },
              exam_boards: { name: 'JNTU Hyderabad' }
            },
            {
              id: 'sample-jntu-hyderabad-mtech-cse-2023',
              title: 'JNTU Hyderabad M.Tech CSE Machine Learning 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 950,
              file_url: 'https://example.com/jntu-hyderabad-mtech-cse-ml-2023.pdf',
              subjects: { name: 'Machine Learning' },
              exam_boards: { name: 'JNTU Hyderabad' }
            },
            {
              id: 'sample-jntu-hyderabad-mba-2023',
              title: 'JNTU Hyderabad MBA Human Resource Management 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 720,
              file_url: 'https://example.com/jntu-hyderabad-mba-hrm-2023.pdf',
              subjects: { name: 'Human Resource Management' },
              exam_boards: { name: 'JNTU Hyderabad' }
            },
            // JNTU Kakinada Papers
            {
              id: 'sample-jntu-kakinada-btech-cse-2023',
              title: 'JNTU Kakinada B.Tech CSE Software Engineering 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1380,
              file_url: 'https://example.com/jntu-kakinada-btech-cse-se-2023.pdf',
              subjects: { name: 'Software Engineering' },
              exam_boards: { name: 'JNTU Kakinada' }
            },
            {
              id: 'sample-jntu-kakinada-btech-mech-2023',
              title: 'JNTU Kakinada B.Tech Mechanical Thermodynamics 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1050,
              file_url: 'https://example.com/jntu-kakinada-btech-mech-thermo-2023.pdf',
              subjects: { name: 'Thermodynamics' },
              exam_boards: { name: 'JNTU Kakinada' }
            },
            {
              id: 'sample-jntu-kakinada-btech-ece-2023',
              title: 'JNTU Kakinada B.Tech ECE Control Systems 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 920,
              file_url: 'https://example.com/jntu-kakinada-btech-ece-control-2023.pdf',
              subjects: { name: 'Control Systems' },
              exam_boards: { name: 'JNTU Kakinada' }
            },
            {
              id: 'sample-jntu-kakinada-mtech-civil-2023',
              title: 'JNTU Kakinada M.Tech Civil Geotechnical Engineering 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 680,
              file_url: 'https://example.com/jntu-kakinada-mtech-civil-geotech-2023.pdf',
              subjects: { name: 'Geotechnical Engineering' },
              exam_boards: { name: 'JNTU Kakinada' }
            },
            // JNTU Ananthapur Papers
            {
              id: 'sample-jntu-ananthapur-btech-cse-2023',
              title: 'JNTU Ananthapur B.Tech CSE Database Systems 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 1120,
              file_url: 'https://example.com/jntu-ananthapur-btech-cse-db-2023.pdf',
              subjects: { name: 'Database Systems' },
              exam_boards: { name: 'JNTU Ananthapur' }
            },
            {
              id: 'sample-jntu-ananthapur-btech-ee-2023',
              title: 'JNTU Ananthapur B.Tech Electrical Power Systems 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 890,
              file_url: 'https://example.com/jntu-ananthapur-btech-ee-power-2023.pdf',
              subjects: { name: 'Power Systems' },
              exam_boards: { name: 'JNTU Ananthapur' }
            },
            {
              id: 'sample-jntu-ananthapur-btech-civil-2023',
              title: 'JNTU Ananthapur B.Tech Civil Construction Technology 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 780,
              file_url: 'https://example.com/jntu-ananthapur-btech-civil-const-2023.pdf',
              subjects: { name: 'Construction Technology' },
              exam_boards: { name: 'JNTU Ananthapur' }
            },
            {
              id: 'sample-jntu-ananthapur-mtech-ee-2023',
              title: 'JNTU Ananthapur M.Tech Electrical Power Electronics 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 620,
              file_url: 'https://example.com/jntu-ananthapur-mtech-ee-pe-2023.pdf',
              subjects: { name: 'Power Electronics' },
              exam_boards: { name: 'JNTU Ananthapur' }
            },
            // Shri Venkateshwara University Papers
            {
              id: 'sample-svu-btech-cse-2023',
              title: 'Shri Venkateshwara University B.Tech CSE Artificial Intelligence 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 950,
              file_url: 'https://example.com/svu-btech-cse-ai-2023.pdf',
              subjects: { name: 'Artificial Intelligence' },
              exam_boards: { name: 'Shri Venkateshwara University' }
            },
            {
              id: 'sample-svu-btech-mech-2023',
              title: 'Shri Venkateshwara University B.Tech Mechanical Fluid Mechanics 2023',
              year: 2023,
              class_level: 'UG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 720,
              file_url: 'https://example.com/svu-btech-mech-fluid-2023.pdf',
              subjects: { name: 'Fluid Mechanics' },
              exam_boards: { name: 'Shri Venkateshwara University' }
            },
            {
              id: 'sample-svu-mba-2023',
              title: 'Shri Venkateshwara University MBA Operations Management 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 580,
              file_url: 'https://example.com/svu-mba-operations-2023.pdf',
              subjects: { name: 'Operations Management' },
              exam_boards: { name: 'Shri Venkateshwara University' }
            },
            {
              id: 'sample-svu-mca-2023',
              title: 'Shri Venkateshwara University MCA Mobile Computing 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 520,
              file_url: 'https://example.com/svu-mca-mobile-2023.pdf',
              subjects: { name: 'Mobile Computing' },
              exam_boards: { name: 'Shri Venkateshwara University' }
            },
            {
              id: 'sample-svu-mtech-cse-2023',
              title: 'Shri Venkateshwara University M.Tech CSE Cloud Computing 2023',
              year: 2023,
              class_level: 'PG',
              paper_type: 'University Exam',
              is_premium: false,
              download_count: 450,
              file_url: 'https://example.com/svu-mtech-cse-cloud-2023.pdf',
              subjects: { name: 'Cloud Computing' },
              exam_boards: { name: 'Shri Venkateshwara University' }
            }
          ]
        }

        setPapers(statePapers)
      } catch (error) {
        console.error('Failed to fetch papers:', error)
        // Fallback to sample papers
        setPapers([
          {
            id: 'fallback-maharashtra-10th-math-2023',
            title: 'Maharashtra Board 10th Mathematics 2023',
            year: 2023,
            class_level: '10th',
            paper_type: 'Final Exam',
            is_premium: false,
            download_count: 1250,
            file_url: 'https://example.com/maharashtra-10th-math-2023.pdf',
            subjects: { name: 'Mathematics' },
            exam_boards: { name: 'Maharashtra Board' }
          },
          {
            id: 'fallback-karnataka-10th-science-2023',
            title: 'Karnataka Board 10th Science 2023',
            year: 2023,
            class_level: '10th',
            paper_type: 'Final Exam',
            is_premium: false,
            download_count: 980,
            file_url: 'https://example.com/karnataka-10th-science-2023.pdf',
            subjects: { name: 'Science' },
            exam_boards: { name: 'Karnataka Board' }
          }
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchPapers()
  }, [])

  // Check user authentication and subscription
  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const { data } = await supabase.auth.getUser()
        setIsLoggedIn(!!data?.user)

        if (data?.user) {
          // Check subscription status
          const subscriptionResponse = await fetch('/api/payments/subscription-status', {
            credentials: 'include'
          })
          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json()
            setUserSubscription({
              plan: subscriptionData.plan,
              isActive: subscriptionData.isActive
            })
          }
        }
      } catch (err) {
        console.error('Auth check failed:', err)
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  const handleDownload = async (paperId: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }

    const paper = papers.find(p => p.id === paperId)
    if (!paper) return

    // Check if user is premium (no ads needed)
    const isPremiumUser = userSubscription &&
      (userSubscription.plan === "Student Elite" || userSubscription.plan === "Student Premium") &&
      userSubscription.isActive

    // If premium user or paper is not premium, download directly
    if (isPremiumUser || !paper.is_premium) {
      await downloadPaper(paperId)
      return
    }

    // For free users, show ad first
    setPendingDownloadId(paperId)
    setAdCompleted(false)
    setShowAd(true)
  }

  const handleAdComplete = async () => {
    try {
      // Record ad completion
      const response = await fetch('/api/ads/complete', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setAdCompleted(true)
        toast({
          title: "Ad Completed",
          description: "Thank you for watching! Your download will start shortly.",
        })

        // Close ad modal after a short delay
        setTimeout(() => {
          setShowAd(false)
          if (pendingDownloadId) {
            downloadPaper(pendingDownloadId)
            setPendingDownloadId(null)
          }
        }, 2000)
      } else {
        toast({
          title: "Error",
          description: "Failed to record ad completion. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Ad completion error:', error)
      toast({
        title: "Error",
        description: "Failed to complete ad. Please try again.",
        variant: "destructive",
      })
    }
  }

  const downloadPaper = async (paperId: string) => {
    setDownloadingPaperId(paperId)
    try {
      const paper = papers.find(p => p.id === paperId)

      // Handle sample papers (they don't have real downloads)
      if (paper && paper.file_url && paper.file_url.startsWith('https://example.com/')) {
        toast({
          title: "Sample Paper",
          description: "This is a sample paper. Visit the official board website for real question papers.",
          variant: "default",
        })

        // Open the official board website
        const boardUrls: { [key: string]: string } = {
          'Maharashtra Board': 'https://mahahsscboard.maharashtra.gov.in',
          'Karnataka Board': 'https://sslc.karnataka.gov.in',
          'Tamil Nadu Board': 'https://tnresults.nic.in',
          'Uttar Pradesh Board': 'https://upmsp.edu.in',
          'Rajasthan Board': 'https://rajeduboard.rajasthan.gov.in',
          'Gujarat Board': 'https://www.gseb.org',
          'West Bengal Board': 'https://wbbse.org',
          'Andhra Pradesh Board': 'https://bie.ap.gov.in',
          'Telangana Board': 'https://bse.telangana.gov.in',
          'Andhra University': 'https://andhrauniversity.edu.in',
          'Osmania University': 'https://osmania.ac.in',
          'JNTU Hyderabad': 'https://jntuh.ac.in',
          'JNTU Kakinada': 'https://jntuk.edu.in',
          'JNTU Ananthapur': 'https://jntua.ac.in',
          'Shri Venkateshwara University': 'https://svuniversity.edu.in'
        }

        const boardUrl = boardUrls[paper.exam_boards?.name || '']
        if (boardUrl) {
          window.open(boardUrl, '_blank')
        }

        return
      }

      const response = await fetch(`/api/papers/${paperId}/download`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        // Trigger download
        const link = document.createElement('a')
        link.href = data.downloadUrl
        link.download = data.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast({
          title: "Download Started",
          description: "Your paper download has started.",
        })
      } else if (response.status === 402) {
        // Ad required
        const errorData = await response.json()
        toast({
          title: "Ad Required",
          description: errorData.message,
          variant: "destructive",
        })
        // Show ad again
        setPendingDownloadId(paperId)
        setShowAd(true)
      } else if (response.status === 403) {
        toast({
          title: "Premium Required",
          description: "This paper requires a premium subscription.",
          variant: "destructive",
        })
      } else {
        const errorText = await response.text()
        console.error('Download failed with status:', response.status, errorText)
        throw new Error(`Download failed: ${response.status} ${errorText}`)
      }
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download paper. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingPaperId(null)
    }
  }

  if (loading) {
    return (
      <section id="papers" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Find Past Papers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Loading papers...
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="papers" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">University & Board Question Papers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access 10th class, IPE (+1/+2), and university exam papers from Andhra University, Osmania University, JNTU Hyderabad, JNTU Kakinada, JNTU Ananthapur, Shri Venkateshwara University, and all major state boards. Free downloads with ads for all users!
          </p>
          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground mt-2">
              Login to download papers • Free users can download unlimited papers with ads
            </p>
          )}

          {/* 10th Class Highlight */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">10</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200">10th Class Papers - Most Popular</h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300">
              SSC/10th standard exam papers from all major state boards. Perfect for board exam preparation!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {/* Sort papers to show 10th class and university papers first */}
          {papers
            .sort((a, b) => {
              // Prioritize 10th class papers
              if (a.class_level === '10th' && b.class_level !== '10th') return -1
              if (a.class_level !== '10th' && b.class_level === '10th') return 1
              // Then prioritize university papers
              const universityBoards = ['Andhra University', 'Osmania University', 'JNTU Hyderabad', 'JNTU Kakinada', 'JNTU Ananthapur', 'Shri Venkateshwara University']
              const aIsUniversity = universityBoards.includes(a.exam_boards?.name || '')
              const bIsUniversity = universityBoards.includes(b.exam_boards?.name || '')
              if (aIsUniversity && !bIsUniversity) return -1
              if (!aIsUniversity && bIsUniversity) return 1
              // Then sort by download count (most popular first)
              return b.download_count - a.download_count
            })
            .map((paper) => (
            <Card key={paper.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{paper.title}</CardTitle>
                  {paper.is_premium && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{paper.exam_boards?.name || 'Unknown Board'}</Badge>
                  <Badge variant="outline">{paper.year}</Badge>
                  <Badge variant="outline">{paper.subjects?.name || 'Unknown Subject'}</Badge>
                  <Badge variant="outline">{paper.class_level}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Type: {paper.paper_type}</span>
                    <span>{paper.download_count} downloads</span>
                  </div>
                  <Button
                    onClick={() => handleDownload(paper.id)}
                    disabled={downloadingPaperId === paper.id}
                    className="w-full mt-2"
                    variant={paper.is_premium ? "default" : "outline"}
                  >
                    {downloadingPaperId === paper.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Paper
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {papers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No papers found in our database.</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Find State Board Papers Online</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                Visit official state board websites for the latest question papers:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <a href="https://andhrauniversity.edu.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Andhra University</a>
                <a href="https://osmania.ac.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Osmania University</a>
                <a href="https://jntuh.ac.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">JNTU Hyderabad</a>
                <a href="https://jntuk.edu.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">JNTU Kakinada</a>
                <a href="https://jntua.ac.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">JNTU Ananthapur</a>
                <a href="https://svuniversity.edu.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Shri Venkateshwara University</a>
                <a href="https://bie.ap.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Andhra Pradesh Board</a>
                <a href="https://bse.telangana.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Telangana Board</a>
                <a href="https://mahahsscboard.maharashtra.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Maharashtra Board</a>
                <a href="https://sslc.karnataka.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Karnataka Board</a>
                <a href="https://tnresults.nic.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Tamil Nadu Board</a>
                <a href="https://upmsp.edu.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">UP Board</a>
                <a href="https://rajeduboard.rajasthan.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Rajasthan Board</a>
                <a href="https://www.gseb.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Gujarat Board</a>
              </div>
            </div>
          </div>
        )}

        {/* Ad Modal for Free Users */}
        {showAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-primary">Watch Ad to Download</h3>
              <p className="mb-6 text-muted-foreground">
                Please watch this short ad to access your paper. Free users can download unlimited papers!
              </p>
              <div className="mb-6">
                {!adCompleted ? (
                  <div className="space-y-4">
                    {/* Replace with real ad embed or video */}
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-2">Ad Content Here</p>
                      <div className="bg-blue-500 text-white px-4 py-2 rounded">
                        Sample Ad Banner
                      </div>
                    </div>
                    <Button onClick={handleAdComplete} className="w-full">
                      I Watched the Ad - Continue to Download
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-green-600 font-semibold">✓ Ad Completed!</div>
                    <p className="text-sm text-muted-foreground">Starting download...</p>
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Login/Signup Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-primary">Login Required</h3>
              <p className="mb-6 text-muted-foreground">
                Please login or sign up to download papers. Free users can download unlimited papers with ads!
              </p>
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
