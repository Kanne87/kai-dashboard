import type { CollectionConfig } from 'payload'

export const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'householdRole', 'household', 'status'],
    group: 'Mandanten',
  },
  fields: [
    // === Personendaten ===
    {
      name: 'salutation',
      type: 'select',
      label: 'Anrede',
      options: [
        { label: 'Herr', value: 'Herr' },
        { label: 'Frau', value: 'Frau' },
        { label: 'Firma', value: 'Firma' },
        { label: 'Kanzlei', value: 'Kanzlei' },
      ],
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      label: 'Vorname',
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      label: 'Nachname',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Geburtsdatum',
      admin: {
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    // === Haushalt-Zuordnung ===
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
      index: true,
      admin: {
        description: 'Zugehöriger Haushalt (über FA-Nummer verknüpft)',
      },
    },
    {
      name: 'householdRole',
      type: 'select',
      label: 'Rolle im Haushalt',
      defaultValue: 'M',
      options: [
        { label: 'Hauptperson', value: 'M' },
        { label: 'Partner', value: 'P' },
        { label: 'Kind', value: 'K' },
        { label: 'Inaktiv', value: 'I' },
      ],
    },
    // === Kontaktdaten ===
    {
      name: 'email',
      type: 'email',
      label: 'E-Mail',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'mobile',
      type: 'text',
      label: 'Mobilnummer',
    },
    // === Adresse ===
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'street', type: 'text', label: 'Straße' },
        { name: 'zip', type: 'text', label: 'PLZ' },
        { name: 'city', type: 'text', label: 'Ort' },
      ],
    },
    // === Berufliche Daten ===
    {
      name: 'occupationType',
      type: 'text',
      label: 'Einkommensart',
      admin: {
        description: 'z.B. Angestellter, Beamter, Selbstständig, Rentner',
      },
    },
    // === Vertragsdaten ===
    {
      name: 'contractCount',
      type: 'number',
      label: 'Anzahl Verträge',
      admin: {
        description: 'Aus TOS – Anzahl Verträge bei Telis',
      },
    },
    {
      name: 'dlzCount',
      type: 'number',
      label: 'Anzahl DLZ',
      admin: {
        description: 'Aus TOS – Anzahl DLZ-Vorgänge',
      },
    },
    {
      name: 'bavCheckPossible',
      type: 'checkbox',
      label: 'bAV-Check möglich',
      defaultValue: false,
      admin: {
        description: 'Vertriebshinweis aus TOS',
        position: 'sidebar',
      },
    },
    // === Status ===
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'lead',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Interessent', value: 'prospect' },
        { label: 'Mandant', value: 'client' },
        { label: 'Ehemaliger Mandant', value: 'former' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Herkunft',
      options: [
        { label: 'Empfehlung', value: 'referral' },
        { label: 'Website', value: 'website' },
        { label: 'Telis', value: 'telis' },
        { label: 'Sonstige', value: 'other' },
      ],
    },
    // === TOS-Sync ===
    {
      name: 'tosPersonId',
      type: 'text',
      unique: true,
      index: true,
      label: 'TOS Personen-Nr.',
      admin: {
        description: 'Pers.-Nr. aus TOS (z.B. 1434763) – eindeutiger Schlüssel für Sync',
        position: 'sidebar',
      },
    },
    {
      name: 'tosMandateSince',
      type: 'date',
      label: 'Mandant seit',
      admin: {
        description: 'Aus TOS',
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'tosLastContact',
      type: 'date',
      label: 'Letzter Kontakt',
      admin: {
        description: 'Aus TOS',
        date: {
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    // === Zuordnung ===
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Zuständiger Berater',
    },
    {
      name: 'notes',
      type: 'richText',
      label: 'Notizen',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
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
