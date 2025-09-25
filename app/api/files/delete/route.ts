import { del } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get("pathname")
    if (!pathname) {
      return NextResponse.json({ error: "Pathname required" }, { status: 400 })
    }
    await del(pathname)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("File delete error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
