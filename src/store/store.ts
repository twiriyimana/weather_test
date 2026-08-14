import { configureStore } from '@reduxjs/toolkit'
import locationReducer from '../features/location/locationSlice'
import weatherReducer from '../features/weather/weatherSlice'
import myLocationsReducer from '../features/myLocations/myLocationsSlice'

export const store = configureStore({
  reducer: {
    location: locationReducer,
    weather: weatherReducer,
    myLocations: myLocationsReducer,
  },
})

// Infer types from the store itself so RootState/AppDispatch always stay in sync
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
