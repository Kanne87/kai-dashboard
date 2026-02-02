import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Name',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Farbe (Hex)',
      admin: {
        description: 'z.B. #3B82F6',
      },
    },
  ],
}
