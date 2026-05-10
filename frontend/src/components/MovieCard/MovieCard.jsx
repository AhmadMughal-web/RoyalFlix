import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlay, FiPlus, FiCheck, FiStar } from 'react-icons/fi'
import { getPoster } from '../../services/tmdb'
import { useAuth } from '../../context/AuthContext'
import './MovieCard.css'

export default function MovieCard({ item, rank }) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()
  const { isLoggedIn, addToWatchlist } = useAuth()

  if (!item) return null

  const isMovie = item.title !== undefined
  const title = item.title || item.name
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const rating = item.vote_average?.toFixed(1)
  const mediaType = isMovie ? 'movie' : 'tv'
  const poster = getPoster(item.poster_path)
  const isHindi = item.original_language === 'hi'

  const handlePlay = (e) => {
    e.stopPropagation()
    navigate(`/player/${mediaType}/${item.id}`)
  }

  const handleAdd = async (e) => {
    e.stopPropagation()
    if (!isLoggedIn) { navigate('/login'); return }
    await addToWatchlist(item.id, mediaType, title, item.poster_path)
    setAdded(true)
  }

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/${mediaType}/${item.id}`)}
    >
      {/* Poster */}
      <div className="card-poster">
        {item.poster_path ? (
          <img src={poster} alt={title} loading="lazy" />
        ) : (
          <div className="card-no-poster">
            <span>🎬</span>
            <small>{title}</small>
          </div>
        )}
      </div>

      {/* Rank number */}
      {rank && <div className="card-rank">{rank}</div>}

      {/* Badges */}
      <div className="card-badges">
        {isHindi && <span className="badge badge-hindi">HI</span>}
        <span className="badge badge-english">EN</span>
        {item.vote_average >= 8 && <span className="badge badge-top">TOP</span>}
      </div>

      {/* Hover overlay */}
      <div className={`card-overlay ${hovered ? 'visible' : ''}`}>
        <button className="card-play-btn" onClick={handlePlay}>
          <FiPlay fill="currentColor" />
        </button>
        <div className="card-info">
          <div className="card-title">{title}</div>
          <div className="card-meta">
            <span className="card-rating"><FiStar size={11} /> {rating}</span>
            <span className="card-year">{year}</span>
          </div>
        </div>
        <button className="card-add-btn" onClick={handleAdd}>
          {added ? <FiCheck /> : <FiPlus />}
        </button>
      </div>
    </div>
  )
}
