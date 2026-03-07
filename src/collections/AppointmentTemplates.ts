import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const AppointmentTemplates: CollectionConfig = {
  slug: 'appointment-templates',
  access: standardAccess,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'duration', 'ewsCategory', 'isActive'],
    group: 'Einstellungen',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Terminart',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: { description: 'Kurzbezeichnung (z.B. "fa", "ga", "bt")' },
    },
    {
      name: 'duration',
      type: 'number',
      required: true,
      defaultValue: 60,
      label: 'Dauer (Minuten)',
      min: 15,
    },
    {
      name: 'bufferBefore',
      type: 'number',
      defaultValue: 0,
      label: 'Puffer davor (Minuten)',
      min: 0,
    },
    {
      name: 'bufferAfter',
      type: 'number',
      defaultValue: 15,
      label: 'Puffer danach (Minuten)',
      min: 0,
    },
    {
      name: 'color',
      type: 'text',
      defaultValue: 'blue',
      label: 'Farbe',
      admin: { description: 'Tailwind-Farbklasse (z.B. "bg-teal-500")' },
    },
    {
      name: 'icon',
      type: 'select',
      defaultValue: 'user',
      label: 'Icon',
      options: [
        { label: 'Gebäude', value: 'building' },
        { label: 'Stift', value: 'pen' },
        { label: 'Person', value: 'user' },
        { label: 'Uhr', value: 'clock' },
        { label: 'Kalender', value: 'calendar' },
      ],
    },
    {
      name: 'ewsCategory',
      type: 'text',
      label: 'EWS-Kategorie',
      admin: { description: 'Exchange-Kategorie (z.B. "Termin FA")' },
    },
    {
      name: 'defaultLocation',
      type: 'select',
      defaultValue: 'kanzlei',
      label: 'Standard-Ort',
      options: [
        { label: 'Kanzlei', value: 'kanzlei' },
        { label: 'Zoom', value: 'zoom' },
        { label: 'Individuell', value: 'custom' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktiv',
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Sortierung',
      admin: { position: 'sidebar' },
    },
    {
      name: 'notificationTemplates',
      type: 'relationship',
      relationTo: 'notification-templates',
      hasMany: true,
      label: 'Zugeordnete Benachrichtigungen',
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
