import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    const db = payload.db.drizzle

    // Fix claims_history: add varchar id column (Payload uses hex string IDs for array rows)
    const fixes: string[] = []

    // Check if id column exists on claims_history
    const histCols = await db.execute({
      sql: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims_history' ORDER BY ordinal_position`,
      params: [],
    })
    const histColNames = histCols.rows.map((r: any) => r.column_name)
    console.log('claims_history columns:', histColNames)

    if (!histColNames.includes('id')) {
      await db.execute({ sql: `ALTER TABLE claims_history ADD COLUMN id varchar`, params: [] })
      fixes.push('Added id varchar column to claims_history')
    } else {
      // Check if it's integer type and needs to be varchar
      const idCol = histCols.rows.find((r: any) => r.column_name === 'id')
      if (idCol && (idCol as any).data_type === 'integer') {
        // Drop and recreate as varchar
        await db.execute({ sql: `ALTER TABLE claims_history DROP COLUMN id`, params: [] })
        await db.execute({ sql: `ALTER TABLE claims_history ADD COLUMN id varchar`, params: [] })
        fixes.push('Changed claims_history.id from integer to varchar')
      }
    }

    // Same check for claims_rels
    const relsCols = await db.execute({
      sql: `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims_rels' ORDER BY ordinal_position`,
      params: [],
    })
    const relsColNames = relsCols.rows.map((r: any) => r.column_name)
    console.log('claims_rels columns:', relsColNames)

    if (!relsColNames.includes('id')) {
      await db.execute({ sql: `ALTER TABLE claims_rels ADD COLUMN id serial PRIMARY KEY`, params: [] })
      fixes.push('Added id serial PRIMARY KEY to claims_rels')
    }

    // Also clean up any broken claims that were created without history
    const brokenClaims = await db.execute({
      sql: `SELECT id, claim_number FROM claims WHERE claim_number IN ('TEST001', 'TEST003')`,
      params: [],
    })
    for (const row of brokenClaims.rows) {
      const cid = (row as any).id
      await db.execute({ sql: `DELETE FROM claims_history WHERE _parent_id = $1`, params: [cid] })
      await db.execute({ sql: `DELETE FROM claims_rels WHERE parent_id = $1`, params: [cid] })
      await db.execute({ sql: `DELETE FROM claims WHERE id = $1`, params: [cid] })
      fixes.push(`Deleted test claim ${(row as any).claim_number} (id=${cid})`)
    }

    return NextResponse.json({ success: true, fixes, historyColumns: histColNames, relsColumns: relsColNames })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
