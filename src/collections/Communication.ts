import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Communication: CollectionConfig = {
  slug: 'communication',
  access: standardAccess,
  admin: {
    useAsTitle: 'subject',
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      label: 'Betreff',
    },
    {
      name: 'type',
      type: 'select',
      label: 'Typ',
      options: [
        { label: 'E-Mail', value: 'email' },
        { label: 'Anruf', value: 'call' },
        { label: 'SMS', value: 'sms' },
        { label: 'Brief', value: 'letter' },
        { label: 'Notiz', value: 'note' },
      ],
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Mandant',
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Inhalt',
    },
    {
      name: 'direction',
      type: 'select',
      label: 'Richtung',
      options: [
        { label: 'Eingehend', value: 'inbound' },
        { label: 'Ausgehend', value: 'outbound' },
      ],
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
