/**
 * Migration: appointment_templates
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'appointment_templates'

export const columns = [
  ['name', 'varchar'],
  ['slug', 'varchar'],
  ['duration', 'numeric DEFAULT 60'],
  ['buffer_before', 'numeric DEFAULT 0'],
  ['buffer_after', 'numeric DEFAULT 15'],
  ['color', 'varchar'],
  ['icon', 'varchar'],
  ['ews_category', 'varchar'],
  ['default_location', 'varchar'],
  ['is_active', 'boolean DEFAULT true'],
  ['sort_order', 'numeric DEFAULT 0'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]

export const rels = {
  table: 'appointment_templates_rels',
  fkColumns: ['notification_templates_id', 'tasks_id', 'tags_id'],
}
