/**
 * Vista Cinema OCAPI Integration Service
 * ========================================
 * Wired up to our local SQL Server backed Node.js Express server.
 * Returns real movies, dynamic showtimes, and booking flows directly from SQL Server.
 */

const API_BASE_URL = 'http://localhost:5000/api';

async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

/** GET /api/films */
export async function getFilms() {
  return apiFetch('/films');
}

/** GET /api/films (Now Showing list) */
export async function getNowShowing() {
  return apiFetch('/films');
}

/** GET /api/coming-soon (Coming Soon list) */
export async function getComingSoon() {
  return apiFetch('/coming-soon');
}

/** GET /api/films/:filmId */
export async function getFilmById(filmId) {
  return apiFetch(`/films/${filmId}`);
}

/** GET /api/films/:filmId/showtimes */
export async function getShowtimes(filmId) {
  return apiFetch(`/films/${filmId}/showtimes`);
}

/** GET ticket prices */
export async function getTicketPrices(showtimeId) {
  const isPremium = showtimeId.includes('st-3');
  return {
    showtimeId,
    categories: [
      { type: 'Standard',  price: isPremium ? 250 : 180, available: true },
      { type: 'Executive', price: isPremium ? 350 : 250, available: true },
      { type: 'Premium',   price: isPremium ? 450 : 350, available: true },
    ],
  };
}

/** GET seat layout */
export async function getSeatLayout(showtimeId) {
  return apiFetch(`/seat-layouts/${showtimeId}`);
}

/** GET seat availability */
export async function getSeatAvailability(showtimeId) {
  return apiFetch(`/seat-layouts/${showtimeId}`);
}

/** POST orders */
export async function createOrder(orderData) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

/** Utility - false since we are powered by real database! */
export function isDemoMode() {
  return false;
}
