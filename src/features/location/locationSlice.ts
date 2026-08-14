import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  searchLocations as searchLocationsApi,
  reverseGeocode as reverseGeocodeApi,
  type LocationResult,
} from '../../services/api'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface LocationState {
  selectedLocation: LocationResult | null
  defaultLocationName: string | null
  searchResults: LocationResult[]
  searchStatus: RequestStatus
  searchError: string | null
}

const initialState: LocationState = {
  selectedLocation: null,
  defaultLocationName: null,
  searchResults: [],
  searchStatus: 'idle',
  searchError: null,
}

// Async thunks - reuse the existing API service layer, no duplicate fetch logic
export const searchLocations = createAsyncThunk(
  'location/searchLocations',
  async (query: string) => {
    return await searchLocationsApi(query)
  }
)

export const fetchDefaultLocationName = createAsyncThunk(
  'location/fetchDefaultLocationName',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const result = await reverseGeocodeApi(lat, lon)
    return result.name
  }
)

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSelectedLocation(state, action: PayloadAction<LocationResult>) {
      state.selectedLocation = action.payload
    },
    clearSearchResults(state) {
      state.searchResults = []
      state.searchStatus = 'idle'
      state.searchError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocations.pending, (state) => {
        state.searchStatus = 'loading'
        state.searchError = null
      })
      .addCase(searchLocations.fulfilled, (state, action) => {
        state.searchStatus = 'succeeded'
        state.searchResults = action.payload
      })
      .addCase(searchLocations.rejected, (state, action) => {
        state.searchStatus = 'failed'
        state.searchError = action.error.message ?? 'Search failed'
        state.searchResults = []
      })
      .addCase(fetchDefaultLocationName.fulfilled, (state, action) => {
        state.defaultLocationName = action.payload
      })
  },
})

export const { setSelectedLocation, clearSearchResults } = locationSlice.actions
export default locationSlice.reducer
