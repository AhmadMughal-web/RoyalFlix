import express from 'express'
import { getTrending, getPopular, getMovieById, searchMovies } from '../controllers/movie.controller.js'

const router = express.Router()

router.get('/trending', getTrending)
router.get('/popular', getPopular)
router.get('/search', searchMovies)
router.get('/:id', getMovieById)

export default router
