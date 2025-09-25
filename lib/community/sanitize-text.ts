import { containsInappropriateContent } from "@/lib/community/content-filter"

export function sanitizeText(text: string): string {
  if (containsInappropriateContent(text)) {
    return "[Blocked: Inappropriate Content]"
  }
  // Remove emails, phone numbers, and other personal info
  let sanitized = text.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, "[hidden email]")
  sanitized = sanitized.replace(/\b\d{10}\b/g, "[hidden phone]")
  sanitized = sanitized.replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, "[hidden phone]")
  // Add more patterns as needed
  return sanitized
}
