'use client'

import { useEffect, useState, useCallback } from 'react'

// Typen
interface InboxItem {
  id: number
  title: string
  status: 'new' | 'seen' | 'task_created' | 'accepted' | 'ignored'
  priority: 'urgent' | 'high' | 'normal' | 'low'
  category: string
  source: string
  suggestedAction: string | null
  documentCategory: string | null
  productName: string | null
  contractNumber: string | null
  nextcloudPath: string | null
  tosDocumentId: string | null
  notes: string | null
  createdAt: string
  processedAt: string | null
  client: { id: number; firstName: string; lastName: string } | null
  document: { id: number; title: string } | null
  task: { id: number; title: string } | null
}

interface CrawlerStatus {
  session: { isValid: boolean; sessionExpires: string | null }
  autoCrawl: { running: boolean; lastCrawlAt: string | null; nextCrawlIn: number | null; isCrawling: boolean }
  stats: { documents: number; pendingInbox: number }
}

// Inline-Styles (Payload Admin nutzt CSS Variablen)
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--theme-text)',
    margin: 0,
  } as React.CSSProperties,
  subtitle: {
    fontSize: '14px',
    color: 'var(--theme-elevation-500)',
    margin: '4px 0 0 0',
  } as React.CSSProperties,
  statusBar: {
    display: 'flex',
    gap: '16px',
    marginBottom: '20px',
    padding: '12px 16px',
    background: 'var(--theme-elevation-50)',
    borderRadius: '8px',
    border: '1px solid var(--theme-elevation-100)',
    fontSize: '13px',
    alignItems: 'center',
  } as React.CSSProperties,
  statusDot: (active: boolean) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: active ? '#22c55e' : '#ef4444',
    display: 'inline-block',
  } as React.CSSProperties),
  filterBar: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,
  filterBtn: (active: boolean) => ({
    padding: '6px 14px',
    fontSize: '13px',
    border: '1px solid ' + (active ? 'var(--theme-success-500)' : 'var(--theme-elevation-200)'),
    borderRadius: '20px',
    cursor: 'pointer',
    background: active ? 'var(--theme-success-100)' : 'transparent',
    color: active ? 'var(--theme-success-700)' : 'var(--theme-elevation-600)',
    fontWeight: active ? 600 : 400,
    transition: 'all 0.15s',
  } as React.CSSProperties),
  card: {
    border: '1px solid var(--theme-elevation-150)',
    borderRadius: '8px',
    padding: '16px 20px',
    marginBottom: '8px',
    background: 'var(--theme-bg)',
    transition: 'border-color 0.15s',
    cursor: 'default',
  } as React.CSSProperties,
  cardNew: {
    borderLeft: '3px solid var(--theme-success-500)',
  } as React.CSSProperties,
  cardUrgent: {
    borderLeft: '3px solid var(--theme-error-500)',
  } as React.CSSProperties,
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  } as React.CSSProperties,
  cardTitle: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--theme-text)',
    margin: '0 0 4px 0',
  } as React.CSSProperties,
  cardMeta: {
    fontSize: '12px',
    color: 'var(--theme-elevation-500)',
    margin: '0 0 8px 0',
  } as React.CSSProperties,
  badge: (color: string) => ({
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '4px',
    backgroundColor: color === 'red' ? '#fef2f2' : color === 'green' ? '#f0fdf4' : color === 'blue' ? '#eff6ff' : '#f5f5f5',
    color: color === 'red' ? '#dc2626' : color === 'green' ? '#16a34a' : color === 'blue' ? '#2563eb' : '#737373',
    marginRight: '6px',
  } as React.CSSProperties),
  actionRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
  } as React.CSSProperties,
  actionBtn: (variant: 'primary' | 'secondary' | 'danger') => ({
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: 500,
    border: '1px solid ' + (variant === 'primary' ? 'var(--theme-success-500)' : variant === 'danger' ? 'var(--theme-error-300)' : 'var(--theme-elevation-200)'),
    borderRadius: '4px',
    cursor: 'pointer',
    background: variant === 'primary' ? 'var(--theme-success-500)' : 'transparent',
    color: variant === 'primary' ? '#fff' : variant === 'danger' ? 'var(--theme-error-500)' : 'var(--theme-elevation-600)',
    transition: 'all 0.15s',
  } as React.CSSProperties),
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: 'var(--theme-elevation-400)',
    fontSize: '15px',
  } as React.CSSProperties,
  count: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '20px',
    height: '20px',
    padding: '0 6px',
    fontSize: '12px',
    fontWeight: 700,
    borderRadius: '10px',
    backgroundColor: 'var(--theme-error-500)',
    color: '#fff',
    marginLeft: '8px',
  } as React.CSSProperties,
  suggestion: {
    margin: '8px 0 0 0',
    padding: '8px 12px',
    background: 'var(--theme-elevation-50)',
    borderRadius: '6px',
    fontSize: '13px',
    color: 'var(--theme-elevation-600)',
    borderLeft: '2px solid var(--theme-success-400)',
  } as React.CSSProperties,
}

// Kategorie → lesbare Labels
const categoryLabels: Record<string, string> = {
  policy: 'Police',
  application: 'Antrag',
  dlz: 'DLZ-Bearbeitung',
  claim: 'Schaden',
  settlement: 'Regulierung VU',
  cancellation: 'Kündigung',
  info_vu: 'Info VU',
  amendment: 'Nachtrag',
  other: 'Sonstiges',
}

const priorityLabels: Record<string, { label: string; color: string }> = {
  urgent: { label: 'Dringend', color: 'red' },
  high: { label: 'Hoch', color: 'red' },
  normal: { label: 'Normal', color: 'blue' },
  low: { label: 'Niedrig', color: 'gray' },
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

export default function Posteingang() {
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('new')
  const [crawlerStatus, setCrawlerStatus] = useState<CrawlerStatus | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        limit: '50',
        sort: '-createdAt',
        depth: '1',
      })
      if (filter && filter !== 'all') {
        params.set('where[status][equals]', filter)
      }
      const res = await fetch(`/api/inbox-items?${params}`, { credentials: 'include' })
      const data = await res.json()
      setItems(data.docs || [])
    } catch (err) {
      console.error('Inbox fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  const fetchCrawlerStatus = useCallback(async () => {
    try {
      const res = await fetch('https://tos-crawler.kailohmann.de/status', {
        headers: { 'x-api-key': 'toscrawler-2026-kl-secure-key' },
      })
      const data = await res.json()
      setCrawlerStatus(data)
    } catch {
      // Crawler nicht erreichbar
    }
  }, [])

  useEffect(() => {
    fetchItems()
    fetchCrawlerStatus()
    const interval = setInterval(() => {
      fetchItems()
      fetchCrawlerStatus()
    }, 60000)
    return () => clearInterval(interval)
  }, [fetchItems, fetchCrawlerStatus])

  const updateItem = async (id: number, data: Partial<InboxItem>) => {
    try {
      await fetch(`/api/inbox-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...data, processedAt: new Date().toISOString() }),
      })
      fetchItems()
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  const createTaskFromItem = async (item: InboxItem) => {
    try {
      // Aufgabe erstellen
      const taskRes = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: item.title,
          description: item.suggestedAction || `Dokument prüfen: ${item.documentCategory || item.category}`,
          status: 'open',
          category: item.category === 'dlz' ? 'wiedervorlage' : item.category === 'claim' ? 'schaden' : 'aufgabe',
          priority: item.priority === 'urgent' || item.priority === 'high',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          client: item.client?.id || undefined,
          documents: item.document?.id ? [item.document.id] : [],
          source: 'workflow',
          tenant: 1,
        }),
      })
      const task = await taskRes.json()

      // Inbox-Item aktualisieren
      await updateItem(item.id, {
        status: 'task_created',
        task: task.doc?.id || task.id,
      } as any)
    } catch (err) {
      console.error('Task creation error:', err)
    }
  }

  const newCount = items.filter(i => i.status === 'new').length

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Posteingang
            {newCount > 0 && <span style={styles.count}>{newCount}</span>}
          </h1>
          <p style={styles.subtitle}>Neue Eingänge analysieren und bearbeiten</p>
        </div>
      </div>

      {/* Crawler Status Bar */}
      {crawlerStatus && (
        <div style={styles.statusBar}>
          <span style={styles.statusDot(crawlerStatus.session.isValid)} />
          <span>
            TOS-Session: {crawlerStatus.session.isValid ? 'Aktiv' : 'Inaktiv'}
          </span>
          {crawlerStatus.autoCrawl.running && (
            <>
              <span style={{ color: 'var(--theme-elevation-300)' }}>|</span>
              <span>
                Auto-Crawl: {crawlerStatus.autoCrawl.isCrawling
                  ? '⏳ Läuft gerade...'
                  : crawlerStatus.autoCrawl.lastCrawlAt
                    ? `Letzter Crawl ${timeAgo(crawlerStatus.autoCrawl.lastCrawlAt)}`
                    : 'Wartet auf ersten Crawl'}
              </span>
            </>
          )}
          <span style={{ color: 'var(--theme-elevation-300)' }}>|</span>
          <span>{crawlerStatus.stats.documents} Dokumente heute</span>
        </div>
      )}

      {/* Filter */}
      <div style={styles.filterBar}>
        {[
          { value: 'new', label: 'Neu' },
          { value: 'seen', label: 'Gesehen' },
          { value: 'task_created', label: 'Mit Aufgabe' },
          { value: 'accepted', label: 'Akzeptiert' },
          { value: 'ignored', label: 'Ignoriert' },
          { value: 'all', label: 'Alle' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => { setFilter(f.value); setLoading(true) }}
            style={styles.filterBtn(filter === f.value)}
            type="button"
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading ? (
        <div style={styles.emptyState}>Lade Eingänge...</div>
      ) : items.length === 0 ? (
        <div style={styles.emptyState}>
          {filter === 'new'
            ? '🎉 Keine neuen Eingänge – alles bearbeitet!'
            : 'Keine Einträge für diesen Filter.'}
        </div>
      ) : (
        items.map(item => (
          <div
            key={item.id}
            style={{
              ...styles.card,
              ...(item.status === 'new' ? styles.cardNew : {}),
              ...(item.priority === 'urgent' ? styles.cardUrgent : {}),
            }}
          >
            <div style={styles.cardRow}>
              <div style={{ flex: 1 }}>
                <p style={styles.cardTitle}>{item.title}</p>
                <p style={styles.cardMeta}>
                  {item.client
                    ? `${item.client.firstName} ${item.client.lastName}`
                    : 'Kein Mandant'}
                  {' · '}
                  {timeAgo(item.createdAt)}
                  {item.contractNumber && ` · VS-Nr: ${item.contractNumber}`}
                </p>
                <div>
                  {item.category && (
                    <span style={styles.badge('blue')}>
                      {categoryLabels[item.category] || item.category}
                    </span>
                  )}
                  {item.priority && item.priority !== 'normal' && (
                    <span style={styles.badge(priorityLabels[item.priority]?.color || 'gray')}>
                      {priorityLabels[item.priority]?.label || item.priority}
                    </span>
                  )}
                  {item.productName && (
                    <span style={styles.badge('gray')}>{item.productName}</span>
                  )}
                </div>
                {item.suggestedAction && (
                  <div style={styles.suggestion}>
                    💡 {item.suggestedAction}
                  </div>
                )}
              </div>
            </div>

            {/* Aktionen – nur für offene Items */}
            {(item.status === 'new' || item.status === 'seen') && (
              <div style={styles.actionRow}>
                <button
                  onClick={() => createTaskFromItem(item)}
                  style={styles.actionBtn('primary')}
                  type="button"
                >
                  ✓ Aufgabe erstellen
                </button>
                <button
                  onClick={() => updateItem(item.id, { status: 'accepted' })}
                  style={styles.actionBtn('secondary')}
                  type="button"
                >
                  Akzeptieren
                </button>
                <button
                  onClick={() => updateItem(item.id, { status: 'ignored' })}
                  style={styles.actionBtn('danger')}
                  type="button"
                >
                  × Ignorieren
                </button>
                {item.nextcloudPath && (
                  <button
                    onClick={() => window.open(`https://cloud.kailohmann.de/apps/files/?dir=${encodeURIComponent(item.nextcloudPath!.substring(0, item.nextcloudPath!.lastIndexOf('/')))}`, '_blank')}
                    style={styles.actionBtn('secondary')}
                    type="button"
                  >
                    📄 In Nextcloud öffnen
                  </button>
                )}
              </div>
            )}

            {/* Status-Anzeige für bearbeitete Items */}
            {item.status === 'task_created' && item.task && (
              <div style={{ ...styles.actionRow, fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
                ✓ Aufgabe erstellt: <a href={`/admin/collections/tasks/${item.task.id}`} style={{ marginLeft: '4px', color: 'var(--theme-success-500)' }}>{item.task.title}</a>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
