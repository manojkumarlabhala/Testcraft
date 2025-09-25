"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
// ...existing code...
// ...existing code...

interface ExamPaper {
  id: number;
  title: string;
  examBoard: string;
  year: string;
  subject: string;
  class: string;
  difficulty: string;
  duration: string;
  maxMarks: string;
  paperType: string;
  downloadCount: number;
  rating: number;
  fileSize: string;
  downloadUrl?: string;
}

const examPapers: ExamPaper[] = [
  {
    id: 1,
    title: "CBSE Previous Year Question Papers",
    examBoard: "CBSE",
    year: "Various",
    subject: "All Subjects",
    class: "Class 10, 12",
    difficulty: "All",
    duration: "Varies",
    maxMarks: "Varies",
    paperType: "Theory/MCQ",
    downloadCount: 50000,
    rating: 4.8,
    fileSize: "Varies",
    downloadUrl: "https://cbseacademic.nic.in/circulars.html"
  },
  {
    id: 2,
    title: "UPSC Previous Year Question Papers",
    examBoard: "UPSC",
    year: "Various",
    subject: "All Subjects",
    class: "N/A",
    difficulty: "All",
    duration: "Varies",
    maxMarks: "Varies",
    paperType: "Theory/MCQ",
    downloadCount: 40000,
    rating: 4.9,
    fileSize: "Varies",
    downloadUrl: "https://upsc.gov.in/examinations/previous-question-papers"
  },
  {
    id: 3,
    title: "JEE Main Previous Year Papers",
    examBoard: "JEE",
    year: "Various",
    subject: "Physics, Chemistry, Mathematics",
    class: "N/A",
    difficulty: "All",
    duration: "Varies",
    maxMarks: "Varies",
    paperType: "MCQ",
    downloadCount: 35000,
    rating: 4.7,
    fileSize: "Varies",
    downloadUrl: "https://jeemain.nta.ac.in/"
  },
  {
    id: 4,
    title: "NEET Previous Year Papers",
    examBoard: "NEET",
    year: "Various",
    subject: "Biology, Physics, Chemistry",
    class: "N/A",
    difficulty: "All",
    duration: "Varies",
    maxMarks: "Varies",
    paperType: "MCQ",
    downloadCount: 30000,
    rating: 4.7,
    fileSize: "Varies",
    downloadUrl: "https://neet.nta.nic.in/"
  },
  {
    id: 5,
    title: "UGC NET Previous Year Papers",
    examBoard: "UGC NET",
    year: "Various",
    subject: "All Subjects",
    class: "Postgraduate",
    difficulty: "All",
    duration: "Varies",
    maxMarks: "Varies",
    paperType: "MCQ",
    downloadCount: 25000,
    rating: 4.6,
    fileSize: "Varies",
    downloadUrl: "https://ugcnet.nta.ac.in/AnswerKey_june2025.html"
  }
];
export function PapersSection() {
  const [showAd, setShowAd] = useState(false);
  const [pendingDownloadUrl, setPendingDownloadUrl] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const filteredPapers: ExamPaper[] = examPapers;

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
  }, []);

  const handleDownload = (downloadUrl: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setPendingDownloadUrl(downloadUrl);
    setShowAd(true);
  };

  const handleAdClose = () => {
    setShowAd(false);
    if (pendingDownloadUrl) {
      window.open(pendingDownloadUrl, "_blank");
      setPendingDownloadUrl(null);
    }
  };

  return (
    <section id="papers" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Find Past Papers</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Search through our extensive collection of exam papers from top Indian boards
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredPapers.map((paper: ExamPaper) => (
            <Card key={paper.id} className="shadow-md">
              <CardHeader>
                <CardTitle>{paper.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>{paper.examBoard}</Badge>
                  <Badge>{paper.year}</Badge>
                  <Badge>{paper.subject}</Badge>
                  <Badge>{paper.class}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <span>Type: {paper.paperType}</span>
                  <span>Difficulty: {paper.difficulty}</span>
                  <span>Duration: {paper.duration}</span>
                  <span>Max Marks: {paper.maxMarks}</span>
                  <span>Downloads: {paper.downloadCount}</span>
                  <span>Rating: {paper.rating}</span>
                  <span>File Size: {paper.fileSize}</span>
                  {paper.downloadUrl && (
                    <button
                      className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                      onClick={() => handleDownload(paper.downloadUrl as string)}
                    >
                      Download Paper
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No papers found matching your criteria.</p>
          </div>
        )}
        {/* Ad Modal for Free Users */}
        {showAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-primary">Sponsored Ad</h3>
              <p className="mb-6 text-muted-foreground">Please watch this ad to access your paper.</p>
              <div className="mb-6">
                {/* Replace with real ad embed or video */}
                <iframe
                  width="320"
                  height="180"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Ad"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              </div>
              <button
                className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80"
                onClick={handleAdClose}
              >
                Continue to Paper
              </button>
            </div>
          </div>
        )}
        {/* Login/Signup Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
              <h3 className="text-xl font-bold mb-4 text-primary">Login Required</h3>
              <p className="mb-6 text-muted-foreground">Please login or sign up to download papers.</p>
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
  );
}
