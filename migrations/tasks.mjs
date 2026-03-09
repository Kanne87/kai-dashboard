/**
 * Migration: tasks
 * Auto-split from monolithic migrate.mjs (Session 177)
 * Updated Session 178: added notizen, category, contract_id,
 * group_order, exchange fields.
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'tasks'

export const columns = [
  ['title', 'varchar'],
  ['description', 'varchar'],
  ['notizen', 'varchar'],
  ['status', 'varchar'],
  ['priority', 'varchar'],
  ['category', 'varchar'],
  ['due_date', 'timestamptz'],
  ['household_id', 'integer'],
  ['client_id', 'integer'],
  ['contract_id', 'integer'],
  ['assigned_to_id', 'integer'],
  ['source', 'varchar'],
  ['source_id', 'varchar'],
  ['task_group_id', 'integer'],
  ['group_order', 'integer'],
  ['exchange_item_id', 'varchar'],
  ['exchange_change_key', 'varchar'],
  ['exchange_synced_at', 'timestamptz'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
