import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  access: standardAccess,
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'email', 'phone'],
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
      name: 'mobile',
      type: 'text',
      label: 'Mobil',
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
        { name: 'city', type: 'text', label: 'Stadt' },
      ],
    },
    {
      name: 'occupation',
      type: 'text',
      label: 'Beruf',
    },
    {
      name: 'smoker',
      type: 'checkbox',
      defaultValue: false,
      label: 'Raucher',
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Interessent', value: 'prospect' },
        { label: 'Inaktiv', value: 'inactive' },
      ],
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
