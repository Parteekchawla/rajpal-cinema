import { motion } from 'framer-motion';

export default function NowShowing({ films, onSelectFilm }) {
  return (
    <section id="now-showing" className="section">
      <div className="section-header">
        <motion.span className="section-label" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Now Showing
        </motion.span>
        <motion.h2 className="section-title" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          Currently Playing at Rajpal Cinema
        </motion.h2>
        <motion.p className="section-desc" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          Catch the biggest movies on the big screen. Book your seats now for today's shows.
        </motion.p>
      </div>

      <div className="movie-grid">
        {films.map((film, i) => (
          <motion.div
            key={film.id}
            className="movie-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            onClick={() => onSelectFilm(film)}
          >
            <div className="movie-card-poster">
              <img src={film.posterUrl} alt={film.title} referrerPolicy="no-referrer" />
              <span className="movie-card-badge">Now Showing</span>
              <span className="movie-card-rating">{film.rating}</span>
              <div className="movie-card-actions">
                <button>Book Now</button>
              </div>
            </div>
            <div className="movie-card-info">
              <h3>{film.title}</h3>
              <div className="movie-card-meta">
                <span>{film.genre}</span>
                <span>•</span>
                <span>{film.duration}</span>
                <span>•</span>
                <span>{film.language}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
