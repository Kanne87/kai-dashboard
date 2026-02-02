import type { CollectionConfig } from 'payload'

export const Communication: CollectionConfig = {
  slug: 'communication',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'channel', 'direction', 'client', 'createdAt'],
  },
  fields: [
    {
      name: 'channel',
      type: 'select',
      required: true,
      options: [
        { label: 'E-Mail', value: 'email' },
        { label: 'Telefon', value: 'phone' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Telis', value: 'telis' },
        { label: 'Persönlich', value: 'in-person' },
        { label: 'Brief', value: 'mail' },
      ],
    },
    {
      name: 'direction',
      type: 'select',
      required: true,
      options: [
        { label: 'Eingehend', value: 'inbound' },
        { label: 'Ausgehend', value: 'outbound' },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Betreff',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Inhalt',
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      required: true,
      label: 'Mandant',
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      label: 'Verknüpfte Aufgabe',
    },
    {
      name: 'contactedAt',
      type: 'date',
      label: 'Kontaktzeitpunkt',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
      },
    },
    {
      name: 'followUpDate',
      type: 'date',
      label: 'Nachfassen am',
    },
  ],
  timestamps: true,
}
