import User from '../models/User.model.js'

// @route   GET /api/user/watchlist
// @access  Private
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('watchlist')
    res.json({ watchlist: user.watchlist || [] })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get watchlist.' })
  }
}

// @route   POST /api/user/watchlist
// @access  Private
export const addToWatchlist = async (req, res) => {
  try {
    const { mediaId, mediaType, title, poster_path } = req.body

    if (!mediaId || !mediaType) {
      return res.status(400).json({ message: 'mediaId and mediaType required.' })
    }

    const user = await User.findById(req.user.id)

    const alreadyAdded = user.watchlist.some(item => item.mediaId === Number(mediaId))
    if (alreadyAdded) {
      return res.status(409).json({ message: 'Already in watchlist.' })
    }

    user.watchlist.unshift({ mediaId: Number(mediaId), mediaType, title, poster_path })
    await user.save()

    res.status(201).json({ message: 'Added to watchlist.', watchlist: user.watchlist })
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to watchlist.' })
  }
}

// @route   DELETE /api/user/watchlist/:mediaId
// @access  Private
export const removeFromWatchlist = async (req, res) => {
  try {
    const mediaId = Number(req.params.mediaId)
    const user = await User.findById(req.user.id)

    user.watchlist = user.watchlist.filter(item => item.mediaId !== mediaId)
    await user.save()

    res.json({ message: 'Removed from watchlist.', watchlist: user.watchlist })
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from watchlist.' })
  }
}

// @route   GET /api/user/history
// @access  Private
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('watchHistory')
    res.json({ history: user.watchHistory || [] })
  } catch (err) {
    res.status(500).json({ message: 'Failed to get watch history.' })
  }
}

// @route   POST /api/user/history
// @access  Private
export const addToHistory = async (req, res) => {
  try {
    const { mediaId, mediaType, title, poster_path, progress } = req.body

    const user = await User.findById(req.user.id)

    // Remove existing entry if present (to update it)
    user.watchHistory = user.watchHistory.filter(item => item.mediaId !== Number(mediaId))

    // Add to front
    user.watchHistory.unshift({
      mediaId: Number(mediaId), mediaType, title, poster_path,
      progress: progress || 0,
      watchedAt: new Date()
    })

    // Keep history max 50 items
    if (user.watchHistory.length > 50) user.watchHistory = user.watchHistory.slice(0, 50)

    await user.save()
    res.json({ message: 'History updated.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update history.' })
  }
}

// @route   DELETE /api/user/history
// @access  Private
export const clearHistory = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { watchHistory: [] })
    res.json({ message: 'Watch history cleared.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear history.' })
  }
}

// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body
    const updates = {}
    if (name) updates.name = name
    if (avatar) updates.avatar = avatar

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true })
    res.json({ message: 'Profile updated.', user })
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile.' })
  }
}

// @route   PUT /api/user/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both passwords required.' })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' })
    }

    const user = await User.findById(req.user.id).select('+password')
    if (!user.password) {
      return res.status(400).json({ message: 'Google accounts cannot change password here.' })
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' })
    }

    user.password = newPassword
    await user.save()
    res.json({ message: 'Password changed successfully.' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password.' })
  }
}
