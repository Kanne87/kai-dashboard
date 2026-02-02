import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
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
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Tenants,
    Clients,
    Tasks,
    Communication,
    Documents,
    Tags,
    Automations,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: true,
  }),
  sharp,
  // Multi-tenant plugin temporarily disabled
  // plugins: [
  //   multiTenantPlugin({...})
  // ],
})
