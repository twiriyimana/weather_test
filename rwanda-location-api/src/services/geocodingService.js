import axios from 'axios'

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const REVERSE_URL = 'https://geocoding-api.open-meteo.com/v1/reverse'

const axiosInstance = axios.create({
  timeout: 10000,
})

export const searchLocations = async (query) => {
  const response = await axiosInstance.get(GEOCODE_URL, {
    params: {
      name: query,
      count: 5,
      language: 'en',
      format: 'json',
    },
  })

  const results = Array.isArray(response.data.results) ? response.data.results : []
  const rwandaResults = []

  for (const item of results) {
    const country = item.country || ''
    const countryCode = (item.country_code || '').toUpperCase()

    if (country.toLowerCase().includes('rwanda') || countryCode === 'RW') {
      rwandaResults.push({
        name: item.name || query,
        country: 'Rwanda',
        countryCode: 'RW',
        province: item.admin1 || null,
        district: item.admin2 || null,
        sector: item.admin3 || null,
        cell: null,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      })
    }
  }

  return rwandaResults
}

export const reverseGeocode = async (lat, lon) => {
  const response = await axiosInstance.get(REVERSE_URL, {
    params: {
      lat,
      lon,
      count: 1,
      language: 'en',
      format: 'json',
    },
  })

  const results = Array.isArray(response.data.results) ? response.data.results : []
  const item = results[0]

  if (!item) {
    return null
  }

  const country = item.country || ''
  const countryCode = (item.country_code || '').toUpperCase()

  if (!country.toLowerCase().includes('rwanda') && countryCode !== 'RW') {
    return null
  }

  return {
    name: item.name || 'Unknown',
    country: 'Rwanda',
    countryCode: 'RW',
    province: item.admin1 || null,
    district: item.admin2 || null,
    sector: item.admin3 || null,
    cell: null,
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
  }
}
