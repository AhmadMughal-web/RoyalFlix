# RoyalFlix Frontend

## Tech Stack
- React 18 + Vite
- React Router DOM v6
- Axios (API calls)
- TMDb API (movie data)
- Google OAuth (@react-oauth/google)
- React Hot Toast (notifications)
- React Icons

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
```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
VITE_BACKEND_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Run Development Server
```bash
npm run dev
```
App runs on: http://localhost:3000

### 4. Build for Production
```bash
npm run build
```

---

## Project Structure
```
src/
├── components/
│   ├── Navbar/          # Navbar + dropdowns + mobile menu
│   ├── Hero/            # Auto-sliding hero section
│   ├── MovieCard/       # Movie card + scrollable row
│   └── Footer/          # Footer component
├── pages/
│   ├── Home.jsx         # Homepage with all rows
│   ├── Movies.jsx       # Movies browse page
│   ├── TVShows.jsx      # TV Shows page
│   ├── Anime.jsx        # Anime page
│   ├── MovieDetail.jsx  # Movie detail + trailer
│   ├── TVDetail.jsx     # TV show detail + seasons
│   ├── Player.jsx       # Video player page
│   ├── Search.jsx       # Search page
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Register page
│   ├── Profile.jsx      # User profile
│   └── Watchlist.jsx    # User watchlist
├── context/
│   └── AuthContext.jsx  # Auth state management
├── services/
│   └── tmdb.js          # TMDb API service
└── index.css            # Global styles (Black + Cyan theme)
```

## Features
- ✅ Black & Cyan premium theme
- ✅ Responsive (Mobile + Desktop)
- ✅ Auto-sliding hero with real movie backdrops
- ✅ Movies / TV Shows / Anime sections
- ✅ Genre-based browsing (Action, Romance, Comedy, etc.)
- ✅ Hindi + English audio badges
- ✅ Trailer player (YouTube embed)
- ✅ Video player (vidsrc.to embed)
- ✅ Login / Register / Google OAuth
- ✅ Watchlist (add/remove)
- ✅ Search with filters
- ✅ Movie detail pages with cast
- ✅ TV Show seasons & episodes

## Getting TMDb API Key (Free)
1. Go to https://www.themoviedb.org
2. Create free account
3. Settings → API → Request API Key (free)
4. Copy key to .env as VITE_TMDB_API_KEY
