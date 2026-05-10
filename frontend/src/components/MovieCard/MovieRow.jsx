import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import MovieCard from '../MovieCard/MovieCard'
import './MovieRow.css'

export default function MovieRow({ title, items = [], linkTo, showRank = false }) {
  const rowRef = useRef()

  const scroll = (dir) => {
    const el = rowRef.current
    if (!el) return
    el.scrollBy({ left: dir * 700, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <div className="movie-row-section">
      <div className="row-header">
        <div className="row-title">
          {title}
          <span className="row-accent" />
        </div>
        {linkTo && <Link to={linkTo} className="row-see-all">See All →</Link>}
      </div>

      <div className="row-wrapper">
        <button className="scroll-btn left" onClick={() => scroll(-1)}>
          <FiChevronLeft />
        </button>
        <div className="cards-scroller" ref={rowRef}>
          {items.map((item, i) => (
            <div key={item.id} className="card-wrapper">
              <MovieCard item={item} rank={showRank ? i + 1 : null} />
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll(1)}>
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}
