import type { Endpoint } from 'payload'

/**
 * POST /api/vorgaenge/aus-termin
 *
 * Erstellt automatisch eine Vorgangsgruppe aus einem Termin:
 * - Input: terminId, aufgaben[], wiedervorlagen[]
 * - Erstellt Gruppe mit Termin-Verknüpfung
 * - Erstellt alle Einzel-Vorgänge und verknüpft sie mit der Gruppe
 */
export const vorgaengeAusTermin: Endpoint = {
  path: '/vorgaenge/aus-termin',
  method: 'post',
  handler: async (req) => {
    const { user, payload } = req

    if (!user) {
      return Response.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    let body: {
      terminId: string | number
      aufgaben?: Array<{
        text: string
        faellig?: string
        vertrag?: string
        sortOrder?: number
      }>
      wiedervorlagen?: Array<{
        text: string
        faellig: string
        sortOrder?: number
      }>
    }

    try {
      body = await req.json!()
    } catch {
      return Response.json({ error: 'Ungültiger Request-Body' }, { status: 400 })
    }

    const { terminId, aufgaben = [], wiedervorlagen = [] } = body

    if (!terminId) {
      return Response.json({ error: 'terminId ist erforderlich' }, { status: 400 })
    }

    // Validate all wiedervorlagen have faellig date
    for (const wv of wiedervorlagen) {
      if (!wv.faellig) {
        return Response.json(
          { error: `Wiedervorlage "${wv.text}" benötigt ein Fälligkeitsdatum.` },
          { status: 400 },
        )
      }
    }

    // Fetch the termin to get haushalt and mandanten
    const termin = await payload.findByID({
      collection: 'termine',
      id: terminId,
      depth: 0,
    })

    if (!termin) {
      return Response.json({ error: 'Termin nicht gefunden' }, { status: 404 })
    }

    // Determine mandant: use first mandant from termin if available
    const mandantId = Array.isArray(termin.mandanten) && termin.mandanten.length > 0
      ? termin.mandanten[0]
      : undefined

    // Create the Vorgangsgruppe
    const gruppe = await payload.create({
      collection: 'vorgangsgruppen',
      data: {
        name: `Termin-Nachbereitung: ${termin.titel}`,
        termin: termin.id,
        haushalt: termin.haushalt || undefined,
        mandant: mandantId,
        createdBy: user.id,
      },
    })

    const erstellteVorgaenge: Array<{ id: string | number; typ: string; text: string }> = []

    // Create Aufgaben
    for (let i = 0; i < aufgaben.length; i++) {
      const aufgabe = aufgaben[i]
      const vorgang = await payload.create({
        collection: 'vorgaenge',
        data: {
          text: aufgabe.text,
          typ: 'aufgabe',
          status: 'offen',
          faellig: aufgabe.faellig || undefined,
          vertrag: aufgabe.vertrag || undefined,
          gruppe: gruppe.id,
          haushalt: termin.haushalt || undefined,
          mandant: mandantId,
          sortOrder: aufgabe.sortOrder ?? i,
          createdBy: user.id,
        },
      })
      erstellteVorgaenge.push({ id: vorgang.id, typ: 'aufgabe', text: vorgang.text })
    }

    // Create Wiedervorlagen
    for (let i = 0; i < wiedervorlagen.length; i++) {
      const wv = wiedervorlagen[i]
      const vorgang = await payload.create({
        collection: 'vorgaenge',
        data: {
          text: wv.text,
          typ: 'wiedervorlage',
          status: 'offen',
          faellig: wv.faellig,
          gruppe: gruppe.id,
          haushalt: termin.haushalt || undefined,
          mandant: mandantId,
          sortOrder: wv.sortOrder ?? aufgaben.length + i,
          createdBy: user.id,
        },
      })
      erstellteVorgaenge.push({ id: vorgang.id, typ: 'wiedervorlage', text: vorgang.text })
    }

    return Response.json({
      gruppe: {
        id: gruppe.id,
        name: gruppe.name,
      },
      vorgaenge: erstellteVorgaenge,
      meta: {
        aufgabenErstellt: aufgaben.length,
        wiedervorlagenErstellt: wiedervorlagen.length,
      },
    })
  },
}
