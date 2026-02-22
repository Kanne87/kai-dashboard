import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Tags: CollectionConfig = {
  slug: 'tags',
  access: standardAccess,
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'color', type: 'text' },
  ],
}
