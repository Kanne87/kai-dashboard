/**
 * CI Schema-Drift Check
 * 
 * Parses payload.config.ts to extract collection slugs, then verifies
 * that migrate.mjs references every collection. Fails the build if
 * a collection is missing from migrate.mjs.
 *
 * Run: node scripts/schema-check.mjs
 */
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

// -- Step 1: Extract collection slugs from payload.config.ts --
const configPath = resolve(root, 'src/payload.config.ts')
const configContent = readFileSync(configPath, 'utf-8')

// Find all collection import paths
const importRegex = /import\s*\{[^}]+\}\s*from\s*'\.\/(?:collections|globals)\/([^']+)'/g
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
      const slugMatch = content.match(/slug:\s*['"]([^'"]+)['"]/) 
      if (slugMatch) {
        slugs.push(slugMatch[1])
      }
      break
    } catch { /* try next dir */ }
  }
}

console.log(`Found ${slugs.length} collections in payload.config.ts:`)
slugs.forEach(s => console.log(`  - ${s}`))

// -- Step 2: Check migrate.mjs for coverage --
const migratePath = resolve(root, 'migrate.mjs')
const migrateContent = readFileSync(migratePath, 'utf-8')

// Convert slug to expected table name (hyphens -> underscores)
const missing = []
const systemCollections = ['users', 'media']

for (const slug of slugs) {
  const tableName = slug.replace(/-/g, '_')
  if (systemCollections.includes(tableName)) continue

  const tableRegex = new RegExp(`['"]${tableName}['"]\\s*:`, 'm')
  if (!tableRegex.test(migrateContent)) {
    const createRegex = new RegExp(`CREATE TABLE.*["']${tableName}["']`, 'im')
    if (!createRegex.test(migrateContent)) {
      missing.push({ slug, tableName })
    }
  }
}

// -- Step 3: Report --
console.log('')
if (missing.length === 0) {
  console.log('All collections are covered in migrate.mjs')
  process.exit(0)
} else {
  console.error('Schema drift detected! The following collections are NOT in migrate.mjs:\n')
  for (const { slug, tableName } of missing) {
    console.error(`  Collection "${slug}" -> expected table "${tableName}"`)
  }
  console.error('\nAction required:')
  console.error('   1. Add the missing table(s) to the SCHEMA definition in migrate.mjs')
  console.error('   2. Include all fields from the Collection definition')
  console.error('   3. Commit and push again')
  console.error('')
  process.exit(1)
}
