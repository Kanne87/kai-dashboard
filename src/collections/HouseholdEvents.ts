import type { CollectionConfig } from 'payload'

export const HouseholdEvents: CollectionConfig = {
  slug: 'household-events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'household', 'eventDate'],
    group: 'Mandanten',
  },
  fields: [
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      required: true,
      label: 'Haushalt',
      index: true,
    },
    {
      name: 'person',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Person',
      admin: {
        description: 'Optional – falls das Ereignis einer bestimmten Person zugeordnet ist',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Art',
      options: [
        { label: 'Anruf', value: 'call' },
        { label: 'Termin', value: 'meeting' },
        { label: 'Dokument', value: 'document' },
        { label: 'E-Mail', value: 'email' },
        { label: 'Aufgabe erledigt', value: 'task_completed' },
        { label: 'TOS Sync', value: 'sync' },
        { label: 'Notiz', value: 'note' },
        { label: 'Vertrag', value: 'contract' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Details',
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      label: 'Datum',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
      },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      label: 'Quelle',
      options: [
        { label: 'Manuell', value: 'manual' },
        { label: 'TOS Sync', value: 'tos_sync' },
        { label: 'Kalender', value: 'calendar' },
        { label: 'Paperless', value: 'paperless' },
        { label: 'System', value: 'system' },
      ],
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
