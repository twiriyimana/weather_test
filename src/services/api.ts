const API_BASE_URL = 'http://localhost:5000/api'

export interface LocationResult {
  name: string
  country: string
  countryCode: string
  province: string | null
  district: string | null
  sector: string | null
  cell: string | null
  latitude: number
  longitude: number
  temperatureUnit: string
}

export interface WeatherResult {
  latitude: number
  longitude: number
  temperature: number
  temperatureUnit: string
  weather: string
  humidity: number
  windSpeed: number
}

export interface ForecastDay {
  date: string
  temperature: number
  temperatureUnit: string
  weather: string
  humidity: number
  windSpeed: number
}

export interface ForecastResult {
  latitude: number
  longitude: number
  days: ForecastDay[]
}

export const searchLocations = async (query: string): Promise<LocationResult[]> => {
  const response = await fetch(`${API_BASE_URL}/locations/search?q=${encodeURIComponent(query)}`)
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Location not found')
  }
  return data.results
}

export const reverseGeocode = async (lat: number, lon: number): Promise<LocationResult> => {
  const response = await fetch(`${API_BASE_URL}/locations/reverse?lat=${lat}&lon=${lon}`)
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Location not found')
  }
  return data.result
}

export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherResult> => {
  const response = await fetch(`${API_BASE_URL}/weather/current?lat=${lat}&lon=${lon}`)
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch weather')
  }
  return data.result
}

export const getForecast = async (lat: number, lon: number): Promise<ForecastResult> => {
  const response = await fetch(`${API_BASE_URL}/weather/forecast?lat=${lat}&lon=${lon}`)
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch forecast')
  }
  return data.result
}
