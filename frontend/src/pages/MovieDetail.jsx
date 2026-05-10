import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiPlay, FiPlus, FiCheck, FiStar, FiClock, FiCalendar } from 'react-icons/fi'
import { getMovieDetails, getBackdrop, getPoster } from '../services/tmdb'
import MovieRow from '../components/MovieCard/MovieRow'
import { useAuth } from '../context/AuthContext'
import './Detail.css'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, addToWatchlist } = useAuth()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [inList, setInList] = useState(false)
  const [trailerKey, setTrailerKey] = useState(null)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    getMovieDetails(id).then(res => {
      setMovie(res.data)
      const trailer = res.data.videos?.results?.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
      )
      setTrailerKey(trailer?.key || null)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="detail-loading"><div className="spinner" /></div>
  if (!movie) return <div className="detail-loading"><p>Movie not found</p></div>

  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A'
  const year = movie.release_date?.slice(0, 4)
  const genres = movie.genres?.map(g => g.name).join(' · ')
  const cast = movie.credits?.cast?.slice(0, 8) || []
  const similar = movie.similar?.results || []
  const isHindi = movie.original_language === 'hi'

  const handleWatchlist = async () => {
    if (!isLoggedIn) { navigate('/login'); return }
    await addToWatchlist(movie.id, 'movie')
    setInList(true)
  }

  return (
    <div className="detail-page">
      {/* Backdrop */}
      <div className="detail-backdrop" style={{ backgroundImage: `url(${getBackdrop(movie.backdrop_path)})` }}>
        <div className="detail-backdrop-overlay" />
      </div>

      {/* Trailer Modal */}
      {showTrailer && trailerKey && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-inner" onClick={e => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              allow="autoplay; fullscreen"
              allowFullScreen title="Trailer"
            />
          </div>
        </div>
      )}

      <div className="detail-content">
        <div className="detail-main">
          {/* Poster */}
          <div className="detail-poster">
            <img src={getPoster(movie.poster_path, 'w500')} alt={movie.title} />
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-badges">
              {isHindi && <span className="badge badge-hindi">🇮🇳 Hindi Dubbed</span>}
              <span className="badge badge-english">🇺🇸 English</span>
              {movie.adult && <span className="badge badge-top">18+</span>}
            </div>

            <h1 className="detail-title">{movie.title}</h1>
            {movie.tagline && <p className="detail-tagline">"{movie.tagline}"</p>}

            <div className="detail-meta">
              <span className="detail-rating"><FiStar /> {movie.vote_average?.toFixed(1)}</span>
              <span className="detail-meta-item"><FiCalendar /> {year}</span>
              <span className="detail-meta-item"><FiClock /> {runtime}</span>
              <span className="detail-meta-item">📽 {genres}</span>
            </div>

            <p className="detail-overview">{movie.overview}</p>

            <div className="detail-actions">
              <button className="btn-primary" onClick={() => navigate(`/player/movie/${movie.id}`)}>
                <FiPlay fill="currentColor" /> Watch Now
              </button>
              {trailerKey && (
                <button className="btn-secondary" onClick={() => setShowTrailer(true)}>
                  ▷ Watch Trailer
                </button>
              )}
              <button className="btn-icon" onClick={handleWatchlist} title="Add to watchlist">
                {inList ? <FiCheck /> : <FiPlus />}
              </button>
            </div>

            {/* Audio Options */}
            <div className="detail-audio">
              <span className="audio-label">Available Audio:</span>
              <span className="audio-pill">🇺🇸 English</span>
              <span className="audio-pill hindi">🇮🇳 Hindi</span>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="detail-cast">
                <div className="cast-label">Cast</div>
                <div className="cast-list">
                  {cast.map(person => (
                    <div key={person.id} className="cast-item">
                      <div className="cast-photo">
                        {person.profile_path
                          ? <img src={`https://image.tmdb.org/t/p/w185${person.profile_path}`} alt={person.name} />
                          : <span>👤</span>
                        }
                      </div>
                      <div className="cast-name">{person.name}</div>
                      <div className="cast-char">{person.character}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="detail-similar">
            <MovieRow title="Similar Movies" items={similar} />
          </div>
        )}
      </div>
    </div>
  )
}
