import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const EWS_URL = process.env.EWS_MIDDLEWARE_URL || 'https://exchange.kailohmann.de'
const EWS_KEY = process.env.EWS_API_KEY || ''

export async function POST() {
  const payload = await getPayload({ config })

  try {
    // 1. Alle Exchange-Tasks holen
    const ewsRes = await fetch(`${EWS_URL}/tasks?limit=200`, {
      headers: { 'x-api-key': EWS_KEY },
    })
    const ewsData = await ewsRes.json()
    const exchangeTasks = ewsData.items || []

    // 2. Alle Payload-Tasks mit exchangeItemId holen
    const payloadTasks = await payload.find({
      collection: 'tasks',
      where: { exchangeItemId: { exists: true } },
      limit: 500,
    })

    const payloadMap = new Map(
      payloadTasks.docs.map((t: any) => [t.exchangeItemId, t]),
    )

    let updated = 0
    let created = 0

    for (const ewsTask of exchangeTasks) {
      const existing = payloadMap.get(ewsTask.id)

      if (existing) {
        // Prüfe ob sich was geändert hat (changeKey-Vergleich)
        if (ewsTask.changeKey && ewsTask.changeKey !== existing.exchangeChangeKey) {
          await payload.update({
            collection: 'tasks',
            id: existing.id,
            data: {
              title: ewsTask.subject,
              dueDate: ewsTask.dueDate || null,
              status: ewsTask.status === 'Completed' ? 'done' : 'open',
              priority: ewsTask.importance === 'High',
              exchangeChangeKey: ewsTask.changeKey,
              exchangeSyncedAt: new Date().toISOString(),
            },
          })
          updated++
        }
      } else {
        // Neuer Exchange-Task → in Payload anlegen
        // Nur offene Tasks importieren
        if (ewsTask.status !== 'Completed') {
          await payload.create({
            collection: 'tasks',
            data: {
              title: ewsTask.subject,
              dueDate: ewsTask.dueDate || null,
              status: 'open',
              category: 'aufgabe',
              priority: ewsTask.importance === 'High',
              source: 'exchange_import',
              exchangeItemId: ewsTask.id,
              exchangeChangeKey: ewsTask.changeKey || null,
              exchangeSyncedAt: new Date().toISOString(),
              // tenant muss gesetzt werden – aus dem authentifizierten User ableiten
            },
          })
          created++
        }
      }
    }

    return NextResponse.json({ success: true, updated, created, total: exchangeTasks.length })
  } catch (error) {
    console.error('[Exchange Sync] Error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
