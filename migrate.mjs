/**
 * Startup migration script for Payload CMS standalone mode.
 * Ensures all expected tables and columns exist before server.js starts.
 * 
 * WHY THIS EXISTS:
 * The Docker image is built in GitHub Actions (no DB access).
 * Payload's push:true only works when DB is reachable at build time.
 * This script bridges the gap by running at container startup.
 *
 * MAINTENANCE:
 * When adding new Collections or fields in Payload, update the
 * SCHEMA definition below. The CI schema-check job will fail
 * if you forget (it compares collection slugs against this file).
 *
 * Generated/maintained by Claude - Session 172
 */
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({ connectionString: process.env.DATABASE_URI })

// --- Schema Definition ---
// Each entry: table -> array of [column, type_with_default]
// Convention: Payload converts camelCase -> snake_case, groups -> prefix_field
const SCHEMA = {
  // -- Tenants --
  tenants: [
    ['name', 'varchar'],
    ['slug', 'varchar'],
    ['kanzlei_street', 'varchar'],
    ['kanzlei_zip', 'varchar'],
    ['kanzlei_city', 'varchar'],
    ['kanzlei_phone', 'varchar'],
    ['kanzlei_email', 'varchar'],
    ['kanzlei_lat', 'numeric'],
    ['kanzlei_lng', 'numeric'],
    ['integrations_zoom_enabled', 'boolean DEFAULT false'],
    ['integrations_zoom_default_link', 'varchar'],
    ['integrations_zoom_api_key', 'varchar'],
    ['integrations_zoom_api_secret', 'varchar'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Users --
  users: [
    ['email', 'varchar'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Households --
  households: [
    ['tos_fa_number', 'varchar'],
    ['tos_fa_promo', 'varchar'],
    ['display_name', 'varchar'],
    ['primary_person_id', 'integer'],
    ['address_street', 'varchar'],
    ['address_zip', 'varchar'],
    ['address_city', 'varchar'],
    ['status', 'varchar'],
    ['tos_last_synced', 'timestamptz'],
    ['tos_sync_status', 'varchar'],
    ['notes', 'varchar'],
    ['assigned_to_id', 'integer'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Clients --
  clients: [
    ['salutation', 'varchar'],
    ['first_name', 'varchar'],
    ['last_name', 'varchar'],
    ['date_of_birth', 'timestamptz'],
    ['household_id', 'integer'],
    ['household_role', 'varchar'],
    ['email', 'varchar'],
    ['phone', 'varchar'],
    ['mobile', 'varchar'],
    ['address_street', 'varchar'],
    ['address_zip', 'varchar'],
    ['address_city', 'varchar'],
    ['occupation_type', 'varchar'],
    ['contract_count', 'integer'],
    ['dlz_count', 'integer'],
    ['bav_check_possible', 'boolean'],
    ['status', 'varchar'],
    ['source', 'varchar'],
    ['tos_person_id', 'varchar'],
    ['tos_client_number', 'varchar'],
    ['tos_mandate_since', 'varchar'],
    ['tos_last_contact', 'varchar'],
    ['assigned_to_id', 'integer'],
    ['notes', 'varchar'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Contracts --
  contracts: [
    ['display_title', 'varchar'],
    ['client_id', 'integer'],
    ['household_id', 'integer'],
    ['company', 'varchar'],
    ['category', 'varchar'],
    ['contract_number', 'varchar'],
    ['product', 'varchar'],
    ['status', 'varchar'],
    ['start_date', 'timestamptz'],
    ['end_date', 'timestamptz'],
    ['premium', 'numeric'],
    ['premium_interval', 'varchar'],
    ['tos_contract_id', 'varchar'],
    ['tos_section', 'varchar'],
    ['notes', 'varchar'],
    ['application_date', 'timestamptz'],
    ['duration_years', 'numeric'],
    ['tariff', 'varchar'],
    ['insured_person', 'varchar'],
    ['payment_account', 'varchar'],
    ['additional_data', 'jsonb'],
    ['original_advisor', 'varchar'],
    ['managed_by_telis', 'boolean'],
    ['cancellation_date', 'timestamptz'],
    ['cancellation_reason', 'varchar'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Documents --
  documents: [
    ['title', 'varchar'],
    ['type', 'varchar'],
    ['client_id', 'integer'],
    ['household_id', 'integer'],
    ['contract_id', 'integer'],
    ['source', 'varchar'],
    ['tos_document_id', 'varchar'],
    ['tos_section', 'varchar'],
    ['contract_number', 'varchar'],
    ['document_category', 'varchar'],
    ['document_date', 'timestamptz'],
    ['product_name', 'varchar'],
    ['section', 'varchar'],
    ['description', 'varchar'],
    ['nextcloud_path', 'varchar'],
    ['rag_status', 'varchar'],
    ['paperless_id', 'integer'],
    ['documenso_id', 'varchar'],
    ['signature_status', 'varchar'],
    ['url', 'varchar'],
    ['file_url', 'varchar'],
    ['thumbnail_u_r_l', 'varchar'],
    ['filename', 'varchar'],
    ['mime_type', 'varchar'],
    ['filesize', 'numeric'],
    ['width', 'numeric'],
    ['height', 'numeric'],
    ['focal_x', 'numeric'],
    ['focal_y', 'numeric'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Claims --
  claims: [
    ['claim_number', 'varchar'],
    ['external_claim_number', 'varchar'],
    ['contract_id', 'integer'],
    ['household_id', 'integer'],
    ['claim_date', 'timestamptz'],
    ['claim_type', 'varchar'],
    ['description', 'varchar'],
    ['status', 'varchar'],
    ['damage_amount', 'numeric'],
    ['regulation_amount', 'numeric'],
    ['hint', 'varchar'],
    ['notes', 'varchar'],
    ['tos_claim_id', 'varchar'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Tasks --
  tasks: [
    ['title', 'varchar'],
    ['description', 'varchar'],
    ['status', 'varchar'],
    ['priority', 'varchar'],
    ['due_date', 'timestamptz'],
    ['household_id', 'integer'],
    ['client_id', 'integer'],
    ['assigned_to_id', 'integer'],
    ['source', 'varchar'],
    ['source_id', 'varchar'],
    ['task_group_id', 'integer'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Task Groups --
  task_groups: [
    ['name', 'varchar'],
    ['slug', 'varchar'],
    ['color', 'varchar'],
    ['icon', 'varchar'],
    ['sort_order', 'numeric'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Inbox Items --
  inbox_items: [
    ['title', 'varchar'],
    ['summary', 'varchar'],
    ['channel', 'varchar'],
    ['status', 'varchar'],
    ['priority', 'varchar'],
    ['document_category', 'varchar'],
    ['product_name', 'varchar'],
    ['contract_number', 'varchar'],
    ['client_id', 'integer'],
    ['household_id', 'integer'],
    ['document_id', 'integer'],
    ['contract_id', 'integer'],
    ['task_id', 'integer'],
    ['suggested_action', 'varchar'],
    ['suggested_action_reason', 'varchar'],
    ['source_id', 'varchar'],
    ['processed_at', 'timestamptz'],
    ['processed_by_id', 'integer'],
    ['ai_summary', 'varchar'],
    ['ai_document_type', 'varchar'],
    ['ai_action_type', 'varchar'],
    ['ai_action_params', 'varchar'],
    ['ai_confidence', 'numeric'],
    ['ai_source', 'varchar'],
    ['ai_suggested_response', 'varchar'],
    ['ai_rule_id', 'varchar'],
    ['ai_category', 'varchar'],
    ['ai_suggested_household', 'integer'],
    ['ai_processed_at', 'timestamptz'],
    ['action_taken', 'varchar'],
    ['action_taken_at', 'timestamptz'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Automations --
  automations: [
    ['title', 'varchar'],
    ['description', 'varchar'],
    ['is_active', 'boolean DEFAULT false'],
    ['trigger', 'varchar'],
    ['action', 'varchar'],
    ['learned_from_count', 'integer'],
    ['accuracy', 'numeric'],
    ['learning_total_processed', 'integer DEFAULT 0'],
    ['learning_accuracy', 'numeric'],
    ['learning_last_trained_at', 'timestamptz'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Advisor Profiles --
  advisor_profiles: [
    ['authentik_sub', 'varchar'],
    ['first_name', 'varchar'],
    ['last_name', 'varchar'],
    ['email', 'varchar'],
    ['phone', 'varchar'],
    ['street', 'varchar'],
    ['zip', 'varchar'],
    ['city', 'varchar'],
    ['zoom_integration_connected', 'boolean DEFAULT false'],
    ['zoom_integration_access_token', 'varchar'],
    ['zoom_integration_refresh_token', 'varchar'],
    ['zoom_integration_token_expires_at', 'timestamptz'],
    ['zoom_integration_zoom_user_id', 'varchar'],
    ['zoom_integration_zoom_email', 'varchar'],
    ['created_at', 'timestamptz'],
    ['updated_at', 'timestamptz'],
  ],

  // -- Household Events --
  household_events: [
    ['household_id', 'integer'],
    ['person_id', 'integer'],
    ['event_type', 'varchar'],
    ['title', 'varchar'],
    ['description', 'varchar'],
    ['event_date', 'timestamptz'],
    ['source', 'varchar'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Communication --
  communication: [
    ['client_id', 'integer'],
    ['household_id', 'integer'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Tags --
  tags: [
    ['name', 'varchar'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- System Status --
  system_status: [
    ['key', 'varchar'],
    ['status', 'varchar'],
    ['message', 'varchar'],
    ['last_login', 'timestamptz'],
    ['last_check', 'timestamptz'],
    ['expires_at', 'timestamptz'],
    ['metadata', 'jsonb'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Appointment Templates (NEW - Session 171) --
  appointment_templates: [
    ['name', 'varchar'],
    ['slug', 'varchar'],
    ['duration', 'numeric DEFAULT 60'],
    ['buffer_before', 'numeric DEFAULT 0'],
    ['buffer_after', 'numeric DEFAULT 15'],
    ['color', 'varchar'],
    ['icon', 'varchar'],
    ['ews_category', 'varchar'],
    ['default_location', 'varchar'],
    ['is_active', 'boolean DEFAULT true'],
    ['sort_order', 'numeric DEFAULT 0'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Notification Templates (NEW - Session 171) --
  notification_templates: [
    ['name', 'varchar'],
    ['type', 'varchar'],
    ['trigger', 'varchar'],
    ['subject', 'varchar'],
    ['body', 'varchar'],
    ['is_active', 'boolean DEFAULT true'],
    ['is_default', 'boolean DEFAULT false'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],

  // -- Appointment Preps (NEW - Session 164) --
  appointment_preps: [
    ['exchange_calendar_id', 'varchar'],
    ['exchange_subject', 'varchar'],
    ['appointment_date', 'timestamptz'],
    ['appointment_time', 'varchar'],
    ['location', 'varchar'],
    ['client_name', 'varchar'],
    ['client_email', 'varchar'],
    ['household_id', 'integer'],
    ['client_id', 'integer'],
    ['status', 'varchar'],
    ['notes', 'varchar'],
    ['summary', 'varchar'],
    ['transcript_url', 'varchar'],
    ['tenant_id', 'integer'],
    ['updated_at', 'timestamptz'],
    ['created_at', 'timestamptz'],
  ],
}

// Relationship tables (for hasMany/relationship fields)
const RELS_TABLES = [
  'appointment_templates_rels',
  'appointment_preps_rels',
]

// Array sub-tables: [table_name, parent_table, columns]
const ARRAY_TABLES = [
  ['appointment_preps_materials', 'appointment_preps', [
    ['type', 'varchar'],
    ['title', 'varchar'],
    ['url', 'varchar'],
  ]],
  ['appointment_preps_aufgaben', 'appointment_preps', [
    ['text', 'varchar'],
    ['is_done', 'boolean DEFAULT false'],
    ['task_id', 'integer'],
  ]],
  ['appointment_preps_wiedervorlagen', 'appointment_preps', [
    ['text', 'varchar'],
    ['due_date', 'timestamptz'],
    ['is_done', 'boolean DEFAULT false'],
    ['task_id', 'integer'],
  ]],
]

async function migrate() {
  const client = await pool.connect()
  try {
    console.log('[migrate] Starting schema check...')
    let created = 0
    let altered = 0

    // -- Ensure all tables exist --
    for (const [table, columns] of Object.entries(SCHEMA)) {
      const { rows } = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        )
      `, [table])

      if (!rows[0].exists) {
        // Create the table with all columns
        const colDefs = columns.map(([name, type]) => `"${name}" ${type}`).join(',\n          ')
        await client.query(`
          CREATE TABLE "${table}" (
            "id" serial PRIMARY KEY,
            ${colDefs}
          )
        `)
        console.log(`[migrate] Created table: ${table}`)
        created++
      } else {
        // Ensure all columns exist
        for (const [col, type] of columns) {
          await client.query(`
            ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${col}" ${type}
          `)
        }
      }
    }

    // -- Ensure rels tables exist --
    for (const relsTable of RELS_TABLES) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "${relsTable}" (
          "id" serial PRIMARY KEY,
          "order" integer,
          "parent_id" integer,
          "path" varchar,
          "notification_templates_id" integer,
          "tasks_id" integer
        )
      `)
    }

    // -- Ensure array sub-tables exist --
    for (const [table, parentTable, columns] of ARRAY_TABLES) {
      const { rows } = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = $1
        )
      `, [table])

      if (!rows[0].exists) {
        const colDefs = columns.map(([name, type]) => `"${name}" ${type}`).join(',\n          ')
        await client.query(`
          CREATE TABLE "${table}" (
            "id" serial PRIMARY KEY,
            "_order" integer NOT NULL,
            "_parent_id" integer NOT NULL,
            ${colDefs}
          )
        `)
        await client.query(`
          CREATE INDEX IF NOT EXISTS "idx_${table}_parent"
          ON "${table}" ("_parent_id")
        `)
        console.log(`[migrate] Created array table: ${table}`)
        created++
      }
    }

    if (created > 0) {
      console.log(`[migrate] Created ${created} new tables`)
    }
    console.log('[migrate] All schema checks complete.')
  } catch (err) {
    console.error('[migrate] Error:', err.message)
    console.error('[migrate] Stack:', err.stack)
    // Don't crash the app - log and continue. The app may still work
    // for most routes even if some tables are missing.
  } finally {
    client.release()
    await pool.end()
  }
}

await migrate()
