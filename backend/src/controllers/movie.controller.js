import fetch from 'node:http'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_KEY = process.env.TMDB_API_KEY

const tmdbFetch = async (path, params = {}) => {
  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set('api_key', TMDB_KEY)
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDb error: ${res.status}`)
  return res.json()
}

// @route   GET /api/movies/trending
export const getTrending = async (req, res) => {
  try {
    const { type = 'all', window = 'week' } = req.query
    const data = await tmdbFetch(`/trending/${type}/${window}`)
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending.' })
  }
}

// @route   GET /api/movies/popular
export const getPopular = async (req, res) => {
  try {
    const { page = 1 } = req.query
    const data = await tmdbFetch('/movie/popular', { page })
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch popular movies.' })
  }
}

// @route   GET /api/movies/:id
export const getMovieById = async (req, res) => {
  try {
    const data = await tmdbFetch(`/movie/${req.params.id}`, {
      append_to_response: 'videos,credits,similar,recommendations'
    })
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch movie.' })
  }
}

// @route   GET /api/movies/search
export const searchMovies = async (req, res) => {
  try {
    const { q, page = 1 } = req.query
    if (!q) return res.status(400).json({ message: 'Query required.' })
    const data = await tmdbFetch('/search/multi', { query: q, page })
    res.json(data)
  } catch (err) {
    res.status(500).json({ message: 'Search failed.' })
  }
}
