import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const InboxItems: CollectionConfig = {
  slug: 'inbox-items',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'priority', 'status', 'aiActionType', 'aiConfidence', 'createdAt'],
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
    },
    {
      name: 'channel',
      type: 'select',
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
        { label: 'Verarbeitet', value: 'processed' },
        { label: 'Aufgabe erstellt', value: 'task_created' },
        { label: 'Abgelegt', value: 'filed' },
        { label: 'Ignoriert', value: 'ignored' },
        { label: 'Archiviert (Regel)', value: 'archived' },
      ],
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      label: 'Priorit\u00e4t',
      options: [
        { label: 'Dringend', value: 'urgent' },
        { label: 'Hoch', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Niedrig', value: 'low' },
      ],
    },

    // ── Dokument-Kontext ──
    { name: 'documentCategory', type: 'text', label: 'Dokumentkategorie' },
    { name: 'productName', type: 'text', label: 'Produktname' },
    { name: 'contractNumber', type: 'text', label: 'Vertragsnummer' },

    // ── Verkn\u00fcpfungen ──
    { name: 'client', type: 'relationship', relationTo: 'clients', label: 'Mandant' },
    { name: 'household', type: 'relationship', relationTo: 'households', label: 'Haushalt' },
    { name: 'document', type: 'relationship', relationTo: 'documents', label: 'Quelldokument' },
    { name: 'contract', type: 'relationship', relationTo: 'contracts', label: 'Vertrag' },
    { name: 'task', type: 'relationship', relationTo: 'tasks', label: 'Erstellte Aufgabe' },

    // ── KI-Anreicherung ──
    {
      name: 'aiSummary',
      type: 'textarea',
      label: 'KI-Zusammenfassung',
      admin: { description: 'Automatisch generierte Zusammenfassung des Dokuments' },
    },
    {
      name: 'aiDocumentType',
      type: 'text',
      label: 'KI-Dokumenttyp',
    },
    {
      name: 'aiActionType',
      type: 'select',
      label: 'Vorgeschlagene Aktion',
      options: [
        { label: 'Aufgabe erstellen', value: 'create_task' },
        { label: 'Nachricht formulieren', value: 'compose_message' },
        { label: 'Weiterleiten', value: 'forward' },
        { label: 'Zur Kenntnis nehmen', value: 'acknowledge' },
      ],
    },
    {
      name: 'aiActionParams',
      type: 'json',
      label: 'Aktions-Parameter',
      admin: { description: 'JSON mit konkreten Parametern f\u00fcr die vorgeschlagene Aktion' },
    },
    {
      name: 'aiConfidence',
      type: 'number',
      label: 'KI-Konfidenz',
      min: 0,
      max: 100,
      admin: { description: '0-100% Sicherheit der KI-Analyse' },
    },
    {
      name: 'aiSource',
      type: 'select',
      label: 'Vorschlags-Quelle',
      options: [
        { label: 'KI (Ollama)', value: 'ai' },
        { label: 'Automatisierungsregel', value: 'rule' },
      ],
    },
    {
      name: 'aiSuggestedResponse',
      type: 'textarea',
      label: 'Nachrichten-Vorschlag',
      admin: { description: 'Vorgeschlagene WhatsApp/E-Mail Nachricht an den Mandanten' },
    },
    {
      name: 'aiRuleId',
      type: 'number',
      label: 'Regel-ID',
      admin: { description: 'ID der Automatisierungsregel die diesen Vorschlag generiert hat' },
    },

    // ── Filterregeln (Session 175) ──
    {
      name: 'filterRuleId',
      type: 'text',
      label: 'Filter-Regel',
      admin: { description: 'ID der Filterregel die dieses Item bewertet hat (z.B. riester-vollzulage)' },
    },
    {
      name: 'filterAction',
      type: 'select',
      label: 'Filter-Aktion',
      options: [
        { label: 'Unterdrueckt (auto-archiviert)', value: 'suppress' },
        { label: 'Warnung anzeigen', value: 'flag' },
        { label: 'Durchgelassen', value: 'pass' },
      ],
      admin: { description: 'Ergebnis der Filterregel-Auswertung' },
    },
    {
      name: 'filterMessage',
      type: 'text',
      label: 'Filter-Hinweis',
      admin: { description: 'Erklaerung der Filterregel fuer den Berater (z.B. Grundzulage nur 21,63 EUR statt 175 EUR)' },
    },

    // ── Bearbeitung ──
    {
      name: 'actionTaken',
      type: 'text',
      label: 'Ausgef\u00fchrte Aktion',
    },
    {
      name: 'actionTakenAt',
      type: 'date',
      label: 'Aktion ausgef\u00fchrt am',
      admin: { date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
    },

    // ── Alt (regelbasiert) ──
    { name: 'suggestedAction', type: 'text', label: 'Regelbasierte Aktion (legacy)' },
    { name: 'suggestedActionReason', type: 'text', label: 'Begr\u00fcndung (legacy)' },

    // ── Metadaten ──
    {
      name: 'sourceId',
      type: 'text',
      label: 'Quell-ID',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'processedAt',
      type: 'date',
      label: 'KI-Analyse am',
      admin: { position: 'sidebar', date: { displayFormat: 'dd.MM.yyyy HH:mm' } },
    },
    {
      name: 'processedBy',
      type: 'relationship',
      relationTo: 'users',
      label: 'Bearbeitet von',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
