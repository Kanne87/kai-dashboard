import type { CollectionConfig } from 'payload'
import { isAuthenticated, isSuperAdmin } from '../access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    read: isAuthenticated,
    create: isSuperAdmin,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'domains',
      type: 'array',
      fields: [
        { name: 'domain', type: 'text', required: true },
      ],
    },

    // ── Kanzlei / Office ──
    {
      name: 'kanzlei',
      type: 'group',
      label: 'Kanzlei',
      fields: [
        { name: 'street', type: 'text', label: 'Strasse' },
        { name: 'zip', type: 'text', label: 'PLZ' },
        { name: 'city', type: 'text', label: 'Ort' },
        { name: 'phone', type: 'text', label: 'Telefon' },
        { name: 'email', type: 'email', label: 'E-Mail' },
      ],
    },

    // ── Integrations ──
    {
      name: 'integrations',
      type: 'group',
      label: 'Integrationen',
      fields: [
        {
          name: 'zoom',
          type: 'group',
          label: 'Zoom',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: false },
            { name: 'defaultLink', type: 'text', label: 'Standard Zoom-Link' },
            { name: 'apiKey', type: 'text', label: 'API Key (optional)' },
            { name: 'apiSecret', type: 'text', label: 'API Secret (optional)' },
          ],
        },
      ],
    },

    // ── Appointment Templates ──
    {
      name: 'appointmentTemplates',
      type: 'array',
      label: 'Terminvorlagen',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Name' },
        { name: 'slug', type: 'text', required: true, label: 'Slug' },
        {
          name: 'duration',
          type: 'number',
          required: true,
          label: 'Dauer (Minuten)',
          defaultValue: 60,
          min: 15,
        },
        { name: 'bufferBefore', type: 'number', label: 'Puffer davor (Min.)', defaultValue: 0, min: 0 },
        { name: 'bufferAfter', type: 'number', label: 'Puffer danach (Min.)', defaultValue: 15, min: 0 },
        {
          name: 'color',
          type: 'select',
          label: 'Farbe',
          defaultValue: 'blue',
          options: [
            { label: 'Blau', value: 'blue' },
            { label: 'Orange', value: 'orange' },
            { label: 'Rot', value: 'red' },
            { label: 'Teal', value: 'teal' },
            { label: 'Gruen', value: 'green' },
            { label: 'Grau', value: 'slate' },
            { label: 'Violett', value: 'violet' },
          ],
        },
        {
          name: 'ewsCategory',
          type: 'select',
          label: 'Exchange-Kategorie',
          options: [
            { label: '(keine)', value: '' },
            { label: 'Termin Beratung', value: 'Termin Beratung' },
            { label: 'Termin BIG', value: 'Termin BIG' },
            { label: 'Termin FA', value: 'Termin FA' },
          ],
        },
        {
          name: 'defaultLocation',
          type: 'select',
          label: 'Standard-Ort',
          defaultValue: 'kanzlei',
          options: [
            { label: 'Kanzlei', value: 'kanzlei' },
            { label: 'Zoom', value: 'zoom' },
            { label: 'Individuell', value: 'custom' },
          ],
        },
        { name: 'isActive', type: 'checkbox', defaultValue: true, label: 'Aktiv' },
      ],
    },
  ],
}
