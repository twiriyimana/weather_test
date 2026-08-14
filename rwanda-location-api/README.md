# Rwanda Location & Weather API

A complete REST API for searching Rwanda locations and retrieving current weather and forecasts.

## Features

- Rwanda location search with administrative hierarchy
- Reverse geocoding
- Current weather by coordinates
- 5-7 day forecast
- Caching
- Rate limiting
- Input validation
- CORS support
- Fallback mock weather data when API key is not configured

## Requirements

- Node.js >= 18
- npm

## Installation

```bash
cd rwanda-location-api
npm install
```

## Environment Variables

Create a `.env` file in the `rwanda-location-api` directory:

```env
PORT=5000
DATABASE_URL=./database/rwanda_location.db
WEATHER_API_KEY=your_openweathermap_api_key
GEOCODING_API_KEY=your_geocoding_api_key
WEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
GEOCODING_BASE_URL=https://api.openweathermap.org/geo/1.0
CACHE_TTL_SECONDS=600
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Setup

```bash
npm run init-db
```

## Run the API

```bash
npm run dev
```

Server runs at `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/locations/search?q=Kigali` | Search Rwanda locations |
| GET | `/api/locations/reverse?lat=-1.9441&lon=30.0619` | Reverse geocoding |
| GET | `/api/weather/current?lat=-1.9441&lon=30.0619` | Current weather |
| GET | `/api/weather/forecast?lat=-1.9441&lon=30.0619` | 5-7 day forecast |

## Example Requests

```bash
curl http://localhost:5000/api/health
curl "http://localhost:5000/api/locations/search?q=Kigali"
curl "http://localhost:5000/api/locations/reverse?lat=-1.9441&lon=30.0619"
curl "http://localhost:5000/api/weather/current?lat=-1.9441&lon=30.0619"
curl "http://localhost:5000/api/weather/forecast?lat=-1.9441&lon=30.0619"
```

## Example Responses

### Location Search

```json
{
  "success": true,
  "query": "Kigali",
  "results": [
    {
      "name": "Kigali",
      "country": "Rwanda",
      "countryCode": "RW",
      "province": "Kigali City",
      "district": "Gasabo",
      "sector": "Remera",
      "cell": "Kabeza",
      "latitude": -1.9441,
      "longitude": 30.0619,
      "temperatureUnit": "C"
    }
  ]
}
```

### Current Weather

```json
{
  "success": true,
  "result": {
    "latitude": -1.9441,
    "longitude": 30.0619,
    "temperature": 24,
    "temperatureUnit": "C",
    "weather": "Partly Cloudy",
    "humidity": 70,
    "windSpeed": 12
  }
}
```

### Forecast

```json
{
  "success": true,
  "result": {
    "latitude": -1.9441,
    "longitude": 30.0619,
    "days": [
      {
        "date": "2026-08-12",
        "temperature": 24,
        "temperatureUnit": "C",
        "weather": "Sunny",
        "humidity": 65,
        "windSpeed": 10
      }
    ]
  }
}
```

### Not Found

```json
{
  "success": false,
  "message": "Location not found in Rwanda"
}
```

## Connect with React

```javascript
// Example with fetch
const response = await fetch('http://localhost:5000/api/locations/search?q=Kigali')
const data = await response.json()

// Example with axios
import axios from 'axios'
const { data } = await axios.get('http://localhost:5000/api/locations/search?q=Kigali')
```

## Notes

- Always provide API keys via `.env`.
- The API prioritizes locations within Rwanda.
- Weather is returned in Celsius.
- Without a valid `WEATHER_API_KEY`, the API returns realistic mock weather data.
- The SQLite database is stored in `database/rwanda_location.db`.
