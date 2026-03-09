import type { CollectionConfig } from 'payload'
import { apiAccess } from '../access'

export const TaskEvents: CollectionConfig = {
  slug: 'task-events',
  access: apiAccess,
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['task', 'eventType', 'text', 'createdAt'],
    group: 'Aufgaben',
  },
  fields: [
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
      required: true,
      index: true,
      label: 'Aufgabe',
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      label: 'Ereignistyp',
      options: [
        { label: 'Erstellt', value: 'created' },
        { label: 'Status ge\u00e4ndert', value: 'status_change' },
        { label: 'Notiz hinzugef\u00fcgt', value: 'note_added' },
        { label: 'Notiz ge\u00e4ndert', value: 'note_updated' },
        { label: 'Datei angeh\u00e4ngt', value: 'file_attached' },
        { label: 'Zuweisung ge\u00e4ndert', value: 'assignment_change' },
        { label: 'Priorit\u00e4t ge\u00e4ndert', value: 'priority_change' },
        { label: 'F\u00e4lligkeit ge\u00e4ndert', value: 'due_date_change' },
        { label: 'Kategorie ge\u00e4ndert', value: 'category_change' },
        { label: 'Erinnerung', value: 'reminder' },
        { label: 'Gruppe ge\u00e4ndert', value: 'group_change' },
        { label: 'Kommentar', value: 'comment' },
      ],
    },
    {
      name: 'text',
      type: 'text',
      required: true,
      label: 'Beschreibung',
      admin: {
        description: 'Menschenlesbarer Summary des Ereignisses',
      },
    },
    {
      name: 'previousValue',
      type: 'text',
      label: 'Vorheriger Wert',
    },
    {
      name: 'newValue',
      type: 'text',
      label: 'Neuer Wert',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'Benutzer',
      admin: {
        description: 'Wer hat die \u00c4nderung vorgenommen',
      },
    },
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
