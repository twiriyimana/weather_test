import fs from 'fs'
import path from 'path'
import { connectDatabase } from '../config/database.js'

const runMigrations = async () => {
  const schemaPath = path.join(process.cwd(), 'database', 'schema.sql')
  const seedPath = path.join(process.cwd(), 'database', 'seed.sql')

  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at ${schemaPath}`)
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8')
  const seedSql = fs.existsSync(seedPath) ? fs.readFileSync(seedPath, 'utf8') : ''

  await connectDatabase()

  const db = global.db
  const statements = schemaSql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)

  for (const sql of statements) {
    if (!sql) continue
    db.exec(sql)
  }

  if (seedSql.trim()) {
    const seedStatements = seedSql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)

    for (const sql of seedStatements) {
      if (!sql) continue
      db.exec(sql)
    }
  }

  console.log('Database initialized successfully')
  process.exit(0)
}

runMigrations().catch((err) => {
  console.error('Failed to initialize database:', err)
  process.exit(1)
})
