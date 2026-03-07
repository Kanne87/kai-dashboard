/**
 * Startup migration script for Payload CMS standalone mode.
 * Ensures all expected tables and columns exist before server.js starts.
 *
 * WHY THIS EXISTS:
 * The Docker image is built in GitHub Actions (no DB access).
 * Payload's push:true only works when DB is reachable at build time.
 * This script bridges the gap by running at container startup.
 *
 * ARCHITECTURE (Session 177):
 * Schema definitions live in per-collection files under migrations/.
 * Each file exports { table, columns, rels?, arrays? }.
 * This entry point aggregates all of them and applies the schema.
 *
 * WHY PER-COLLECTION FILES:
 * Multiple Claude chats can work on different collections simultaneously.
 * With a monolithic schema file, the last push wins and overwrites
 * the other chat's changes. Per-collection files eliminate this conflict
 * because each chat touches only the file for its collection.
 *
 * MAINTENANCE:
 * When adding a new Collection to Payload, create a matching file
 * in migrations/ with the table name and column definitions.
 * The CI schema-check job will fail if you forget.
 */
import pg from 'pg'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const { Pool } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))
const pool = new Pool({ connectionString: process.env.DATABASE_URI })

// --- Load all per-collection migration files ---
async function loadMigrations() {
  const migrationsDir = join(__dirname, 'migrations')
  const files = await readdir(migrationsDir)
  const schema = {}
  const relsTables = []
  const arrayTables = []

  for (const file of files.sort()) {
    if (!file.endsWith('.mjs')) continue
    const filePath = join(migrationsDir, file)
    const mod = await import(pathToFileURL(filePath).href)

    schema[mod.table] = mod.columns

    if (mod.rels) {
      relsTables.push(mod.rels)
    }

    if (mod.arrays) {
      for (const arr of mod.arrays) {
        arrayTables.push([arr.table, mod.table, arr.columns])
      }
    }
  }

  return { schema, relsTables, arrayTables }
}

async function migrate() {
  const client = await pool.connect()
  try {
    console.log('[migrate] Loading per-collection schema definitions...')
    const { schema, relsTables, arrayTables } = await loadMigrations()
    console.log(`[migrate] Loaded ${Object.keys(schema).length} collections, ${relsTables.length} rels tables, ${arrayTables.length} array tables`)

    let created = 0

    // -- Ensure all tables exist --
    for (const [table, columns] of Object.entries(schema)) {
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
            ${colDefs}
          )
        `)
        console.log(`[migrate] Created table: ${table}`)
        created++
      } else {
        for (const [col, type] of columns) {
          await client.query(`
            ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${col}" ${type}
          `)
        }
      }
    }

    // -- Ensure rels tables exist --
    const allFkColumns = new Set()
    for (const rels of relsTables) {
      for (const col of rels.fkColumns) {
        allFkColumns.add(col)
      }
    }

    for (const rels of relsTables) {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "${rels.table}" (
          "id" serial PRIMARY KEY,
          "order" integer,
          "parent_id" integer,
          "path" varchar
        )
      `)
      for (const col of allFkColumns) {
        await client.query(`
          ALTER TABLE "${rels.table}" ADD COLUMN IF NOT EXISTS "${col}" integer
        `)
      }
    }

    // -- Ensure array sub-tables exist --
    for (const [table, parentTable, columns] of arrayTables) {
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

    // -- Ensure payload internal tables have columns for all collections --
    const allCollections = Object.keys(schema)
    const internalRelsTables = ['payload_locked_documents', 'payload_locked_documents_rels', 'payload_preferences_rels']
    for (const internalTable of internalRelsTables) {
      const { rows: tableExists } = await client.query(`
        SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1)
      `, [internalTable])
      if (!tableExists[0].exists) continue
      for (const collection of allCollections) {
        const colName = `${collection}_id`
        await client.query(`
          ALTER TABLE "${internalTable}" ADD COLUMN IF NOT EXISTS "${colName}" integer
        `)
      }
    }
    console.log('[migrate] Payload internal FK columns verified for all collections.')

    if (created > 0) {
      console.log(`[migrate] Created ${created} new tables`)
    }
    console.log('[migrate] All schema checks complete.')
  } catch (err) {
    console.error('[migrate] Error:', err.message)
    console.error('[migrate] Stack:', err.stack)
  } finally {
    client.release()
    await pool.end()
  }
}

await migrate()
