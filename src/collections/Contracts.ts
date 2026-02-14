import type { CollectionConfig } from 'payload'

export const Contracts: CollectionConfig = {
  slug: 'contracts',
  admin: {
    useAsTitle: 'displayTitle',
    defaultColumns: ['displayTitle', 'company', 'category', 'contractNumber', 'client', 'status'],
    group: 'Mandanten',
  },
  fields: [
    {
      name: 'displayTitle',
      type: 'text',
      label: 'Anzeigename',
      admin: {
        description: 'Wird automatisch generiert: Kategorie | Gesellschaft | Vertragsnummer',
        readOnly: true,
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data) {
              const parts = [data.category, data.company, data.contractNumber].filter(Boolean)
              return parts.join(' | ') || 'Neuer Vertrag'
            }
          },
        ],
      },
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      label: 'Mandant',
      index: true,
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
      index: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Gesellschaft',
      admin: {
        description: 'z.B. Allianz, HDI, DWS, Alte Leipziger',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Sparte',
      options: [
        { label: 'Leben', value: 'leben' },
        { label: 'Sach', value: 'sach' },
        { label: 'Kranken', value: 'kranken' },
        { label: 'Investment', value: 'investment' },
        { label: 'Baufinanzierung', value: 'baufi' },
        { label: 'bAV', value: 'bav' },
        { label: 'Sonstiges', value: 'sonstig' },
      ],
    },
    {
      name: 'contractNumber',
      type: 'text',
      label: 'Vertragsnummer',
      admin: {
        description: 'Vertragsnummer bei der Gesellschaft',
      },
    },
    {
      name: 'product',
      type: 'text',
      label: 'Produkt',
      admin: {
        description: 'z.B. BU Comfort, Top Dividende, Riester Zulagen',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Beantragt', value: 'pending' },
        { label: 'Ruhend', value: 'dormant' },
        { label: 'Gekündigt', value: 'cancelled' },
        { label: 'Abgelaufen', value: 'expired' },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Vertragsbeginn',
      admin: {
        date: { displayFormat: 'dd.MM.yyyy' },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Vertragsende / Ablauf',
      admin: {
        date: { displayFormat: 'dd.MM.yyyy' },
      },
    },
    {
      name: 'premium',
      type: 'number',
      label: 'Beitrag (€)',
      admin: {
        description: 'Monatlicher oder jährlicher Beitrag',
      },
    },
    {
      name: 'premiumInterval',
      type: 'select',
      label: 'Zahlweise',
      options: [
        { label: 'Monatlich', value: 'monthly' },
        { label: 'Vierteljährlich', value: 'quarterly' },
        { label: 'Halbjährlich', value: 'semi-annual' },
        { label: 'Jährlich', value: 'annual' },
        { label: 'Einmalbeitrag', value: 'single' },
      ],
    },
    // === TOS Sync ===
    {
      name: 'tosContractId',
      type: 'text',
      unique: true,
      label: 'TOS Antrags-/Vertragsnummer',
      admin: {
        description: 'antrag-Parameter aus TOS URL (z.B. 3698693)',
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
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
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
