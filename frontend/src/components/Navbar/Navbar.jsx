import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiSearch, FiUser, FiLogOut, FiBookmark, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import './Navbar.css'

const genres = [
  { label: 'Action', emoji: '💥' },
  { label: 'Romance', emoji: '💕' },
  { label: 'Comedy', emoji: '😂' },
  { label: 'Thriller', emoji: '😱' },
  { label: 'Sci-Fi', emoji: '🚀' },
  { label: 'Drama', emoji: '🎭' },
  { label: 'Horror', emoji: '👻' },
  { label: 'Family', emoji: '👨‍👩‍👧' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState(null)
  const { user, isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const searchRef = useRef()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo">Royal<span>Flix</span></Link>

      {/* Desktop Links */}
      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>

        {/* Movies Dropdown */}
        <li className="dropdown" onMouseEnter={() => setActiveDropdown('movies')} onMouseLeave={() => setActiveDropdown(null)}>
          <Link to="/movies" className={`dropdown-trigger ${location.pathname === '/movies' ? 'active' : ''}`}>
            Movies <FiChevronDown size={13} />
          </Link>
          {activeDropdown === 'movies' && (
            <div className="dropdown-menu">
              <div className="dub-section">
                <span className="dub-badge hindi">🇮🇳 Hindi Dubbed</span>
                <span className="dub-badge english">🇺🇸 English</span>
              </div>
              <div className="dropdown-divider" />
              <div className="dropdown-label">Genres</div>
              {genres.map(g => (
                <Link key={g.label} to={`/movies?genre=${g.label.toLowerCase()}`} className="dropdown-item">
                  <span>{g.emoji}</span> {g.label}
                </Link>
              ))}
              <div className="dropdown-divider" />
              <Link to="/movies" className="dropdown-item view-all">🎬 All Movies</Link>
            </div>
          )}
        </li>

        {/* TV Shows Dropdown */}
        <li className="dropdown" onMouseEnter={() => setActiveDropdown('tv')} onMouseLeave={() => setActiveDropdown(null)}>
          <Link to="/tv-shows" className={`dropdown-trigger ${location.pathname === '/tv-shows' ? 'active' : ''}`}>
            TV Shows <FiChevronDown size={13} />
          </Link>
          {activeDropdown === 'tv' && (
            <div className="dropdown-menu">
              <div className="dub-section">
                <span className="dub-badge hindi">🇮🇳 Hindi Dubbed</span>
                <span className="dub-badge english">🇺🇸 English</span>
              </div>
              <div className="dropdown-divider" />
              <Link to="/tv-shows?cat=hollywood" className="dropdown-item">📺 Hollywood Series</Link>
              <Link to="/tv-shows?cat=bollywood" className="dropdown-item">🎬 Bollywood Series</Link>
              <Link to="/tv-shows?cat=turkish" className="dropdown-item">🌍 Turkish Drama</Link>
              <Link to="/tv-shows?cat=kdrama" className="dropdown-item">🇰🇷 K-Drama</Link>
              <div className="dropdown-divider" />
              <Link to="/tv-shows" className="dropdown-item view-all">📺 All TV Shows</Link>
            </div>
          )}
        </li>

        {/* Anime Dropdown */}
        <li className="dropdown" onMouseEnter={() => setActiveDropdown('anime')} onMouseLeave={() => setActiveDropdown(null)}>
          <Link to="/anime" className={`dropdown-trigger ${location.pathname === '/anime' ? 'active' : ''}`}>
            Anime <FiChevronDown size={13} />
          </Link>
          {activeDropdown === 'anime' && (
            <div className="dropdown-menu">
              <div className="dub-section">
                <span className="dub-badge hindi">🇮🇳 Hindi Dubbed</span>
                <span className="dub-badge english">🇺🇸 English</span>
              </div>
              <div className="dropdown-divider" />
              <Link to="/anime?genre=action" className="dropdown-item">⚔️ Action / Shonen</Link>
              <Link to="/anime?genre=romance" className="dropdown-item">💖 Romance / Shoujo</Link>
              <Link to="/anime?genre=fantasy" className="dropdown-item">🔮 Fantasy / Isekai</Link>
              <Link to="/anime?genre=psychological" className="dropdown-item">🧠 Psychological</Link>
              <div className="dropdown-divider" />
              <Link to="/anime" className="dropdown-item view-all">✨ All Anime</Link>
            </div>
          )}
        </li>

        <li><Link to="/search" className={location.pathname === '/search' ? 'active' : ''}>New Releases</Link></li>
        {isLoggedIn && <li><Link to="/watchlist" className={location.pathname === '/watchlist' ? 'active' : ''}>My List</Link></li>}
      </ul>

      {/* Right side */}
      <div className="nav-right">
        {/* Search */}
        {searchOpen ? (
          <form className="search-form" onSubmit={handleSearch}>
            <input
              ref={searchRef}
              type="text"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="button" onClick={() => setSearchOpen(false)}><FiX /></button>
          </form>
        ) : (
          <button className="icon-btn" onClick={() => setSearchOpen(true)}><FiSearch /></button>
        )}

        {isLoggedIn ? (
          <div className="user-menu" onMouseEnter={() => setActiveDropdown('user')} onMouseLeave={() => setActiveDropdown(null)}>
            <div className="user-avatar">
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} />
                : <span>{user?.name?.[0]?.toUpperCase()}</span>
              }
            </div>
            {activeDropdown === 'user' && (
              <div className="dropdown-menu user-dropdown">
                <div className="user-info">
                  <strong>{user?.name}</strong>
                  <small>{user?.email}</small>
                </div>
                <div className="dropdown-divider" />
                <Link to="/profile" className="dropdown-item"><FiUser /> Profile</Link>
                <Link to="/watchlist" className="dropdown-item"><FiBookmark /> My Watchlist</Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout-btn" onClick={logout}><FiLogOut /> Logout</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn-signin">Sign In</Link>
            <Link to="/register" className="btn-register">Get Started</Link>
          </>
        )}

        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/movies">Movies</Link>
          <Link to="/tv-shows">TV Shows</Link>
          <Link to="/anime">Anime</Link>
          <Link to="/search">Search</Link>
          {isLoggedIn ? (
            <>
              <Link to="/watchlist">My List</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
