import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'email', 'status'],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Vorname',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Nachname',
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-Mail',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Geburtsdatum',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
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
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'lead',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Interessent', value: 'prospect' },
        { label: 'Mandant', value: 'client' },
        { label: 'Ehemaliger Mandant', value: 'former' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Herkunft',
      options: [
        { label: 'Empfehlung', value: 'referral' },
        { label: 'Website', value: 'website' },
        { label: 'Telis', value: 'telis' },
        { label: 'Sonstige', value: 'other' },
      ],
    },
    {
      name: 'tosPersonId',
      type: 'text',
      unique: true,
      index: true,
      label: 'TOS Mandanten-ID',
      admin: {
        description: 'Eindeutige ID aus TOS-Portal für automatisches Matching (z.B. 1330139)',
        position: 'sidebar',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Zuständiger Berater',
    },
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
  ],
}
