import type { CollectionConfig } from 'payload'
import { standardAccess } from '../access'
import { createInboxItemHook } from '../hooks/createInboxItemHook'

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: standardAccess,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'subtype', 'client', 'source', 'createdAt'],
  },
  hooks: {
    afterChange: [createInboxItemHook],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Titel',
    },
    // ── Neues Klassifikationssystem ──
    {
      name: 'category',
      type: 'select',
      label: 'Kategorie',
      defaultValue: 'unclassified',
      options: [
        { label: 'Nicht klassifiziert', value: 'unclassified' },
        { label: 'Police', value: 'police' },
        { label: 'Antrag', value: 'antrag' },
        { label: 'Willenserkl\u00e4rung', value: 'willenserklaerung' },
        { label: 'Beratung', value: 'beratung' },
        { label: 'Nacharbeiten', value: 'nacharbeiten' },
        { label: 'Storno', value: 'storno' },
        { label: 'Schaden', value: 'schaden' },
        { label: 'Sonstiges', value: 'sonstiges' },
      ],
      index: true,
    },
    {
      name: 'subtype',
      type: 'text',
      label: 'Subtyp',
      admin: {
        description: 'Feingranularer Subtyp (z.B. nachtrag, pkv-protokoll, dlz-auftrag). Flexibles Textfeld \u2013 w\u00e4chst mit den Rules.',
      },
    },
    {
      name: 'customLabel',
      type: 'text',
      label: 'Individuelles Label',
      admin: {
        description: 'Freitext f\u00fcr manuell hochgeladene Dokumente (z.B. Darlehensverlauf, Tilgungsplan)',
      },
    },
    // ── Klassifikations-Metadaten ──
    {
      name: 'classificationConfidence',
      type: 'number',
      label: 'Klassifikations-Konfidenz',
      min: 0,
      max: 1,
      admin: {
        position: 'sidebar',
        step: 0.01,
        condition: (_, siblingData) => siblingData?.category && siblingData.category !== 'unclassified',
      },
    },
    {
      name: 'classificationMethod',
      type: 'select',
      label: 'Klassifikations-Methode',
      options: [
        { label: 'LLM (Ollama)', value: 'llm' },
        { label: 'Signal-Match', value: 'signal-match' },
        { label: 'Fallback', value: 'fallback' },
        { label: 'Manuell', value: 'manual' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.category && siblingData.category !== 'unclassified',
      },
    },
    {
      name: 'classificationReasoning',
      type: 'text',
      label: 'Klassifikations-Begr\u00fcndung',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => !!siblingData?.classificationReasoning,
      },
    },
    // ── Legacy type (f\u00fcr Abw\u00e4rtskompatibilit\u00e4t) ──
    {
      name: 'type',
      type: 'select',
      label: 'Dokumenttyp (Legacy)',
      admin: {
        description: 'Altes Feld \u2013 wird durch category/subtype ersetzt',
        position: 'sidebar',
        condition: (_, siblingData) => !!siblingData?.type,
      },
      options: [
        { label: 'Antrag', value: 'application' },
        { label: 'Police', value: 'policy' },
        { label: 'Nachtrag', value: 'amendment' },
        { label: 'K\u00fcndigung', value: 'cancellation' },
        { label: 'Schadensmeldung', value: 'claim' },
        { label: 'Korrespondenz', value: 'correspondence' },
        { label: 'Beratungsprotokoll', value: 'advisory-protocol' },
        { label: 'Vollmacht', value: 'power-of-attorney' },
        { label: 'Steuerbescheinigung', value: 'tax-certificate' },
        { label: 'DLZ-Bearbeitung', value: 'dlz' },
        { label: 'Haushaltsdokument', value: 'household-doc' },
        { label: 'Sonstiges', value: 'other' },
        { label: 'In Bearbeitung', value: 'editing' },
        { label: 'Bearbeitet', value: 'edited' },
      ],
    },
    {
      name: 'source',
      type: 'select',
      label: 'Quelle',
      defaultValue: 'manual',
      options: [
        { label: 'Manuell', value: 'manual' },
        { label: 'TOS Dokumentenportal', value: 'tos' },
        { label: 'TOS Vertragsdokumente', value: 'tos_contract' },
        { label: 'E-Mail', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Telefonnotiz', value: 'phone' },
        { label: 'Termintranskript', value: 'transcript' },
        { label: 'Bearbeitungskopie', value: 'editing' },
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
      name: 'contract',
      type: 'relationship',
      relationTo: 'contracts',
      label: 'Vertrag',
    },
    {
      name: 'fileUrl',
      type: 'text',
      label: 'Datei-URL',
      admin: {
        description: 'Link zum Dokument in MinIO (Public URL)',
      },
    },
    {
      name: 'paperlessId',
      type: 'number',
      label: 'Paperless Dokument-ID (deprecated)',
      admin: {
        description: 'Nicht mehr in Verwendung',
        condition: (_, siblingData) => !!siblingData?.paperlessId,
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    // ── Extrahierter Text ──
    {
      name: 'extractedText',
      type: 'textarea',
      label: 'Extrahierter Text',
      admin: {
        description: 'Volltext aus dem PDF \u2013 via pdf-parse (digital) oder OCR-Service (gescannt)',
        condition: (_, siblingData) => !!siblingData?.extractedText,
      },
    },
    {
      name: 'textExtractionMethod',
      type: 'select',
      label: 'Text-Extraktionsmethode',
      options: [
        { label: 'Nicht extrahiert', value: 'none' },
        { label: 'pdf-parse (digital)', value: 'pdf-parse' },
        { label: 'OCR (Marker/Surya)', value: 'ocr' },
        { label: 'Kein Text gefunden', value: 'no-text' },
        { label: 'Fehler', value: 'error' },
      ],
      defaultValue: 'none',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'textExtractionDate',
      type: 'date',
      label: 'Text extrahiert am',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.textExtractionMethod && siblingData.textExtractionMethod !== 'none',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      label: 'Tags',
    },
    // ── TOS-Crawler Felder ──
    {
      name: 'tosDocumentId',
      type: 'text',
      label: 'TOS Dokument-ID',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Eindeutige ID aus dem TOS-Dokumentenportal',
      },
    },
    {
      name: 'documentCategory',
      type: 'text',
      label: 'TOS-Kategorie (Original)',
      admin: {
        position: 'sidebar',
        description: 'Originale Kategorie aus dem TOS \u2013 nur Referenz, nicht die Wahrheit',
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
      label: 'VS-Nr / Vertragsnummer',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tosSection',
      type: 'text',
      label: 'TOS-Sektion',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'documentDate',
      type: 'date',
      label: 'Dokumentdatum (TOS)',
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Datum an dem das Dokument im TOS-Portal eingestellt wurde',
        date: {
          pickerAppearance: 'dayOnly',
          displayFormat: 'dd.MM.yyyy',
        },
      },
    },
    {
      name: 'nextcloudPath',
      type: 'text',
      label: 'Nextcloud-Pfad (deprecated)',
      admin: {
        position: 'sidebar',
        description: 'Legacy \u2013 Dokumente liegen jetzt in MinIO',
        condition: (_, siblingData) => !!siblingData?.nextcloudPath,
      },
    },
    {
      name: 'filename',
      type: 'text',
      label: 'Dateiname',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'ragStatus',
      type: 'select',
      label: 'RAG-Status',
      defaultValue: 'none',
      options: [
        { label: 'Nicht verarbeitet', value: 'none' },
        { label: 'Ausstehend', value: 'pending' },
        { label: 'Indiziert', value: 'indexed' },
        { label: 'Verarbeitet', value: 'processed' },
        { label: 'Kein Text', value: 'no_text' },
        { label: 'Fehler', value: 'error' },
      ],
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
