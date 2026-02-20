import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// POST /api/task-groups/dissolve/:id → Gruppe auflösen
// 1. Alle Tasks mit group = id → group: null setzen
// 2. TaskGroup löschen
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const payload = await getPayload({ config })

  try {
    // 1. Alle Tasks finden, die zu dieser Gruppe gehören
    const tasksInGroup = await payload.find({
      collection: 'tasks',
      where: { group: { equals: id } },
      limit: 500,
    })

    // 2. Bei allen Tasks die Gruppen-Zuordnung entfernen
    let unlinked = 0
    for (const task of tasksInGroup.docs) {
      await payload.update({
        collection: 'tasks',
        id: task.id,
        data: {
          group: null,
          groupOrder: 0,
        },
      })
      unlinked++
    }

    // 3. TaskGroup löschen
    await payload.delete({
      collection: 'task-groups',
      id,
    })

    return NextResponse.json({
      success: true,
      message: `Gruppe aufgelöst. ${unlinked} Aufgaben wurden entkoppelt.`,
      unlinkedTasks: unlinked,
    })
  } catch (error) {
    console.error('[Task Group Dissolve] Error:', error)
    return NextResponse.json({ error: 'Gruppe konnte nicht aufgelöst werden' }, { status: 500 })
  }
}
