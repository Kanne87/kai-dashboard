import type { CollectionConfig } from 'payload'

export const Households: CollectionConfig = {
  slug: 'households',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'addressCity', 'tosFaNumber', 'status', 'tosLastSynced'],
    group: 'Mandanten',
  },
  fields: [
    // === Identifikation ===
    {
      name: 'tosFaNumber',
      type: 'text',
      unique: true,
      index: true,
      label: 'FA-Nummer',
      admin: {
        description: 'Finanzanalyse-Nummer aus TOS – eindeutiger Schlüssel pro Haushalt',
        position: 'sidebar',
      },
    },
    {
      name: 'tosFaPromo',
      type: 'text',
      label: 'FA Promo',
      admin: {
        description: 'Zeitraum der Finanzanalyse (z.B. 2022/05)',
        position: 'sidebar',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: 'Anzeigename',
      admin: {
        description: 'Nachname der Hauptperson (wird automatisch gesetzt)',
      },
    },
    // === Hauptperson ===
    {
      name: 'primaryPerson',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Hauptperson',
      admin: {
        description: 'Mandant (Stand M) – die zentrale Ansprechperson des Haushalts',
      },
    },
    // === Adresse (vom Hauptmandanten übernommen) ===
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'street', type: 'text', label: 'Straße' },
        { name: 'zip', type: 'text', label: 'PLZ' },
        { name: 'city', type: 'text', label: 'Ort' },
      ],
    },
    // === Status ===
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Inaktiv', value: 'inactive' },
        { label: 'Archiviert', value: 'archived' },
      ],
    },
    // === Sync ===
    {
      name: 'tosLastSynced',
      type: 'date',
      label: 'Zuletzt synchronisiert',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'tosSyncStatus',
      type: 'select',
      defaultValue: 'never',
      label: 'Sync-Status',
      options: [
        { label: 'Synchronisiert', value: 'synced' },
        { label: 'Veraltet', value: 'outdated' },
        { label: 'Nie synchronisiert', value: 'never' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    // === Sonstiges ===
    {
      name: 'notes',
      type: 'richText',
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
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Zuständiger Berater',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      label: 'Mandant (Tenant)',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
