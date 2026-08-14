import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchForecast } from '../../features/weather/weatherSlice'
import './Forecast.css'

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

function formatDay(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
}

export default function Forecast() {
  const dispatch = useAppDispatch()
  const selectedLocation = useAppSelector((state) => state.location.selectedLocation)
  const { days, status, error } = useAppSelector((state) => state.weather.forecast)

  const loading = status === 'loading' || status === 'idle'

  useEffect(() => {
    const lat = selectedLocation ? selectedLocation.latitude : DEFAULT_LAT
    const lon = selectedLocation ? selectedLocation.longitude : DEFAULT_LON
    dispatch(fetchForecast({ lat, lon }))
  }, [selectedLocation, dispatch])

  return (
    <section className="forecast">
      <h3 className="section-title">5-Day Forecast</h3>
      {error && <p className="error-text">{error}</p>}
      <div className="forecast-card">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="forecast-item skeleton">
                <div className="skeleton-line short" />
                <div className="skeleton-circle" />
                <div className="skeleton-line" />
              </div>
            ))
          : days.map((item) => (
              <div key={item.date} className="forecast-item">
                <span className="forecast-day">{formatDay(item.date)}</span>
                <span className="forecast-icon">{weatherIcon(item.weather)}</span>
                <span className="forecast-temp">{item.temperature}°</span>
              </div>
            ))}
      </div>
    </section>
  )
}
