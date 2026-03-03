import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const db = (payload.db as any)
    
    // Try different ways to access the raw pool
    const pool = db.pool || db.client?.pool
    
    if (!pool) {
      // Fallback: use drizzle execute for raw SQL
      const drizzle = db.drizzle
      if (!drizzle) {
        return NextResponse.json({ 
          error: 'No DB access found',
          dbKeys: Object.keys(db).join(', ')
        }, { status: 500 })
      }
      
      // Use drizzle.execute for raw SQL
      const results: string[] = []
      
      try {
        // Check existing columns
        const colsResult = await drizzle.execute(
          `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims' ORDER BY ordinal_position`
        )
        const existingCols = colsResult.rows.map((r: any) => r.column_name)
        results.push('Existing claims columns: ' + existingCols.join(', '))

        // Add missing camelCase columns
        const adds = [
          ['"damageAmount"', 'numeric'],
          ['"regulationAmount"', 'numeric'],
          ['"claimType"', 'varchar(255)'],
          ['"hint"', 'text'],
          ['"notes"', 'text'],
          ['"tosClaimId"', 'varchar(255)'],
        ]
        
        for (const [name, type] of adds) {
          const clean = (name as string).replace(/"/g, '')
          if (!existingCols.includes(clean)) {
            try {
              await drizzle.execute(`ALTER TABLE claims ADD COLUMN IF NOT EXISTS ${name} ${type}`)
              results.push('Added ' + name)
            } catch (e: any) {
              results.push(name + ' error: ' + e.message)
            }
          } else {
            results.push(clean + ' exists')
          }
        }
        
        // Check claims_history
        const histResult = await drizzle.execute(
          `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims_history' ORDER BY ordinal_position`
        )
        const histCols = histResult.rows.map((r: any) => r.column_name)
        results.push('History columns: ' + histCols.join(', '))
        
        // Recreate claims_history with correct Payload schema
        const needsRecreate = histCols.length === 0 || 
          histCols.includes('event_type') || 
          !histCols.includes('id')
          
        if (needsRecreate) {
          await drizzle.execute(`DROP TABLE IF EXISTS claims_history CASCADE`)
          await drizzle.execute(`
            CREATE TABLE claims_history (
              id serial PRIMARY KEY,
              "_order" integer NOT NULL,
              "_parent_id" integer NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
              "date" timestamptz,
              "eventType" varchar(255),
              "description" text,
              "documentUrl" varchar(255)
            )
          `)
          await drizzle.execute(`CREATE INDEX IF NOT EXISTS "claims_history_order_idx" ON claims_history ("_order")`)
          await drizzle.execute(`CREATE INDEX IF NOT EXISTS "claims_history_parent_id_idx" ON claims_history ("_parent_id")`)
          results.push('Recreated claims_history with Payload-compatible schema')
        } else {
          results.push('claims_history OK')
        }
        
        // Verify
        const finalClaims = await drizzle.execute(
          `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims' ORDER BY ordinal_position`
        )
        const finalHistory = await drizzle.execute(
          `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'claims_history' ORDER BY ordinal_position`
        )
        
        return NextResponse.json({
          success: true,
          steps: results,
          finalSchema: {
            claims: finalClaims.rows,
            claims_history: finalHistory.rows,
          }
        })
        
      } catch (sqlErr: any) {
        return NextResponse.json({
          success: false,
          error: sqlErr.message,
          steps: results,
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: 'Unexpected path' }, { status: 500 })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
