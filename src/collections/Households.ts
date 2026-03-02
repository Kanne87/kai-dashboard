import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Households: CollectionConfig = {
  slug: 'households',
  access: standardAccess,
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'status', 'assignedTo'],
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: 'Haushaltsname',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      required: true,
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Interessent', value: 'prospect' },
        { label: 'Inaktiv', value: 'inactive' },
      ],
    },
    {
      name: 'primaryPerson',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Hauptperson',
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Berater',
    },
    {
      name: 'address',
      type: 'group',
      label: 'Adresse',
      fields: [
        { name: 'street', type: 'text', label: 'Straße' },
        { name: 'zip', type: 'text', label: 'PLZ' },
        { name: 'city', type: 'text', label: 'Stadt' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
    },

    // ── TOS-Synchronisation ──
    {
      name: 'tosFaNumber',
      type: 'text',
      unique: true,
      label: 'TOS FA-Nummer',
      admin: {
        position: 'sidebar',
        description: 'Mandanten-Nr. im TOS (z.B. 1313412)',
      },
    },
    {
      name: 'tosFaPromo',
      type: 'text',
      label: 'TOS FA-Promo',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tosLastSynced',
      type: 'date',
      label: 'Letzter TOS-Sync',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd.MM.yyyy HH:mm' },
      },
    },
    {
      name: 'tosSyncStatus',
      type: 'select',
      defaultValue: 'never',
      label: 'Sync-Status',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Nie synchronisiert', value: 'never' },
        { label: 'Synchronisiert', value: 'synced' },
        { label: 'Fehler', value: 'error' },
        { label: 'Ausstehend', value: 'pending' },
      ],
    },

    // ── Tenant ──
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: { position: 'sidebar' },
    },
  ],
}
