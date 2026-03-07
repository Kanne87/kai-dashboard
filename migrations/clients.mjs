/**
 * Migration: clients
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'clients'

export const columns = [
  ['salutation', 'varchar'],
  ['first_name', 'varchar'],
  ['last_name', 'varchar'],
  ['date_of_birth', 'timestamptz'],
  ['household_id', 'integer'],
  ['household_role', 'varchar'],
  ['email', 'varchar'],
  ['phone', 'varchar'],
  ['mobile', 'varchar'],
  ['address_street', 'varchar'],
  ['address_zip', 'varchar'],
  ['address_city', 'varchar'],
  ['occupation_type', 'varchar'],
  ['contract_count', 'integer'],
  ['dlz_count', 'integer'],
  ['bav_check_possible', 'boolean'],
  ['status', 'varchar'],
  ['source', 'varchar'],
  ['tos_person_id', 'varchar'],
  ['tos_client_number', 'varchar'],
  ['tos_mandate_since', 'varchar'],
  ['tos_last_contact', 'varchar'],
  ['assigned_to_id', 'integer'],
  ['notes', 'varchar'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
