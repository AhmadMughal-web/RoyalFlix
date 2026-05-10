import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import toast from 'react-hot-toast'

const AuthContext = createContext()
const API = import.meta.env.VITE_BACKEND_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('rf_token'))

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } else {
          logout()
        }
      } catch { logout() }
    }
    setLoading(false)
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password })
      const { token: newToken, user: userData } = res.data
      localStorage.setItem('rf_token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(userData)
      toast.success(`Welcome back, ${userData.name}!`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await axios.post(`${API}/auth/register`, { name, email, password })
      const { token: newToken, user: userData } = res.data
      localStorage.setItem('rf_token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(userData)
      toast.success(`Welcome to RoyalFlix, ${userData.name}!`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const googleLogin = async (googleToken) => {
    try {
      const res = await axios.post(`${API}/auth/google`, { token: googleToken })
      const { token: newToken, user: userData } = res.data
      localStorage.setItem('rf_token', newToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      setToken(newToken)
      setUser(userData)
      toast.success(`Welcome, ${userData.name}!`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Google login failed'
      toast.error(msg)
      return { success: false, message: msg }
    }
  }

  const logout = () => {
    localStorage.removeItem('rf_token')
    delete axios.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
  }

  const addToWatchlist = async (mediaId, mediaType, title, poster_path) => {
    try {
      await axios.post(`${API}/user/watchlist`, { mediaId, mediaType, title, poster_path })
      toast.success('Added to watchlist')
    } catch { toast.error('Failed to update watchlist') }
  }

  const removeFromWatchlist = async (mediaId) => {
    try {
      await axios.delete(`${API}/user/watchlist/${mediaId}`)
      toast.success('Removed from watchlist')
    } catch { toast.error('Failed to update watchlist') }
  }

  return (
    <AuthContext.Provider value={{
      user, loading, token,
      login, register, googleLogin, logout,
      addToWatchlist, removeFromWatchlist,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
