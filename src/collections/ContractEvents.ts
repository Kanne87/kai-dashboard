import type { CollectionConfig } from 'payload'
import { apiAccess } from '../access'

export const ContractEvents: CollectionConfig = {
  slug: 'contract-events',
  access: apiAccess,
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['contract', 'eventType', 'summary', 'eventDate', 'createdAt'],
    group: 'Vertr\u00e4ge',
  },
  fields: [
    {
      name: 'contract',
      type: 'relationship',
      relationTo: 'contracts',
      required: true,
      index: true,
      label: 'Vertrag',
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      index: true,
      label: 'Haushalt',
    },
    {
      name: 'eventDate',
      type: 'date',
      required: true,
      index: true,
      label: 'Ereignisdatum',
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      index: true,
      label: 'Ereignistyp',
      options: [
        { label: 'Neuabschluss', value: 'neuabschluss' },
        { label: 'Police best\u00e4tigt', value: 'police_bestaetigung' },
        { label: 'Beitragsanpassung', value: 'beitragsanpassung' },
        { label: 'Vertrags\u00e4nderung', value: 'vertragsaenderung' },
        { label: 'Sonderzahlung', value: 'sonderzahlung' },
        { label: 'Nachtrag', value: 'nachtrag' },
        { label: 'DLZ', value: 'dlz' },
        { label: 'Storno', value: 'storno' },
        { label: 'Bestands\u00fcbertragung', value: 'bestandsuebertragung' },
        { label: 'Schaden', value: 'schaden' },
        { label: 'Info', value: 'info' },
        { label: 'Routine', value: 'routine' },
      ],
    },
    {
      name: 'summary',
      type: 'text',
      required: true,
      label: 'Zusammenfassung',
      admin: {
        description: 'Kurze Beschreibung des Ereignisses (1-2 S\u00e4tze)',
      },
    },
    {
      name: 'details',
      type: 'json',
      label: 'Details',
      admin: {
        description: 'Strukturierte Daten (Beitrag, Rentenfaktor, Abweichungen etc.)',
      },
    },
    {
      name: 'flags',
      type: 'json',
      label: 'Flags',
      admin: {
        description: 'Array von Flags: abweichung_antrag_police, beitragsaenderung, handlungsbedarf, frist',
      },
    },
    {
      name: 'documentIds',
      type: 'json',
      label: 'Dokument-IDs',
      admin: {
        description: 'Array von Payload Document IDs die zu diesem Event geh\u00f6ren',
      },
    },
    {
      name: 'analysisModel',
      type: 'text',
      label: 'Analyse-Modell',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
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
