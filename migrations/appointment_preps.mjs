/**
 * Migration: appointment_preps
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'appointment_preps'

export const columns = [
  ['exchange_calendar_id', 'varchar'],
  ['exchange_subject', 'varchar'],
  ['appointment_date', 'timestamptz'],
  ['appointment_time', 'varchar'],
  ['location', 'varchar'],
  ['client_name', 'varchar'],
  ['client_email', 'varchar'],
  ['household_id', 'integer'],
  ['client_id', 'integer'],
  ['status', 'varchar'],
  ['notes', 'varchar'],
  ['summary', 'varchar'],
  ['transcript_url', 'varchar'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]

export const rels = {
  table: 'appointment_preps_rels',
  fkColumns: ['notification_templates_id', 'tasks_id', 'tags_id'],
}

export const arrays = [
  {
    table: 'appointment_preps_materials',
    columns: [['type', 'varchar'], ['title', 'varchar'], ['url', 'varchar']],
  },
  {
    table: 'appointment_preps_aufgaben',
    columns: [['text', 'varchar'], ['is_done', 'boolean DEFAULT false'], ['task_id', 'integer']],
  },
  {
    table: 'appointment_preps_wiedervorlagen',
    columns: [['text', 'varchar'], ['due_date', 'timestamptz'], ['is_done', 'boolean DEFAULT false'], ['task_id', 'integer']],
  },
]
