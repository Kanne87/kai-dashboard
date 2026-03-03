import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sql } from 'drizzle-orm'

const EWS_URL = process.env.EWS_MIDDLEWARE_URL || 'https://exchange.kailohmann.de'
const EWS_KEY = process.env.EWS_API_KEY || ''

// GET /api/tasks/sync – Run DB migration (temporary, remove after use)
export async function GET() {
  const results: string[] = []

  try {
    const payload = await getPayload({ config })
    const db = payload.db.drizzle

    // Check if task_groups table exists
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
      results.push('task_groups table exists')
    }

    // Check columns on tasks
    const colsRes = await db.execute(sql`
      SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks'
    `)
    const cols = new Set(
      colsRes.rows?.map((r: Record<string, unknown>) => r.column_name as string) || []
    )
    results.push(`Columns: ${[...cols].join(', ')}`)

    // Add missing columns
    const toAdd: Array<[string, ReturnType<typeof sql>]> = [
      ['group_id', sql`ALTER TABLE "tasks" ADD COLUMN "group_id" integer`],
      ['group_order', sql`ALTER TABLE "tasks" ADD COLUMN "group_order" integer DEFAULT 0`],
      ['exchange_change_key', sql`ALTER TABLE "tasks" ADD COLUMN "exchange_change_key" varchar`],
      ['exchange_synced_at', sql`ALTER TABLE "tasks" ADD COLUMN "exchange_synced_at" timestamptz`],
    ]

    for (const [col, query] of toAdd) {
      if (!cols.has(col)) {
        await db.execute(query)
        results.push(`Added: ${col}`)
      }
    }

    // Verify
    const test = await payload.find({ collection: 'tasks', limit: 1 })
    results.push(`Verify: ${test.totalDocs} tasks readable`)

    return NextResponse.json({ success: true, results })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    results.push(`Error: ${msg}`)
    return NextResponse.json({ success: false, results, error: msg }, { status: 500 })
  }
}

// POST /api/tasks/sync – Exchange sync
export async function POST() {
  const payload = await getPayload({ config })

  try {
    const ewsRes = await fetch(`${EWS_URL}/tasks?limit=200`, {
      headers: { 'x-api-key': EWS_KEY },
    })
    const ewsData = await ewsRes.json()
    const exchangeTasks = ewsData.items || []

    const payloadTasks = await payload.find({
      collection: 'tasks',
      where: { exchangeItemId: { exists: true } },
      limit: 500,
    })

    const payloadMap = new Map(
      payloadTasks.docs.map((t: any) => [t.exchangeItemId, t]),
    )

    let updated = 0
    let created = 0

    for (const ewsTask of exchangeTasks) {
      const existing = payloadMap.get(ewsTask.id)

      if (existing) {
        if (ewsTask.changeKey && ewsTask.changeKey !== existing.exchangeChangeKey) {
          await payload.update({
            collection: 'tasks',
            id: existing.id,
            data: {
              title: ewsTask.subject,
              dueDate: ewsTask.dueDate || null,
              status: ewsTask.status === 'Completed' ? 'done' : 'open',
              priority: ewsTask.importance === 'High',
              exchangeChangeKey: ewsTask.changeKey,
              exchangeSyncedAt: new Date().toISOString(),
            },
          })
          updated++
        }
      } else {
        if (ewsTask.status !== 'Completed') {
          await payload.create({
            collection: 'tasks',
            data: {
              title: ewsTask.subject,
              dueDate: ewsTask.dueDate || null,
              status: 'open',
              category: 'aufgabe',
              priority: ewsTask.importance === 'High',
              source: 'exchange_import',
              exchangeItemId: ewsTask.id,
              exchangeChangeKey: ewsTask.changeKey || null,
              exchangeSyncedAt: new Date().toISOString(),
            },
          })
          created++
        }
      }
    }

    return NextResponse.json({ success: true, updated, created, total: exchangeTasks.length })
  } catch (error) {
    console.error('[Exchange Sync] Error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
