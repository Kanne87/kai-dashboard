import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'
import { Clients } from './collections/Clients'
import { Tasks } from './collections/Tasks'
import { Communication } from './collections/Communication'
import { Documents } from './collections/Documents'
import { Tags } from './collections/Tags'
import { Automations } from './collections/Automations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' | Kai Dashboard',
    },
  },
  collections: [Tenants, Users, Clients, Tasks, Communication, Documents, Tags, Automations],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'CHANGE-ME-IN-PRODUCTION',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    multiTenantPlugin({
      collections: {
        clients: {},
        tasks: {},
        communication: {},
        documents: {},
        tags: {},
        automations: {},
      },
      tenantsSlug: 'tenants',
      userHasAccessToAllTenants: (user) =>
        user?.role === 'super-admin',
    }),
  ],
})
