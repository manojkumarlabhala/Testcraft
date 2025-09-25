import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server-client"
import fs from 'fs'
import path from 'path'

export async function POST() {
  try {
    const supabase = createServerClient()

    // Read the analytics functions SQL file
    const sqlFilePath = path.join(process.cwd(), 'scripts', '003_create_analytics_functions.sql')
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')

    // Split into individual statements and clean them up
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('GRANT'))

    console.log(`Found ${statements.length} SQL statements to execute`)

    let successCount = 0
    let errorCount = 0

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}`)
          const { error } = await supabase.rpc('exec_sql', {
            sql: statement + ';'
          })

          if (error) {
            console.error(`Error in statement ${i + 1}:`, error.message)
            errorCount++
          } else {
            successCount++
          }
        } catch (err) {
          console.error(`Exception in statement ${i + 1}:`, err)
          errorCount++
        }
      }
    }

    console.log(`Completed: ${successCount} successful, ${errorCount} errors`)

    return NextResponse.json({
      success: errorCount === 0,
      message: `Analytics functions creation completed: ${successCount} successful, ${errorCount} errors`,
      stats: { successCount, errorCount, total: statements.length }
    })

  } catch (error) {
    console.error("Error creating analytics functions:", error)
    return NextResponse.json({ error: "Failed to create analytics functions" }, { status: 500 })
  }
}
