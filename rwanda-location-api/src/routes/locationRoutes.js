import express from 'express'
import { searchLocations, reverseGeocode } from '../controllers/locationController.js'

const router = express.Router()

router.get('/search', searchLocations)
router.get('/reverse', reverseGeocode)

export default router
