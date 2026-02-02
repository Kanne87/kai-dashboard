import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
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
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'advisor',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Berater', value: 'advisor' },
        { label: 'Assistent', value: 'assistant' },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
  ],
}
