import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  getCurrentWeather,
  getForecast,
  type WeatherResult,
  type ForecastDay,
} from '../../services/api'

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

interface WeatherState {
  current: {
    data: WeatherResult | null
    status: RequestStatus
    error: string | null
  }
  forecast: {
    days: ForecastDay[]
    status: RequestStatus
    error: string | null
  }
}

const initialState: WeatherState = {
  current: { data: null, status: 'idle', error: null },
  forecast: { days: [], status: 'idle', error: null },
}

// Async thunks - reuse the existing API service layer, no duplicate fetch logic
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    return await getCurrentWeather(lat, lon)
  }
)

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    return await getForecast(lat, lon)
  }
)

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.current.status = 'loading'
        state.current.error = null
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.current.status = 'succeeded'
        state.current.data = action.payload
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.current.status = 'failed'
        state.current.error = action.error.message ?? 'Failed to load weather'
      })
      .addCase(fetchForecast.pending, (state) => {
        state.forecast.status = 'loading'
        state.forecast.error = null
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecast.status = 'succeeded'
        state.forecast.days = action.payload.days
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.forecast.status = 'failed'
        state.forecast.error = action.error.message ?? 'Failed to load forecast'
      })
  },
})

export default weatherSlice.reducer
