import type { CollectionAfterChangeHook } from 'payload'

const EWS_URL = process.env.EWS_MIDDLEWARE_URL || 'https://exchange.kailohmann.de'
const EWS_KEY = process.env.EWS_API_KEY || ''

// Felder die nach Exchange synchronisiert werden
// Mapping: Payload-Feldname → wird im Hook geprüft
const SYNC_FIELDS = ['title', 'dueDate', 'status', 'priority', 'description'] as const

export const exchangeSyncAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  // Nur synchen wenn sich sync-relevante Felder geändert haben
  if (operation === 'update' && previousDoc) {
    const changed = SYNC_FIELDS.some((f) => doc[f] !== previousDoc[f])
    if (!changed) return doc
  }

  // Mapping Payload → Exchange
  const exchangeData: Record<string, any> = {
    subject: doc.title,
    dueDate: doc.dueDate || undefined,
    status: doc.status === 'done' ? 'Completed' : 'NotStarted',
    importance: doc.priority ? 'High' : 'Normal',
    body: doc.description || undefined,
  }

  try {
    if (doc.exchangeItemId) {
      // Update bestehenden Exchange-Task
      const changeKey = doc.exchangeChangeKey
      const idParam = changeKey ? `${doc.exchangeItemId}|${changeKey}` : doc.exchangeItemId
      const res = await fetch(`${EWS_URL}/tasks/${idParam}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-api-key': EWS_KEY },
        body: JSON.stringify(exchangeData),
      })
      if (res.ok) {
        const result = await res.json()
        // changeKey aktualisieren falls zurückgegeben
        if (result.changeKey) {
          await req.payload.update({
            collection: 'tasks',
            id: doc.id,
            data: {
              exchangeChangeKey: result.changeKey,
              exchangeSyncedAt: new Date().toISOString(),
            },
          })
        }
      }
    } else if (operation === 'create') {
      // Neuen Exchange-Task erstellen
      // Tasks mit source 'manual' oder 'appointment' synchen, 'workflow' nicht
      if (['manual', 'appointment'].includes(doc.source)) {
        const res = await fetch(`${EWS_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': EWS_KEY },
          body: JSON.stringify(exchangeData),
        })
        if (res.ok) {
          const result = await res.json()
          if (result.id) {
            await req.payload.update({
              collection: 'tasks',
              id: doc.id,
              data: {
                exchangeItemId: result.id,
                exchangeSyncedAt: new Date().toISOString(),
              },
            })
          }
        }
      }
    }
  } catch (error) {
    // Sync-Fehler loggen aber nicht die Operation blockieren
    console.error('[Exchange Sync] Error:', error)
  }

  return doc
}
