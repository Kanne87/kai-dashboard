import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'

const MIGRATION_SECRET = 'migrate-2026-fix'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  if (body.secret !== MIGRATION_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URI })

  const migrations = [
    // Add group_id column (relationship to task-groups)
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks' AND column_name='group_id') THEN
        ALTER TABLE tasks ADD COLUMN group_id integer;
      END IF;
    END $$;`,
    // Add group_order column
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='tasks' AND column_name='group_order') THEN
        ALTER TABLE tasks ADD COLUMN group_order numeric DEFAULT 0;
      END IF;
    END $$;`,
    // Add index on group_id
    `CREATE INDEX IF NOT EXISTS idx_tasks_group_id ON tasks(group_id);`,
    // Add foreign key if task_groups table exists
    `DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='task_groups') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='fk_tasks_group') THEN
          ALTER TABLE tasks ADD CONSTRAINT fk_tasks_group FOREIGN KEY (group_id) REFERENCES task_groups(id) ON DELETE SET NULL;
        END IF;
      END IF;
    END $$;`,
    // Also ensure task_groups table exists
    `CREATE TABLE IF NOT EXISTS task_groups (
      id serial PRIMARY KEY,
      title varchar(255),
      source varchar(50) DEFAULT 'manual',
      appointment_ref varchar(255),
      client_id integer,
      household_id integer,
      tenant_id integer,
      updated_at timestamptz DEFAULT now(),
      created_at timestamptz DEFAULT now()
    );`,
    // Create task_groups_rels if needed
    `CREATE TABLE IF NOT EXISTS task_groups_rels (
      id serial PRIMARY KEY,
      order_idx integer,
      parent_id integer REFERENCES task_groups(id) ON DELETE CASCADE,
      path varchar(255)
    );`,
  ]

  const results: string[] = []
  try {
    for (const sql of migrations) {
      await pool.query(sql)
      results.push('OK: ' + sql.slice(0, 60).replace(/\n/g, ' '))
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    results.push('ERROR: ' + msg)
  } finally {
    await pool.end()
  }

  return NextResponse.json({ results })
}
