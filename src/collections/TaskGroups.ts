import type { CollectionConfig } from 'payload'
import { apiAccess } from '../access'

export const TaskGroups: CollectionConfig = {
  slug: 'task-groups',
  access: apiAccess,
  labels: { singular: 'Gruppe', plural: 'Gruppen' },
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'client', type: 'relationship', relationTo: 'clients', hasMany: false },
    { name: 'household', type: 'relationship', relationTo: 'households', hasMany: false },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Manuell (Drag & Drop)', value: 'manual' },
        { label: 'Workflow (N8N)', value: 'workflow' },
        { label: 'Termin-Nachbereitung', value: 'appointment' },
      ],
    },
    { name: 'appointmentRef', type: 'text', admin: { description: 'Exchange-Termin-ID' } },
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
