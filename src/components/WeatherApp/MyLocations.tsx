import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchMyLocations } from '../../features/myLocations/myLocationsSlice'
import './MyLocations.css'

function weatherIcon(condition: string): string {
  const c = condition.toLowerCase()
  if (c.includes('sun') || c.includes('clear')) return '☀️'
  if (c.includes('cloud')) return '⛅'
  if (c.includes('rain')) return '🌧️'
  if (c.includes('snow')) return '❄️'
  if (c.includes('thunder')) return '⛈️'
  return '🌤️'
}

export default function MyLocations() {
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.myLocations)

  const loading = status === 'loading' || status === 'idle'

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMyLocations())
    }
  }, [status, dispatch])

  return (
    <section className="my-locations">
      <div className="my-locations-header">
        <h3 className="section-title">My Locations</h3>
        <button className="view-all">View All</button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <div className="locations-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="location-card skeleton">
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
            </div>
          ))}
        </div>
      ) : (
        <div className="locations-grid">
          {items.map(({ location, weather }) => (
            <div key={location.name} className="location-card">
              <div className="location-info">
                <span className="location-name">{location.name}</span>
                <span className="location-condition">
                  <span className="location-icon">
                    {weather ? weatherIcon(weather.weather) : '⌛'}
                  </span>
                  {weather ? weather.weather : 'Loading...'}
                </span>
              </div>
              <span className="location-temp">
                {weather ? `${weather.temperature}°` : '--'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
