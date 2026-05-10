import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import { searchMulti } from '../services/tmdb'
import MovieCard from '../components/MovieCard/MovieCard'
import './Search.css'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); doSearch(q, 1) }
  }, [searchParams])

  const doSearch = async (q, pg = 1) => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const res = await searchMulti(q, pg)
      const filtered = res.data.results.filter(r => r.media_type !== 'person' && r.poster_path)
      setResults(pg === 1 ? filtered : prev => [...prev, ...filtered])
      setTotalPages(res.data.total_pages)
      setPage(pg)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) { setSearchParams({ q: query }); doSearch(query, 1) }
  }

  return (
    <div className="search-page">
      <div className="search-hero">
        <h1>Search <span className="cyan">RoyalFlix</span></h1>
        <p>Find movies, TV shows & anime</p>
        <form className="search-bar" onSubmit={handleSubmit}>
          <FiSearch className="search-icon" />
          <input
            type="text" placeholder="Search for movies, TV shows, anime..."
            value={query} onChange={e => setQuery(e.target.value)} autoFocus
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="search-results-wrap">
        {results.length > 0 && (
          <div className="results-header">
            <h2>Results for "<span className="cyan">{searchParams.get('q')}</span>"</h2>
            <span className="results-count">{results.length}+ results</span>
          </div>
        )}
        {loading && page === 1 ? (
          <div className="spinner" />
        ) : results.length === 0 && searchParams.get('q') ? (
          <div className="no-results">
            <span>🔍</span>
            <p>No results found for "<strong>{searchParams.get('q')}</strong>"</p>
            <small>Try different keywords</small>
          </div>
        ) : (
          <>
            <div className="search-grid">
              {results.map(item => <MovieCard key={item.id} item={item} />)}
            </div>
            {page < totalPages && (
              <button className="load-more" onClick={() => doSearch(query, page + 1)} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
