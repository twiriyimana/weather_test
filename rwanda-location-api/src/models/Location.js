import { searchLocations, reverseGeocode } from '../services/geocodingService.js'

const findByQuery = async (query) => {
  const lowerQuery = `%${query.toLowerCase()}%`

  const sql = `
    SELECT 
      l.name,
      l.country,
      l.country_code,
      l.province,
      l.district,
      l.sector,
      l.cell,
      l.latitude,
      l.longitude
    FROM locations l
    WHERE LOWER(l.name) LIKE ?
      AND l.country_code = 'RW'
    ORDER BY l.name
    LIMIT 20
  `

  const result = global.db.prepare(sql).all(lowerQuery)
  return result.map((row) => ({
    name: row.name,
    country: row.country,
    countryCode: row.country_code,
    province: row.province,
    district: row.district,
    sector: row.sector,
    cell: row.cell,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  }))
}

const findByCoordinates = async (latitude, longitude) => {
  const sql = `
    SELECT 
      l.name,
      l.country,
      l.country_code,
      l.province,
      l.district,
      l.sector,
      l.cell,
      l.latitude,
      l.longitude
    FROM locations l
    WHERE l.country_code = 'RW'
      AND ABS(l.latitude - ?) < 0.1
      AND ABS(l.longitude - ?) < 0.1
    ORDER BY ABS(l.latitude - ?) + ABS(l.longitude - ?)
    LIMIT 1
  `

  const row = global.db.prepare(sql).get(latitude, longitude, latitude, longitude)
  if (!row) return null

  return {
    name: row.name,
    country: row.country,
    countryCode: row.country_code,
    province: row.province,
    district: row.district,
    sector: row.sector,
    cell: row.cell,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
  }
}

const findByExternalProvider = async (query) => {
  try {
    return await searchLocations(query)
  } catch (error) {
    console.error('External geocoding fallback failed:', error)
    return []
  }
}

const insertSearchHistory = async (query, resultsCount) => {
  try {
    const sql = `
      INSERT INTO search_history (query, results_count, created_at)
      VALUES (?, ?, datetime('now'))
    `
    global.db.prepare(sql).run(query, resultsCount)
  } catch (error) {
    console.error('Failed to insert search history:', error)
  }
}

export {
  findByQuery,
  findByCoordinates,
  findByExternalProvider,
  insertSearchHistory,
}
