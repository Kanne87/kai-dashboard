/**
 * Migration: contracts
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'contracts'

export const columns = [
  ['display_title', 'varchar'],
  ['client_id', 'integer'],
  ['household_id', 'integer'],
  ['company', 'varchar'],
  ['category', 'varchar'],
  ['contract_number', 'varchar'],
  ['product', 'varchar'],
  ['status', 'varchar'],
  ['start_date', 'timestamptz'],
  ['end_date', 'timestamptz'],
  ['premium', 'numeric'],
  ['premium_interval', 'varchar'],
  ['tos_contract_id', 'varchar'],
  ['tos_section', 'varchar'],
  ['notes', 'varchar'],
  ['application_date', 'timestamptz'],
  ['duration_years', 'numeric'],
  ['tariff', 'varchar'],
  ['insured_person', 'varchar'],
  ['payment_account', 'varchar'],
  ['additional_data', 'jsonb'],
  ['original_advisor', 'varchar'],
  ['managed_by_telis', 'boolean'],
  ['cancellation_date', 'timestamptz'],
  ['cancellation_reason', 'varchar'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
