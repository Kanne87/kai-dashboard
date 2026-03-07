/**
 * Migration: system_status
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'system_status'

export const columns = [
  ['key', 'varchar'],
  ['status', 'varchar'],
  ['message', 'varchar'],
  ['last_login', 'timestamptz'],
  ['last_check', 'timestamptz'],
  ['expires_at', 'timestamptz'],
  ['metadata', 'jsonb'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
