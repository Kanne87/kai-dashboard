import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Automations: CollectionConfig = {
  slug: 'automations',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
    group: 'Posteingang',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Aktiv',
    },
    {
      name: 'trigger',
      type: 'json',
      label: 'Ausl\u00f6ser',
      admin: { description: 'JSON: { documentType, category, keywords[] }' },
    },
    {
      name: 'action',
      type: 'json',
      label: 'Aktion',
      admin: { description: 'JSON: { type, params }' },
    },
    {
      name: 'learnedFromCount',
      type: 'number',
      defaultValue: 0,
      label: 'Gelernt aus',
      admin: { description: 'Anzahl Aktionen aus denen diese Regel gelernt wurde' },
    },
    {
      name: 'accuracy',
      type: 'number',
      defaultValue: 90,
      label: 'Genauigkeit (%)',
      min: 0,
      max: 100,
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: { position: 'sidebar' },
    },
  ],
}
