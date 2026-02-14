import type { Endpoint, Where } from 'payload'

/**
 * GET /api/vorgaenge/uebersicht
 *
 * Liefert die komplette Vorgänge-Übersicht:
 * - Alle Gruppen mit ihren Aufgaben + Wiedervorlagen (getrennt)
 * - Fortschritt pro Gruppe (nur Aufgaben)
 * - Alle Einzelvorgänge ohne Gruppe
 * - Filterfähig nach: typ, status, haushalt, mandant
 * - Sortierung: Gruppen zuerst, dann Einzelvorgänge nach Fälligkeit
 */
export const vorgaengeUebersicht: Endpoint = {
  path: '/vorgaenge/uebersicht',
  method: 'get',
  handler: async (req) => {
    const { user, payload } = req

    if (!user) {
      return Response.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const url = new URL(req.url || '', 'http://localhost')
    const typ = url.searchParams.get('typ')
    const status = url.searchParams.get('status')
    const haushalt = url.searchParams.get('haushalt')
    const mandant = url.searchParams.get('mandant')

    // Build where clause for vorgaenge
    const vorgaengeConditions: Where[] = [
      { createdBy: { equals: user.id } },
    ]
    if (typ) vorgaengeConditions.push({ typ: { equals: typ } })
    if (status) vorgaengeConditions.push({ status: { equals: status } })
    if (haushalt) vorgaengeConditions.push({ haushalt: { equals: haushalt } })
    if (mandant) vorgaengeConditions.push({ mandant: { equals: mandant } })
    const vorgaengeWhere: Where = { and: vorgaengeConditions }

    // Build where clause for gruppen
    const gruppenConditions: Where[] = [
      { createdBy: { equals: user.id } },
    ]
    if (haushalt) gruppenConditions.push({ haushalt: { equals: haushalt } })
    if (mandant) gruppenConditions.push({ mandant: { equals: mandant } })
    const gruppenWhere: Where = { and: gruppenConditions }

    // Fetch all groups for this user
    const gruppenResult = await payload.find({
      collection: 'vorgangsgruppen',
      where: gruppenWhere,
      limit: 0,
      depth: 1,
    })

    // Fetch all vorgaenge for this user (with filters)
    const vorgaengeResult = await payload.find({
      collection: 'vorgaenge',
      where: vorgaengeWhere,
      sort: 'faellig',
      limit: 0,
      depth: 1,
    })

    const alleVorgaenge = vorgaengeResult.docs

    // Build grouped structure
    const gruppen = gruppenResult.docs.map((gruppe) => {
      const gruppenVorgaenge = alleVorgaenge.filter((v) => {
        const gruppeId = typeof v.gruppe === 'object' && v.gruppe !== null ? v.gruppe.id : v.gruppe
        return gruppeId === gruppe.id
      })

      const aufgaben = gruppenVorgaenge.filter((v) => v.typ !== 'wiedervorlage')
      const wiedervorlagen = gruppenVorgaenge.filter((v) => v.typ === 'wiedervorlage')

      // Fortschritt: nur Aufgaben zählen, keine Wiedervorlagen
      const aufgabenGesamt = aufgaben.length
      const aufgabenErledigt = aufgaben.filter((v) => v.status === 'erledigt').length

      return {
        id: gruppe.id,
        name: gruppe.name,
        termin: gruppe.termin,
        haushalt: gruppe.haushalt,
        mandant: gruppe.mandant,
        fortschritt: {
          done: aufgabenErledigt,
          total: aufgabenGesamt,
        },
        offeneWiedervorlagen: wiedervorlagen.filter((v) => v.status === 'offen').length,
        aufgaben,
        wiedervorlagen,
      }
    })

    // Einzelvorgänge ohne Gruppe
    const einzelvorgaenge = alleVorgaenge.filter((v) => !v.gruppe)

    return Response.json({
      gruppen,
      einzelvorgaenge,
      meta: {
        totalGruppen: gruppen.length,
        totalEinzelvorgaenge: einzelvorgaenge.length,
        totalVorgaenge: alleVorgaenge.length,
      },
    })
  },
}
