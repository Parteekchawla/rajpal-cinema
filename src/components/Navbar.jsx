import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <a href="#" className="nav-logo">
        <div className="nav-logo-icon">RC</div>
        <div className="nav-logo-text">Rajpal <span>Cinema</span></div>
      </a>

      <div className="nav-links">
        <a href="#now-showing" className="active">Now Showing</a>
        <a href="#coming-soon">Coming Soon</a>
        <a href="#features">Experience</a>
        <a href="#contact">Contact</a>
      </div>

      <button className="nav-cta" onClick={() => document.getElementById('now-showing')?.scrollIntoView({ behavior: 'smooth' })}>
        Book Tickets
      </button>

      <button className="nav-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? '✕' : '☰'}
      </button>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'absolute', top: '72px', left: 0, right: 0,
            background: 'rgba(10,10,15,0.97)', backdropFilter: 'blur(20px)',
            padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px',
            borderBottom: '1px solid var(--border)'
          }}
        >
          <a href="#now-showing" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '1rem' }}>Now Showing</a>
          <a href="#coming-soon" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '1rem' }}>Coming Soon</a>
          <a href="#features" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '1rem' }}>Experience</a>
          <a href="#contact" onClick={() => setMobileOpen(false)} style={{ color: '#fff', fontSize: '1rem' }}>Contact</a>
        </motion.div>
      )}
    </motion.nav>
  );
}
