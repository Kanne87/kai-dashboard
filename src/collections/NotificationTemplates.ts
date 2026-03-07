import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const NotificationTemplates: CollectionConfig = {
  slug: 'notification-templates',
  access: standardAccess,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'trigger'],
    group: 'Einstellungen',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Vorlagenname',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Typ',
      options: [
        { label: 'E-Mail', value: 'email' },
        { label: 'SMS', value: 'sms' },
      ],
    },
    {
      name: 'trigger',
      type: 'select',
      required: true,
      label: 'Auslöser',
      defaultValue: 'immediately',
      options: [
        { label: 'Sofort nach Erstellung', value: 'immediately' },
        { label: '24h vor Termin', value: '24h_before' },
        { label: '48h vor Termin', value: '48h_before' },
        { label: '1h vor Termin', value: '1h_before' },
      ],
    },
    {
      name: 'subject',
      type: 'text',
      label: 'Betreff',
      admin: {
        description: 'Platzhalter: {{mandant}}, {{termin}}, {{datum}}, {{uhrzeit}}, {{berater}}',
        condition: (_, siblingData) => siblingData?.type === 'email',
      },
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Inhalt',
      admin: {
        description: 'Platzhalter: {{mandant}}, {{termin}}, {{datum}}, {{uhrzeit}}, {{ort}}, {{berater}}, {{zoom_link}}',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktiv',
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      label: 'Standard-Vorlage',
      admin: { description: 'Wird neuen Terminarten automatisch zugewiesen' },
    },

    // ── Tenant ──
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: { position: 'sidebar' },
    },
  ],
}
