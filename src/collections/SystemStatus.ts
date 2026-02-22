import type { CollectionConfig } from 'payload'
import { isAuthenticated, isSuperAdmin } from '../access'

export const SystemStatus: CollectionConfig = {
  slug: 'system-status',
  access: {
    read: isAuthenticated,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'service',
  },
  fields: [
    {
      name: 'service',
      type: 'text',
      required: true,
      label: 'Service',
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Degraded', value: 'degraded' },
        { label: 'Offline', value: 'offline' },
      ],
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
    },
    {
      name: 'lastChecked',
      type: 'date',
      label: 'Zuletzt geprüft',
      admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
  ],
}
