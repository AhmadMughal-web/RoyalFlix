import { useState, useEffect } from 'react'
import { getPopularTV, getTopRatedTV, discoverByGenre } from '../services/tmdb'
import MovieCard from '../components/MovieCard/MovieCard'
import './Browse.css'

const GENRES = [
  { label: 'All', id: null },
  { label: 'Action', id: 10759 },
  { label: 'Comedy', id: 35 },
  { label: 'Drama', id: 18 },
  { label: 'Crime', id: 80 },
  { label: 'Sci-Fi', id: 10765 },
  { label: 'Reality', id: 10764 },
]

const CATEGORIES = [
  { label: 'Popular', key: 'popular' },
  { label: 'Top Rated', key: 'top' },
]

const ORIGINS = [
  { label: 'All', value: null },
  { label: '🇺🇸 Hollywood', value: 'en' },
  { label: '🇮🇳 Bollywood', value: 'hi' },
  { label: '🇹🇷 Turkish', value: 'tr' },
  { label: '🇰🇷 K-Drama', value: 'ko' },
]

export default function TVShows() {
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('popular')
  const [activeGenre, setActiveGenre] = useState(null)
  const [activeOrigin, setActiveOrigin] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setShows([])
    setPage(1)
    fetchShows(1, activeGenre, filter, activeOrigin)
  }, [filter, activeGenre, activeOrigin])

  const fetchShows = async (pg, genreId, sortKey, origin) => {
    setLoading(true)
    try {
      let res
      if (genreId || origin) {
        res = await discoverByGenre(genreId, 'tv', pg, origin)
      } else {
        const fn = sortKey === 'top' ? getTopRatedTV : getPopularTV
        res = await fn(pg)
      }
      setShows(prev => pg === 1 ? res.data.results : [...prev, ...res.data.results])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchShows(next, activeGenre, filter, activeOrigin)
  }

  const handleOrigin = (value) => {
    setActiveOrigin(value)
    setActiveGenre(null)
    setPage(1)
  }

  const handleGenre = (id) => {
    setActiveGenre(id)
    setPage(1)
  }

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>📺 <span className="cyan">TV Shows</span></h1>

        {/* Sort */}
        <div className="browse-filters">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`filter-btn ${filter === c.key && !activeGenre && !activeOrigin ? 'active' : ''}`}
              onClick={() => { setFilter(c.key); setActiveGenre(null); setActiveOrigin(null) }}
            >{c.label}</button>
          ))}
        </div>

        {/* Origin/Language */}
        <div className="browse-filters" style={{ marginTop: '10px' }}>
          {ORIGINS.map(o => (
            <button
              key={o.label}
              className={`filter-btn ${activeOrigin === o.value && !activeGenre ? 'active' : ''}`}
              onClick={() => handleOrigin(o.value)}
            >{o.label}</button>
          ))}
        </div>

        {/* Genres */}
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
            {shows.map(s => <MovieCard key={s.id} item={s} />)}
          </div>
          <button className="load-more" onClick={loadMore}>Load More</button>
        </>
      )}
    </div>
  )
}