import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Tenants } from './collections/Tenants'
import { Households } from './collections/Households'
import { Clients } from './collections/Clients'
import { HouseholdEvents } from './collections/HouseholdEvents'
import { Tasks } from './collections/Tasks'
import { TaskEvents } from './collections/TaskEvents'
import { Communication } from './collections/Communication'
import { Documents } from './collections/Documents'
import { Tags } from './collections/Tags'
import { Automations } from './collections/Automations'
import { Contracts } from './collections/Contracts'
import { Claims } from './collections/Claims'
import { SystemStatus } from './collections/SystemStatus'
import { TaskGroups } from './collections/TaskGroups'
import { AdvisorProfiles } from './collections/AdvisorProfiles'
import { InboxItems } from './collections/InboxItems'
import { AppointmentPreps } from './collections/AppointmentPreps'
import { AppointmentTemplates } from './collections/AppointmentTemplates'
import { NotificationTemplates } from './collections/NotificationTemplates'
import { ContractEvents } from './collections/ContractEvents'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterLogin: ['src/components/AuthentikLoginButton'],
      views: {
        posteingang: {
          Component: 'src/components/Posteingang',
          path: '/posteingang',
          meta: {
            title: 'Posteingang',
          },
        },
      },
    },
  },
  cors: [
    'https://app.kailohmann.de',
    'https://immo.kailohmann.de',
    'https://tos-crawler.kailohmann.de',
  ],
  collections: [
    Users,
    Tenants,
    Households,
    Clients,
    HouseholdEvents,
    Tasks,
    TaskEvents,
    TaskGroups,
    Communication,
    Documents,
    Tags,
    Automations,
    Contracts,
    ContractEvents,
    Claims,
    SystemStatus,
    AdvisorProfiles,
    InboxItems,
    AppointmentPreps,
    AppointmentTemplates,
    NotificationTemplates,
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
})
