"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar, User, Eye } from "lucide-react"

interface FileCardProps {
  file: {
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
  onDownload: (fileId: string, filename: string) => void
  getFileIcon: (fileType: string) => React.ReactNode
  formatFileSize: (bytes: number) => string
}

export function FileCard({ file, onDownload, getFileIcon, formatFileSize }: FileCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getFileIcon(file.file_type)}
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-medium truncate">{file.filename}</CardTitle>
              <CardDescription className="text-xs">{formatFileSize(file.file_size)}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="text-xs">
            {file.category.replace("-", " ")}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {file.subject}
          </Badge>
          {file.exam_board && (
            <Badge variant="outline" className="text-xs">
              {file.exam_board}
            </Badge>
          )}
          {file.class && (
            <Badge variant="outline" className="text-xs">
              Class {file.class}
            </Badge>
          )}
        </div>

        {file.description && <p className="text-xs text-muted-foreground line-clamp-2">{file.description}</p>}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{file.uploader.full_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{file.download_count}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{typeof window !== "undefined" ? new Date(file.created_at).toLocaleDateString() : new Date(file.created_at).toISOString().split('T')[0]}</span>
          </div>
        </div>

        <Button size="sm" className="w-full gap-2" onClick={() => onDownload(file.id, file.filename)}>
          <Download className="h-4 w-4" />
          Download
        </Button>
      </CardContent>
    </Card>
  )
}
