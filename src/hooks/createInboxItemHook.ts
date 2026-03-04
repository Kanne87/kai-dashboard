// Hook: Erstellt automatisch ein Inbox-Item wenn ein neues TOS-Dokument eingeht
// Wird als afterChange Hook an die Documents Collection gehängt.

import type { CollectionAfterChangeHook } from 'payload'

// Dokumenttyp → Priorität
const PRIORITY_MAP: Record<string, string> = {
  dlz: 'high',
  claim: 'urgent',
  cancellation: 'high',
  application: 'normal',
  policy: 'low',
  correspondence: 'normal',
  amendment: 'normal',
  'advisory-protocol': 'normal',
  other: 'low',
}

// Dokumenttyp → vorgeschlagene Aktion (select value)
const ACTION_MAP: Record<string, { action: string; reason: string }> = {
  policy: { action: 'file', reason: 'Police prüfen und ablegen. Ggf. Deckungsumfang mit Mandant besprechen.' },
  dlz: { action: 'create_task', reason: 'DLZ-Bearbeitung prüfen und termingerecht erledigen.' },
  application: { action: 'review', reason: 'Antrag prüfen. Mandant über Status informieren.' },
  claim: { action: 'process_claim', reason: 'Schadensdokument prüfen. Schadenmeldung bei VU einreichen oder Status prüfen.' },
  cancellation: { action: 'notify_client', reason: 'Stornierung prüfen. Ggf. Ersatzdeckung anbieten.' },
  correspondence: { action: 'review', reason: 'Information des VU prüfen und ggf. an Mandanten weiterleiten.' },
  amendment: { action: 'notify_client', reason: 'Nachtrag prüfen. Mandant über Vertragsänderung informieren.' },
  other: { action: 'review', reason: 'Dokument prüfen und entscheiden ob Handlungsbedarf besteht.' },
}

export const createInboxItemHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  // Nur bei Neuanlage und nur für TOS-Dokumente
  if (operation !== 'create') return doc
  if (doc.source !== 'tos') return doc

  const sourceId = doc.tosDocumentId ? `tos-doc-${doc.tosDocumentId}` : null

  // Prüfe ob bereits ein Inbox-Item für diese sourceId existiert
  if (sourceId) {
    const existing = await req.payload.find({
      collection: 'inbox-items',
      where: { sourceId: { equals: sourceId } },
      limit: 1,
    })
    if (existing.totalDocs > 0) return doc
  }

  const docType = doc.type || 'other'
  const priority = PRIORITY_MAP[docType] || 'normal'
  const suggestion = ACTION_MAP[docType] || ACTION_MAP['other']

  try {
    await req.payload.create({
      collection: 'inbox-items',
      data: {
        title: doc.title,
        channel: 'tos-documents',
        status: 'new',
        priority,
        suggestedAction: suggestion.action,
        suggestedActionReason: suggestion.reason,
        documentCategory: doc.documentCategory || undefined,
        productName: doc.productName || undefined,
        contractNumber: doc.contractNumber || undefined,
        sourceId: sourceId || `tos-doc-${doc.id}-${Date.now()}`,
        document: doc.id,
        client: typeof doc.client === 'object' ? doc.client?.id : doc.client || undefined,
        contract: typeof doc.contract === 'object' ? doc.contract?.id : doc.contract || undefined,
        household: typeof doc.household === 'object' ? doc.household?.id : doc.household || undefined,
        tenant: typeof doc.tenant === 'object' ? doc.tenant?.id : doc.tenant || 1,
      },
    })
  } catch (err) {
    req.payload.logger.error(`Inbox-Item Erstellung fehlgeschlagen für ${sourceId}: ${err}`)
  }

  return doc
}
