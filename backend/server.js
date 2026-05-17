import express from 'express';
import cors from 'cors';
import mssql from 'mssql/msnodesqlv8.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// SQL Server connection configuration using native Windows Trusted connection
const sqlConfig = {
  server: 'localhost',
  driver: 'msnodesqlv8',
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(local)\\SQLEXPRESS;Database=RajpalVista;Trusted_Connection=yes;',
};

// Rich local metadata mapping for the active and upcoming films in our demo
// Rich local metadata mapping for the active and upcoming films in our demo
const FILM_METADATA = {
  // Now Showing Map: Map database film codes to local, high-definition SVG vector poster assets
  '0020000003': { // SOORYAVANSHI (U/A)
    title: 'Sooryavanshi',
    synopsis: 'A daredevil Mumbai cop joins forces with two legendary officers to stop a major terror plot threatening the city, packing high-octane stunts and blockbuster entertainment.',
    posterUrl: '/images/sooryavanshi_poster.svg',
    backdropUrl: '/images/sooryavanshi_backdrop.svg',
    genre: 'Action / Crime / Thriller',
    language: 'Hindi',
    cast: ['Akshay Kumar', 'Katrina Kaif', 'Ajay Devgn', 'Ranveer Singh', 'Jaaved Jaaferi'],
    director: 'Rohit Shetty',
  },
  '0020000004': { // HONSLA RAKH (U/A)
    title: 'Honsla Rakh',
    synopsis: 'A single father navigates the struggles of parenting and dating in modern Vancouver, only for his ex-wife to suddenly reappear in his life causing a hilarious love-triangle.',
    posterUrl: '/images/honsla_rakh_poster.svg',
    backdropUrl: '/images/honsla_rakh_backdrop.svg',
    genre: 'Comedy / Drama / Romance',
    language: 'Punjabi',
    cast: ['Diljit Dosanjh', 'Shehnaaz Gill', 'Sonam Bajwa', 'Shinda Grewal'],
    director: 'Amarjit Singh Saron',
  },
  '0020000005': { // FUFFAD JI (U/A)
    title: 'Fuffad Ji',
    synopsis: 'A satirical comedy about family rivalry, ego, and local politics in a traditional Punjabi household as a newlywed son-in-law challenges his senior brother-in-law.',
    posterUrl: '/images/fuffad_ji_poster.svg',
    backdropUrl: '/images/fuffad_ji_backdrop.svg',
    genre: 'Comedy / Family / Drama',
    language: 'Punjabi',
    cast: ['Binnu Dhillon', 'Gurnam Bhullar', 'Jaswinder Bhalla', 'Alby Dhindsa'],
    director: 'Pankaj Batra',
  },
  '0020000002': { // PANI CH MADHAANI (A)
    title: 'Pani Ch Madhaani',
    synopsis: 'Set in the 1980s, a struggling group of Punjabi musicians search for fame, love, and their big breakthrough in the UK, leading to a series of unexpected events.',
    posterUrl: '/images/pani_ch_madhaani_poster.svg',
    backdropUrl: '/images/pani_ch_madhaani_backdrop.svg',
    genre: 'Drama / Comedy / Musical',
    language: 'Punjabi',
    cast: ['Gippy Grewal', 'Neeru Bajwa', 'Karamjit Anmol', 'Gurpreet Ghuggi'],
    director: 'Vijay Kumar Arora',
  },
  // Coming Soon Map: Map database film codes to local, high-definition SVG vector poster assets
  'HO00002714': { // DANGAL (U)
    title: 'Dangal',
    synopsis: 'A former wrestler trains his daughters to become world-class champions against all social odds, leading them to India\'s first-ever gold medal in wrestling.',
    posterUrl: '/images/dangal_poster.svg',
    backdropUrl: '/images/dangal_backdrop.svg',
    genre: 'Action / Biography / Drama',
    language: 'Hindi',
    cast: ['Aamir Khan', 'Sakshi Tanwar', 'Fatima Sana Shaikh', 'Sanya Malhotra'],
    director: 'Nitesh Tiwari',
  },
  'HO00003138': { // CARRY ON JATTA 2 (U/A)
    title: 'Carry On Jatta 2',
    synopsis: 'A hilarious comedy of errors as a young orphan tries to win the heart of a girl who only wants to marry a man with a large family, resulting in chaos and confusion.',
    posterUrl: '/images/carry_on_jatta_2_poster.svg',
    backdropUrl: '/images/carry_on_jatta_2_backdrop.svg',
    genre: 'Comedy / Romance',
    language: 'Punjabi',
    cast: ['Gippy Grewal', 'Sonam Bajwa', 'Gurpreet Ghuggi', 'Jaswinder Bhalla', 'Binnu Dhillon'],
    director: 'Smeep Kang',
  },
  'HO00002829': { // BAAHUBALI 2 (U/A)
    title: 'Baahubali 2: The Conclusion',
    synopsis: 'The epic conclusion to the saga of Mahendra Baahubali and his quest to reclaim the throne of Mahishmati while uncovering the dark secrets of his legendary father\'s murder.',
    posterUrl: '/images/baahubali_2_poster.svg',
    backdropUrl: '/images/baahubali_2_backdrop.svg',
    genre: 'Action / Drama / Fantasy',
    language: 'Hindi / Telugu / Tamil',
    cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty', 'Tamannaah Bhatia'],
    director: 'S.S. Rajamouli',
  },
  'HO00003034': { // TIGER ZINDA HAI (U/A)
    title: 'Tiger Zinda Hai',
    synopsis: 'A massive action espionage thriller following super spies Tiger and Zoya as they team up to rescue a group of Indian and Pakistani nurses held hostage in Iraq.',
    posterUrl: '/images/tiger_zinda_hai_poster.svg',
    backdropUrl: '/images/tiger_zinda_hai_backdrop.svg',
    genre: 'Action / Thriller / Adventure',
    language: 'Hindi',
    cast: ['Salman Khan', 'Katrina Kaif', 'Sajjad Delafrooz', 'Angad Bedi'],
    director: 'Ali Abbas Zafar',
  }
};

// In-Memory Bookings Store
const bookings = [];

// Helper function to shift Vista dates from Nov 2021 to "This Week" (Today + offset)
function shiftDate(originalDateStr) {
  const originalDate = new Date(originalDateStr);
  const baseDate = new Date('2021-11-05T00:00:00'); // Base Friday
  
  // Calculate day offset from the base date
  const diffTime = originalDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Today's date at midnight local time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Return new shifted date
  const shifted = new Date(today.getTime() + (diffDays % 7) * 24 * 60 * 60 * 1000);
  shifted.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), 0);
  
  return shifted;
}

// Helper to generate day label for frontend
function getDayLabel(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(0, 0, 0, 0);
  
  const check = new Date(date);
  check.setHours(0, 0, 0, 0);
  
  if (check.getTime() === today.getTime()) return 'Today';
  if (check.getTime() === tomorrow.getTime()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

// deterministic hash for consistent seat maps
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Connect to SQL Server
let pool;
async function getDbConnection() {
  if (pool) return pool;
  try {
    pool = await mssql.connect(sqlConfig);
    console.log('Successfully connected to SQL Server Express database.');
    return pool;
  } catch (err) {
    console.error('SQL Server Connection Failed:', err);
    throw err;
  }
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// GET /api/films
app.get('/api/films', async (req, res) => {
  try {
    const db = await getDbConnection();
    // Query films active in our target November 2021 date range
    const result = await db.query(`
      SELECT DISTINCT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
      FROM tblFilm f
      JOIN tblSession s ON f.Film_strCode = s.Film_strCode
      WHERE s.Session_dtmShowing >= '2021-11-01' AND f.Film_strTitle IS NOT NULL
    `);

    const films = result.recordset.map(row => {
      const code = row.Film_strCode.trim();
      const meta = FILM_METADATA[code] || {
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
        backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200',
        genre: 'Drama / Action',
        language: 'Hindi',
        cast: [],
        director: 'Unknown',
      };

      return {
        id: code,
        title: meta.title || row.Film_strTitle.trim(),
        synopsis: meta.synopsis || row.Film_strDescription?.trim() || 'No description available.',
        genre: meta.genre,
        duration: `${Math.floor(row.Film_intDuration / 60)}h ${row.Film_intDuration % 60}min`,
        rating: row.Film_strCensor.trim() || 'UA',
        language: meta.language,
        posterUrl: row.Film_strURL3?.trim() || meta.posterUrl,
        backdropUrl: row.Film_strURL4?.trim() || meta.backdropUrl,
        cast: meta.cast,
        director: meta.director,
        isNowShowing: true,
      };
    });

    res.json(films);
  } catch (err) {
    console.error('Error fetching films:', err);
    res.status(500).json({ error: 'Database error fetching films' });
  }
});

// GET /api/coming-soon
app.get('/api/coming-soon', async (req, res) => {
  try {
    const db = await getDbConnection();
    // Query specific classic films
    const result = await db.query(`
      SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
      FROM tblFilm f
      WHERE f.Film_strCode IN ('HO00002714', 'HO00002829', 'HO00003034', 'HO00003138')
    `);

    const films = result.recordset.map(row => {
      const code = row.Film_strCode.trim();
      const meta = FILM_METADATA[code] || {
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
        backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200',
        genre: 'Drama / Action',
        language: 'Hindi',
        cast: [],
        director: 'Unknown',
      };

      const releaseDate = new Date();
      releaseDate.setDate(releaseDate.getDate() + 30);
      const comingSoonLabel = releaseDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

      return {
        id: code,
        title: meta.title || row.Film_strTitle.trim(),
        synopsis: meta.synopsis || row.Film_strDescription?.trim() || 'No description available.',
        genre: meta.genre,
        duration: `${Math.floor(row.Film_intDuration / 60)}h ${row.Film_intDuration % 60}min`,
        rating: row.Film_strCensor.trim() || 'UA',
        language: meta.language,
        posterUrl: row.Film_strURL3?.trim() || meta.posterUrl,
        backdropUrl: row.Film_strURL4?.trim() || meta.backdropUrl,
        cast: meta.cast,
        director: meta.director,
        isNowShowing: false,
        comingSoonDate: comingSoonLabel,
      };
    });

    res.json(films);
  } catch (err) {
    console.error('Error fetching coming soon films:', err);
    res.status(500).json({ error: 'Database error fetching coming soon' });
  }
});

// GET /api/films/:filmId
app.get('/api/films/:filmId', async (req, res) => {
  const { filmId } = req.params;
  try {
    const db = await getDbConnection();
    const result = await db.query`
      SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
      FROM tblFilm f
      WHERE f.Film_strCode = ${filmId}
    `;

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Film not found' });
    }

    const row = result.recordset[0];
    const code = row.Film_strCode.trim();
    const meta = FILM_METADATA[code] || {
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500',
      backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200',
      genre: 'Drama / Action',
      language: 'Hindi',
      cast: [],
      director: 'Unknown',
    };

    res.json({
      id: code,
      title: meta.title || row.Film_strTitle.trim(),
      synopsis: meta.synopsis || row.Film_strDescription?.trim() || 'No description available.',
      genre: meta.genre,
      duration: `${Math.floor(row.Film_intDuration / 60)}h ${row.Film_intDuration % 60}min`,
      rating: row.Film_strCensor.trim() || 'UA',
      language: meta.language,
      posterUrl: row.Film_strURL3?.trim() || meta.posterUrl,
      backdropUrl: row.Film_strURL4?.trim() || meta.backdropUrl,
      cast: meta.cast,
      director: meta.director,
      isNowShowing: code !== 'HO00002714' && code !== 'HO00002829' && code !== 'HO00003034' && code !== 'HO00003138',
    });
  } catch (err) {
    console.error('Error fetching film by ID:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/films/:filmId/showtimes
app.get('/api/films/:filmId/showtimes', async (req, res) => {
  const { filmId } = req.params;
  try {
    const db = await getDbConnection();
    // Query actual sessions from Vista database between Nov 5 and Nov 11, 2021
    const result = await db.query`
      SELECT s.Session_lngSessionId, s.Screen_bytNum, s.Session_dtmShowing
      FROM tblSession s
      WHERE s.Film_strCode = ${filmId} AND s.Session_dtmShowing >= '2021-11-05' AND s.Session_dtmShowing <= '2021-11-12'
      ORDER BY s.Session_dtmShowing ASC
    `;

    const showtimes = result.recordset.map(row => {
      const origDateStr = row.Session_dtmShowing.toISOString();
      const newDate = shiftDate(origDateStr);
      
      const format = row.Screen_bytNum === 1 ? 'Dolby Atmos' : row.Screen_bytNum === 3 ? 'Recliner' : '2D';
      const screenLabel = row.Screen_bytNum === 1 ? 'Screen 1 — Dolby Atmos' : row.Screen_bytNum === 2 ? 'Screen 2 — Standard' : 'Screen 3 — Recliner';
      const price = row.Screen_bytNum === 3 ? 450 : row.Screen_bytNum === 1 ? 280 : 180;
      
      const dateStr = newDate.toISOString().split('T')[0];
      const timeStr = newDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      const seed = hashCode(`${filmId}-${origDateStr}`);
      const available = 20 + (Math.abs(seed) % 80);

      return {
        id: `st-${row.Session_lngSessionId}`,
        filmId,
        date: dateStr,
        dayLabel: getDayLabel(newDate),
        time: timeStr,
        screen: screenLabel,
        price,
        format,
        seatsAvailable: available,
        totalSeats: 140,
      };
    });

    res.json(showtimes);
  } catch (err) {
    console.error('Error fetching showtimes:', err);
    res.status(500).json({ error: 'Database error fetching showtimes' });
  }
});

// GET /api/seat-layouts/:showtimeId
app.get('/api/seat-layouts/:showtimeId', (req, res) => {
  const { showtimeId } = req.params;
  const isPremiumScreen = showtimeId.includes('st-3') || hashCode(showtimeId) % 3 === 0;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];
  const seatsPerRow = 14;
  const layout = [];

  // Get already-booked seats for this showtime
  const bookedSeats = new Set();
  bookings
    .filter(b => b.showtimeId === showtimeId)
    .forEach(b => b.seats.forEach(s => bookedSeats.add(s)));

  rows.forEach((row, ri) => {
    const rowSeats = [];
    for (let s = 1; s <= seatsPerRow; s++) {
      const isAisle = s === 4 || s === 11;
      const label = `${row}${s}`;

      let status = 'available';
      if (bookedSeats.has(label)) {
        status = 'sold';
      } else {
        const seed = hashCode(`${showtimeId}-${label}`);
        const r = (Math.abs(seed) % 100) / 100;
        if (r < 0.22) status = 'sold'; // Deterministic pre-sold seats (22%)
      }

      const type = ri >= 8 ? 'premium' : ri >= 5 ? 'executive' : 'standard';
      const price = isPremiumScreen 
        ? (type === 'premium' ? 450 : type === 'executive' ? 350 : 250) 
        : (type === 'premium' ? 350 : type === 'executive' ? 250 : 180);

      rowSeats.push({
        id: `${showtimeId}-${label}`,
        row,
        number: s,
        label,
        status,
        isAisle,
        type,
        price
      });
    }
    layout.push({ row, seats: rowSeats });
  });

  res.json({
    showtimeId,
    rows: layout,
    totalSeats: rows.length * seatsPerRow
  });
});

// POST /api/orders
app.post('/api/orders', (req, res) => {
  const orderData = req.body;
  
  const booking = {
    orderId: `ORD-${Date.now()}`,
    status: 'confirmed',
    bookingReference: `RPC${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    cinema: 'Rajpal Cinema, Muktsar',
    createdAt: new Date().toISOString(),
    ...orderData,
  };

  bookings.push(booking);
  res.json(booking);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
