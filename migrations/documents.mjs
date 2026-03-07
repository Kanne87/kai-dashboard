/**
 * Migration: documents
 * Auto-split from monolithic migrate.mjs (Session 177)
 *
 * MAINTENANCE: When adding fields to the corresponding
 * Collection .ts file, add the column here too.
 */
export const table = 'documents'

export const columns = [
  ['title', 'varchar'],
  ['category', "varchar DEFAULT 'unclassified'"],
  ['subtype', 'varchar'],
  ['custom_label', 'varchar'],
  ['classification_confidence', 'numeric'],
  ['classification_method', 'varchar'],
  ['classification_reasoning', 'varchar'],
  ['type', 'varchar'],
  ['source', 'varchar'],
  ['client_id', 'integer'],
  ['household_id', 'integer'],
  ['contract_id', 'integer'],
  ['file_url', 'varchar'],
  ['paperless_id', 'integer'],
  ['description', 'varchar'],
  ['extracted_text', 'text'],
  ['text_extraction_method', 'varchar'],
  ['text_extraction_date', 'timestamptz'],
  ['tos_document_id', 'varchar'],
  ['tos_section', 'varchar'],
  ['contract_number', 'varchar'],
  ['document_category', 'varchar'],
  ['document_date', 'timestamptz'],
  ['product_name', 'varchar'],
  ['section', 'varchar'],
  ['nextcloud_path', 'varchar'],
  ['filename', 'varchar'],
  ['rag_status', 'varchar'],
  ['url', 'varchar'],
  ['thumbnail_u_r_l', 'varchar'],
  ['mime_type', 'varchar'],
  ['filesize', 'numeric'],
  ['width', 'numeric'],
  ['height', 'numeric'],
  ['focal_x', 'numeric'],
  ['focal_y', 'numeric'],
  ['documenso_id', 'varchar'],
  ['signature_status', 'varchar'],
  ['tenant_id', 'integer'],
  ['updated_at', 'timestamptz'],
  ['created_at', 'timestamptz'],
]

export const rels = {
  table: 'documents_rels',
  fkColumns: ['tags_id', 'notification_templates_id', 'tasks_id'],
}
