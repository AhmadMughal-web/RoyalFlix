// Profile.jsx
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiLogOut } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import './Profile.css'

export default function Profile() {
  const { user, logout } = useAuth()
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user?.name?.[0]?.toUpperCase()}</span>}
        </div>
        <h1 className="profile-name">{user?.name}</h1>
        <p className="profile-email"><FiMail /> {user?.email}</p>
        <div className="profile-badges">
          <span className="profile-badge">{user?.role === 'admin' ? '👑 Admin' : '🎬 Member'}</span>
          <span className="profile-badge free">Free Plan</span>
        </div>
        <div className="profile-actions">
          <Link to="/watchlist" className="btn-primary" style={{textDecoration:'none'}}>My Watchlist</Link>
          <button className="btn-secondary" onClick={logout}><FiLogOut /> Logout</button>
        </div>
        <div className="upgrade-box">
          <h3>Upgrade to Premium</h3>
          <p>Get HD streaming, downloads & ad-free experience</p>
          <button className="upgrade-btn">Upgrade Now →</button>
        </div>
      </div>
    </div>
  )
}
