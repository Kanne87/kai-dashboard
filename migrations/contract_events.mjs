/**
 * Migration: contract_events
 * Created for AI-powered document analysis (contract history).
 *
 * MAINTENANCE: When adding fields to ContractEvents.ts,
 * add the column here too.
 */
export const table = 'contract_events'

export const columns = [
  ['contract_id', 'integer'],
  ['household_id', 'integer'],
  ['event_date', 'timestamptz'],
  ['event_type', 'varchar'],
  ['summary', 'varchar'],
  ['details', 'jsonb'],
  ['flags', 'jsonb'],
  ['document_ids', 'jsonb'],
  ['analysis_model', 'varchar'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
