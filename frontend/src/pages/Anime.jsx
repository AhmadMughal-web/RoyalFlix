import { useState, useEffect } from 'react'
import { discoverByGenre } from '../services/tmdb'
import MovieCard from '../components/MovieCard/MovieCard'
import './Browse.css'

const GENRES = [
  { label: 'All', id: null },
  { label: '⚔️ Action', id: 10759 },
  { label: '💖 Romance', id: 10749 },
  { label: '🔮 Fantasy', id: 10765 },
  { label: '😂 Comedy', id: 35 },
  { label: '🧠 Psychological', id: 9648 },
  { label: '👨‍👩‍👧 Family', id: 10751 },
]

export default function Anime() {
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setAnime([])
    setPage(1)
    fetchAnime(1, activeGenre)
  }, [activeGenre])

  const fetchAnime = async (pg, genreId) => {
    setLoading(true)
    try {
      const params = {
        with_original_language: 'ja',
        sort_by: 'popularity.desc',
        page: pg,
        ...(genreId && { with_genres: genreId }),
      }
      const { default: tmdb } = await import('../services/tmdb')
      const res = await tmdb.get('/discover/tv', { params })
      setAnime(prev => pg === 1 ? res.data.results : [...prev, ...res.data.results])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchAnime(next, activeGenre)
  }

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>⚔️ <span className="cyan">Anime</span></h1>

        <div className="browse-filters" style={{ marginTop: '10px' }}>
          {GENRES.map(g => (
            <button
              key={g.label}
              className={`filter-btn ${activeGenre === g.id ? 'active' : ''}`}
              onClick={() => setActiveGenre(g.id)}
            >{g.label}</button>
          ))}
        </div>
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          <div className="browse-grid">
            {anime.map(a => <MovieCard key={a.id} item={a} />)}
          </div>
          <button className="load-more" onClick={loadMore}>Load More</button>
        </>
      )}
    </div>
  )
}