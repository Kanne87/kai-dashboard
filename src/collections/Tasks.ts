import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'priority', 'dueDate', 'client', 'status'],
  },
  hooks: {
    // Placeholder für späteren Exchange-Sync Hook
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      label: 'Status',
      options: [
        { label: 'Offen', value: 'open' },
        { label: 'Erledigt', value: 'done' },
      ],
    },
    {
      name: 'priority',
      type: 'checkbox',
      defaultValue: false,
      label: 'Priorität',
      admin: {
        description: 'Aufgabe wird in der Liste hervorgehoben',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Kategorie',
      options: [
        { label: 'Wiedervorlage', value: 'wiedervorlage' },
        { label: 'Aufgabe', value: 'aufgabe' },
        { label: 'Schaden', value: 'schaden' },
        { label: 'Nacharbeit', value: 'nacharbeit' },
        { label: 'Empfehlung', value: 'empfehlung' },
      ],
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      label: 'Fällig am',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
      },
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
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Zugewiesen an',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      label: 'Verknüpfte Dokumente',
    },
    // === Exchange Sync ===
    {
      name: 'exchangeItemId',
      type: 'text',
      label: 'Exchange Task ID',
      admin: {
        position: 'sidebar',
        description: 'Automatisch gesetzt bei Exchange-Sync',
        readOnly: true,
      },
    },
    {
      name: 'exchangeChangeKey',
      type: 'text',
      label: 'Exchange Change Key',
      admin: {
        position: 'sidebar',
        description: 'Wird für Updates benötigt',
        readOnly: true,
      },
    },
    {
      name: 'exchangeSyncedAt',
      type: 'date',
      label: 'Zuletzt synchronisiert',
      admin: {
        position: 'sidebar',
        date: {
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
        readOnly: true,
      },
    },
    // === Tenant ===
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
