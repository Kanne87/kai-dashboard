import type { CollectionConfig } from 'payload'

export const Automations: CollectionConfig = {
  slug: 'automations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'trigger', 'active'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktiv',
    },
    {
      name: 'trigger',
      type: 'select',
      required: true,
      label: 'Auslöser',
      options: [
        { label: 'Neuer Mandant', value: 'client-created' },
        { label: 'Dokument hochgeladen', value: 'document-uploaded' },
        { label: 'Aufgabe fällig', value: 'task-due' },
        { label: 'Kommunikation eingegangen', value: 'communication-received' },
        { label: 'Status geändert', value: 'status-changed' },
        { label: 'Zeitgesteuert', value: 'scheduled' },
      ],
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      label: 'Aktion',
      options: [
        { label: 'Aufgabe erstellen', value: 'create-task' },
        { label: 'E-Mail senden', value: 'send-email' },
        { label: 'SMS senden', value: 'send-sms' },
        { label: 'Tag zuweisen', value: 'assign-tag' },
        { label: 'Status ändern', value: 'change-status' },
        { label: 'N8N Workflow triggern', value: 'trigger-n8n' },
      ],
    },
    {
      name: 'n8nWebhookUrl',
      type: 'text',
      label: 'N8N Webhook URL',
      admin: {
        condition: (data) => data?.action === 'trigger-n8n',
        description: 'z.B. https://n8n.kailohmann.de/webhook/...',
      },
    },
    {
      name: 'conditions',
      type: 'json',
      label: 'Bedingungen (JSON)',
      admin: {
        description: 'Filter-Bedingungen für den Auslöser',
      },
    },
  ],
}
