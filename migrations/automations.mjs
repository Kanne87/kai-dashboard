/**
 * Migration: automations
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'automations'

export const columns = [
  ['title', 'varchar'],
  ['description', 'varchar'],
  ['is_active', 'boolean DEFAULT false'],
  ['trigger', 'varchar'],
  ['action', 'varchar'],
  ['learned_from_count', 'integer'],
  ['accuracy', 'numeric'],
  ['learning_total_processed', 'integer DEFAULT 0'],
  ['learning_accuracy', 'numeric'],
  ['learning_last_trained_at', 'timestamptz'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
