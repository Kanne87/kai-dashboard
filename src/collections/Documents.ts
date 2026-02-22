import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'client', 'createdAt'],
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
        { label: 'Sonstiges', value: 'other' },
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
        description: 'Link zum Dokument in Paperless-ngx oder Nextcloud',
      },
    },
    {
      name: 'paperlessId',
      type: 'number',
      label: 'Paperless Dokument-ID',
      admin: {
        description: 'Automatisch verknüpft über N8N-Workflow',
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
