import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'client', 'createdAt'],
  },
  upload: {
    mimeTypes: ['application/pdf', 'image/*'],
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
      required: true,
      label: 'Dokumenttyp',
      options: [
        { label: 'Vertrag', value: 'contract' },
        { label: 'Antrag', value: 'application' },
        { label: 'Angebot', value: 'offer' },
        { label: 'Rechnung', value: 'invoice' },
        { label: 'Ausweis/Legitimation', value: 'identification' },
        { label: 'Beratungsprotokoll', value: 'advisory-protocol' },
        { label: 'Analyse', value: 'analysis' },
        { label: 'Korrespondenz', value: 'correspondence' },
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
      name: 'paperlessId',
      type: 'number',
      label: 'Paperless Dokument-ID',
      admin: {
        description: 'Verknüpfung zu Paperless-ngx',
      },
    },
    {
      name: 'documensoId',
      type: 'text',
      label: 'Documenso Dokument-ID',
      admin: {
        description: 'Verknüpfung zu Documenso (Unterschrift)',
      },
    },
    {
      name: 'signatureStatus',
      type: 'select',
      label: 'Unterschriftsstatus',
      options: [
        { label: 'Nicht erforderlich', value: 'not-required' },
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Unterschrieben', value: 'signed' },
        { label: 'Abgelehnt', value: 'rejected' },
      ],
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
    },
  ],
}
