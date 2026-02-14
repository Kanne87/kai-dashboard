import type { Endpoint, PayloadRequest } from 'payload'

// ============================================================
// Types
// ============================================================

interface ParsedPerson {
  persNr: string
  faNr: string
  faPromo: string | null
  anrede: string | null
  nachname: string
  vorname: string
  stand: 'M' | 'P' | 'K' | null
  bavCheck: boolean
}

interface ParsedHousehold {
  faNr: string
  faPromo: string | null
  displayName: string
  persons: ParsedPerson[]
}

interface MatchResult {
  newHouseholds: ParsedHousehold[]
  matched: { parsed: ParsedHousehold; existing: any }[]
  changed: {
    parsed: ParsedHousehold
    existing: any
    changes: { field: string; oldValue: any; newValue: any }[]
  }[]
  onlyInSystem: any[]
  stats: {
    totalPersonsParsed: number
    totalHouseholdsParsed: number
    new: number
    matched: number
    changed: number
    onlyInSystem: number
  }
}

// ============================================================
// PDF Text → Structured Data
// ============================================================

function parseMandantenliste(text: string): ParsedHousehold[] {
  const lines = text.split('\n')

  // Detect betreuer nr: most frequent 7-digit number at line start
  const freq: Record<string, number> = {}
  for (const line of lines) {
    const m = line.trim().match(/^(\d{7})\s/)
    if (m) freq[m[1]] = (freq[m[1]] || 0) + 1
  }
  const betreuerNr = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0]
  if (!betreuerNr) return []

  // Filter headers, footers, noise
  const skip = ['Pers.-Nr.', 'Betreuer', 'Suchergebnis']
  const cleaned = lines.filter(
    (l) =>
      l.trim() &&
      !skip.some((s) => l.trim().startsWith(s)) &&
      !l.includes('Person(en)')
  )

  // Build blocks: each person starts with a 6-7 digit number
  // Special case: betreuer's own person record (persNr === betreuerNr)
  // is detected by checking if betreuerNr is followed by FA-Nr + Anrede
  const blocks: string[][] = []
  let current: string[] = []

  for (const line of cleaned) {
    const stripped = line.trim()
    const m = stripped.match(/^(\d{6,7})\s/)

    let isNewPerson = false
    if (m && m[1].length >= 6) {
      if (m[1] !== betreuerNr) {
        isNewPerson = true
      } else {
        // Betreuer-Nr at start → check if this is betreuer-as-person
        // Person line: "1313412 1122501 Herr Lohmann ..."
        // Betreuer line: "1313412 2025/06 29221 Celle ..."
        const afterNr = stripped.slice(m[0].length).trim()
        const hasAnrede = /^\d{7}\s+(Herr|Frau|Firma|Kanzlei)\s/.test(afterNr)
        if (hasAnrede) {
          isNewPerson = true
        }
      }
    }

    if (isNewPerson) {
      if (current.length > 0) blocks.push(current)
      current = [stripped]
    } else {
      if (current.length > 0) current.push(stripped)
    }
  }
  if (current.length > 0) blocks.push(current)

  // Parse each block into a person
  const persons: ParsedPerson[] = []
  for (const block of blocks) {
    const person = parsePersonBlock(block, betreuerNr)
    if (person) persons.push(person)
  }

  // Group persons by FA-Nr into households
  const householdMap: Record<string, ParsedPerson[]> = {}
  for (const p of persons) {
    if (!p.faNr) continue
    if (!householdMap[p.faNr]) householdMap[p.faNr] = []
    householdMap[p.faNr].push(p)
  }

  const households: ParsedHousehold[] = []
  for (const [faNr, members] of Object.entries(householdMap).sort()) {
    const primary = members.find((m) => m.stand === 'M') || members[0]
    const faPromo = members.find((m) => m.faPromo)?.faPromo || null
    households.push({
      faNr,
      faPromo,
      displayName: primary.nachname,
      persons: members,
    })
  }

  return households
}

function parsePersonBlock(lines: string[], betreuerNr: string): ParsedPerson | null {
  if (!lines.length) return null

  let bavCheck = false
  let mainLine: string | null = null
  let betreuerLine: string | null = null

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    if (l.includes('bAV-Check')) {
      bavCheck = true
      continue
    }
    if (l.includes('Aktionen') && l.includes('Reports')) continue
    if (i === 0) {
      mainLine = l
    } else if (l.trim().startsWith(betreuerNr) && !betreuerLine) {
      betreuerLine = l
    }
  }

  if (!mainLine) return null

  let first = mainLine.trim()

  // Stand (M/P/K) at end of line
  let stand: 'M' | 'P' | 'K' | null = null
  const standMatch = first.match(/\s([MPK])\s*$/)
  if (standMatch) {
    stand = standMatch[1] as 'M' | 'P' | 'K'
    first = first.slice(0, standMatch.index).trim()
  }

  // Pers.-Nr. (6 or 7 digits)
  const persMatch = first.match(/^(\d{6,7})\s*/)
  if (!persMatch) return null
  const persNr = persMatch[1]
  let rest = first.slice(persMatch[0].length).trim()

  // FA-Nr. (7 digits)
  let faNr = ''
  const faMatch = rest.match(/^(\d{7})\s*/)
  if (faMatch) {
    faNr = faMatch[1]
    rest = rest.slice(faMatch[0].length).trim()
  }

  // Anrede
  let anrede: string | null = null
  for (const a of ['Herr', 'Frau', 'Firma', 'Kanzlei']) {
    if (rest.startsWith(a)) {
      anrede = a
      rest = rest.slice(a.length).trim()
      break
    }
  }

  // Name: everything before birth date (dd.mm.yyyy)
  const gebMatch = rest.match(/(\d{2}\.\d{2}\.\d{4})/)
  let nameRaw: string

  if (gebMatch) {
    nameRaw = rest.slice(0, gebMatch.index).trim()
  } else {
    // Fallback: remove Einkommensart keywords from end
    const einkommensarten = [
      'Unbekannt', 'Angestellter', 'Beamter', 'Selbstständig',
      'Rentner/', 'Öffentl.', 'Student', 'Azubi/', 'Kind',
      'Schüler', 'Arbeitssuchend', 'Hausfrau/', 'Nicht',
    ]
    nameRaw = rest
    for (const ea of einkommensarten) {
      const idx = rest.lastIndexOf(ea)
      if (idx > 0) {
        nameRaw = rest.slice(0, idx).trim()
        break
      }
    }
  }

  // Split: first word = Nachname, rest = Vorname
  const nameParts = nameRaw.split(/\s+/)
  let nachname: string
  let vorname: string

  if (anrede === 'Firma' || anrede === 'Kanzlei') {
    nachname = nameRaw
    vorname = ''
  } else if (nameParts.length >= 2) {
    nachname = nameParts[0]
    vorname = nameParts.slice(1).join(' ')
  } else {
    nachname = nameRaw
    vorname = ''
  }

  // FA Promo from betreuer line (YYYY/MM at start after betreuer nr)
  let faPromo: string | null = null
  if (betreuerLine) {
    const bl = betreuerLine.trim().replace(/^\d{7}\s*/, '').trim()
    const promoMatch = bl.match(/^(\d{4}\/\d{2})/)
    if (promoMatch) faPromo = promoMatch[1]
  }

  return { persNr, faNr, faPromo, anrede, nachname, vorname, stand, bavCheck }
}

// ============================================================
// Match parsed data against existing DB records
// ============================================================

async function matchWithExisting(
  payload: PayloadRequest['payload'],
  parsedHouseholds: ParsedHousehold[]
): Promise<MatchResult> {
  const existingHouseholds = await payload.find({
    collection: 'households',
    limit: 1000,
    depth: 0,
  })

  const existingMap = new Map<string, any>()
  for (const h of existingHouseholds.docs) {
    if (h.tosFaNumber) existingMap.set(h.tosFaNumber, h)
  }

  const newHouseholds: ParsedHousehold[] = []
  const matched: MatchResult['matched'] = []
  const changed: MatchResult['changed'] = []
  const matchedFaNrs = new Set<string>()

  for (const parsed of parsedHouseholds) {
    const existing = existingMap.get(parsed.faNr)

    if (!existing) {
      newHouseholds.push(parsed)
      continue
    }

    matchedFaNrs.add(parsed.faNr)

    const changes: { field: string; oldValue: any; newValue: any }[] = []

    if (existing.displayName !== parsed.displayName) {
      changes.push({
        field: 'displayName',
        oldValue: existing.displayName,
        newValue: parsed.displayName,
      })
    }

    if (parsed.faPromo && existing.tosFaPromo !== parsed.faPromo) {
      changes.push({
        field: 'tosFaPromo',
        oldValue: existing.tosFaPromo,
        newValue: parsed.faPromo,
      })
    }

    const existingPersonCount = await payload.count({
      collection: 'clients',
      where: { household: { equals: existing.id } },
    })
    if (existingPersonCount.totalDocs !== parsed.persons.length) {
      changes.push({
        field: 'personCount',
        oldValue: existingPersonCount.totalDocs,
        newValue: parsed.persons.length,
      })
    }

    if (changes.length > 0) {
      changed.push({ parsed, existing, changes })
    } else {
      matched.push({ parsed, existing })
    }
  }

  const onlyInSystem = existingHouseholds.docs.filter(
    (h: any) => h.tosFaNumber && !matchedFaNrs.has(h.tosFaNumber)
  )

  const totalPersons = parsedHouseholds.reduce((sum, h) => sum + h.persons.length, 0)

  return {
    newHouseholds,
    matched,
    changed,
    onlyInSystem,
    stats: {
      totalPersonsParsed: totalPersons,
      totalHouseholdsParsed: parsedHouseholds.length,
      new: newHouseholds.length,
      matched: matched.length,
      changed: changed.length,
      onlyInSystem: onlyInSystem.length,
    },
  }
}

// ============================================================
// Endpoint 1: POST /api/households/import/parse
// Accepts PDF upload → returns matching preview
// ============================================================

export const tosImportParse: Endpoint = {
  path: '/import/parse',
  method: 'post',
  handler: async (req: PayloadRequest): Promise<Response> => {
    try {
      if (!req.user) {
        return Response.json({ error: 'Nicht autorisiert' }, { status: 401 })
      }

      let pdfText: string
      const contentType = req.headers.get('content-type') || ''

      if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData!()
        const file = formData.get('file') as File | null

        if (!file) {
          return Response.json({ error: 'Keine Datei übermittelt' }, { status: 400 })
        }
        if (!file.name.toLowerCase().endsWith('.pdf')) {
          return Response.json({ error: 'Datei muss eine PDF sein' }, { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const { PDFParse } = await import('pdf-parse')
        const pdf = new PDFParse({ data: new Uint8Array(buffer) })
        const textResult = await pdf.getText()
        pdfText = textResult.text
      } else {
        const body = await req.json!()
        pdfText = body.text
        if (!pdfText) {
          return Response.json({ error: 'Kein Text übermittelt' }, { status: 400 })
        }
      }

      const parsedHouseholds = parseMandantenliste(pdfText)

      if (parsedHouseholds.length === 0) {
        return Response.json(
          { error: 'Keine Haushalte in der PDF gefunden. Ist das die richtige Datei?' },
          { status: 400 }
        )
      }

      const result = await matchWithExisting(req.payload, parsedHouseholds)
      return Response.json(result)
    } catch (error: any) {
      console.error('TOS Import Parse Error:', error)
      return Response.json(
        { error: error.message || 'Import-Analyse fehlgeschlagen' },
        { status: 500 }
      )
    }
  },
}

// ============================================================
// Endpoint 2: POST /api/households/import/execute
// Accepts user selections → creates/updates/archives records
// ============================================================

export const tosImportExecute: Endpoint = {
  path: '/import/execute',
  method: 'post',
  handler: async (req: PayloadRequest): Promise<Response> => {
    try {
      if (!req.user) {
        return Response.json({ error: 'Nicht autorisiert' }, { status: 401 })
      }

      const body = await req.json!()
      const {
        createHouseholds = [],
        updateHouseholds = [],
        archiveHouseholds = [],
      }: {
        createHouseholds: ParsedHousehold[]
        updateHouseholds: { faNr: string; changes: Record<string, any> }[]
        archiveHouseholds: string[]
      } = body

      const results = {
        created: { households: 0, persons: 0 },
        updated: { households: 0 },
        archived: { households: 0 },
        errors: [] as string[],
      }

      // === CREATE ===
      for (const hh of createHouseholds) {
        try {
          const household = await req.payload.create({
            collection: 'households',
            data: {
              tosFaNumber: hh.faNr,
              tosFaPromo: hh.faPromo || undefined,
              displayName: hh.displayName,
              status: 'active',
              tosSyncStatus: 'never',
            },
          })
          results.created.households++

          let primaryPersonId: string | number | null = null

          for (const p of hh.persons) {
            try {
              const client = await req.payload.create({
                collection: 'clients',
                data: {
                  tosPersonId: p.persNr,
                  salutation: p.anrede as any,
                  firstName: p.vorname || '–',
                  lastName: p.nachname,
                  householdRole: p.stand || 'M',
                  household: household.id,
                  bavCheckPossible: p.bavCheck,
                  status: 'client',
                  source: 'telis',
                },
              })
              results.created.persons++

              if (p.stand === 'M' && !primaryPersonId) {
                primaryPersonId = client.id
              }
            } catch (personError: any) {
              if (
                personError.message?.includes('unique') ||
                personError.message?.includes('duplicate')
              ) {
                const existing = await req.payload.find({
                  collection: 'clients',
                  where: { tosPersonId: { equals: p.persNr } },
                  limit: 1,
                })
                if (existing.docs.length > 0) {
                  await req.payload.update({
                    collection: 'clients',
                    id: existing.docs[0].id,
                    data: {
                      household: household.id,
                      householdRole: p.stand || 'M',
                    },
                  })
                  if (p.stand === 'M' && !primaryPersonId) {
                    primaryPersonId = existing.docs[0].id
                  }
                }
              } else {
                results.errors.push(
                  `Person ${p.persNr} (${p.nachname}): ${personError.message}`
                )
              }
            }
          }

          if (primaryPersonId) {
            await req.payload.update({
              collection: 'households',
              id: household.id,
              data: { primaryPerson: primaryPersonId },
            })
          }
        } catch (hhError: any) {
          results.errors.push(
            `Haushalt ${hh.faNr} (${hh.displayName}): ${hhError.message}`
          )
        }
      }

      // === UPDATE ===
      for (const update of updateHouseholds) {
        try {
          const existing = await req.payload.find({
            collection: 'households',
            where: { tosFaNumber: { equals: update.faNr } },
            limit: 1,
          })
          if (existing.docs.length > 0) {
            await req.payload.update({
              collection: 'households',
              id: existing.docs[0].id,
              data: update.changes,
            })
            results.updated.households++
          }
        } catch (updateError: any) {
          results.errors.push(`Update ${update.faNr}: ${updateError.message}`)
        }
      }

      // === ARCHIVE ===
      for (const householdId of archiveHouseholds) {
        try {
          await req.payload.update({
            collection: 'households',
            id: householdId,
            data: { status: 'archived' },
          })
          results.archived.households++
        } catch (archiveError: any) {
          results.errors.push(`Archivieren ${householdId}: ${archiveError.message}`)
        }
      }

      return Response.json({ success: true, results })
    } catch (error: any) {
      console.error('TOS Import Execute Error:', error)
      return Response.json(
        { error: error.message || 'Import fehlgeschlagen' },
        { status: 500 }
      )
    }
  },
}
