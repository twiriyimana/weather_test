import axios from 'axios'
import NodeCache from 'node-cache'

const weatherCache = new NodeCache(60)

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

const axiosInstance = axios.create({
  timeout: 10000,
})

const fetchWithCache = async (key, fetcher) => {
  const cached = weatherCache.get(key)
  if (cached) return cached

  const data = await fetcher()
  weatherCache.set(key, data, 60)
  return data
}

const mapWmoToCondition = (code) => {
  const map = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  }
  return map[code] || 'Unknown'
}

export const getCurrentWeather = async (req, res) => {
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

    const cacheKey = `current:${latitude}:${longitude}`
    const data = await fetchWithCache(cacheKey, async () => {
      const response = await axiosInstance.get(FORECAST_URL, {
        params: {
          latitude,
          longitude,
          current_weather: true,
          timezone: 'auto',
        },
      })

      const current = response.data.current_weather || {}
      const hourly = response.data.hourly || {}

      let humidity = 0
      if (hourly.relativehumidity_2m && hourly.time && hourly.relativehumidity_2m.length > 0) {
        const currentHourIndex = hourly.time.findIndex((t) => t === current.time)
        if (currentHourIndex >= 0) {
          humidity = hourly.relativehumidity_2m[currentHourIndex] || 0
        }
      }

      return {
        latitude,
        longitude,
        temperature: Math.round(current.temperature || 0),
        temperatureUnit: 'C',
        weather: mapWmoToCondition(current.weathercode),
        humidity,
        windSpeed: Math.round(current.windspeed || 0),
      }
    })

    res.status(200).json({
      success: true,
      result: data,
    })
  } catch (error) {
    console.error('Error in getCurrentWeather:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current weather',
      error: error.message,
    })
  }
}

export const getForecast = async (req, res) => {
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

    const cacheKey = `forecast:${latitude}:${longitude}`
    const data = await fetchWithCache(cacheKey, async () => {
      const response = await axiosInstance.get(FORECAST_URL, {
        params: {
          latitude,
          longitude,
          daily: ['weathercode', 'temperature_2m_max', 'temperature_2m_min'],
          timezone: 'auto',
          forecast_days: 7,
        },
      })

      const daily = response.data.daily || {}
      const days = []

      if (daily.time && daily.time.length > 0) {
        for (let i = 0; i < daily.time.length; i++) {
          days.push({
            date: daily.time[i],
            temperature: Math.round((daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2),
            temperatureUnit: 'C',
            weather: mapWmoToCondition(daily.weathercode[i]),
            humidity: 0,
            windSpeed: 0,
          })
        }
      }

      return {
        latitude,
        longitude,
        days,
      }
    })

    res.status(200).json({
      success: true,
      result: data,
    })
  } catch (error) {
    console.error('Error in getForecast:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forecast',
      error: error.message,
    })
  }
}
