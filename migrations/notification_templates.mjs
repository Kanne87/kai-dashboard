/**
 * Migration: notification_templates
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'notification_templates'

export const columns = [
  ['name', 'varchar'],
  ['type', 'varchar'],
  ['trigger', 'varchar'],
  ['subject', 'varchar'],
  ['body', 'varchar'],
  ['is_active', 'boolean DEFAULT true'],
  ['is_default', 'boolean DEFAULT false'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
