"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileText, ImageIcon, File, Filter, Plus } from "lucide-react"
import { toast } from "sonner"
import { FileUploadDialog } from "@/components/files/file-upload-dialog"
import { FileCard } from "@/components/files/file-card"

interface FileItem {
  id: string
  filename: string
  file_url: string
  file_size: number
  file_type: string
  category: string
  subject: string
  exam_board: string
  class: string
  description: string
  created_at: string
  uploader: { full_name: string }
  download_count: number
}

const categories = ["question-papers", "study-materials", "notes", "solutions", "reference-books"]
const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Hindi",
  "History",
  "Geography",
  "Economics",
  "Political Science",
]
const examBoards = ["CBSE", "ICSE", "State Board", "UGC Universities", "Graduation", "Postgraduate"]

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      })

      if (selectedCategory) params.append("category", selectedCategory)
      if (selectedSubject) params.append("subject", selectedSubject)
      if (selectedExamBoard) params.append("examBoard", selectedExamBoard)
      if (selectedClass) params.append("class", selectedClass)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/files?${params}`)
      if (!response.ok) throw new Error("Failed to fetch files")

      const data = await response.json()
      setFiles(data.files)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error("Error fetching files:", error)
      toast.error("Failed to load files")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [currentPage, selectedCategory, selectedSubject, selectedExamBoard, selectedClass])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchFiles()
  }

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Download failed")

      const data = await response.json()

      // Create download link
      const link = document.createElement("a")
      link.href = data.downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast.success("Download started")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download file")
    }
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedSubject("")
    setSelectedExamBoard("")
    setSelectedClass("")
    setSearchTerm("")
    setCurrentPage(1)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return <ImageIcon className="h-5 w-5" />
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Study Materials</h1>
            <p className="text-muted-foreground">Access and share question papers, notes, and study resources</p>
          </div>
          <Button onClick={() => setShowUploadDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Upload File
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedExamBoard} onValueChange={setSelectedExamBoard}>
                <SelectTrigger>
                  <SelectValue placeholder="Board" />
                </SelectTrigger>
                <SelectContent>
                  {examBoards.map((board) => (
                    <SelectItem key={board} value={board}>
                      {board}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Input placeholder="Class" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} />
                <Button variant="outline" onClick={clearFilters} size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Files Grid */}
        {loading ? (
          <div className="text-center py-12">Loading files...</div>
        ) : files.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No files found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or upload some files</p>
              <Button onClick={() => setShowUploadDialog(true)}>Upload First File</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={handleDownload}
                getFileIcon={getFileIcon}
                formatFileSize={formatFileSize}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Upload Dialog */}
        <FileUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onUploadSuccess={() => {
            setShowUploadDialog(false)
            fetchFiles()
          }}
        />
      </div>
    </div>
  )
}
