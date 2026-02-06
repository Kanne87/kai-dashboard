import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'client', 'source', 'createdAt'],
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
        { label: 'DLZ-Bearbeitung', value: 'dlz' },
        { label: 'Vertragsdokument', value: 'contract-doc' },
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
      name: 'source',
      type: 'select',
      label: 'Quelle',
      options: [
        { label: 'TOS Portal', value: 'tos' },
        { label: 'Paperless', value: 'paperless' },
        { label: 'Manuell', value: 'manual' },
        { label: 'Documenso', value: 'documenso' },
      ],
    },
    {
      name: 'tosDocumentId',
      type: 'text',
      unique: true,
      label: 'TOS Dokument-ID',
      admin: {
        description: 'Für Deduplizierung beim Crawling',
      },
    },
    {
      name: 'contractNumber',
      type: 'text',
      label: 'Vertragsnummer',
    },
    {
      name: 'documentCategory',
      type: 'text',
      label: 'Dokumentkategorie',
      admin: {
        description: 'z.B. DLZ-Bearbeitung, Antrags-Infoblatt',
      },
    },
    {
      name: 'productName',
      type: 'text',
      label: 'Produktbezeichnung',
    },
    {
      name: 'section',
      type: 'text',
      label: 'TOS Sektion',
      admin: {
        description: 'z.B. DLZ Bearbeitungen, Vertragsdokumente',
      },
    },
    {
      name: 'nextcloudPath',
      type: 'text',
      label: 'Nextcloud-Pfad',
    },
    {
      name: 'ragStatus',
      type: 'select',
      label: 'RAG Status',
      defaultValue: 'pending',
      options: [
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Eingebettet', value: 'embedded' },
        { label: 'Fehlgeschlagen', value: 'failed' },
      ],
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
