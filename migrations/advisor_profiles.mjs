/**
 * Migration: advisor_profiles
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'advisor_profiles'

export const columns = [
  ['authentik_sub', 'varchar'],
  ['first_name', 'varchar'],
  ['last_name', 'varchar'],
  ['email', 'varchar'],
  ['phone', 'varchar'],
  ['role', 'varchar'],
  ['bio', 'varchar'],
  ['street', 'varchar'],
  ['zip', 'varchar'],
  ['city', 'varchar'],
  ['zoom_integration_connected', 'boolean DEFAULT false'],
  ['zoom_integration_access_token', 'varchar'],
  ['zoom_integration_refresh_token', 'varchar'],
  ['zoom_integration_token_expires_at', 'timestamptz'],
  ['zoom_integration_zoom_user_id', 'varchar'],
  ['zoom_integration_zoom_email', 'varchar'],
  ['created_at', 'timestamptz'],
  ['updated_at', 'timestamptz'],
]
