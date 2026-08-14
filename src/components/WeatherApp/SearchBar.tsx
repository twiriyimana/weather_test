import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { searchLocations, setSelectedLocation, clearSearchResults } from '../../features/location/locationSlice'
import type { LocationResult } from '../../services/api'
import './SearchBar.css'

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const results = useAppSelector((state) => state.location.searchResults)
  const loading = useAppSelector((state) => state.location.searchStatus === 'loading')
  const error = useAppSelector((state) => state.location.searchError)

  // Purely local UI state: the raw input text and whether the dropdown is open
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayed = setTimeout(() => {
      const trimmed = query.trim()
      if (trimmed.length < 2) {
        dispatch(clearSearchResults())
        return
      }

      dispatch(searchLocations(trimmed)).then((action) => {
        if (searchLocations.fulfilled.match(action)) {
          setOpen(true)
        }
      })
    }, 300)

    return () => clearTimeout(delayed)
  }, [query, dispatch])

  const handleSelect = (loc: LocationResult) => {
    setQuery(loc.name)
    setOpen(false)
    dispatch(clearSearchResults())
    dispatch(setSelectedLocation(loc))
  }

  return (
    <div className="search-bar" ref={containerRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Rwanda locations..."
          className="search-input"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => {
              setQuery('')
              dispatch(clearSearchResults())
            }}
          >
            ✕
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="search-results">
          {results.map((loc) => (
            <li key={`${loc.name}-${loc.latitude}-${loc.longitude}`}>
              <button className="search-result-item" onClick={() => handleSelect(loc)}>
                <span className="result-name">{loc.name}</span>
                <span className="result-details">
                  {loc.province} {loc.district ? `· ${loc.district}` : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && <div className="search-loading">Searching...</div>}
      {error && <p className="search-error">{error}</p>}
    </div>
  )
}
