/**
 * Migration: task_events
 * Created in Session 178 for task chronik/audit trail.
 *
 * MAINTENANCE: When adding fields to TaskEvents.ts,
 * add the column here too.
 */
export const table = 'task_events'

export const columns = [
  ['task_id', 'integer'],
  ['event_type', 'varchar'],
  ['text', 'varchar'],
  ['previous_value', 'varchar'],
  ['new_value', 'varchar'],
  ['user_id', 'integer'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
