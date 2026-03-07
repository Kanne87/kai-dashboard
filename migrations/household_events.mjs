/**
 * Migration: household_events
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'household_events'

export const columns = [
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
]
