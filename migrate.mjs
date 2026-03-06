/**
 * Startup migration script for Payload CMS standalone mode.
 * Adds missing columns/tables that push:true would normally create.
 * Safe to run repeatedly (uses IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).
 */
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

async function migrate() {
  const client = await pool.connect()
  try {
    console.log('[migrate] Starting schema check...')

    // Tenants: kanzlei group columns
    const tenantCols = [
      ['kanzlei_street', 'varchar'],
      ['kanzlei_zip', 'varchar'],
      ['kanzlei_city', 'varchar'],
      ['kanzlei_phone', 'varchar'],
      ['kanzlei_email', 'varchar'],
      ['integrations_zoom_enabled', 'boolean DEFAULT false'],
      ['integrations_zoom_default_link', 'varchar'],
      ['integrations_zoom_api_key', 'varchar'],
      ['integrations_zoom_api_secret', 'varchar'],
    ]

    for (const [col, type] of tenantCols) {
      await client.query(`ALTER TABLE tenants ADD COLUMN IF NOT EXISTS "${col}" ${type}`)
    }
    console.log('[migrate] tenants columns checked')

    // Tenants: appointmentTemplates array table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tenants_appointment_templates (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "id" serial PRIMARY KEY,
        "name" varchar,
        "slug" varchar,
        "duration" numeric DEFAULT 60,
        "buffer_before" numeric DEFAULT 0,
        "buffer_after" numeric DEFAULT 15,
        "color" varchar DEFAULT 'blue',
        "ews_category" varchar,
        "default_location" varchar DEFAULT 'kanzlei',
        "is_active" boolean DEFAULT true
      )
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tenants_appt_templates_parent
      ON tenants_appointment_templates ("_parent_id")
    `)
    console.log('[migrate] tenants_appointment_templates table checked')

    // AdvisorProfiles: zoom integration group columns
    const { rows } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'advisor_profiles'
      )
    `)
    if (rows[0].exists) {
      const advisorCols = [
        ['zoom_integration_connected', 'boolean DEFAULT false'],
        ['zoom_integration_access_token', 'varchar'],
        ['zoom_integration_refresh_token', 'varchar'],
        ['zoom_integration_token_expires_at', 'timestamptz'],
        ['zoom_integration_zoom_user_id', 'varchar'],
        ['zoom_integration_zoom_email', 'varchar'],
      ]
      for (const [col, type] of advisorCols) {
        await client.query(`ALTER TABLE advisor_profiles ADD COLUMN IF NOT EXISTS "${col}" ${type}`)
      }
      console.log('[migrate] advisor_profiles columns checked')
    }

    // InboxItems: AI enrichment fields
    const { rows: inboxExists } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'inbox_items'
      )
    `)
    if (inboxExists[0].exists) {
      const inboxCols = [
        ['ai_summary', 'varchar'],
        ['ai_category', 'varchar'],
        ['ai_confidence', 'numeric'],
        ['ai_suggested_household', 'integer'],
        ['ai_processed_at', 'timestamptz'],
      ]
      for (const [col, type] of inboxCols) {
        await client.query(`ALTER TABLE inbox_items ADD COLUMN IF NOT EXISTS "${col}" ${type}`)
      }
      console.log('[migrate] inbox_items columns checked')
    }

    // Automations: learning fields
    const { rows: autoExists } = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'automations'
      )
    `)
    if (autoExists[0].exists) {
      const autoCols = [
        ['learning_total_processed', 'integer DEFAULT 0'],
        ['learning_accuracy', 'numeric'],
        ['learning_last_trained_at', 'timestamptz'],
      ]
      for (const [col, type] of autoCols) {
        await client.query(`ALTER TABLE automations ADD COLUMN IF NOT EXISTS "${col}" ${type}`)
      }
      console.log('[migrate] automations columns checked')
    }

    console.log('[migrate] All schema checks complete.')
  } catch (err) {
    console.error('[migrate] Error:', err.message)
    // Don't crash the app - log and continue
  } finally {
    client.release()
    await pool.end()
  }
}

await migrate()
