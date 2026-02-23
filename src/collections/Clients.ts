import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Clients: CollectionConfig = {
  slug: 'clients',
  access: standardAccess,
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'email', 'phone', 'status'],
  },
  fields: [
    // ── Stammdaten ──
    {
      name: 'salutation',
      type: 'select',
      label: 'Anrede',
      options: [
        { label: 'Herr', value: 'Herr' },
        { label: 'Frau', value: 'Frau' },
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
        date: { displayFormat: 'dd.MM.yyyy' },
      },
    },
    {
      name: 'occupationType',
      type: 'text',
      label: 'Beruf',
    },

    // ── Kontakt ──
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
      label: 'Mobil',
    },

    // ── Adresse (flat, matching DB columns) ──
    {
      name: 'addressStreet',
      type: 'text',
      label: 'Straße',
    },
    {
      name: 'addressZip',
      type: 'text',
      label: 'PLZ',
    },
    {
      name: 'addressCity',
      type: 'text',
      label: 'Stadt',
    },

    // ── Haushalt & Zuordnung ──
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },
    {
      name: 'householdRole',
      type: 'select',
      label: 'Rolle im Haushalt',
      defaultValue: 'M',
      options: [
        { label: 'Mandant (Hauptperson)', value: 'M' },
        { label: 'Partner', value: 'P' },
        { label: 'Kind', value: 'K' },
        { label: 'Sonstige', value: 'S' },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Zugeordneter Berater',
    },

    // ── Statistik-Felder (automatisch gepflegt) ──
    {
      name: 'contractCount',
      type: 'number',
      label: 'Anzahl Verträge',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'dlzCount',
      type: 'number',
      label: 'Anzahl DLZ',
      defaultValue: 0,
      admin: { readOnly: true },
    },
    {
      name: 'bavCheckPossible',
      type: 'checkbox',
      label: 'bAV-Check möglich',
      defaultValue: false,
    },

    // ── Status & Quelle ──
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Aktiv', value: 'active' },
        { label: 'Interessent', value: 'prospect' },
        { label: 'Inaktiv', value: 'inactive' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Quelle',
      defaultValue: 'manual',
      options: [
        { label: 'Manuell', value: 'manual' },
        { label: 'TOS-Import', value: 'tos' },
        { label: 'Empfehlung', value: 'referral' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },

    // ── TOS-Synchronisation ──
    {
      name: 'tosPersonId',
      type: 'text',
      label: 'TOS Person-ID',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tosClientNumber',
      type: 'text',
      label: 'TOS Mandanten-Nr.',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tosMandateSince',
      type: 'date',
      label: 'Mandant seit',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd.MM.yyyy' },
      },
    },
    {
      name: 'tosLastContact',
      type: 'date',
      label: 'Letzter pers. Kontakt',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd.MM.yyyy' },
      },
    },

    // ── Tenant ──
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
