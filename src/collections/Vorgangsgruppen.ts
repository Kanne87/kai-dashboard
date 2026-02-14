import type { CollectionConfig } from 'payload'

export const Vorgangsgruppen: CollectionConfig = {
  slug: 'vorgangsgruppen',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'termin', 'haushalt', 'mandant'],
    group: 'Vorgänge',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      return {
        createdBy: {
          equals: user.id,
        },
      }
    },
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => {
      if (!user) return false
      return {
        createdBy: {
          equals: user.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return {
        createdBy: {
          equals: user.id,
        },
      }
    },
  },
  timestamps: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Gruppenname',
      admin: {
        description: 'z.B. "Termin-Nachbereitung: Beratung Kühne"',
      },
    },
    {
      name: 'termin',
      type: 'relationship',
      relationTo: 'termine',
      label: 'Verknüpfter Termin',
    },
    {
      name: 'haushalt',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },
    {
      name: 'mandant',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Mandant',
    },

    // === Virtuelle Felder (via Join) ===
    {
      name: 'vorgaenge',
      type: 'join',
      collection: 'vorgaenge',
      on: 'gruppe',
      label: 'Vorgänge',
      admin: {
        description: 'Alle Vorgänge in dieser Gruppe',
      },
    },

    // === Meta ===
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Erstellt von',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
    ],
  },
}
