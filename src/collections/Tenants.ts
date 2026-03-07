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
        // Geocoded coordinates (auto-filled on save)
        { name: 'lat', type: 'number', admin: { condition: () => false } },
        { name: 'lng', type: 'number', admin: { condition: () => false } },
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

  ],
}
