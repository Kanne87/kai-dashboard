import type { CollectionConfig } from 'payload'
import { authentikAuth } from '../auth/endpoints/authentik-auth'
import { authentikCallback } from '../auth/endpoints/authentik-callback'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
    cookies: {
      secure: true,
      sameSite: 'Lax',
      domain: undefined,
    },
    tokenExpiration: 60 * 60 * 24 * 7, // 7 days
  },
  endpoints: [authentikAuth, authentikCallback],
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'advisor',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Berater', value: 'advisor' },
        { label: 'Assistent', value: 'assistant' },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
    },
    {
      name: 'authProvider',
      type: 'select',
      defaultValue: 'local',
      options: [
        { label: 'Lokal', value: 'local' },
        { label: 'Authentik', value: 'authentik' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'authProviderId',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Authentik User ID (sub claim)',
      },
    },
    {
      name: 'exchangeCredentials',
      type: 'group',
      label: 'Exchange Server Zugangsdaten',
      admin: {
        description: 'EWS-Zugangsdaten für Kalender/Mail-Integration',
      },
      fields: [
        { name: 'ewsUser', type: 'text', label: 'EWS Benutzername' },
        {
          name: 'ewsPassword',
          type: 'text',
          label: 'EWS Passwort',
          admin: { description: 'Wird verschlüsselt gespeichert' },
        },
        {
          name: 'ewsHost',
          type: 'text',
          label: 'EWS Host',
          defaultValue: 'https://webmail.telis-finanz.de',
        },
      ],
    },
  ],
}
