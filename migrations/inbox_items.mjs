/**
 * Migration: inbox_items
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'inbox_items'

export const columns = [
  ['title', 'varchar'],
  ['summary', 'varchar'],
  ['channel', 'varchar'],
  ['status', 'varchar'],
  ['priority', 'varchar'],
  ['document_category', 'varchar'],
  ['product_name', 'varchar'],
  ['contract_number', 'varchar'],
  ['client_id', 'integer'],
  ['household_id', 'integer'],
  ['document_id', 'integer'],
  ['contract_id', 'integer'],
  ['task_id', 'integer'],
  ['suggested_action', 'varchar'],
  ['suggested_action_reason', 'varchar'],
  ['source_id', 'varchar'],
  ['processed_at', 'timestamptz'],
  ['processed_by_id', 'integer'],
  ['ai_summary', 'varchar'],
  ['ai_document_type', 'varchar'],
  ['ai_action_type', 'varchar'],
  ['ai_action_params', 'varchar'],
  ['ai_confidence', 'numeric'],
  ['ai_source', 'varchar'],
  ['ai_suggested_response', 'varchar'],
  ['ai_rule_id', 'varchar'],
  ['ai_category', 'varchar'],
  ['ai_suggested_household', 'integer'],
  ['ai_processed_at', 'timestamptz'],
  ['action_taken', 'varchar'],
  ['action_taken_at', 'timestamptz'],
  ['filter_rule_id', 'varchar'],
  ['filter_action', 'varchar'],
  ['filter_message', 'varchar'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
