import { useState, useEffect } from 'react'
import Hero from '../components/Hero/Hero'
import MovieRow from '../components/MovieCard/MovieRow'
import {
  getTrending, getTopRatedMovies, getNowPlayingMovies,
  getPopularTV, getBollywood, getAnime
} from '../services/tmdb'
import './Home.css'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [topRated, setTopRated] = useState([])
  const [tvShows, setTvShows] = useState([])
  const [bollywood, setBollywood] = useState([])
  const [anime, setAnime] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [t, np, tr, tv, bw, an] = await Promise.all([
          getTrending('all', 'week'),
          getNowPlayingMovies(),
          getTopRatedMovies(),
          getPopularTV(),
          getBollywood(),
          getAnime(),
        ])
        setTrending(t.data.results)
        setNowPlaying(np.data.results)
        setTopRated(tr.data.results)
        setTvShows(tv.data.results)
        setBollywood(bw.data.results)
        setAnime(an.data.results)
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return (
    <div className="home-loading">
      <div className="spinner" />
      <p>Loading RoyalFlix...</p>
    </div>
  )

  return (
    <div className="home fade-in">
      <Hero items={trending} />

      <div className="home-content">
        <MovieRow
          title="🔥 Trending Now"
          items={trending}
          linkTo="/movies?sort=trending"
        />
        <MovieRow
          title="🎬 New Releases"
          items={nowPlaying}
          linkTo="/movies?sort=new"
        />
        <MovieRow
          title="🏆 Top Rated"
          items={topRated}
          linkTo="/movies?sort=top"
          showRank={true}
        />
        <MovieRow
          title="📺 Popular TV Shows"
          items={tvShows}
          linkTo="/tv-shows"
        />
        <MovieRow
          title="🇮🇳 Bollywood Hits"
          items={bollywood}
          linkTo="/movies?lang=hindi"
        />
        <MovieRow
          title="⚔️ Anime"
          items={anime}
          linkTo="/anime"
        />
      </div>
    </div>
  )
}
