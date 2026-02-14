import type { CollectionConfig } from 'payload'

export const SystemStatus: CollectionConfig = {
  slug: 'system-status',
  admin: {
    useAsTitle: 'key',
    defaultColumns: ['key', 'status', 'lastCheck', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'key',
      type: 'text',
      required: true,
      unique: true,
      label: 'Service-Schlüssel',
      admin: {
        description: 'z.B. tos-session, paperless, ollama',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Status',
      defaultValue: 'inactive',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Inaktiv', value: 'inactive' },
        { label: 'Fehler', value: 'error' },
      ],
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: 'Letzter Login',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'lastCheck',
      type: 'date',
      label: 'Letzte Prüfung',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Gültig bis',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'message',
      type: 'text',
      label: 'Status-Nachricht',
      admin: {
        description: 'z.B. Fehlermeldung oder Info',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Zusätzliche Daten',
      admin: {
        description: 'z.B. Session-Cookie-Name, Cookie-Count',
      },
    },
  ],
}
