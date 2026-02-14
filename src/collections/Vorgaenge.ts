import type { CollectionConfig } from 'payload'

export const Vorgaenge: CollectionConfig = {
  slug: 'vorgaenge',
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['text', 'typ', 'status', 'faellig', 'haushalt', 'mandant'],
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
    // === Hauptfelder ===
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Beschreibung',
    },
    {
      name: 'typ',
      type: 'select',
      required: true,
      label: 'Typ',
      options: [
        { label: 'Aufgabe', value: 'aufgabe' },
        { label: 'Wiedervorlage', value: 'wiedervorlage' },
        { label: 'Nacharbeit', value: 'nacharbeit' },
        { label: 'Schaden', value: 'schaden' },
        { label: 'Empfehlung', value: 'empfehlung' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'offen',
      label: 'Status',
      options: [
        { label: 'Offen', value: 'offen' },
        { label: 'Erledigt', value: 'erledigt' },
      ],
    },
    {
      name: 'faellig',
      type: 'date',
      label: 'Fälligkeitsdatum',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
        description: 'Pflicht bei Typ "Wiedervorlage"',
      },
    },
    {
      name: 'erledigtAm',
      type: 'date',
      label: 'Erledigt am',
      admin: {
        position: 'sidebar',
        readOnly: true,
        date: {
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
      },
    },

    // === Typ-spezifische Felder ===
    {
      name: 'vertrag',
      type: 'text',
      label: 'Vertragsbezeichnung',
      admin: {
        description: 'Bei Nacharbeit/Schaden: Vertragsbezeichnung',
        condition: (_data, siblingData) =>
          siblingData?.typ === 'nacharbeit' || siblingData?.typ === 'schaden',
      },
    },
    {
      name: 'gemeldetAm',
      type: 'date',
      label: 'Gemeldet am',
      admin: {
        description: 'Bei Schaden: Datum der Schadenmeldung',
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
        condition: (_data, siblingData) => siblingData?.typ === 'schaden',
      },
    },
    {
      name: 'autoReminderTage',
      type: 'number',
      label: 'Auto-Reminder (Tage)',
      defaultValue: 10,
      admin: {
        description: 'Bei Schaden: Tage bis automatische Erinnerung',
        condition: (_data, siblingData) => siblingData?.typ === 'schaden',
      },
    },

    // === Beziehungen ===
    {
      name: 'gruppe',
      type: 'relationship',
      relationTo: 'vorgangsgruppen',
      label: 'Vorgangsgruppe',
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

    // === Meta ===
    {
      name: 'notizen',
      type: 'richText',
      label: 'Notizen',
      admin: {
        description: 'Schnellnotiz',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sortierung',
      defaultValue: 0,
      admin: {
        description: 'Reihenfolge innerhalb einer Gruppe',
      },
    },
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
      // Set createdBy on create
      ({ req, operation, data }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
      // Validate: Wiedervorlage requires faellig date
      ({ data }) => {
        if (data.typ === 'wiedervorlage' && !data.faellig) {
          throw new Error('Wiedervorlagen benötigen ein Fälligkeitsdatum.')
        }
        return data
      },
    ],
    afterChange: [
      // Set erledigtAm timestamp when status changes to 'erledigt'
      async ({ doc, previousDoc, req, operation, context }) => {
        if (context?.skipErledigtAmHook) return
        if (
          operation === 'update' &&
          doc.status === 'erledigt' &&
          previousDoc?.status !== 'erledigt' &&
          !doc.erledigtAm
        ) {
          await req.payload.update({
            collection: 'vorgaenge',
            id: doc.id,
            data: {
              erledigtAm: new Date().toISOString(),
            },
            context: { skipErledigtAmHook: true },
          })
        }
      },
    ],
  },
}
