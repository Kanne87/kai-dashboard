import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const InboxItems: CollectionConfig = {
  slug: 'inbox-items',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'channel', 'priority', 'status', 'client', 'createdAt'],
    group: 'Posteingang',
  },
  fields: [
    // ── Kern ──
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Zusammenfassung',
      admin: {
        description: 'Kurzbeschreibung des Eingangs – was ist passiert, was ist zu tun?',
      },
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      label: 'Kanal',
      options: [
        { label: 'TOS Dokumentenportal', value: 'tos-documents' },
        { label: 'E-Mail', value: 'email' },
        { label: 'Telefon', value: 'phone' },
        { label: 'Paperless', value: 'paperless' },
        { label: 'Manuell', value: 'manual' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Status',
      options: [
        { label: 'Neu', value: 'new' },
        { label: 'Gesehen', value: 'seen' },
        { label: 'Aufgabe erstellt', value: 'task_created' },
        { label: 'Abgelegt', value: 'filed' },
        { label: 'Ignoriert', value: 'ignored' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      label: 'Priorität',
      options: [
        { label: 'Dringend', value: 'urgent' },
        { label: 'Hoch', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Niedrig', value: 'low' },
      ],
    },

    // ── Dokument-Kontext (befüllt vom Crawler) ──
    {
      name: 'documentCategory',
      type: 'text',
      label: 'Dokumentkategorie',
      admin: {
        description: 'z.B. Police, DLZ-Bearbeitung, Regulierung VU',
      },
    },
    {
      name: 'productName',
      type: 'text',
      label: 'Produktname',
    },
    {
      name: 'contractNumber',
      type: 'text',
      label: 'Vertragsnummer',
    },

    // ── Verknüpfungen ──
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
      name: 'document',
      type: 'relationship',
      relationTo: 'documents',
      label: 'Quelldokument',
    },
    {
      name: 'contract',
      type: 'relationship',
      relationTo: 'contracts',
      label: 'Vertrag',
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      label: 'Erstellte Aufgabe',
      admin: {
        description: 'Wird gesetzt wenn aus diesem Eingang eine Aufgabe erstellt wird',
      },
    },

    // ── Aktionen / Vorschläge ──
    {
      name: 'suggestedAction',
      type: 'select',
      label: 'Vorgeschlagene Aktion',
      options: [
        { label: 'Ablegen', value: 'file' },
        { label: 'Aufgabe erstellen', value: 'create_task' },
        { label: 'Kunden informieren', value: 'notify_client' },
        { label: 'Prüfen', value: 'review' },
        { label: 'Weiterleiten', value: 'forward' },
        { label: 'Schadensmeldung bearbeiten', value: 'process_claim' },
        { label: 'Ignorieren', value: 'ignore' },
      ],
      admin: {
        description: 'Automatischer Vorschlag basierend auf Dokumenttyp',
      },
    },
    {
      name: 'suggestedActionReason',
      type: 'text',
      label: 'Begründung',
      admin: {
        description: 'Warum wird diese Aktion vorgeschlagen?',
      },
    },

    // ── Metadaten ──
    {
      name: 'sourceId',
      type: 'text',
      label: 'Quell-ID',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Eindeutige ID zur Deduplizierung (z.B. tos-doc-34967060)',
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      label: 'Bearbeitet am',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'dd.MM.yyyy HH:mm' },
      },
    },
    {
      name: 'processedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Bearbeitet von',
      admin: {
        position: 'sidebar',
      },
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
