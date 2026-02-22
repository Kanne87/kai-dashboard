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
    useAsTitle: 'key',
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      label: 'Service-Key',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'unknown',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Error', value: 'error' },
        { label: 'Unknown', value: 'unknown' },
      ],
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: 'Letzter Login',
      admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
    },
    {
      name: 'lastCheck',
      type: 'date',
      label: 'Letzter Check',
      admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Gültig bis',
      admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
    },
    {
      name: 'message',
      type: 'text',
      label: 'Nachricht',
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadaten',
    },
  ],
}
