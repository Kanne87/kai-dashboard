import type { CollectionConfig } from 'payload'

export const Termine: CollectionConfig = {
  slug: 'termine',
  admin: {
    useAsTitle: 'titel',
    defaultColumns: ['titel', 'typ', 'datum', 'status', 'haushalt'],
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
    // === Exchange-Referenz ===
    {
      name: 'exchangeId',
      type: 'text',
      unique: true,
      label: 'Exchange Kalender-ID',
      admin: {
        description: 'Referenz zum Exchange-Kalendereintrag',
        position: 'sidebar',
      },
    },

    // === Termindaten ===
    {
      name: 'titel',
      type: 'text',
      required: true,
      label: 'Terminbezeichnung',
    },
    {
      name: 'typ',
      type: 'select',
      required: true,
      label: 'Termintyp',
      options: [
        { label: 'Finanzanalyse', value: 'finanzanalyse' },
        { label: 'Beratung', value: 'beratung' },
        { label: 'Jahrestermin', value: 'jahrestermin' },
        { label: 'Gutachten A', value: 'gutachten-a' },
        { label: 'Gutachten B', value: 'gutachten-b' },
        { label: 'Servicetermin', value: 'servicetermin' },
      ],
    },
    {
      name: 'datum',
      type: 'date',
      required: true,
      label: 'Datum',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'startZeit',
      type: 'text',
      label: 'Startzeit',
      admin: {
        description: 'Format: HH:mm',
      },
    },
    {
      name: 'endZeit',
      type: 'text',
      label: 'Endzeit',
      admin: {
        description: 'Format: HH:mm',
      },
    },

    // === Ort ===
    {
      name: 'ort',
      type: 'text',
      label: 'Ort',
      admin: {
        description: 'Adresse oder "Zoom-Meeting" / "Telefon"',
      },
    },
    {
      name: 'ortTyp',
      type: 'select',
      label: 'Ort-Typ',
      options: [
        { label: 'Vor Ort', value: 'vor-ort' },
        { label: 'Zoom', value: 'zoom' },
        { label: 'Telefon', value: 'telefon' },
      ],
    },
    {
      name: 'zoomLink',
      type: 'text',
      label: 'Zoom-Link',
      admin: {
        condition: (_data, siblingData) => siblingData?.ortTyp === 'zoom',
      },
    },

    // === Inhalte ===
    {
      name: 'beschreibung',
      type: 'richText',
      label: 'Beschreibung',
      admin: {
        description: 'Freitext vom Kalendereintrag',
      },
    },
    {
      name: 'zusammenfassung',
      type: 'richText',
      label: 'Zusammenfassung',
      admin: {
        description: 'Nachträglich erfasste Zusammenfassung',
      },
    },

    // === Status ===
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'geplant',
      label: 'Status',
      options: [
        { label: 'Geplant', value: 'geplant' },
        { label: 'Bestätigt', value: 'bestaetigt' },
        { label: 'Durchgeführt', value: 'durchgefuehrt' },
        { label: 'Abgesagt', value: 'abgesagt' },
      ],
    },

    // === Beziehungen ===
    {
      name: 'haushalt',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },
    {
      name: 'mandanten',
      type: 'relationship',
      relationTo: 'clients',
      hasMany: true,
      label: 'Mandanten',
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
