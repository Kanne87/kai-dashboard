import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const db = payload.db.drizzle

    const statements = [
      // Fix: Add claims_id column to payload_locked_documents_rels
      `ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "claims_id" integer REFERENCES "claims"("id") ON DELETE CASCADE`,
      `CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_claims_id_idx" ON "payload_locked_documents_rels"("claims_id")`,

      // Also fix payload_preferences_rels
      `ALTER TABLE "payload_preferences_rels" ADD COLUMN IF NOT EXISTS "claims_id" integer REFERENCES "claims"("id") ON DELETE CASCADE`,
      `CREATE INDEX IF NOT EXISTS "payload_preferences_rels_claims_id_idx" ON "payload_preferences_rels"("claims_id")`,
    ]

    const results: string[] = []

    for (const sql of statements) {
      try {
        await db.execute(sql as any)
        results.push('OK: ' + sql.substring(0, 80))
      } catch (err: any) {
        const msg = err.message || String(err)
        if (msg.includes('already exists')) {
          results.push('SKIP (exists): ' + sql.substring(0, 80))
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
