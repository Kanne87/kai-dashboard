import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'
import { createInboxItemHook } from '../hooks/createInboxItemHook'

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'client', 'source', 'createdAt'],
  },
  hooks: {
    afterChange: [createInboxItemHook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Dokumenttyp',
      options: [
        { label: 'Antrag', value: 'application' },
        { label: 'Police', value: 'policy' },
        { label: 'Nachtrag', value: 'amendment' },
        { label: 'Kündigung', value: 'cancellation' },
        { label: 'Schadensmeldung', value: 'claim' },
        { label: 'Korrespondenz', value: 'correspondence' },
        { label: 'Beratungsprotokoll', value: 'advisory-protocol' },
        { label: 'Vollmacht', value: 'power-of-attorney' },
        { label: 'Steuerbescheinigung', value: 'tax-certificate' },
        { label: 'DLZ-Bearbeitung', value: 'dlz' },
        { label: 'Haushaltsdokument', value: 'household-doc' },
        { label: 'Sonstiges', value: 'other' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Quelle',
      defaultValue: 'manual',
      options: [
        { label: 'Manuell', value: 'manual' },
        { label: 'TOS-Crawler', value: 'tos' },
        { label: 'E-Mail', value: 'email' },
      ],
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Mandant',
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },
    {
      name: 'contract',
      type: 'relationship',
      relationTo: 'contracts',
      label: 'Vertrag',
    },
    {
      name: 'fileUrl',
      type: 'text',
      label: 'Datei-URL',
      admin: {
        description: 'Link zum Dokument in MinIO (Public URL)',
      },
    },
    {
      name: 'paperlessId',
      type: 'number',
      label: 'Paperless Dokument-ID (deprecated)',
      admin: {
        description: 'Nicht mehr in Verwendung',
        condition: (_, siblingData) => !!siblingData?.paperlessId,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
    },
    // ── TOS-Crawler Felder ──
    {
      name: 'tosDocumentId',
      type: 'text',
      label: 'TOS Dokument-ID',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Eindeutige ID aus dem TOS-Dokumentenportal',
      },
    },
    {
      name: 'documentCategory',
      type: 'text',
      label: 'Dokumentkategorie (TOS)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'productName',
      type: 'text',
      label: 'Produktname',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contractNumber',
      type: 'text',
      label: 'VS-Nr / Vertragsnummer',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tosSection',
      type: 'text',
      label: 'TOS-Sektion',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'documentDate',
      type: 'date',
      label: 'Dokumentdatum (TOS)',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Datum an dem das Dokument im TOS-Portal eingestellt wurde',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'nextcloudPath',
      type: 'text',
      label: 'Nextcloud-Pfad (deprecated)',
      admin: {
        position: 'sidebar',
        description: 'Legacy – Dokumente liegen jetzt in MinIO',
        condition: (_, siblingData) => !!siblingData?.nextcloudPath,
      },
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Dateiname',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'ragStatus',
      type: 'select',
      label: 'RAG-Status',
      defaultValue: 'none',
      options: [
        { label: 'Nicht verarbeitet', value: 'none' },
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Indiziert', value: 'indexed' },
        { label: 'Verarbeitet', value: 'processed' },
        { label: 'Kein Text', value: 'no_text' },
        { label: 'Fehler', value: 'error' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
