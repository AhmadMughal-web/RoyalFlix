# RoyalFlix Backend API

## Tech Stack
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Google OAuth 2.0
- TMDb API Proxy

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Fill in your `.env` file:
- `MONGO_URI` — MongoDB connection string (local or Atlas)
- `JWT_SECRET` — any long random string
- `GOOGLE_CLIENT_ID` — from Google Cloud Console
- `TMDB_API_KEY` — from https://www.themoviedb.org/settings/api

### 3. Run Development Server
```bash
npm run dev
```
Server runs on: http://localhost:5000

### 4. Health Check
Visit: http://localhost:5000/api/health

---

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login with email/password |
| POST | /api/auth/google | Google OAuth login |
| GET | /api/auth/me | Get current user (protected) |

### User (all protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/user/watchlist | Get watchlist |
| POST | /api/user/watchlist | Add to watchlist |
| DELETE | /api/user/watchlist/:id | Remove from watchlist |
| GET | /api/user/history | Get watch history |
| POST | /api/user/history | Add to history |
| DELETE | /api/user/history | Clear history |
| PUT | /api/user/profile | Update profile |
| PUT | /api/user/password | Change password |

### Movies
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/movies/trending | Trending content |
| GET | /api/movies/popular | Popular movies |
| GET | /api/movies/search?q= | Search |
| GET | /api/movies/:id | Movie details |

---

## Getting TMDb API Key (Free)
1. Go to https://www.themoviedb.org
2. Create free account
3. Settings → API → Request API Key
4. Copy the key to your .env

## Getting Google OAuth Client ID
1. Go to https://console.cloud.google.com
2. Create a new project
3. APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Add http://localhost:3000 to authorized origins
