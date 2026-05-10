import express from 'express'
import {
  getWatchlist, addToWatchlist, removeFromWatchlist,
  getHistory, addToHistory, clearHistory,
  updateProfile, changePassword
} from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// All routes protected
router.use(protect)

// Watchlist
router.get('/watchlist', getWatchlist)
router.post('/watchlist', addToWatchlist)
router.delete('/watchlist/:mediaId', removeFromWatchlist)

// History
router.get('/history', getHistory)
router.post('/history', addToHistory)
router.delete('/history', clearHistory)

// Profile
router.put('/profile', updateProfile)
router.put('/password', changePassword)

export default router
