'use client'

import { useEffect, useState, useCallback } from 'react'

interface InboxItem {
  id: number
  title: string
  status: 'new' | 'seen' | 'task_created' | 'filed' | 'ignored'
  priority: 'urgent' | 'high' | 'normal' | 'low'
  channel: string
  suggestedAction: string | null
  suggestedActionReason: string | null
  documentCategory: string | null
  productName: string | null
  contractNumber: string | null
  sourceId: string | null
  createdAt: string
  processedAt: string | null
  client: { id: number; firstName: string; lastName: string } | null
  document: { id: number; title: string; nextcloudPath?: string } | null
  task: { id: number; title: string } | null
}

interface CrawlerStatus {
  session: { isValid: boolean; sessionExpires: string | null }
  autoCrawl: { running: boolean; lastCrawlAt: string | null; nextCrawlIn: number | null; isCrawling: boolean }
  stats: { documents: number; openInboxItems: number }
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  urgent: { label: 'Dringend', color: 'red' },
  high: { label: 'Hoch', color: 'red' },
  normal: { label: 'Normal', color: 'blue' },
  low: { label: 'Niedrig', color: 'gray' },
}

const actionLabels: Record<string, string> = {
  file: 'Ablegen',
  create_task: 'Aufgabe erstellen',
  notify_client: 'Kunden informieren',
  review: 'Prüfen',
  forward: 'Weiterleiten',
  process_claim: 'Schadensmeldung bearbeiten',
  ignore: 'Ignorieren',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'gerade eben'
  if (mins < 60) return `vor ${mins} Min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `vor ${hrs} Std`
  const days = Math.floor(hrs / 24)
  return `vor ${days} Tag${days > 1 ? 'en' : ''}`
}

const s = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px' } as React.CSSProperties,
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' } as React.CSSProperties,
  title: { fontSize: '24px', fontWeight: 700, color: 'var(--theme-text)', margin: 0 } as React.CSSProperties,
  subtitle: { fontSize: '14px', color: 'var(--theme-elevation-500)', margin: '4px 0 0 0' } as React.CSSProperties,
  statusBar: { display: 'flex', gap: '16px', marginBottom: '20px', padding: '12px 16px', background: 'var(--theme-elevation-50)', borderRadius: '8px', border: '1px solid var(--theme-elevation-100)', fontSize: '13px', alignItems: 'center' } as React.CSSProperties,
  dot: (on: boolean) => ({ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: on ? '#22c55e' : '#ef4444', display: 'inline-block' } as React.CSSProperties),
  sep: { color: 'var(--theme-elevation-300)' } as React.CSSProperties,
  filterBar: { display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' as const } as React.CSSProperties,
  filterBtn: (on: boolean) => ({ padding: '6px 14px', fontSize: '13px', border: `1px solid ${on ? 'var(--theme-success-500)' : 'var(--theme-elevation-200)'}`, borderRadius: '20px', cursor: 'pointer', background: on ? 'var(--theme-success-100)' : 'transparent', color: on ? 'var(--theme-success-700)' : 'var(--theme-elevation-600)', fontWeight: on ? 600 : 400 } as React.CSSProperties),
  card: { border: '1px solid var(--theme-elevation-150)', borderRadius: '8px', padding: '16px 20px', marginBottom: '8px', background: 'var(--theme-bg)' } as React.CSSProperties,
  cardNew: { borderLeft: '3px solid var(--theme-success-500)' },
  cardUrgent: { borderLeft: '3px solid var(--theme-error-500)' },
  cardTitle: { fontSize: '15px', fontWeight: 600, color: 'var(--theme-text)', margin: '0 0 4px 0' } as React.CSSProperties,
  cardMeta: { fontSize: '12px', color: 'var(--theme-elevation-500)', margin: '0 0 8px 0' } as React.CSSProperties,
  badge: (c: string) => ({ display: 'inline-block', padding: '2px 8px', fontSize: '11px', fontWeight: 600, borderRadius: '4px', backgroundColor: c === 'red' ? '#fef2f2' : c === 'green' ? '#f0fdf4' : c === 'blue' ? '#eff6ff' : '#f5f5f5', color: c === 'red' ? '#dc2626' : c === 'green' ? '#16a34a' : c === 'blue' ? '#2563eb' : '#737373', marginRight: '6px' } as React.CSSProperties),
  actionRow: { display: 'flex', gap: '8px', marginTop: '10px' } as React.CSSProperties,
  btn: (v: 'primary' | 'secondary' | 'danger') => ({ padding: '5px 12px', fontSize: '12px', fontWeight: 500, border: `1px solid ${v === 'primary' ? 'var(--theme-success-500)' : v === 'danger' ? 'var(--theme-error-300)' : 'var(--theme-elevation-200)'}`, borderRadius: '4px', cursor: 'pointer', background: v === 'primary' ? 'var(--theme-success-500)' : 'transparent', color: v === 'primary' ? '#fff' : v === 'danger' ? 'var(--theme-error-500)' : 'var(--theme-elevation-600)' } as React.CSSProperties),
  suggestion: { margin: '8px 0 0 0', padding: '8px 12px', background: 'var(--theme-elevation-50)', borderRadius: '6px', fontSize: '13px', color: 'var(--theme-elevation-600)', borderLeft: '2px solid var(--theme-success-400)' } as React.CSSProperties,
  empty: { textAlign: 'center' as const, padding: '60px 20px', color: 'var(--theme-elevation-400)', fontSize: '15px' } as React.CSSProperties,
  count: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '20px', height: '20px', padding: '0 6px', fontSize: '12px', fontWeight: 700, borderRadius: '10px', backgroundColor: 'var(--theme-error-500)', color: '#fff', marginLeft: '8px' } as React.CSSProperties,
}

export default function Posteingang() {
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('new')
  const [crawler, setCrawler] = useState<CrawlerStatus | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: '50', sort: '-createdAt', depth: '1' })
      if (filter && filter !== 'all') params.set('where[status][equals]', filter)
      const res = await fetch(`/api/inbox-items?${params}`, { credentials: 'include' })
      const data = await res.json()
      setItems(data.docs || [])
    } catch (err) {
      console.error('Inbox fetch:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  const fetchCrawler = useCallback(async () => {
    try {
      const res = await fetch('https://tos-crawler.kailohmann.de/status', {
        headers: { 'x-api-key': 'toscrawler-2026-kl-secure-key' },
      })
      setCrawler(await res.json())
    } catch {}
  }, [])

  useEffect(() => {
    fetchItems()
    fetchCrawler()
    const iv = setInterval(() => { fetchItems(); fetchCrawler() }, 60000)
    return () => clearInterval(iv)
  }, [fetchItems, fetchCrawler])

  const patchItem = async (id: number, data: Record<string, unknown>) => {
    try {
      await fetch(`/api/inbox-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...data, processedAt: new Date().toISOString() }),
      })
      fetchItems()
    } catch (err) {
      console.error('Patch error:', err)
    }
  }

  const createTask = async (item: InboxItem) => {
    try {
      const taskRes = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: item.title,
          description: item.suggestedActionReason || `Dokument prüfen: ${item.documentCategory || 'Sonstiges'}`,
          status: 'open',
          category: item.documentCategory === 'DLZ Bearbeitungen' ? 'wiedervorlage' : 'aufgabe',
          priority: item.priority === 'urgent' || item.priority === 'high',
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          client: item.client?.id || undefined,
          documents: item.document?.id ? [item.document.id] : [],
          source: 'workflow',
          tenant: 1,
        }),
      })
      const task = await taskRes.json()
      await patchItem(item.id, { status: 'task_created', task: task.doc?.id || task.id })
    } catch (err) {
      console.error('Task create:', err)
    }
  }

  const newCount = items.filter(i => i.status === 'new').length

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>
            Posteingang
            {newCount > 0 && <span style={s.count}>{newCount}</span>}
          </h1>
          <p style={s.subtitle}>Neue Eingänge analysieren und bearbeiten</p>
        </div>
      </div>

      {crawler && (
        <div style={s.statusBar}>
          <span style={s.dot(crawler.session.isValid)} />
          <span>TOS: {crawler.session.isValid ? 'Aktiv' : 'Inaktiv'}</span>
          {crawler.autoCrawl.running && (
            <>
              <span style={s.sep}>|</span>
              <span>
                Auto-Crawl: {crawler.autoCrawl.isCrawling
                  ? 'Läuft...'
                  : crawler.autoCrawl.lastCrawlAt
                    ? `Letzter ${timeAgo(crawler.autoCrawl.lastCrawlAt)}`
                    : 'Wartet'}
              </span>
            </>
          )}
          <span style={s.sep}>|</span>
          <span>{crawler.stats.documents} Dokumente heute</span>
        </div>
      )}

      <div style={s.filterBar}>
        {[
          { value: 'new', label: 'Neu' },
          { value: 'seen', label: 'Gesehen' },
          { value: 'task_created', label: 'Mit Aufgabe' },
          { value: 'filed', label: 'Abgelegt' },
          { value: 'ignored', label: 'Ignoriert' },
          { value: 'all', label: 'Alle' },
        ].map(f => (
          <button key={f.value} onClick={() => { setFilter(f.value); setLoading(true) }} style={s.filterBtn(filter === f.value)} type="button">{f.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={s.empty}>Lade Eingänge...</div>
      ) : items.length === 0 ? (
        <div style={s.empty}>
          {filter === 'new' ? 'Keine neuen Eingänge – alles bearbeitet!' : 'Keine Einträge für diesen Filter.'}
        </div>
      ) : (
        items.map(item => {
          const pri = priorityConfig[item.priority]
          const ncPath = item.document && typeof item.document === 'object' ? (item.document as any).nextcloudPath : null

          return (
            <div key={item.id} style={{ ...s.card, ...(item.status === 'new' ? s.cardNew : {}), ...(item.priority === 'urgent' ? s.cardUrgent : {}) }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <p style={s.cardTitle}>{item.title}</p>
                  <p style={s.cardMeta}>
                    {item.client ? `${item.client.firstName} ${item.client.lastName}` : 'Kein Mandant'}
                    {' · '}{timeAgo(item.createdAt)}
                    {item.contractNumber && ` · VS-Nr: ${item.contractNumber}`}
                  </p>
                  <div>
                    {item.documentCategory && <span style={s.badge('blue')}>{item.documentCategory}</span>}
                    {item.priority && item.priority !== 'normal' && <span style={s.badge(pri?.color || 'gray')}>{pri?.label}</span>}
                    {item.productName && <span style={s.badge('gray')}>{item.productName}</span>}
                    {item.suggestedAction && <span style={s.badge('green')}>{actionLabels[item.suggestedAction] || item.suggestedAction}</span>}
                  </div>
                  {item.suggestedActionReason && (
                    <div style={s.suggestion}>💡 {item.suggestedActionReason}</div>
                  )}
                </div>
              </div>

              {(item.status === 'new' || item.status === 'seen') && (
                <div style={s.actionRow}>
                  <button onClick={() => createTask(item)} style={s.btn('primary')} type="button">✓ Aufgabe erstellen</button>
                  <button onClick={() => patchItem(item.id, { status: 'filed' })} style={s.btn('secondary')} type="button">Ablegen</button>
                  <button onClick={() => patchItem(item.id, { status: 'ignored' })} style={s.btn('danger')} type="button">× Ignorieren</button>
                  {ncPath && (
                    <button onClick={() => window.open(`https://cloud.kailohmann.de/apps/files/?dir=${encodeURIComponent(ncPath.substring(0, ncPath.lastIndexOf('/')))}`, '_blank')} style={s.btn('secondary')} type="button">📄 Nextcloud</button>
                  )}
                </div>
              )}

              {item.status === 'task_created' && item.task && (
                <div style={{ ...s.actionRow, fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
                  ✓ Aufgabe: <a href={`/admin/collections/tasks/${item.task.id}`} style={{ marginLeft: '4px', color: 'var(--theme-success-500)' }}>{item.task.title}</a>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
