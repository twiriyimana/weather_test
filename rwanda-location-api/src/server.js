import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import locationRoutes from './routes/locationRoutes.js'
import weatherRoutes from './routes/weatherRoutes.js'
import { errorHandler } from './middleware/errorMiddleware.js'
import { connectDatabase } from './config/database.js'

const app = express()

app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

app.use('/api/locations', locationRoutes)
app.use('/api/weather', weatherRoutes)

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rwanda Location & Weather API is healthy',
    timestamp: new Date().toISOString(),
  })
})

app.use(errorHandler)

const start = async () => {
  await connectDatabase()
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
