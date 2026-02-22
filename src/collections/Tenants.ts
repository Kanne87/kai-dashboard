import type { CollectionConfig } from 'payload'
import { isAuthenticated, isSuperAdmin } from '../access'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    read: isAuthenticated,
    create: isSuperAdmin,
    update: isSuperAdmin,
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
  ],
}
