import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const MIGRATION_SECRET = 'migrate-2026-fix'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  if (body.secret !== MIGRATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URI })
  const results: string[] = []

  try {
    // First: dump current columns for debugging
    const colRes = await pool.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'tasks' ORDER BY ordinal_position`
    )
    results.push('EXISTING COLUMNS: ' + colRes.rows.map((r: { column_name: string }) => r.column_name).join(', '))

    // Ensure task_groups table
    await pool.query(`CREATE TABLE IF NOT EXISTS task_groups (
      id serial PRIMARY KEY,
      title varchar(255),
      source varchar(50) DEFAULT 'manual',
      appointment_ref varchar(255),
      client_id integer,
      household_id integer,
      tenant_id integer,
      updated_at timestamptz DEFAULT now(),
      created_at timestamptz DEFAULT now()
    )`)
    results.push('OK: task_groups table ensured')

    // All columns that Tasks.ts defines, in Payload snake_case
    const columns: [string, string][] = [
      ['title', 'varchar(255)'],
      ['description', 'text'],
      ['status', "varchar(20) DEFAULT 'open'"],
      ['priority', 'boolean DEFAULT false'],
      ['category', "varchar(50) DEFAULT 'aufgabe'"],
      ['due_date', 'timestamptz'],
      ['client_id', 'integer'],
      ['household_id', 'integer'],
      ['contract_id', 'integer'],
      ['assigned_to_id', 'integer'],
      ['group_id', 'integer'],
      ['group_order', 'numeric DEFAULT 0'],
      ['source', "varchar(50) DEFAULT 'manual'"],
      ['exchange_item_id', 'varchar(500)'],
      ['exchange_change_key', 'varchar(500)'],
      ['exchange_synced_at', 'timestamptz'],
      ['tenant_id', 'integer'],
    ]

    for (const [col, type] of columns) {
      await pool.query(`DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks' AND column_name='${col}') THEN
          ALTER TABLE tasks ADD COLUMN ${col} ${type};
        END IF;
      END $$;`)
    }
    results.push('OK: all task columns ensured')

    // Indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_group_id ON tasks(group_id)')
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tasks_exchange_item_id ON tasks(exchange_item_id)')
    results.push('OK: indexes created')

    // Rels table for hasMany relationships (tags, documents)
    await pool.query(`CREATE TABLE IF NOT EXISTS tasks_rels (
      id serial PRIMARY KEY,
      "order" integer,
      parent_id integer REFERENCES tasks(id) ON DELETE CASCADE,
      path varchar(255),
      tags_id integer,
      documents_id integer
    )`)
    results.push('OK: tasks_rels table ensured')

    // Verify
    const verifyRes = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'tasks' ORDER BY ordinal_position`
    )
    results.push('FINAL COLUMNS: ' + verifyRes.rows.map((r: { column_name: string }) => r.column_name).join(', '))

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    results.push('ERROR: ' + msg)
  } finally {
    await pool.end()
  }

  return NextResponse.json({ results })
}
