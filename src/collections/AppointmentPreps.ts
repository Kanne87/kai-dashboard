import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const AppointmentPreps: CollectionConfig = {
  slug: 'appointment-preps',
  access: standardAccess,
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'appointmentDate', 'status', 'household'],
  },
  fields: [
    // ── Exchange-Verknuepfung ──
    {
      name: 'exchangeCalendarId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Exchange Calendar-ID',
      admin: { description: 'EWS Item-ID des Kalendereintrags' },
    },
    {
      name: 'exchangeSubject',
      type: 'text',
      label: 'Exchange Subject',
      admin: { description: 'Betreff aus dem Kalender (z.B. "Terminvereinbarung Aline Olejnik und Kai Lohmann")' },
    },

    // ── Termindaten ──
    {
      name: 'appointmentDate',
      type: 'date',
      required: true,
      label: 'Termindatum',
      admin: { date: { displayFormat: 'dd.MM.yyyy' } },
    },
    {
      name: 'appointmentTime',
      type: 'text',
      label: 'Uhrzeit',
      admin: { description: 'z.B. "14:00 - 15:30"' },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Ort / Zoom-Link',
    },

    // ── Mandant & Haushalt ──
    {
      name: 'clientName',
      type: 'text',
      label: 'Mandantenname',
      admin: { description: 'Geparster Name aus Subject oder manuell' },
    },
    {
      name: 'clientEmail',
      type: 'email',
      label: 'Mandanten-E-Mail',
      admin: { description: 'Aus Exchange Attendees' },
    },
    {
      name: 'household',
      type: 'relationship',
      relationTo: 'households',
      label: 'Haushalt',
    },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'clients',
      label: 'Person',
    },

    // ── Status ──
    {
      name: 'status',
      type: 'select',
      defaultValue: 'vorbereiten',
      label: 'Status',
      options: [
        { label: 'Vorbereiten', value: 'vorbereiten' },
        { label: 'Durchgefuehrt', value: 'durchgefuehrt' },
        { label: 'Nachbereitet', value: 'nachbereitet' },
      ],
    },

    // ── Vorbereitung ──
    {
      name: 'notes',
      type: 'textarea',
      label: 'Vorbereitungs-Notizen',
    },
    {
      name: 'materials',
      type: 'array',
      label: 'Materialien',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          label: 'Typ',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Bild/Screenshot', value: 'image' },
            { label: 'Dokument', value: 'document' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Titel',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL / Dateipfad',
        },
      ],
    },

    // ── KI-Zusammenfassung (spaeter befuellt) ──
    {
      name: 'summary',
      type: 'textarea',
      label: 'KI-Zusammenfassung',
      admin: { description: 'Automatisch generiert aus vorherigen Terminen' },
    },

    // ── Nachbereitung ──
    {
      name: 'aufgaben',
      type: 'array',
      label: 'Aufgaben (Nachbereitung)',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Beschreibung',
        },
        {
          name: 'isDone',
          type: 'checkbox',
          defaultValue: false,
          label: 'Erledigt',
        },
        {
          name: 'taskId',
          type: 'relationship',
          relationTo: 'tasks',
          label: 'Verknuepfte Aufgabe',
          admin: { description: 'Falls als Vorgang erstellt' },
        },
      ],
    },
    {
      name: 'wiedervorlagen',
      type: 'array',
      label: 'Wiedervorlagen (Nachbereitung)',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Beschreibung',
        },
        {
          name: 'dueDate',
          type: 'date',
          label: 'Faellig am',
          admin: { date: { displayFormat: 'dd.MM.yyyy' } },
        },
        {
          name: 'isDone',
          type: 'checkbox',
          defaultValue: false,
          label: 'Erledigt',
        },
        {
          name: 'taskId',
          type: 'relationship',
          relationTo: 'tasks',
          label: 'Verknuepfte Aufgabe',
        },
      ],
    },

    // ── Transkript (spaeter) ──
    {
      name: 'transcriptUrl',
      type: 'text',
      label: 'Transkript',
      admin: { description: 'Link zum Termintranskript (zukuenftig)' },
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
