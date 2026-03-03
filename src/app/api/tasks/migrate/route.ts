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
      ) as "exists"
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
    const existingCols = new Set(
      colsRes.rows?.map((r: Record<string, unknown>) => r.column_name as string) || []
    )
    results.push(`Existing task columns: ${[...existingCols].join(', ')}`)

    // 3. Add missing columns
    if (!existingCols.has('group_id')) {
      await db.execute(sql`ALTER TABLE "tasks" ADD COLUMN "group_id" integer`)
      results.push('Added column: group_id')
    } else {
      results.push('Column already exists: group_id')
    }

    if (!existingCols.has('group_order')) {
      await db.execute(sql`ALTER TABLE "tasks" ADD COLUMN "group_order" integer DEFAULT 0`)
      results.push('Added column: group_order')
    } else {
      results.push('Column already exists: group_order')
    }

    if (!existingCols.has('exchange_change_key')) {
      await db.execute(sql`ALTER TABLE "tasks" ADD COLUMN "exchange_change_key" varchar`)
      results.push('Added column: exchange_change_key')
    } else {
      results.push('Column already exists: exchange_change_key')
    }

    if (!existingCols.has('exchange_synced_at')) {
      await db.execute(sql`ALTER TABLE "tasks" ADD COLUMN "exchange_synced_at" timestamptz`)
      results.push('Added column: exchange_synced_at')
    } else {
      results.push('Column already exists: exchange_synced_at')
    }

    // 4. Verify: try a tasks query
    const testQuery = await payload.find({
      collection: 'tasks',
      limit: 1,
    })
    results.push(`Verify OK: tasks query returned ${testQuery.totalDocs} total docs`)

    return NextResponse.json({ success: true, results })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    results.push(`Error: ${msg}`)
    return NextResponse.json({ success: false, results, error: msg }, { status: 500 })
  }
}
