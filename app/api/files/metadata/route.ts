import { head } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get("pathname")
    if (!pathname) {
      return NextResponse.json({ error: "Pathname required" }, { status: 400 })
    }
    const metadata = await head(pathname)
    return NextResponse.json(metadata)
  } catch (error) {
    console.error("File metadata error:", error)
    return NextResponse.json({ error: "Failed to fetch metadata" }, { status: 500 })
  }
}
