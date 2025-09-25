import { head } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")
    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 })
    }
    // Get file metadata from Vercel Blob
    const metadata = await head(filename)
    if (!metadata) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }
    return NextResponse.json(metadata)
  } catch (error) {
    console.error("File fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
  }
}
