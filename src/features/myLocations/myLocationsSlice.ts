import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  searchLocations,
  getCurrentWeather,
  type LocationResult,
  type WeatherResult,
} from '../../services/api'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface MyLocationItem {
  location: LocationResult
  weather: WeatherResult | null
}

interface MyLocationsState {
  items: MyLocationItem[]
  status: RequestStatus
  error: string | null
}

const initialState: MyLocationsState = {
  items: [],
  status: 'idle',
  error: null,
}

const DEFAULT_QUERIES = ['Kigali', 'Musanze', 'Huye', 'Rubavu', 'Nyamata', 'Rwamagana']

// Async thunk - reuses the existing API service layer, same behavior as before
export const fetchMyLocations = createAsyncThunk(
  'myLocations/fetchMyLocations',
  async () => {
    const results = await Promise.all(DEFAULT_QUERIES.map((q) => searchLocations(q)))
    const combined = results.flat()
    const uniqueLocations = Array.from(new Map(combined.map((item) => [item.name, item])).values())

    const enriched = await Promise.all(
      uniqueLocations.slice(0, 6).map(async (loc) => {
        try {
          const weather = await getCurrentWeather(loc.latitude, loc.longitude)
          return { location: loc, weather }
        } catch {
          return { location: loc, weather: null }
        }
      })
    )

    return enriched
  }
)

const myLocationsSlice = createSlice({
  name: 'myLocations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyLocations.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchMyLocations.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchMyLocations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Failed to load locations'
      })
  },
})

export default myLocationsSlice.reducer
