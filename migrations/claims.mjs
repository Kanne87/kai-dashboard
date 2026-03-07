/**
 * Migration: claims
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'claims'

export const columns = [
  ['claim_number', 'varchar'],
  ['external_claim_number', 'varchar'],
  ['contract_id', 'integer'],
  ['household_id', 'integer'],
  ['claim_date', 'timestamptz'],
  ['claim_type', 'varchar'],
  ['description', 'varchar'],
  ['status', 'varchar'],
  ['damage_amount', 'numeric'],
  ['regulation_amount', 'numeric'],
  ['hint', 'varchar'],
  ['notes', 'varchar'],
  ['tos_claim_id', 'varchar'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
