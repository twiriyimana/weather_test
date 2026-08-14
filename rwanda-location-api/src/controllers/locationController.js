import { insertSearchHistory, findByCoordinates } from '../models/Location.js'
import { searchLocations as searchExternal, reverseGeocode as reverseExternal } from '../services/geocodingService.js'

export const searchLocations = async (req, res) => {
  try {
    const rawQuery = (req.query.q || '').trim()
    const normalizedQuery = rawQuery.toLowerCase()

    if (!normalizedQuery) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter "q" is required',
      })
    }

    let locations = []

    try {
      locations = await searchExternal(normalizedQuery)
    } catch (error) {
      console.error('External geocoding failed:', error)
      return res.status(500).json({
        success: false,
        message: 'Failed to search locations via external API',
        error: error.message,
      })
    }

    if (locations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found in Rwanda',
      })
    }

    try {
      await insertSearchHistory(rawQuery, locations.length)
    } catch (error) {
      console.error('Failed to insert search history:', error)
    }

    const enriched = locations.map((loc) => ({
      ...loc,
      temperatureUnit: 'C',
    }))

    res.status(200).json({
      success: true,
      query: rawQuery,
      results: enriched,
    })
  } catch (error) {
    console.error('Error in searchLocations:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to search locations',
      error: error.message,
    })
  }
}

export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'lat and lon query parameters are required',
      })
    }

    const latitude = Number(lat)
    const longitude = Number(lon)

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: 'lat and lon must be valid numbers',
      })
    }

    let location = null

    try {
      location = await reverseExternal(latitude, longitude)
    } catch (error) {
      const status = error.response?.status
      if (status === 404) {
        location = await findByCoordinates(latitude, longitude)
      } else {
        console.error('External reverse geocoding failed:', error)
        return res.status(500).json({
          success: false,
          message: 'Failed to reverse geocode location via external API',
          error: error.message,
        })
      }
    }

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found for provided coordinates',
      })
    }

    res.status(200).json({
      success: true,
      result: {
        ...location,
        temperatureUnit: 'C',
      },
    })
  } catch (error) {
    console.error('Error in reverseGeocode:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to reverse geocode location',
      error: error.message,
    })
  }
}
