import { createClient } from "@/lib/supabase/server"
import type { ExamBoard, Subject, ExamPaper, MockTest, UserProfile } from "./types"

export async function getExamBoards(): Promise<ExamBoard[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("exam_boards").select("*").eq("is_active", true).order("name")

  if (error) throw error
  return data || []
}

export async function getSubjectsByBoard(examBoardId: string): Promise<Subject[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("exam_board_id", examBoardId)
    .eq("is_active", true)
    .order("name")

  if (error) throw error
  return data || []
}

export async function getExamPapers(filters?: {
  examBoardId?: string
  subjectId?: string
  classLevel?: string
  year?: number
  paperType?: string
  searchTerm?: string
}): Promise<ExamPaper[]> {
  const supabase = await createClient()

  let query = supabase.from("exam_papers").select(`
      *,
      subjects(name),
      exam_boards(name)
    `)

  if (filters?.examBoardId) {
    query = query.eq("exam_board_id", filters.examBoardId)
  }

  if (filters?.subjectId) {
    query = query.eq("subject_id", filters.subjectId)
  }

  if (filters?.classLevel) {
    query = query.eq("class_level", filters.classLevel)
  }

  if (filters?.year) {
    query = query.eq("year", filters.year)
  }

  if (filters?.paperType) {
    query = query.eq("paper_type", filters.paperType)
  }

  if (filters?.searchTerm) {
    query = query.ilike("title", `%${filters.searchTerm}%`)
  }

  query = query.order("created_at", { ascending: false })

  try {
    const { data, error } = await query
    if (error) {
      console.error("getExamPapers query error (exam_papers may be missing):", error)
      return []
    }
    return data || []
  } catch (err) {
    console.error("getExamPapers failed (possibly missing table):", err)
    return []
  }
}

export async function getMockTests(filters?: {
  examBoardId?: string
  subjectId?: string
  classLevel?: string
  difficultyLevel?: string
}): Promise<MockTest[]> {
  const supabase = await createClient()

  let query = supabase.from("mock_tests").select(`
      *,
      subjects(name),
      exam_boards(name)
    `)

  if (filters?.examBoardId) {
    query = query.eq("exam_board_id", filters.examBoardId)
  }

  if (filters?.subjectId) {
    query = query.eq("subject_id", filters.subjectId)
  }

  if (filters?.classLevel) {
    query = query.eq("class_level", filters.classLevel)
  }

  if (filters?.difficultyLevel) {
    query = query.eq("difficulty_level", filters.difficultyLevel)
  }

  query = query.order("created_at", { ascending: false })

  const { data, error } = await query

  if (error) throw error
  return data || []
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateDownloadCount(paperId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.rpc("increment_download_count", {
    paper_id: paperId,
  })

  if (error) throw error
}

export async function recordUserDownload(userId: string, paperId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("user_downloads").insert({
    user_id: userId,
    exam_paper_id: paperId,
  })

  if (error) throw error
}

export async function addToFavorites(userId: string, paperId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("user_favorites").insert({
    user_id: userId,
    exam_paper_id: paperId,
  })

  if (error) throw error
}

export async function removeFromFavorites(userId: string, paperId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("user_favorites").delete().eq("user_id", userId).eq("exam_paper_id", paperId)

  if (error) throw error
}

export async function getUserFavorites(userId: string): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("user_favorites").select("exam_paper_id").eq("user_id", userId)

  if (error) throw error
  return data?.map((item) => item.exam_paper_id) || []
}
