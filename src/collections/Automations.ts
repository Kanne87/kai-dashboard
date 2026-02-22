import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Automations: CollectionConfig = {
  slug: 'automations',
  access: standardAccess,
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Typ',
      options: [
        { label: 'N8N Workflow', value: 'n8n' },
        { label: 'Cron Job', value: 'cron' },
        { label: 'Webhook', value: 'webhook' },
        { label: 'Event-basiert', value: 'event' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Inaktiv', value: 'inactive' },
        { label: 'Fehler', value: 'error' },
      ],
    },
    {
      name: 'n8nWorkflowId',
      type: 'text',
      label: 'N8N Workflow ID',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'lastRun',
      type: 'date',
      label: 'Letzter Lauf',
      admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
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
