import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NowShowing from './components/NowShowing';
import FilmModal from './components/FilmModal';
import Features from './components/Features';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { getNowShowing, getComingSoon, isDemoMode } from './services/vistaApi';

function App() {
  const [films, setFilms] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [now, soon] = await Promise.all([getNowShowing(), getComingSoon()]);
        setFilms(now);
        setComingSoon(soon);
      } catch (e) {
        console.error('Failed to load films:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <Hero films={films} onSelectFilm={setSelectedFilm} />
      
      {loading ? (
        <div className="loader"><div className="loader-spinner" /></div>
      ) : (
        <>
          <NowShowing films={films} onSelectFilm={setSelectedFilm} />
          {comingSoon.length > 0 && (
            <section id="coming-soon" className="section">
              <div className="section-header">
                <span className="section-label">Coming Soon</span>
                <h2 className="section-title">Releasing This Month</h2>
                <p className="section-desc">Stay ahead – explore the most awaited movies arriving at Rajpal Cinema soon.</p>
              </div>
              <div className="movie-grid">
                {comingSoon.map((film, i) => (
                  <motion.div
                    key={film.id}
                    className="movie-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    onClick={() => setSelectedFilm(film)}
                  >
                    <div className="movie-card-poster">
                      <img src={film.posterUrl} alt={film.title} referrerPolicy="no-referrer" />
                      <span className="movie-card-badge" style={{ background: 'var(--gold)', color: '#000' }}>Coming Soon</span>
                      <span className="movie-card-rating">{film.rating}</span>
                    </div>
                    <div className="movie-card-info">
                      <h3>{film.title}</h3>
                      <div className="movie-card-meta">
                        <span>{film.genre}</span>
                        <span>•</span>
                        <span>{film.language}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <Features />
      <Contact />
      <Footer />

      <AnimatePresence>
        {selectedFilm && (
          <FilmModal film={selectedFilm} onClose={() => setSelectedFilm(null)} />
        )}
      </AnimatePresence>

      {isDemoMode() && (
        <div className="demo-banner">
          🎬 Demo Mode — Connect your Vista API credentials via .env to enable live data
        </div>
      )}
    </div>
  );
}

export default App;
