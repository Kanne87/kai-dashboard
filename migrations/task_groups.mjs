/**
 * Migration: task_groups
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'task_groups'

export const columns = [
  ['name', 'varchar'],
  ['slug', 'varchar'],
  ['color', 'varchar'],
  ['icon', 'varchar'],
  ['sort_order', 'numeric'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
