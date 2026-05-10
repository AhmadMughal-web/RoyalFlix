import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlay, FiInfo, FiPlus, FiCheck } from 'react-icons/fi'
import { getBackdrop } from '../../services/tmdb'
import { useAuth } from '../../context/AuthContext'
import './Hero.css'

export default function Hero({ items = [] }) {
  const [current, setCurrent] = useState(0)
  const [inWatchlist, setInWatchlist] = useState(false)
  const navigate = useNavigate()
  const { isLoggedIn, addToWatchlist } = useAuth()

  useEffect(() => {
    if (!items.length) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % Math.min(items.length, 5))
    }, 6000)
    return () => clearInterval(timer)
  }, [items])

  if (!items.length) return <div className="hero-skeleton" />

  const item = items[current]
  const isMovie = item.title !== undefined
  const title = item.title || item.name
  const overview = item.overview?.slice(0, 160) + (item.overview?.length > 160 ? '...' : '')
  const rating = item.vote_average?.toFixed(1)
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const backdrop = getBackdrop(item.backdrop_path)
  const mediaType = isMovie ? 'movie' : 'tv'

  const handleWatchlist = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    await addToWatchlist(item.id, mediaType, title, item.poster_path)
    setInWatchlist(true)
  }

  return (
    <div className="hero">
      {/* Backgrounds */}
      <div className="hero-slides">
        {items.slice(0, 5).map((m, i) => (
          <div
            key={m.id}
            className={`hero-slide ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `url(${getBackdrop(m.backdrop_path)})` }}
          />
        ))}
      </div>
      <div className="hero-overlay" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-badge">
          <span className="blink" /> Now Trending
        </div>

        <h1 className="hero-title">{title}</h1>

        <div className="hero-meta">
          <span className="hero-rating">⭐ {rating}</span>
          <span className="hero-dot" />
          <span className="hero-year">{year}</span>
          <span className="hero-dot" />
          <span className="hero-type">{isMovie ? 'Movie' : 'TV Show'}</span>
          <span className="dub-pill hindi">🇮🇳 Hindi</span>
          <span className="dub-pill english">🇺🇸 English</span>
        </div>

        <p className="hero-desc">{overview}</p>

        <div className="hero-actions">
          <button className="btn-play" onClick={() => navigate(`/player/${mediaType}/${item.id}`)}>
            <FiPlay fill="currentColor" /> Play Now
          </button>
          <button className="btn-info" onClick={() => navigate(`/${mediaType}/${item.id}`)}>
            <FiInfo /> More Info
          </button>
          <button className="btn-watchlist" onClick={handleWatchlist} title="Add to watchlist">
            {inWatchlist ? <FiCheck /> : <FiPlus />}
          </button>
        </div>
      </div>

      {/* Slide Dots */}
      <div className="hero-dots">
        {items.slice(0, 5).map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>

      {/* Slide Thumbs */}
      <div className="hero-thumbs">
        {items.slice(0, 5).map((m, i) => (
          <div
            key={m.id}
            className={`thumb ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
            style={{ backgroundImage: `url(${getBackdrop(m.backdrop_path, 'w300')})` }}
          />
        ))}
      </div>
    </div>
  )
}
