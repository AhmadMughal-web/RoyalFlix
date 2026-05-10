import axios from 'axios'

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
})

// IMAGE HELPERS
export const getPoster = (path, size = 'w500') =>
  path ? `${IMAGE_URL}/${size}${path}` : '/placeholder.jpg'

export const getBackdrop = (path, size = 'original') =>
  path ? `${IMAGE_URL}/${size}${path}` : '/backdrop-placeholder.jpg'

// MOVIES
export const getTrending = (type = 'all', window = 'week') =>
  tmdb.get(`/trending/${type}/${window}`)

export const getPopularMovies = (page = 1) =>
  tmdb.get('/movie/popular', { params: { page } })

export const getTopRatedMovies = (page = 1) =>
  tmdb.get('/movie/top_rated', { params: { page } })

export const getNowPlayingMovies = (page = 1) =>
  tmdb.get('/movie/now_playing', { params: { page } })

export const getUpcomingMovies = (page = 1) =>
  tmdb.get('/movie/upcoming', { params: { page } })

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'videos,credits,similar,recommendations' }
  })

export const getMovieVideos = (id) =>
  tmdb.get(`/movie/${id}/videos`)

// TV SHOWS
export const getPopularTV = (page = 1) =>
  tmdb.get('/tv/popular', { params: { page } })

export const getTopRatedTV = (page = 1) =>
  tmdb.get('/tv/top_rated', { params: { page } })

export const getTVDetails = (id) =>
  tmdb.get(`/tv/${id}`, {
    params: { append_to_response: 'videos,credits,similar,recommendations' }
  })

export const getTVSeason = (id, season) =>
  tmdb.get(`/tv/${id}/season/${season}`)

// ANIME (using keywords)
export const getAnime = (page = 1) =>
  tmdb.get('/discover/tv', {
    params: {
      with_keywords: '210024',
      with_original_language: 'ja',
      sort_by: 'popularity.desc',
      page,
    }
  })

// SEARCH
export const searchMulti = (query, page = 1) =>
  tmdb.get('/search/multi', { params: { query, page } })

export const searchMovies = (query, page = 1) =>
  tmdb.get('/search/movie', { params: { query, page } })

// GENRES
export const getMovieGenres = () => tmdb.get('/genre/movie/list')
export const getTVGenres = () => tmdb.get('/genre/tv/list')

// DISCOVER BY GENRE
export const discoverByGenre = (genreId, type = 'movie', page = 1, language = null) =>
  tmdb.get(`/discover/${type}`, {
    params: {
      ...(genreId && { with_genres: genreId }),
      ...(language && { with_original_language: language }),
      sort_by: 'popularity.desc',
      page,
    }
  })

// BOLLYWOOD (Hindi language movies)
export const getBollywood = (page = 1) =>
  tmdb.get('/discover/movie', {
    params: {
      with_original_language: 'hi',
      sort_by: 'popularity.desc',
      page,
    }
  })

export default tmdb
