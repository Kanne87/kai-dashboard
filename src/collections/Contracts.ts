import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Contracts: CollectionConfig = {
  slug: 'contracts',
  access: standardAccess,
  admin: {
    useAsTitle: 'contractNumber',
    defaultColumns: ['contractNumber', 'company', 'category', 'client', 'status'],
  },
  fields: [
    {
      name: 'contractNumber',
      type: 'text',
      required: true,
      label: 'Vertragsnummer',
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      label: 'Gesellschaft',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Sparte',
      options: [
        { label: 'Lebensversicherung', value: 'LV' },
        { label: 'BU-Versicherung', value: 'BU' },
        { label: 'Private Krankenversicherung', value: 'PKV' },
        { label: 'Hausratversicherung', value: 'Hausrat' },
        { label: 'Privathaftpflicht', value: 'PHV' },
        { label: 'KFZ-Versicherung', value: 'KFZ' },
        { label: 'Rechtsschutz', value: 'RS' },
        { label: 'Unfallversicherung', value: 'Unfall' },
        { label: 'Wohngebäude', value: 'Wohngebäude' },
        { label: 'Riester', value: 'Riester' },
        { label: 'Rürup', value: 'Rürup' },
        { label: 'bAV', value: 'bAV' },
        { label: 'Depot/Fonds', value: 'Depot' },
        { label: 'Gewerbe', value: 'Gewerbe' },
        { label: 'Sonstige', value: 'Sonstige' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Beantragt', value: 'pending' },
        { label: 'Gekündigt', value: 'cancelled' },
        { label: 'Beitragsfrei', value: 'paid-up' },
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
      name: 'premium',
      type: 'group',
      label: 'Beitrag',
      fields: [
        { name: 'amount', type: 'number', label: 'Betrag (EUR)' },
        {
          name: 'interval',
          type: 'select',
          label: 'Zahlweise',
          options: [
            { label: 'Monatlich', value: 'monthly' },
            { label: 'Vierteljährlich', value: 'quarterly' },
            { label: 'Halbjährlich', value: 'semi-annual' },
            { label: 'Jährlich', value: 'annual' },
            { label: 'Einmalbeitrag', value: 'single' },
          ],
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Vertragsbeginn',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Vertragsende',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      label: 'Dokumente',
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
