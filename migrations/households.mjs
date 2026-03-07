/**
 * Migration: households
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'households'

export const columns = [
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
]
