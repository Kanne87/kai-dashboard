import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const Contracts: CollectionConfig = {
  slug: 'contracts',
  access: standardAccess,
  admin: {
    useAsTitle: 'displayTitle',
    defaultColumns: ['displayTitle', 'company', 'category', 'client', 'status'],
  },
  fields: [
    // ── Identifikation ──
    {
      name: 'displayTitle',
      type: 'text',
      label: 'Anzeigename',
      admin: { description: 'z.B. "Allianz KFZ – AS-9130065998"' },
    },
    {
      name: 'contractNumber',
      type: 'text',
      required: true,
      label: 'Vertragsnummer',
    },
    {
      name: 'product',
      type: 'text',
      label: 'Produkt',
      admin: { description: '1:1 aus TOS, z.B. "DEMA Privathaftpflicht Exklusiv - Rhion"' },
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
        { label: 'DU-Versicherung', value: 'DU' },
        { label: 'Private Krankenversicherung', value: 'PKV' },
        { label: 'Hausratversicherung', value: 'Hausrat' },
        { label: 'Privathaftpflicht', value: 'PHV' },
        { label: 'Grundbesitzer-Haftpflicht', value: 'Grundbesitzer-HP' },
        { label: 'KFZ-Versicherung', value: 'KFZ' },
        { label: 'Rechtsschutz', value: 'RS' },
        { label: 'Unfallversicherung', value: 'Unfall' },
        { label: 'Wohngebäude', value: 'Wohngebäude' },
        { label: 'Glasversicherung', value: 'Glas' },
        { label: 'Vermögensschadenhaftpflicht', value: 'VSH' },
        { label: 'Kapitalversicherung', value: 'Kapital' },
        { label: 'Riester', value: 'Riester' },
        { label: 'Rürup', value: 'Rürup' },
        { label: 'bAV', value: 'bAV' },
        { label: 'Depot/Fonds', value: 'Depot' },
        { label: 'Gewerbe', value: 'Gewerbe' },
        { label: 'Sonstige', value: 'Sonstige' },
      ],
    },
    {
      name: 'tariff',
      type: 'text',
      label: 'Tarif',
      admin: { description: 'z.B. "Premium Best Leistungsgarantie", "REN205201Z"' },
    },

    // ── Zuordnung ──
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
      name: 'insuredPerson',
      type: 'text',
      label: 'Versicherte Person(en)',
      admin: { description: 'Freitext, später ggf. Relation' },
    },

    // ── Laufzeit & Beitrag ──
    {
      name: 'applicationDate',
      type: 'date',
      label: 'Abschluss-Datum',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
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
      label: 'Vertragsende / Ablauf',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'durationYears',
      type: 'number',
      label: 'Laufzeit (Jahre)',
    },
    {
      name: 'premium',
      type: 'number',
      label: 'Zahlbeitrag (EUR)',
    },
    {
      name: 'premiumInterval',
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
    {
      name: 'paymentAccount',
      type: 'text',
      label: 'Konto-Referenz',
      admin: { description: 'Konto-Nr. Referenz aus Vertragsspiegel (keine Bankdaten)' },
    },

    // ── Zusatzdaten (flexibel) ──
    {
      name: 'additionalData',
      type: 'json',
      label: 'Zusatz-Daten',
      admin: {
        description: 'Vers.Summe, Selbstbehalt, KFZ-Kennzeichen, Baujahr, etc.',
      },
    },

    // ── Status ──
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
        { label: 'Abgelaufen', value: 'expired' },
        { label: 'Schwebend', value: 'suspended' },
      ],
    },
    {
      name: 'managedByTelis',
      type: 'checkbox',
      defaultValue: true,
      label: 'Von TELIS betreut',
    },
    {
      name: 'cancellationDate',
      type: 'date',
      label: 'Stornodatum',
      admin: {
        date: { displayFormat: 'dd.MM.yyyy' },
        condition: (data) => data?.status === 'cancelled' || data?.status === 'expired',
      },
    },
    {
      name: 'cancellationReason',
      type: 'text',
      label: 'Stornogrund',
      admin: {
        condition: (data) => data?.status === 'cancelled' || data?.status === 'expired',
      },
    },
    {
      name: 'originalAdvisor',
      type: 'text',
      label: 'Originalberater',
      admin: { description: 'Bei Bestandsübernahme: z.B. "Hautau, Marcel"' },
    },

    // ── Verknüpfungen ──
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      label: 'Dokumente',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },

    // ── TOS-Synchronisation ──
    {
      name: 'tosContractId',
      type: 'text',
      label: 'TOS Antrags-Nr.',
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tosSection',
      type: 'text',
      label: 'TOS-Sektion',
      admin: {
        position: 'sidebar',
        description: 'z.B. "Schutz erworbener Werte", "Alterseinkommenssicherung"',
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
