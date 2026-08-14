import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchCurrentWeather } from '../../features/weather/weatherSlice'
import { fetchDefaultLocationName } from '../../features/location/locationSlice'
import './CurrentWeather.css'

const DEFAULT_LAT = -1.9441
const DEFAULT_LON = 30.0619

function weatherIcon(condition: string): string {
  const c = condition.toLowerCase()
  if (c.includes('sun') || c.includes('clear')) return '☀️'
  if (c.includes('cloud')) return '⛅'
  if (c.includes('rain')) return '🌧️'
  if (c.includes('snow')) return '❄️'
  if (c.includes('thunder')) return '⛈️'
  return '🌤️'
}

export default function CurrentWeather() {
  const dispatch = useAppDispatch()
  const selectedLocation = useAppSelector((state) => state.location.selectedLocation)
  const defaultLocationName = useAppSelector((state) => state.location.defaultLocationName)
  const { data, status, error } = useAppSelector((state) => state.weather.current)

  const loading = status === 'loading' || status === 'idle'

  useEffect(() => {
    const lat = selectedLocation?.latitude ?? DEFAULT_LAT
    const lon = selectedLocation?.longitude ?? DEFAULT_LON

    dispatch(fetchCurrentWeather({ lat, lon }))

    if (!selectedLocation) {
      dispatch(fetchDefaultLocationName({ lat, lon }))
    }
  }, [selectedLocation, dispatch])

  const name = selectedLocation?.name ?? defaultLocationName ?? 'Kigali'
  const condition = data?.weather ?? 'Loading...'

  return (
    <div className="current-weather-card">
      <div className="current-weather-header">
        <div>
          <h2 className="city-name">{name}</h2>
          <p className="weather-condition">{loading ? 'Loading...' : condition}</p>
        </div>
        <div className="weather-icon-large">{loading ? '⌛' : weatherIcon(condition)}</div>
      </div>
      <div className="current-weather-body">
        <span className="temperature-large">
          {loading ? '--' : data ? `${data.temperature}°` : '--'}
        </span>
        <div className="weather-details">
          <p className="date-time">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          {!loading && data?.humidity !== undefined && (
            <p className="detail-text">Humidity: {data.humidity}%</p>
          )}
          {!loading && data?.windSpeed !== undefined && (
            <p className="detail-text">Wind: {data.windSpeed} km/h</p>
          )}
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  )
}
