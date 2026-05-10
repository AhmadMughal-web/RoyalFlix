import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getPoster } from '../services/tmdb'
import { FiTrash2, FiPlay } from 'react-icons/fi'
import axios from 'axios'
import './Watchlist.css'

export default function Watchlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()
  const API = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return }
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get(`${API}/user/watchlist`)
      setItems(res.data.watchlist || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (mediaId) => {
    try {
      await axios.delete(`${API}/user/watchlist/${mediaId}`)
      setItems(prev => prev.filter(i => i.mediaId !== mediaId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="watchlist-page">
      <div className="watchlist-header">
        <h1>My <span className="cyan">List</span></h1>
        <p>{items.length} titles saved</p>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : items.length === 0 ? (
        <div className="watchlist-empty">
          <span>🎬</span>
          <p>Your watchlist is empty</p>
          <small>Add movies and shows to watch later</small>
        </div>
      ) : (
        <div className="watchlist-grid">
          {items.map(item => (
            <div key={item.mediaId} className="wl-card">
              <img
                src={item.poster_path
                  ? getPoster(item.poster_path)
                  : '/placeholder.jpg'}
                alt={item.title}
                onError={e => e.target.src = 'https://via.placeholder.com/200x300/0d1520/00e5ff?text=No+Image'}
              />
              <div className="wl-overlay">
                <button
                  className="wl-play"
                  onClick={() => navigate(`/player/${item.mediaType}/${item.mediaId}`)}
                >
                  <FiPlay fill="currentColor" />
                </button>
                <div className="wl-title">{item.title}</div>
                <button
                  className="wl-remove"
                  onClick={() => handleRemove(item.mediaId)}
                >
                  <FiTrash2 /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}