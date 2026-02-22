import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const HouseholdEvents: CollectionConfig = {
  slug: 'household-events',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
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
      label: 'Ereignistyp',
      options: [
        { label: 'Jahresgespräch', value: 'yearly-review' },
        { label: 'Beratung', value: 'consultation' },
        { label: 'Telefonat', value: 'call' },
        { label: 'Schadenfall', value: 'claim' },
        { label: 'Vertragsänderung', value: 'contract-change' },
        { label: 'Sonstiges', value: 'other' },
      ],
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      required: true,
      label: 'Haushalt',
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Datum',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      label: 'Dokumente',
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
