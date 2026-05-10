import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">Royal<span>Flix</span></div>
          <p>Stream movies, TV shows & anime in HD. English & Hindi audio available.</p>
          <div className="footer-socials">
            <a href="#" className="social-btn">📘</a>
            <a href="#" className="social-btn">🐦</a>
            <a href="#" className="social-btn">📸</a>
            <a href="#" className="social-btn">▶️</a>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Browse</h4>
            <Link to="/movies">Movies</Link>
            <Link to="/tv-shows">TV Shows</Link>
            <Link to="/anime">Anime</Link>
            <Link to="/search">Search</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/watchlist">My List</Link>
            <Link to="/profile">Profile</Link>
          </div>
          <div className="footer-col">
            <h4>Info</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 RoyalFlix. All rights reserved.</p>
        {/* <div className="footer-audio">
          <span className="audio-pill">English</span>
          <span className="audio-pill hindi">🇮🇳 Hindi</span>
        </div> */}
      </div>
    </footer>
  )
}
