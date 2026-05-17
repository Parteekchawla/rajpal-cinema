import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getShowtimes, getSeatLayout, createOrder } from '../services/vistaApi';

export default function FilmModal({ film, onClose }) {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [seatLayout, setSeatLayout] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingResult, setBookingResult] = useState(null);
  const [step, setStep] = useState('info'); // info | seats | confirmed

  useEffect(() => {
    getShowtimes(film.id).then(data => {
      setShowtimes(data);
      if (data.length > 0) setSelectedDate(data[0].date);
    });
  }, [film.id]);

  const dates = [...new Set(showtimes.map(s => s.date))];
  const filteredShowtimes = showtimes.filter(s => s.date === selectedDate);

  const handleSelectShowtime = async (st) => {
    setSelectedShowtime(st);
    setSelectedSeats([]);
    const layout = await getSeatLayout(st.id);
    setSeatLayout(layout);
    setStep('seats');
  };

  const toggleSeat = (seat) => {
    if (seat.status !== 'available') return;
    setSelectedSeats(prev =>
      prev.find(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    );
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleConfirmBooking = async () => {
    const result = await createOrder({
      filmId: film.id,
      filmTitle: film.title,
      showtimeId: selectedShowtime.id,
      showtime: `${selectedShowtime.dayLabel} ${selectedShowtime.time}`,
      screen: selectedShowtime.screen,
      seats: selectedSeats.map(s => s.label),
      totalPrice,
    });
    setBookingResult(result);
    setStep('confirmed');
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-hero">
          <img src={film.backdropUrl || film.posterUrl} alt={film.title} referrerPolicy="no-referrer" />
          <div className="modal-hero-overlay">
            <div className="modal-hero-poster">
              <img src={film.posterUrl} alt={film.title} referrerPolicy="no-referrer" />
            </div>
            <div className="modal-hero-info">
              <h2>{film.title}</h2>
              <div className="meta">
                <span>{film.rating}</span>
                <span>{film.duration}</span>
                <span>{film.language}</span>
                <span>{film.genre}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {step === 'info' && (
            <>
              <h4>Synopsis</h4>
              <p>{film.synopsis}</p>

              <h4>Director</h4>
              <p>{film.director}</p>

              <h4>Cast</h4>
              <div className="modal-cast">
                {film.cast?.map((c, i) => <span key={i}>{c}</span>)}
              </div>

              <div className="showtimes-section">
                <h4>🎟️ Select Showtime</h4>
                <div className="showtime-dates">
                  {dates.map(date => {
                    const st = showtimes.find(s => s.date === date);
                    return (
                      <button
                        key={date}
                        className={`showtime-date-btn ${selectedDate === date ? 'active' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        {st?.dayLabel || date}
                      </button>
                    );
                  })}
                </div>

                <div className="showtime-list">
                  {filteredShowtimes.map(st => (
                    <div key={st.id} className="showtime-item">
                      <div className="showtime-info">
                        <span className="showtime-time">{st.time}</span>
                        <span className="showtime-screen">{st.screen}</span>
                        <span className="showtime-format">{st.format}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className="showtime-price">₹{st.price}</span>
                        <button className="showtime-book" onClick={() => handleSelectShowtime(st)}>
                          Select Seats
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 'seats' && seatLayout && (
            <div className="seat-selector">
              <button className="btn-outline" style={{ marginBottom: '20px', padding: '8px 20px', fontSize: '0.85rem' }} onClick={() => { setStep('info'); setSelectedSeats([]); }}>
                ← Back to Showtimes
              </button>

              <h4 style={{ marginBottom: '4px' }}>
                {selectedShowtime.dayLabel} • {selectedShowtime.time} • {selectedShowtime.screen}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Tap seats to select them
              </p>

              <div className="seat-screen">
                <div className="seat-screen-bar" />
                <span>Screen This Way</span>
              </div>

              <div className="seat-grid">
                {seatLayout.rows.map(row => (
                  <div key={row.row} className="seat-row">
                    <span className="seat-row-label">{row.row}</span>
                    {row.seats.map(seat => (
                      <button
                        key={seat.id}
                        className={`seat ${seat.status} ${selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''} ${seat.isAisle ? 'aisle' : ''}`}
                        onClick={() => toggleSeat(seat)}
                        disabled={seat.status !== 'available'}
                        title={`${seat.label} - ₹${seat.price}`}
                      >
                        {seat.isAisle ? '' : seat.number}
                      </button>
                    ))}
                    <span className="seat-row-label">{row.row}</span>
                  </div>
                ))}
              </div>

              <div className="seat-legend">
                <div className="seat-legend-item"><div className="seat-legend-box" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} /> Available</div>
                <div className="seat-legend-item"><div className="seat-legend-box" style={{ background: 'var(--accent)' }} /> Selected</div>
                <div className="seat-legend-item"><div className="seat-legend-box" style={{ background: 'rgba(255,255,255,0.05)' }} /> Sold</div>
              </div>

              {selectedSeats.length > 0 && (
                <motion.div className="booking-summary" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <h4>Booking Summary</h4>
                  <div className="booking-summary-row">
                    <span>Movie</span><span>{film.title}</span>
                  </div>
                  <div className="booking-summary-row">
                    <span>Show</span><span>{selectedShowtime.dayLabel}, {selectedShowtime.time}</span>
                  </div>
                  <div className="booking-summary-row">
                    <span>Screen</span><span>{selectedShowtime.screen}</span>
                  </div>
                  <div className="booking-summary-row">
                    <span>Seats ({selectedSeats.length})</span>
                    <span>{selectedSeats.map(s => s.label).join(', ')}</span>
                  </div>
                  <div className="booking-summary-row total">
                    <span>Total</span><span>₹{totalPrice}</span>
                  </div>
                  <button className="booking-confirm" onClick={handleConfirmBooking}>
                    Confirm Booking • ₹{totalPrice}
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {step === 'confirmed' && bookingResult && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Booking Confirmed!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Your tickets have been reserved</p>
              <div className="booking-summary">
                <div className="booking-summary-row"><span>Reference</span><span style={{ color: 'var(--gold)', fontWeight: 700 }}>{bookingResult.bookingReference}</span></div>
                <div className="booking-summary-row"><span>Movie</span><span>{bookingResult.filmTitle}</span></div>
                <div className="booking-summary-row"><span>Show</span><span>{bookingResult.showtime}</span></div>
                <div className="booking-summary-row"><span>Seats</span><span>{bookingResult.seats?.join(', ')}</span></div>
                <div className="booking-summary-row total"><span>Paid</span><span>₹{bookingResult.totalPrice}</span></div>
              </div>
              <button className="btn-primary" style={{ margin: '24px auto 0' }} onClick={onClose}>Done</button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
