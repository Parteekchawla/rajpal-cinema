import { motion } from 'framer-motion';

export default function Hero({ films, onSelectFilm }) {
  const featured = films[0];

  return (
    <section className="hero">
      <div className="hero-bg">
        <div className="hero-particles" />
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            <span className="accent">Rajpal</span> Cinema
            <br />
            <span className="gold">Muktsar</span>
          </h1>
          <p className="hero-subtitle">
            Your premier movie destination in Sri Muktsar Sahib, Punjab.
            Experience cinema like never before with Dolby Atmos sound,
            luxurious recliners, and the latest blockbusters.
          </p>

          <div className="hero-badges">
            <span className="hero-badge">🎬 3 Screens</span>
            <span className="hero-badge">🔊 Dolby Atmos</span>
            <span className="hero-badge">🍿 F&B Lounge</span>
            <span className="hero-badge">♿ Accessible</span>
          </div>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => document.getElementById('now-showing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              🎟️ Book Tickets Now
            </button>
            <button
              className="btn-outline"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Experience
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-poster"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {featured && (
            <>
              <div className="hero-poster-glow" />
              <div
                className="hero-poster-card"
                onClick={() => onSelectFilm(featured)}
                style={{ cursor: 'pointer' }}
              >
                <img src={featured.posterUrl} alt={featured.title} referrerPolicy="no-referrer" />
                <div className="hero-poster-overlay">
                  <h3>{featured.title}</h3>
                  <p>{featured.genre} • {featured.duration}</p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
