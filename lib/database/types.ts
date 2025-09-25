export interface ExamBoard {
  id: string
  name: string
  description: string
  logo_url: string
  is_active: boolean
  created_at: string
}

export interface Subject {
  id: string
  name: string
  class_level: string
  exam_board_id: string
  is_active: boolean
  created_at: string
}

export interface ExamPaper {
  id: string
  title: string
  subject_id: string
  exam_board_id: string
  class_level: string
  year: number
  paper_type: string
  file_url: string
  file_size: number
  is_premium: boolean
  download_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface MockTest {
  id: string
  title: string
  description: string
  subject_id: string
  exam_board_id: string
  class_level: string
  duration_minutes: number
  total_questions: number
  total_marks: number
  difficulty_level: string
  is_ai_generated: boolean
  is_premium: boolean
  attempt_count: number
  created_at: string
  updated_at: string
}

export interface MockTestQuestion {
  id: string
  mock_test_id: string
  question_text: string
  question_type: string
  options: Record<string, any>
  correct_answer: string
  explanation: string
  marks: number
  difficulty: string
  question_order: number
  created_at: string
}

export interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  subscription_plan: string
  subscription_expires_at?: string
  created_at: string
  updated_at: string
}

export interface UserTestAttempt {
  id: string
  user_id: string
  mock_test_id: string
  score: number
  total_marks: number
  percentage: number
  time_taken_minutes: number
  answers: Record<string, any>
  is_completed: boolean
  started_at: string
  completed_at?: string
}

export interface PaymentOrder {
  id: string
  user_id: string
  amount: number
  currency: string
  plan_type: string
  status: string
  razorpay_order_id?: string
  razorpay_payment_id?: string
  razorpay_signature?: string
  created_at: string
  completed_at?: string
}

export interface Analytics {
  id: string
  user_id: string
  event_type: string
  event_data: Record<string, any>
  created_at: string
}
