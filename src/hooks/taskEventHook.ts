import type { CollectionAfterChangeHook } from 'payload'

/**
 * Tracked fields: when any of these change on a task,
 * a task-event is created automatically.
 */
interface TrackedField {
  field: string
  eventType: string
  label: string
  format?: (val: any, payload: any) => Promise<string> | string
}

const TRACKED_FIELDS: TrackedField[] = [
  {
    field: 'status',
    eventType: 'status_change',
    label: 'Status',
    format: (val) => (val === 'done' ? 'Erledigt' : 'Offen'),
  },
  {
    field: 'priority',
    eventType: 'priority_change',
    label: 'Priorit\u00e4t',
    format: (val) => (val ? 'Ja' : 'Nein'),
  },
  {
    field: 'dueDate',
    eventType: 'due_date_change',
    label: 'F\u00e4lligkeit',
    format: (val) => {
      if (!val) return '\u2013'
      const d = new Date(val)
      if (isNaN(d.getTime())) return String(val)
      return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`
    },
  },
  {
    field: 'category',
    eventType: 'category_change',
    label: 'Kategorie',
  },
  {
    field: 'notizen',
    eventType: 'note_updated',
    label: 'Notizen',
    format: (val) => (val ? `${String(val).slice(0, 80)}${String(val).length > 80 ? '...' : ''}` : '\u2013'),
  },
]

/**
 * Resolves a relationship field to a display name.
 * Handles both populated objects and raw IDs.
 */
async function resolveRelName(
  val: any,
  collection: string,
  titleField: string,
  payload: any
): Promise<string> {
  if (!val) return '\u2013'
  // Already populated
  if (typeof val === 'object' && val[titleField]) return val[titleField]
  // Raw ID - fetch
  try {
    const doc = await payload.findByID({ collection, id: typeof val === 'object' ? val.id : val })
    return doc?.[titleField] || String(val)
  } catch {
    return String(val)
  }
}

/**
 * afterChange hook for Tasks collection.
 * Creates task-event entries for tracked field changes.
 */
export const createTaskEvent: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
}) => {
  const userId = req.user?.id || null
  const tenantId = doc.tenant?.id || doc.tenant || null

  try {
    if (operation === 'create') {
      // Task created
      await req.payload.create({
        collection: 'task-events',
        data: {
          task: doc.id,
          eventType: 'created',
          text: `Aufgabe erstellt: ${doc.title}`,
          newValue: doc.title,
          user: userId,
          tenant: tenantId,
        },
      })

      // If created with notizen, also log that
      if (doc.notizen) {
        await req.payload.create({
          collection: 'task-events',
          data: {
            task: doc.id,
            eventType: 'note_added',
            text: 'Notiz hinzugef\u00fcgt',
            newValue: String(doc.notizen).slice(0, 200),
            user: userId,
            tenant: tenantId,
          },
        })
      }
    }

    if (operation === 'update' && previousDoc) {
      // Check tracked scalar fields
      for (const tracked of TRACKED_FIELDS) {
        const oldVal = previousDoc[tracked.field]
        const newVal = doc[tracked.field]

        // Skip if unchanged
        if (String(oldVal ?? '') === String(newVal ?? '')) continue

        // Special case: notizen added for the first time
        const isNoteAdded = tracked.field === 'notizen' && !oldVal && newVal

        const oldFormatted = tracked.format ? await tracked.format(oldVal, req.payload) : String(oldVal ?? '\u2013')
        const newFormatted = tracked.format ? await tracked.format(newVal, req.payload) : String(newVal ?? '\u2013')

        await req.payload.create({
          collection: 'task-events',
          data: {
            task: doc.id,
            eventType: isNoteAdded ? 'note_added' : tracked.eventType,
            text: isNoteAdded
              ? 'Notiz hinzugef\u00fcgt'
              : `${tracked.label} ge\u00e4ndert: ${oldFormatted} \u2192 ${newFormatted}`,
            previousValue: String(oldVal ?? ''),
            newValue: String(newVal ?? ''),
            user: userId,
            tenant: tenantId,
          },
        })
      }

      // Check assignedTo (relationship field)
      const oldAssigned = previousDoc.assignedTo?.id || previousDoc.assignedTo
      const newAssigned = doc.assignedTo?.id || doc.assignedTo
      if (String(oldAssigned ?? '') !== String(newAssigned ?? '')) {
        const oldName = await resolveRelName(previousDoc.assignedTo, 'users', 'name', req.payload)
        const newName = await resolveRelName(doc.assignedTo, 'users', 'name', req.payload)
        await req.payload.create({
          collection: 'task-events',
          data: {
            task: doc.id,
            eventType: 'assignment_change',
            text: `Zuweisung ge\u00e4ndert: ${oldName} \u2192 ${newName}`,
            previousValue: oldName,
            newValue: newName,
            user: userId,
            tenant: tenantId,
          },
        })
      }

      // Check group (relationship field)
      const oldGroup = previousDoc.group?.id || previousDoc.group
      const newGroup = doc.group?.id || doc.group
      if (String(oldGroup ?? '') !== String(newGroup ?? '')) {
        const oldName = await resolveRelName(previousDoc.group, 'task-groups', 'title', req.payload)
        const newName = await resolveRelName(doc.group, 'task-groups', 'title', req.payload)
        await req.payload.create({
          collection: 'task-events',
          data: {
            task: doc.id,
            eventType: 'group_change',
            text: `Gruppe ge\u00e4ndert: ${oldName} \u2192 ${newName}`,
            previousValue: oldName,
            newValue: newName,
            user: userId,
            tenant: tenantId,
          },
        })
      }
    }
  } catch (error) {
    // Never block the main operation
    console.error('[TaskEvent Hook] Error:', error)
  }

  return doc
}
