import type { CollectionConfig } from 'payload'

export const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'priority', 'dueDate', 'assignedTo'],
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
      type: 'richText',
      label: 'Beschreibung',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'inbox',
      options: [
        { label: 'Eingang', value: 'inbox' },
        { label: 'Zu erledigen', value: 'todo' },
        { label: 'In Bearbeitung', value: 'in-progress' },
        { label: 'Warten auf Rückmeldung', value: 'waiting' },
        { label: 'Erledigt', value: 'done' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      required: true,
      defaultValue: 'medium',
      options: [
        { label: 'Dringend', value: 'urgent' },
        { label: 'Hoch', value: 'high' },
        { label: 'Mittel', value: 'medium' },
        { label: 'Niedrig', value: 'low' },
      ],
    },
    {
      name: 'dueDate',
      type: 'date',
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
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Zugewiesen an',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategorie',
      options: [
        { label: 'Beratung', value: 'consultation' },
        { label: 'Dokument', value: 'document' },
        { label: 'Nachfassen', value: 'follow-up' },
        { label: 'Vertrag', value: 'contract' },
        { label: 'Termin', value: 'appointment' },
        { label: 'Sonstiges', value: 'other' },
      ],
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
  ],
}
