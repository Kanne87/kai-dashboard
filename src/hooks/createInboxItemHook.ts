// Hook: Erstellt automatisch ein Inbox-Item wenn ein neues TOS-Dokument eingeht
// Wird als afterChange Hook an die Documents Collection gehängt.

import type { CollectionAfterChangeHook } from 'payload'

// Dokumentkategorie → Inbox-Kategorie
const CATEGORY_MAP: Record<string, string> = {
  policy: 'policy',
  dlz: 'dlz',
  application: 'application',
  claim: 'claim',
  cancellation: 'cancellation',
  amendment: 'amendment',
  correspondence: 'info_vu',
  other: 'other',
}

// Kategorie → Priorität
const PRIORITY_MAP: Record<string, string> = {
  dlz: 'high',
  claim: 'urgent',
  cancellation: 'high',
  application: 'normal',
  policy: 'low',
  info_vu: 'normal',
  amendment: 'normal',
  other: 'low',
}

// Kategorie → vorgeschlagene Aktion
const ACTION_MAP: Record<string, string> = {
  policy: 'Police prüfen und ablegen. Ggf. Deckungsumfang mit Mandant besprechen.',
  dlz: 'DLZ-Bearbeitung prüfen und termingerecht erledigen.',
  application: 'Antrag prüfen. Mandant über Status informieren.',
  claim: 'Schadensdokument prüfen. Schadenmeldung bei VU einreichen oder Status prüfen.',
  cancellation: 'Stornierung prüfen. Ggf. Ersatzdeckung anbieten.',
  info_vu: 'Information des VU prüfen und ggf. an Mandanten weiterleiten.',
  amendment: 'Nachtrag prüfen. Mandant über Vertragsänderung informieren.',
  other: 'Dokument prüfen und entscheiden ob Handlungsbedarf besteht.',
}

export const createInboxItemHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Nur bei Neuanlage und nur für TOS-Dokumente
  if (operation !== 'create') return doc
  if (doc.source !== 'tos') return doc

  // Prüfe ob bereits ein Inbox-Item für diese tosDocumentId existiert
  if (doc.tosDocumentId) {
    const existing = await req.payload.find({
      collection: 'inbox-items',
      where: { tosDocumentId: { equals: doc.tosDocumentId } },
      limit: 1,
    })
    if (existing.totalDocs > 0) return doc
  }

  const docType = doc.type || 'other'
  const category = CATEGORY_MAP[docType] || 'other'
  const priority = PRIORITY_MAP[category] || 'normal'
  const suggestedAction = ACTION_MAP[category] || ACTION_MAP['other']

  try {
    await req.payload.create({
      collection: 'inbox-items',
      data: {
        title: doc.title,
        status: 'new',
        priority,
        category,
        source: 'tos_crawl',
        suggestedAction,
        documentCategory: doc.documentCategory || undefined,
        productName: doc.productName || undefined,
        contractNumber: doc.contractNumber || undefined,
        nextcloudPath: doc.nextcloudPath || undefined,
        tosDocumentId: doc.tosDocumentId || undefined,
        document: doc.id,
        client: typeof doc.client === 'object' ? doc.client?.id : doc.client || undefined,
        contract: typeof doc.contract === 'object' ? doc.contract?.id : doc.contract || undefined,
        household: typeof doc.household === 'object' ? doc.household?.id : doc.household || undefined,
        tenant: typeof doc.tenant === 'object' ? doc.tenant?.id : doc.tenant || 1,
      },
    })
  } catch (err) {
    // Fehler loggen aber Dokument-Erstellung nicht blockieren
    req.payload.logger.error(`Inbox-Item Erstellung fehlgeschlagen für ${doc.tosDocumentId}: ${err}`)
  }

  return doc
}
