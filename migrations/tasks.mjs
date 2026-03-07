/**
 * Migration: tasks
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'tasks'

export const columns = [
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
]
