import { NextResponse } from 'next/server'
import payload from 'payload'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = (payload as any).db?.pool || (payload as any).db?.drizzle

    if (!db) {
      return NextResponse.json({ error: 'No DB pool found' }, { status: 500 })
    }

    // Get a client from the pool
    const pool = (payload as any).db?.pool
    if (!pool) {
      return NextResponse.json({ error: 'No pool available' }, { status: 500 })
    }

    const client = await pool.connect()
    const results: string[] = []

    try {
      // Step 1: Check what columns exist in claims table
      const colsResult = await client.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'claims' 
        ORDER BY ordinal_position
      `)
      const existingCols = colsResult.rows.map((r: any) => r.column_name)
      results.push('Existing columns: ' + existingCols.join(', '))

      // Step 2: Add missing columns with Payload-compatible names
      // Payload v3 + Drizzle uses camelCase with quoted identifiers
      const columnsToAdd = [
        { name: '"damageAmount"', type: 'numeric', fallback: 'damage_amount' },
        { name: '"regulationAmount"', type: 'numeric', fallback: 'regulation_amount' },
        { name: '"claimType"', type: 'varchar(255)', fallback: 'claim_type' },
        { name: '"hint"', type: 'text', fallback: 'hint_col' },
        { name: '"notes"', type: 'text', fallback: 'notes' },
        { name: '"tosClaimId"', type: 'varchar(255)', fallback: 'tos_claim_id' },
        { name: '"claimNumber"', type: 'varchar(255)', fallback: 'claim_number' },
        { name: '"externalClaimNumber"', type: 'varchar(255)', fallback: 'external_claim_number' },
        { name: '"claimDate"', type: 'timestamptz', fallback: 'claim_date' },
        { name: '"contract_id"', type: 'integer', fallback: '' },
        { name: '"household_id"', type: 'integer', fallback: '' },
        { name: '"tenant_id"', type: 'integer', fallback: '' },
      ]

      for (const col of columnsToAdd) {
        const cleanName = col.name.replace(/"/g, '')
        if (!existingCols.includes(cleanName)) {
          try {
            await client.query(`ALTER TABLE claims ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`)
            results.push(`Added column ${col.name} (${col.type})`)
          } catch (e: any) {
            results.push(`Column ${col.name} error: ${e.message}`)
          }
        } else {
          results.push(`Column ${cleanName} already exists`)
        }
      }

      // Step 3: Fix claims_history table
      const histColsResult = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns 
        WHERE table_name = 'claims_history' 
        ORDER BY ordinal_position
      `)
      const histCols = histColsResult.rows.map((r: any) => r.column_name)
      results.push('History existing columns: ' + histCols.join(', '))

      // If history table has snake_case, we need to recreate with Payload naming
      // Payload array sub-tables: id, _order, _parent_id, _locale (optional), then field columns
      const histColumnsToAdd = [
        { name: '"eventType"', type: 'varchar(255)', fallback: 'event_type' },
        { name: '"documentUrl"', type: 'varchar(255)', fallback: 'document_url' },
        { name: '"date"', type: 'timestamptz', fallback: '' },
        { name: '"description"', type: 'text', fallback: '' },
        { name: '"_order"', type: 'integer NOT NULL', fallback: '' },
        { name: '"_parent_id"', type: 'integer NOT NULL', fallback: '' },
        { name: '"id"', type: 'serial PRIMARY KEY', fallback: '' },
      ]

      // Check if table needs full recreation
      if (histCols.length > 0 && !histCols.includes('id')) {
        // Old table without id column - need to recreate
        await client.query('DROP TABLE IF EXISTS claims_history CASCADE')
        await client.query(`
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
        await client.query('CREATE INDEX IF NOT EXISTS "claims_history_order_idx" ON claims_history ("_order")')
        await client.query('CREATE INDEX IF NOT EXISTS "claims_history_parent_id_idx" ON claims_history ("_parent_id")')
        results.push('Recreated claims_history with correct schema')
      } else if (histCols.length === 0) {
        // Table doesn't exist
        await client.query(`
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
        await client.query('CREATE INDEX IF NOT EXISTS "claims_history_order_idx" ON claims_history ("_order")')
        await client.query('CREATE INDEX IF NOT EXISTS "claims_history_parent_id_idx" ON claims_history ("_parent_id")')
        results.push('Created claims_history')
      } else {
        // Add missing columns
        for (const col of histColumnsToAdd) {
          const cleanName = col.name.replace(/"/g, '')
          if (!histCols.includes(cleanName)) {
            try {
              await client.query(`ALTER TABLE claims_history ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`)
              results.push(`History: added ${col.name}`)
            } catch (e: any) {
              results.push(`History: ${col.name} error: ${e.message}`)
            }
          }
        }
        results.push('claims_history schema updated')
      }

      // Step 4: Check/fix claims_rels table for documents relationship
      const relsResult = await client.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'claims_rels'
      `)
      const relsCols = relsResult.rows.map((r: any) => r.column_name)
      results.push('Rels existing columns: ' + relsCols.join(', '))

      if (!relsCols.includes('documents_id') && relsCols.length > 0) {
        try {
          await client.query('ALTER TABLE claims_rels ADD COLUMN IF NOT EXISTS "documents_id" integer REFERENCES documents(id) ON DELETE CASCADE')
          results.push('Added documents_id to claims_rels')
        } catch (e: any) {
          results.push('Rels documents_id error: ' + e.message)
        }
      }

      // Step 5: Verify final schema
      const finalCols = await client.query(`
        SELECT column_name, data_type FROM information_schema.columns 
        WHERE table_name = 'claims' ORDER BY ordinal_position
      `)
      const finalHistCols = await client.query(`
        SELECT column_name, data_type FROM information_schema.columns 
        WHERE table_name = 'claims_history' ORDER BY ordinal_position
      `)

      return NextResponse.json({
        success: true,
        steps: results,
        finalSchema: {
          claims: finalCols.rows,
          claims_history: finalHistCols.rows,
        }
      })

    } finally {
      client.release()
    }

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack?.split('\n').slice(0, 5),
    }, { status: 500 })
  }
}
