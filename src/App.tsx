import { Routes, Route } from 'react-router-dom'
import CurrentWeather from './components/WeatherApp/CurrentWeather'
import MyLocations from './components/WeatherApp/MyLocations'
import Forecast from './components/WeatherApp/Forecast'
import BottomNav from './components/WeatherApp/BottomNav'
import SearchBar from './components/WeatherApp/SearchBar'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import UserBar from './components/Auth/UserBar'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function WeatherHome() {
  return (
    <div className="weather-app">
      <main className="weather-content">
        <UserBar />
        <SearchBar />
        <CurrentWeather />
        <MyLocations />
        <Forecast />
      </main>
      <BottomNav />
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WeatherHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
