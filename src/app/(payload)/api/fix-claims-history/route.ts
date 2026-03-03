import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const db = payload.db.drizzle
    const fixes: string[] = []

    // Check claims_history columns
    const histCols = await db.execute(
      sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims_history' ORDER BY ordinal_position`
    )
    const histColNames = histCols.rows.map((r: Record<string, unknown>) => r.column_name as string)

    if (!histColNames.includes('id')) {
      await db.execute(sql`ALTER TABLE claims_history ADD COLUMN id varchar`)
      fixes.push('Added id varchar column to claims_history')
    } else {
      const idCol = histCols.rows.find((r: Record<string, unknown>) => r.column_name === 'id')
      if (idCol && (idCol as Record<string, unknown>).data_type === 'integer') {
        await db.execute(sql`ALTER TABLE claims_history DROP COLUMN id`)
        await db.execute(sql`ALTER TABLE claims_history ADD COLUMN id varchar`)
        fixes.push('Changed claims_history.id from integer to varchar')
      }
    }

    // Check claims_rels columns
    const relsCols = await db.execute(
      sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims_rels' ORDER BY ordinal_position`
    )
    const relsColNames = relsCols.rows.map((r: Record<string, unknown>) => r.column_name as string)

    if (!relsColNames.includes('id')) {
      await db.execute(sql`ALTER TABLE claims_rels ADD COLUMN id serial PRIMARY KEY`)
      fixes.push('Added id serial PRIMARY KEY to claims_rels')
    }

    // Clean up test claims
    await db.execute(sql`DELETE FROM claims_history WHERE _parent_id IN (SELECT id FROM claims WHERE claim_number IN ('TEST001', 'TEST003'))`)
    await db.execute(sql`DELETE FROM claims_rels WHERE parent_id IN (SELECT id FROM claims WHERE claim_number IN ('TEST001', 'TEST003'))`)
    const deleted = await db.execute(sql`DELETE FROM claims WHERE claim_number IN ('TEST001', 'TEST003') RETURNING id, claim_number`)
    for (const row of deleted.rows) {
      fixes.push(`Deleted test claim ${(row as Record<string, unknown>).claim_number}`)
    }

    return NextResponse.json({ success: true, fixes, historyColumns: histColNames, relsColumns: relsColNames })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
