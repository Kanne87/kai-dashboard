import type { CollectionConfig } from 'payload'
import { isAuthenticated, isSuperAdmin } from '../access'

export const AdvisorProfiles: CollectionConfig = {
  slug: 'advisor-profiles',
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  admin: {
    useAsTitle: 'lastName',
    group: 'Immo-Rechner',
    description: 'Beraterprofile fuer den Kapitalanlage-Rechner',
  },
  fields: [
    {
      name: 'authentikSub',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Authentik Subject ID (wird automatisch gesetzt)',
        readOnly: true,
      },
    },
    {
      name: 'firstName',
      label: 'Vorname',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      label: 'Nachname',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: 'E-Mail',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      label: 'Telefon',
      type: 'text',
      required: true,
    },
    {
      name: 'street',
      label: 'Strasse + Hausnummer',
      type: 'text',
      required: true,
    },
    {
      name: 'zip',
      label: 'PLZ',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      label: 'Ort',
      type: 'text',
      required: true,
    },

    // ── Zoom OAuth ──
    {
      name: 'zoomIntegration',
      type: 'group',
      label: 'Zoom-Integration',
      admin: {
        description: 'Wird automatisch beim Verbinden mit Zoom gesetzt',
      },
      fields: [
        { name: 'connected', type: 'checkbox', defaultValue: false },
        { name: 'accessToken', type: 'text', admin: { readOnly: true } },
        { name: 'refreshToken', type: 'text', admin: { readOnly: true } },
        { name: 'tokenExpiresAt', type: 'date', admin: { readOnly: true } },
        { name: 'zoomUserId', type: 'text', admin: { readOnly: true } },
        { name: 'zoomEmail', type: 'text', admin: { readOnly: true } },
      ],
    },
  ],
  timestamps: true,
}
