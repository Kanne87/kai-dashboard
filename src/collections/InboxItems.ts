import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'

export const InboxItems: CollectionConfig = {
  slug: 'inbox-items',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'priority', 'status', 'client', 'createdAt'],
    listSearchableFields: ['title', 'documentCategory', 'contractNumber'],
  },
  fields: [
    // ── Kern ──
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
      admin: {
        description: 'z.B. "Maasewers GmbH – Police – 32-3585"',
      },
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
        { label: 'Akzeptiert', value: 'accepted' },
        { label: 'Ignoriert', value: 'ignored' },
      ],
      admin: {
        position: 'sidebar',
      },
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Kategorie',
      options: [
        { label: 'Police', value: 'policy' },
        { label: 'Antrag', value: 'application' },
        { label: 'DLZ-Bearbeitung', value: 'dlz' },
        { label: 'Schadensdokument', value: 'claim' },
        { label: 'Regulierung VU', value: 'settlement' },
        { label: 'Kündigung', value: 'cancellation' },
        { label: 'Info VU an Vermittler', value: 'info_vu' },
        { label: 'Nachtrag', value: 'amendment' },
        { label: 'Sonstiges', value: 'other' },
      ],
    },
    {
      name: 'suggestedAction',
      type: 'textarea',
      label: 'Vorgeschlagene Aktion',
      admin: {
        description: 'Was soll mit diesem Eingang passieren?',
      },
    },
    // ── Quelle ──
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'tos_crawl',
      label: 'Quelle',
      options: [
        { label: 'TOS Dokumenten-Crawl', value: 'tos_crawl' },
        { label: 'E-Mail', value: 'email' },
        { label: 'Telefon', value: 'phone' },
        { label: 'Manuell', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
      },
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
      name: 'contract',
      type: 'relationship',
      relationTo: 'contracts',
      label: 'Vertrag',
    },
    {
      name: 'document',
      type: 'relationship',
      relationTo: 'documents',
      label: 'Verknüpftes Dokument',
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      label: 'Erstellte Aufgabe',
      admin: {
        description: 'Wird gesetzt wenn aus dem Eingang eine Aufgabe erstellt wird',
      },
    },
    // ── TOS Metadaten ──
    {
      name: 'documentCategory',
      type: 'text',
      label: 'TOS-Dokumentkategorie',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'productName',
      type: 'text',
      label: 'Produktname',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'contractNumber',
      type: 'text',
      label: 'Vertragsnummer',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'nextcloudPath',
      type: 'text',
      label: 'Nextcloud-Pfad',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tosDocumentId',
      type: 'text',
      label: 'TOS Dokument-ID',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    // ── Notizen & Entscheidung ──
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
      admin: {
        description: 'Eigene Anmerkungen zum Eingang',
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      label: 'Bearbeitet am',
      admin: {
        position: 'sidebar',
        date: {
          displayFormat: 'dd.MM.yyyy HH:mm',
        },
      },
    },
    // ── Tenant ──
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
