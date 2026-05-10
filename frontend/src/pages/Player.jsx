import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiDownload } from 'react-icons/fi'
import { getMovieDetails, getTVDetails, getMovieVideos } from '../services/tmdb'
import './Player.css'

export default function Player() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [media, setMedia] = useState(null)
  const [trailerKey, setTrailerKey] = useState(null)
  const [audioLang, setAudioLang] = useState('en')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = type === 'movie'
          ? await getMovieDetails(id)
          : await getTVDetails(id)
        setMedia(res.data)
        const trailer = res.data.videos?.results?.find(
          v => v.type === 'Trailer' && v.site === 'YouTube'
        )
        setTrailerKey(trailer?.key)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMedia()
  }, [id, type])

  if (loading) return <div className="player-loading"><div className="spinner" /></div>
  if (!media) return <div className="player-loading"><p>Content not found</p></div>

  const title = media.title || media.name

  return (
    <div className="player-page">
      {/* Top bar */}
      <div className="player-topbar">
        <button className="player-back" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <div className="player-title">{title}</div>
        <div className="player-controls">
          <div className="audio-switcher">
            <span className="audio-label">Audio:</span>
            <button
              className={`audio-opt ${audioLang === 'en' ? 'active' : ''}`}
              onClick={() => setAudioLang('en')}
            >🇺🇸 English</button>
            <button
              className={`audio-opt ${audioLang === 'hi' ? 'active' : ''}`}
              onClick={() => setAudioLang('hi')}
            >🇮🇳 Hindi</button>
          </div>
          <button className="player-download" title="Download">
            <FiDownload /> Download
          </button>
        </div>
      </div>

      {/* Player */}
      <div className="player-frame-wrapper">
        {trailerKey ? (
          <iframe
            className="player-frame"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0&modestbranding=1`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          /* Embed via vidsrc (free movie streaming embed) */
          <iframe
            className="player-frame"
            src={`https://vidsrc.to/embed/${type}/${id}`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
            referrerPolicy="origin"
          />
        )}
      </div>

      {/* Download note */}
      <div className="player-note">
        <div className="player-note-inner">
          <span>📥</span>
          <p>
            To download this {type === 'movie' ? 'movie' : 'episode'}, use the download button above.
            Premium members get HD downloads. <strong style={{color:'var(--cyan)'}}>Upgrade to Premium →</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
