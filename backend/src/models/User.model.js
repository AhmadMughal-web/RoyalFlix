import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const watchlistItemSchema = new mongoose.Schema({
  mediaId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], required: true },
  title: { type: String },
  poster_path: { type: String },
  addedAt: { type: Date, default: Date.now }
}, { _id: false })

const watchHistorySchema = new mongoose.Schema({
  mediaId: { type: Number, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'] },
  title: { type: String },
  poster_path: { type: String },
  progress: { type: Number, default: 0 }, // in seconds
  watchedAt: { type: Date, default: Date.now }
}, { _id: false })

const userSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true, minlength: 2, maxlength: 50
  },
  email: {
    type: String, required: true, unique: true,
    lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: 6,
    select: false // never return password in queries
  },
  avatar: { type: String, default: '' },
  googleId: { type: String, default: null },
  role: {
    type: String, enum: ['user', 'admin'], default: 'user'
  },
  plan: {
    type: String, enum: ['free', 'premium'], default: 'free'
  },
  watchlist: [watchlistItemSchema],
  watchHistory: [watchHistorySchema],
  isVerified: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  delete obj.googleId
  delete obj.__v
  return obj
}

const User = mongoose.model('User', userSchema)
export default User
