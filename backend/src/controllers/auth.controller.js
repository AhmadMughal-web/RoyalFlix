import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.model.js'

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// Helper: generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      avatar: user.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return res.status(409).json({ message: 'Email already registered. Please login.' })
    }

    const user = await User.create({ name, email, password })
    const token = generateToken(user)

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
      }
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error during registration.' })
  }
}

// @route   POST /api/auth/login
// @desc    Login with email & password
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }
    if (!user.password) {
      return res.status(401).json({ message: 'This account uses Google sign-in. Please use Google.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    user.lastLogin = new Date()
    await user.save()

    const token = generateToken(user)
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error during login.' })
  }
}

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { token: googleToken } = req.body
    if (!googleToken) {
      return res.status(400).json({ message: 'Google token required.' })
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()

    const { sub: googleId, name, email, picture } = payload

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() })

    if (user) {
      // Update google info if needed
      if (!user.googleId) user.googleId = googleId
      if (picture && !user.avatar) user.avatar = picture
      user.lastLogin = new Date()
      await user.save()
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture || '',
        isVerified: true,
      })
    }

    const jwtToken = generateToken(user)
    res.json({
      message: 'Google login successful!',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        avatar: user.avatar,
      }
    })
  } catch (err) {
    console.error('Google auth error:', err)
    if (err.message?.includes('Invalid token')) {
      return res.status(401).json({ message: 'Invalid Google token.' })
    }
    res.status(500).json({ message: 'Google authentication failed.' })
  }
}

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: 'Server error.' })
  }
}
