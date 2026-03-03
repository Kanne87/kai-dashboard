import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })
    const db = payload.db.drizzle

    // Main claims table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "claims" (
        "id" serial PRIMARY KEY,
        "claim_number" varchar,
        "external_claim_number" varchar,
        "contract_id" integer REFERENCES "contracts"("id") ON DELETE SET NULL,
        "household_id" integer REFERENCES "households"("id") ON DELETE SET NULL,
        "claim_date" timestamptz,
        "claim_type" varchar,
        "description" varchar,
        "status" varchar DEFAULT 'gemeldet',
        "damage_amount" numeric,
        "regulation_amount" numeric,
        "hint" varchar,
        "notes" varchar,
        "tos_claim_id" varchar,
        "tenant_id" integer REFERENCES "tenants"("id") ON DELETE SET NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL,
        "created_at" timestamptz DEFAULT now() NOT NULL
      )
    `)

    // Unique index on claim_number
    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS "claims_claim_number_idx" ON "claims" ("claim_number")
    `)

    // History sub-table (array field)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "claims_history" (
        "id" serial PRIMARY KEY,
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL REFERENCES "claims"("id") ON DELETE CASCADE,
        "date" timestamptz,
        "event_type" varchar,
        "description" varchar,
        "document_url" varchar
      )
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS "claims_history_order_idx" ON "claims_history" ("_order")
    `)
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "claims_history_parent_id_idx" ON "claims_history" ("_parent_id")
    `)

    // Rels table for hasMany relationships (documents)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "claims_rels" (
        "id" serial PRIMARY KEY,
        "order" integer,
        "parent_id" integer NOT NULL REFERENCES "claims"("id") ON DELETE CASCADE,
        "path" varchar NOT NULL,
        "documents_id" integer REFERENCES "documents"("id") ON DELETE CASCADE
      )
    `)

    await db.execute(`
      CREATE INDEX IF NOT EXISTS "claims_rels_order_idx" ON "claims_rels" ("order")
    `)
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "claims_rels_parent_idx" ON "claims_rels" ("parent_id")
    `)
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "claims_rels_path_idx" ON "claims_rels" ("path")
    `)

    return NextResponse.json({
      success: true,
      message: 'Claims tables created successfully',
      tables: ['claims', 'claims_history', 'claims_rels']
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}
