/**
 * Migration: users
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'users'

export const columns = [
  ['email', 'varchar'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
