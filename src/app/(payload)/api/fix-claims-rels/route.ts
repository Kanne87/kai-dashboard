import { NextResponse } from 'next/server'
import payload from 'payload'

export async function GET() {
  try {
    const db = payload.db
    // @ts-ignore - drizzle session access
    const drizzle = db.drizzle

    // Fix: Add claims_id column to payload_locked_documents_rels
    // This column is needed because Payload tracks locked documents
    // across ALL collections via a polymorphic rels table.
    const statements = [
      `ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS claims_id integer`,
      `ALTER TABLE payload_locked_documents_rels 
       ADD CONSTRAINT payload_locked_documents_rels_claims_fk 
       FOREIGN KEY (claims_id) REFERENCES claims(id) ON DELETE CASCADE`,
      `CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_claims_id_idx 
       ON payload_locked_documents_rels(claims_id)`,

      // Also check payload_preferences_rels for the same issue
      `ALTER TABLE payload_preferences_rels ADD COLUMN IF NOT EXISTS claims_id integer`,
    ]

    const results: string[] = []

    for (const sql of statements) {
      try {
        await drizzle.execute({ sql: sql as any })
        results.push('OK: ' + sql.split('\n')[0].trim().substring(0, 80))
      } catch (err: any) {
        const msg = err.message || String(err)
        if (msg.includes('already exists')) {
          results.push('SKIP (exists): ' + sql.split('\n')[0].trim().substring(0, 80))
        } else {
          results.push('ERR: ' + msg.substring(0, 120))
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
}
