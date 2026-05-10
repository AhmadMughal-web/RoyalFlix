import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getBollywood, discoverByGenre } from '../services/tmdb'
import MovieCard from '../components/MovieCard/MovieCard'
import './Browse.css'

const GENRES = [
  { label: 'All', id: null },
  { label: 'Action', id: 28 },
  { label: 'Romance', id: 10749 },
  { label: 'Comedy', id: 35 },
  { label: 'Horror', id: 27 },
  { label: 'Thriller', id: 53 },
  { label: 'Sci-Fi', id: 878 },
  { label: 'Drama', id: 18 },
  { label: 'Animation', id: 16 },
  { label: 'Family', id: 10751 },
  { label: 'Crime', id: 80 },
]

const SORTS = [
  { label: 'Popular', key: 'popular' },
  { label: 'Top Rated', key: 'top' },
  { label: 'New Releases', key: 'new' },
  { label: 'Bollywood', key: 'hindi' },
]

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [activeGenre, setActiveGenre] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const sort = searchParams.get('sort') || 'popular'

  useEffect(() => {
    setLoading(true)
    setMovies([])
    setPage(1)
    fetchMovies(1, activeGenre, sort)
  }, [sort, activeGenre])

  const fetchMovies = async (pg, genreId, sortKey) => {
    try {
      let res
      if (genreId) {
        res = await discoverByGenre(genreId, 'movie', pg)
      } else {
        const fetcher = sortKey === 'top' ? getTopRatedMovies
          : sortKey === 'new' ? getNowPlayingMovies
          : sortKey === 'hindi' ? getBollywood
          : getPopularMovies
        res = await fetcher(pg)
      }
      setMovies(prev => pg === 1 ? res.data.results : [...prev, ...res.data.results])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMovies(nextPage, activeGenre, sort)
  }

  const handleGenre = (genreId) => {
    setActiveGenre(genreId)
    setMovies([])
    setPage(1)
  }

  const handleSort = (key) => {
    setActiveGenre(null)
    setSearchParams({ sort: key })
  }

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>🎬 <span className="cyan">Movies</span></h1>

        {/* Sort Filters */}
        <div className="browse-filters">
          {SORTS.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${sort === f.key && !activeGenre ? 'active' : ''}`}
              onClick={() => handleSort(f.key)}
            >{f.label}</button>
          ))}
        </div>

        {/* Genre Filters */}
        <div className="browse-filters" style={{ marginTop: '10px' }}>
          {GENRES.map(g => (
            <button
              key={g.label}
              className={`filter-btn ${activeGenre === g.id ? 'active' : ''}`}
              onClick={() => handleGenre(g.id)}
            >{g.label}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          <div className="browse-grid">
            {movies.map(m => <MovieCard key={m.id} item={m} />)}
          </div>
          <button className="load-more" onClick={loadMore}>Load More</button>
        </>
      )}
    </div>
  )
}