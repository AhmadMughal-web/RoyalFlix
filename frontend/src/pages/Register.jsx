import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import './Auth.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, googleLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password.length < 6) return
    setLoading(true)
    const res = await register(name, email, password)
    if (res.success) navigate('/')
    setLoading(false)
  }

  const handleGoogle = async (credentialResponse) => {
    const res = await googleLogin(credentialResponse.credential)
    if (res.success) navigate('/')
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <Link to="/" className="auth-logo">Royal<span>Flix</span></Link>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join RoyalFlix — it's free to start</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text" placeholder="Full name"
              value={name} onChange={e => setName(e.target.value)}
              required minLength={2}
            />
          </div>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)}
              required autoComplete="email"
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type={showPass ? 'text' : 'password'} placeholder="Password (min 6 chars)"
              value={password} onChange={e => setPassword(e.target.value)}
              required minLength={6}
            />
            <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>or sign up with</span></div>

        <div className="google-btn-wrapper">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => {}}
            theme="filled_black"
            shape="rectangular"
            size="large"
            width="100%"
          />
        </div>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
