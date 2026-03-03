import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Claims: CollectionConfig = {
  slug: 'claims',
  access: standardAccess,
  admin: {
    useAsTitle: 'description',
    defaultColumns: ['claimNumber', 'description', 'claimDate', 'status', 'regulationAmount'],
  },
  fields: [
    // ── Identifikation ──
    {
      name: 'claimNumber',
      type: 'text',
      unique: true,
      label: 'Schaden-Nr.',
      admin: { description: 'TOS Schaden-Nr. (z.B. "547570")' },
    },
    {
      name: 'externalClaimNumber',
      type: 'text',
      label: 'Schaden-Nr. (Gesellschaft)',
      admin: { description: 'Schaden-Nr. bei der Gesellschaft (z.B. "260032421V")' },
    },

    // ── Zuordnung ──
    {
      name: 'contract',
      type: 'relationship',
      relationTo: 'contracts',
      required: true,
      label: 'Vertrag',
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },

    // ── Schadendaten ──
    {
      name: 'claimDate',
      type: 'date',
      required: true,
      label: 'Schadentag',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'claimType',
      type: 'select',
      label: 'Schadentyp',
      options: [
        { label: 'Einbruchdiebstahl/Raub/Vandalismus', value: 'einbruch_raub_vandalismus' },
        { label: 'Elementar', value: 'elementar' },
        { label: 'Fahrraddiebstahl', value: 'fahrraddiebstahl' },
        { label: 'Feuer', value: 'feuer' },
        { label: 'Glasbruch', value: 'glasbruch' },
        { label: 'Leitungswasser', value: 'leitungswasser' },
        { label: 'Personenschaden', value: 'personenschaden' },
        { label: 'Sachschaden', value: 'sachschaden' },
        { label: 'Sonstiges', value: 'sonstiges' },
        { label: 'Sturm', value: 'sturm' },
        { label: 'Überspannung', value: 'ueberspannung' },
      ],
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      label: 'Beschreibung',
      admin: { description: 'Kurzbeschreibung (z.B. "Brandschaden")' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'gemeldet',
      label: 'Status',
      options: [
        { label: 'Gemeldet', value: 'gemeldet' },
        { label: 'In Bearbeitung', value: 'in_bearbeitung' },
        { label: 'Reguliert', value: 'reguliert' },
        { label: 'Abgelehnt', value: 'abgelehnt' },
        { label: 'Offen', value: 'offen' },
      ],
    },

    // ── Beträge ──
    {
      name: 'damageAmount',
      type: 'number',
      label: 'Schadenhöhe (EUR)',
    },
    {
      name: 'regulationAmount',
      type: 'number',
      label: 'Regulierungshöhe (EUR)',
      admin: { description: 'Was die VU tatsächlich zahlt' },
    },

    // ── Hinweis & Notizen ──
    {
      name: 'hint',
      type: 'text',
      label: 'Hinweis',
      admin: { description: 'z.B. "Unterlagen fehlen"' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },

    // ── Schadenhistorie ──
    {
      name: 'history',
      type: 'array',
      label: 'Schadenhistorie',
      fields: [
        {
          name: 'date',
          type: 'date',
          required: true,
          label: 'Datum',
          admin: { date: { displayFormat: 'dd.MM.yyyy' } },
        },
        {
          name: 'eventType',
          type: 'text',
          required: true,
          label: 'Ereignistyp',
          admin: { description: 'z.B. "Regulierung VU", "Anforderung Information"' },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Beschreibung',
        },
        {
          name: 'documentUrl',
          type: 'text',
          label: 'Dokument-Link',
          admin: { description: 'Link zum DMS-Dokument (optional)' },
        },
      ],
    },

    // ── Verknüpfungen ──
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      label: 'Dokumente',
    },

    // ── TOS-Synchronisation ──
    {
      name: 'tosClaimId',
      type: 'text',
      label: 'TOS Schaden-Nr.',
      admin: { position: 'sidebar', description: 'Für Sync mit TOS' },
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
