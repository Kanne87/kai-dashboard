/**
 * CI Schema-Drift Check
 *
 * Verifies that every collection defined in payload.config.ts has
 * a corresponding migration file in migrations/.
 *
 * Run: node scripts/schema-check.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// -- Step 1: Extract collection slugs from payload.config.ts --
const configPath = resolve(root, 'src/payload.config.ts')
const configContent = readFileSync(configPath, 'utf-8')

// Find all collection import paths
const importRegex = /import\s*\{[^}]+\}\s*from\s*['"]\.\/(?:collections|globals)\/([^'"]+)['"]/g
const collectionFiles = []
let match
while ((match = importRegex.exec(configContent)) !== null) {
  collectionFiles.push(match[1])
}

// Read each collection file to get the slug
const slugs = []
for (const file of collectionFiles) {
  for (const dir of ['collections', 'globals']) {
    const filePath = resolve(root, 'src', dir, `${file}.ts`)
    try {
      const content = readFileSync(filePath, 'utf-8')
      const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"/])
      if (slugMatch) {
        slugs.push(slugMatch[1])
      }
      break
    } catch { /* try next dir */ }
  }
}

console.log(`Found ${slugs.length} collections in payload.config.ts:`)
slugs.forEach(s => console.log(`  - ${s}`))

// -- Step 2: Check migrations/ directory for coverage --
const migrationsDir = resolve(root, 'migrations')
const migrationFiles = existsSync(migrationsDir)
  ? readdirSync(migrationsDir).filter(f => f.endsWith('.mjs'))
  : []

// Read each migration file to get the exported table name
const migrationTables = new Set()
for (const file of migrationFiles) {
  const content = readFileSync(resolve(migrationsDir, file), 'utf-8')
  const tableMatch = content.match(/export\s+const\s+table\s*=\s*['"]([^'"]+)['"/])
  if (tableMatch) {
    migrationTables.add(tableMatch[1])
  }
}

console.log(`\nFound ${migrationTables.size} migration files in migrations/:`)
migrationTables.forEach(t => console.log(`  - ${t}`))

// -- Step 3: Compare --
const missing = []
const systemCollections = ['users', 'media']

for (const slug of slugs) {
  const tableName = slug.replace(/-/g, '_')
  if (systemCollections.includes(tableName)) continue

  if (!migrationTables.has(tableName)) {
    missing.push({ slug, tableName })
  }
}

// -- Step 4: Report --
console.log('')
if (missing.length === 0) {
  console.log('All collections have migration files.')
  process.exit(0)
} else {
  console.error('Schema drift detected! The following collections have NO migration file:\n')
  for (const { slug, tableName } of missing) {
    console.error(`  Collection "${slug}" -> expected migrations/${tableName}.mjs`)
  }
  console.error('\nAction required:')
  console.error('   1. Create migrations/${tableName}.mjs with table name and column definitions')
  console.error('   2. Export: table (string), columns (array), optionally rels and arrays')
  console.error('   3. Commit and push again')
  console.error('')
  process.exit(1)
}
