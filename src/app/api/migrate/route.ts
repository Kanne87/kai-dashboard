import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sql } from 'drizzle-orm'

export async function POST() {
  const results: string[] = []

  try {
    const payload = await getPayload({ config })
    const db = payload.db.drizzle

    // 1. Check if task_groups table exists
    const tgCheck = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'task_groups'
      ) as exists
    `)
    const tgExists = tgCheck.rows?.[0]?.exists === true

    if (!tgExists) {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "task_groups" (
          "id" serial PRIMARY KEY,
          "title" varchar NOT NULL,
          "source" varchar DEFAULT 'manual',
          "appointment_ref" varchar,
          "client_id" integer,
          "household_id" integer,
          "tenant_id" integer,
          "updated_at" timestamptz DEFAULT now() NOT NULL,
          "created_at" timestamptz DEFAULT now() NOT NULL
        )
      `)
      results.push('Created task_groups table')
    } else {
      results.push('task_groups table already exists')
    }

    // 2. Check which columns exist on tasks table
    const colsRes = await db.execute(sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'tasks'
    `)
    const existingCols = new Set(colsRes.rows?.map((r: any) => r.column_name) || [])
    results.push(`Existing task columns: ${[...existingCols].join(', ')}`)

    // 3. Add missing columns
    const migrations: Array<{ col: string; query: ReturnType<typeof sql> }> = [
      { col: 'group_id', query: sql`ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "group_id" integer` },
      { col: 'group_order', query: sql`ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "group_order" integer DEFAULT 0` },
      { col: 'exchange_change_key', query: sql`ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "exchange_change_key" varchar` },
      { col: 'exchange_synced_at', query: sql`ALTER TABLE "tasks" ADD COLUMN IF NOT EXISTS "exchange_synced_at" timestamptz` },
    ]

    for (const m of migrations) {
      if (!existingCols.has(m.col)) {
        await db.execute(m.query)
        results.push(`Added column: ${m.col}`)
      } else {
        results.push(`Column already exists: ${m.col}`)
      }
    }

    // 4. Quick verify: try reading tasks
    const testQuery = await payload.find({
      collection: 'tasks',
      limit: 1,
    })
    results.push(`Verify: tasks query returned ${testQuery.totalDocs} total docs`)

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    results.push(`Error: ${error.message}`)
    return NextResponse.json({ success: false, results, error: error.message }, { status: 500 })
  }
}
