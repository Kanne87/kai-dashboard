/**
 * Migration: tenants
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'tenants'

export const columns = [
  ['name', 'varchar'],
  ['slug', 'varchar'],
  ['kanzlei_street', 'varchar'],
  ['kanzlei_zip', 'varchar'],
  ['kanzlei_city', 'varchar'],
  ['kanzlei_phone', 'varchar'],
  ['kanzlei_email', 'varchar'],
  ['kanzlei_lat', 'numeric'],
  ['kanzlei_lng', 'numeric'],
  ['integrations_zoom_enabled', 'boolean DEFAULT false'],
  ['integrations_zoom_default_link', 'varchar'],
  ['integrations_zoom_api_key', 'varchar'],
  ['integrations_zoom_api_secret', 'varchar'],
  ['disabled_rules', 'jsonb'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]
