import { DatabaseSync } from 'node:sqlite'
import fs from 'fs'
import path from 'path'

const dbPath = process.env.DATABASE_URL || './database/rwanda_location.db'

const connectDatabase = async () => {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  const db = new DatabaseSync(dbPath)

  db.exec('PRAGMA journal_mode = WAL;')

  global.db = db
  console.log('Connected to SQLite database')
  return db
}

export { connectDatabase }
