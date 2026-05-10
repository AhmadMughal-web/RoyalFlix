// TVDetail.jsx — same as MovieDetail but for TV
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiPlay, FiPlus, FiCheck, FiStar } from 'react-icons/fi'
import { getTVDetails, getBackdrop, getPoster } from '../services/tmdb'
import MovieRow from '../components/MovieCard/MovieRow'
import { useAuth } from '../context/AuthContext'
import './Detail.css'

export default function TVDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, addToWatchlist } = useAuth()
  const [show, setShow] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inList, setInList] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [activeSeason, setActiveSeason] = useState(1)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    getTVDetails(id).then(res => {
      setShow(res.data)
      const trailer = res.data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
      setTrailerKey(trailer?.key || null)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="detail-loading"><div className="spinner" /></div>
  if (!show) return <div className="detail-loading"><p>Show not found</p></div>

  const year = show.first_air_date?.slice(0, 4)
  const similar = show.similar?.results || []
  const seasons = show.seasons?.filter(s => s.season_number > 0) || []

  return (
    <div className="detail-page">
      <div className="detail-backdrop" style={{ backgroundImage: `url(${getBackdrop(show.backdrop_path)})` }}>
        <div className="detail-backdrop-overlay" />
      </div>
      {showTrailer && trailerKey && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-inner" onClick={e => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} allow="autoplay; fullscreen" allowFullScreen title="Trailer" />
          </div>
        </div>
      )}
      <div className="detail-content">
        <div className="detail-main">
          <div className="detail-poster">
            <img src={getPoster(show.poster_path, 'w500')} alt={show.name} />
          </div>
          <div className="detail-info">
            <div className="detail-badges">
              <span className="badge badge-english">🇺🇸 English</span>
              <span className="badge badge-hindi">🇮🇳 Hindi Dubbed</span>
            </div>
            <h1 className="detail-title">{show.name}</h1>
            <div className="detail-meta">
              <span className="detail-rating"><FiStar /> {show.vote_average?.toFixed(1)}</span>
              <span className="detail-meta-item">📅 {year}</span>
              <span className="detail-meta-item">📺 {show.number_of_seasons} Season{show.number_of_seasons > 1 ? 's' : ''}</span>
              <span className="detail-meta-item">🎬 {show.number_of_episodes} Episodes</span>
            </div>
            <p className="detail-overview">{show.overview}</p>
            <div className="detail-actions">
              <button className="btn-primary" onClick={() => navigate(`/player/tv/${show.id}`)}>
                <FiPlay fill="currentColor" /> Watch Now
              </button>
              {trailerKey && (
                <button className="btn-secondary" onClick={() => setShowTrailer(true)}>▷ Trailer</button>
              )}
              <button className="btn-icon" onClick={async () => { if (!isLoggedIn) { navigate('/login'); return } await addToWatchlist(show.id, 'tv'); setInList(true) }}>
                {inList ? <FiCheck /> : <FiPlus />}
              </button>
            </div>
            <div className="detail-audio">
              <span className="audio-label">Audio:</span>
              <span className="audio-pill">🇺🇸 English</span>
              <span className="audio-pill hindi">🇮🇳 Hindi</span>
            </div>
            {/* Seasons */}
            {seasons.length > 0 && (
              <div className="seasons-section">
                <div className="seasons-tabs">
                  {seasons.map(s => (
                    <button
                      key={s.season_number}
                      className={`season-tab ${activeSeason === s.season_number ? 'active' : ''}`}
                      onClick={() => setActiveSeason(s.season_number)}
                    >S{s.season_number}</button>
                  ))}
                </div>
                <div className="season-info">
                  {seasons.find(s => s.season_number === activeSeason)?.episode_count || 0} Episodes
                </div>
              </div>
            )}
          </div>
        </div>
        {similar.length > 0 && (
          <div className="detail-similar">
            <MovieRow title="Similar Shows" items={similar} />
          </div>
        )}
      </div>
    </div>
  )
}
