import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Households: CollectionConfig = {
  slug: 'households',
  access: standardAccess,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'status', 'advisor'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Haushaltsname',
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
      name: 'advisor',
      type: 'relationship',
      relationTo: 'users',
      label: 'Berater',
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
      name: 'yearlyReviewMonth',
      type: 'select',
      label: 'Jahresgespräch (Monat)',
      options: [
        { label: 'Januar', value: '1' },
        { label: 'Februar', value: '2' },
        { label: 'März', value: '3' },
        { label: 'April', value: '4' },
        { label: 'Mai', value: '5' },
        { label: 'Juni', value: '6' },
        { label: 'Juli', value: '7' },
        { label: 'August', value: '8' },
        { label: 'September', value: '9' },
        { label: 'Oktober', value: '10' },
        { label: 'November', value: '11' },
        { label: 'Dezember', value: '12' },
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
