import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../access'

export const SystemStatus: CollectionConfig = {
  slug: 'system-status',
  access: {
    // Public read – enthält nur Service-Status-Daten, keine sensitiven Infos.
    // Wird vom Frontend (app.kailohmann.de) ohne Auth abgefragt.
    read: () => true,
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
