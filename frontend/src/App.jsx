import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Anime from './pages/Anime'
import MovieDetail from './pages/MovieDetail'
import TVDetail from './pages/TVDetail'
import Search from './pages/Search'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Watchlist from './pages/Watchlist'
import Player from './pages/Player'

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return <div className="spinner" />
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  const location = useLocation()
  const isPlayer = location.pathname.startsWith('/player')

  return (
    <>
      {!isPlayer && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/anime" element={<Anime />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/tv/:id" element={<TVDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/player/:type/:id" element={
          <ProtectedRoute><Player /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/watchlist" element={
          <ProtectedRoute><Watchlist /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isPlayer && <Footer />}
    </>
  )
}