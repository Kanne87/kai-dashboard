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
    group: 'Berater',
    description: 'Beraterprofile (lo-board, Rechner-Tools)',
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
    },
    {
      name: 'role',
      label: 'Rolle',
      type: 'select',
      defaultValue: 'berater',
      options: [
        { label: 'Berater', value: 'berater' },
        { label: 'Assistenz', value: 'assistenz' },
        { label: 'Admin', value: 'admin' },
      ],
    },
    {
      name: 'bio',
      label: 'Bio / Notizen',
      type: 'textarea',
    },
    {
      name: 'street',
      label: 'Strasse + Hausnummer',
      type: 'text',
    },
    {
      name: 'zip',
      label: 'PLZ',
      type: 'text',
    },
    {
      name: 'city',
      label: 'Ort',
      type: 'text',
    },

    // -- Zoom OAuth --
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
