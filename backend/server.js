import express from 'express';
import cors from 'cors';
import alasql from 'alasql';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mssql from 'mssql/msnodesqlv8.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// Serving images locally
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// ─── SQL SERVER EXPRESS CONNECTION ───────────────────────────────────────────
const sqlConfig = {
  server: 'localhost',
  driver: 'msnodesqlv8',
  connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=(local)\\SQLEXPRESS;Database=RajpalVista;Trusted_Connection=yes;',
  options: {
    trustServerCertificate: true,
  }
};

let pool;
let isSqlServerConnected = false;

async function getDbConnection() {
  if (pool && isSqlServerConnected) return pool;
  try {
    pool = await mssql.connect(sqlConfig);
    isSqlServerConnected = true;
    console.log('[DATABASE SUCCESS] Successfully connected to live local SQL Server Express database (RajpalVista).');
    return pool;
  } catch (err) {
    console.warn('[DATABASE WARNING] SQL Server Express connection failed. Falling back to in-memory Alasql database.', err.message);
    isSqlServerConnected = false;
    throw err;
  }
}

// Initial connection attempt on startup
getDbConnection().catch(() => {});

// ─── INITIALIZE ALASQL FALLBACK DATABASE ─────────────────────────────────────
console.log('Initializing self-contained pure JavaScript SQL database (Alasql)...');

alasql('CREATE TABLE tblFilm (Film_strCode STRING, Film_strTitle STRING, Film_strCensor STRING, Film_intDuration INT, Film_strDescription STRING, Film_strURL3 STRING, Film_strURL4 STRING)');
alasql('CREATE TABLE tblSession (Session_strCode STRING, Film_strCode STRING, Session_dtmShowing STRING, Screen_intNumber INT)');

let filmRecords = [];
let sessionRecords = [];

const KNOWN_METADATA = {
  '0020000002': { 
    title: 'Pani Ch Madhaani',
    synopsis: 'Set in the 1980s, a struggling group of Punjabi musicians search for fame, love, and their big breakthrough in the UK, leading to a series of unexpected events.',
    genre: 'Drama / Comedy / Musical', 
    language: 'Punjabi', 
    cast: ['Gippy Grewal', 'Neeru Bajwa', 'Karamjit Anmol', 'Gurpreet Ghuggi'], 
    director: 'Vijay Kumar Arora',
    posterUrl: '/images/pani_ch_madhaani_poster.jpg',
    backdropUrl: 'https://i.ytimg.com/vi/GzI87o-Lslc/maxresdefault.jpg'
  },
  '0020000003': { 
    title: 'Sooryavanshi',
    synopsis: 'A daredevil Mumbai cop joins forces with two legendary officers to stop a major terror plot threatening the city, packing high-octane stunts and blockbuster entertainment.',
    genre: 'Action / Crime / Thriller', 
    language: 'Hindi', 
    cast: ['Akshay Kumar', 'Katrina Kaif', 'Ajay Devgn', 'Ranveer Singh'], 
    director: 'Rohit Shetty',
    posterUrl: '/images/sooryavanshi_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/fX2yq57gHjYd1sC21Z9w8c3aQG8.jpg'
  },
  '0020000004': { 
    title: 'Honsla Rakh',
    synopsis: 'A single father navigates the struggles of parenting and dating in modern Vancouver, only for his ex-wife to suddenly reappear in his life causing a hilarious love-triangle.',
    genre: 'Comedy / Drama / Romance', 
    language: 'Punjabi', 
    cast: ['Diljit Dosanjh', 'Shehnaaz Gill', 'Sonam Bajwa', 'Shinda Grewal'], 
    director: 'Amarjit Singh Saron',
    posterUrl: '/images/honsla_rakh_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/mN71w2Cq80dZkYjY6H3yC76GgWb.jpg'
  },
  '0020000005': { 
    title: 'Fuffad Ji',
    synopsis: 'A satirical comedy about family rivalry, ego, and local politics in a traditional Punjabi household as a newlywed son-in-law challenges his senior brother-in-law.',
    genre: 'Comedy / Family / Drama', 
    language: 'Punjabi', 
    cast: ['Binnu Dhillon', 'Gurnam Bhullar', 'Jaswinder Bhalla'], 
    director: 'Pankaj Batra',
    posterUrl: '/images/fuffad_ji_poster.jpg', // Official high-resolution theatrical poster
    backdropUrl: 'https://i.ytimg.com/vi/aZ3CgI1mYmg/maxresdefault.jpg'
  },
  'HO00002714': { 
    title: 'Dangal',
    synopsis: "A former wrestler trains his daughters to become world-class champions against all social odds, leading them to India's first-ever gold medal in wrestling.",
    genre: 'Biography / Drama / Sport', 
    language: 'Hindi', 
    cast: ['Aamir Khan', 'Sakshi Tanwar', 'Fatima Sana Shaikh'], 
    director: 'Nitesh Tiwari',
    posterUrl: 'https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg',
    backdropUrl: 'https://i.ytimg.com/vi/x_7YlGv9u1g/maxresdefault.jpg'
  },
  'HO00003138': { 
    title: 'Carry On Jatta 2',
    synopsis: 'A hilarious comedy of errors as a young orphan tries to win the heart of a girl who only wants to marry a man with a large family, resulting in chaos and confusion.',
    genre: 'Comedy / Drama', 
    language: 'Punjabi', 
    cast: ['Gippy Grewal', 'Sonam Bajwa', 'Gurpreet Ghuggi'], 
    director: 'Smeep Kang',
    posterUrl: '/images/carry_on_jatta_2_poster.jpg',
    backdropUrl: 'https://i.ytimg.com/vi/F-tC40rA8h4/maxresdefault.jpg'
  },
  'HO00002829': { 
    title: 'Baahubali 2: The Conclusion',
    synopsis: "The epic conclusion to the saga of Mahendra Baahubali and his quest to reclaim the throne of Mahishmati while uncovering the dark secrets of his legendary father's murder.",
    genre: 'Action / Widescreen / Fantasy', 
    language: 'Hindi / Telugu', 
    cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty'], 
    director: 'S. S. Rajamouli',
    posterUrl: '/images/baahubali_2_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/2w8gD8M4w4wX3v0S9yX6w2B8w.jpg'
  },
  'HO00003034': { 
    title: 'Tiger Zinda Hai',
    synopsis: 'A massive action espionage thriller following super spies Tiger and Zoya as they team up to rescue a group of Indian and Pakistani nurses held hostage in Iraq.',
    genre: 'Action / Adventure / Thriller', 
    language: 'Hindi', 
    cast: ['Salman Khan', 'Katrina Kaif', 'Sajjad Delafrooz'], 
    director: 'Ali Abbas Zafar',
    posterUrl: '/images/tiger_zinda_hai_poster.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/6t3T1e82E8m92S8e2T0w2E6mE8g.jpg'
  }
};

const FILM_METADATA = {};

try {
  const exportPath = path.join(__dirname, 'rajpal_database_export.json');
  if (fs.existsSync(exportPath)) {
    console.log('[DATABASE] Loading backup database records from rajpal_database_export.json...');
    const rawData = fs.readFileSync(exportPath, 'utf8');
    const dbData = JSON.parse(rawData);

    if (dbData.nowShowingFilms) {
      dbData.nowShowingFilms.forEach(f => {
        filmRecords.push({
          Film_strCode: f.id.toString().trim(),
          Film_strTitle: f.title.trim(),
          Film_strCensor: f.rating || 'UA',
          Film_intDuration: f.durationMinutes || 120,
          Film_strDescription: f.synopsis || 'No description available.',
          Film_strURL3: f.posterUrl,
          Film_strURL4: f.backdropUrl
        });
      });
    }

    if (dbData.comingSoonFilms) {
      dbData.comingSoonFilms.forEach(f => {
        filmRecords.push({
          Film_strCode: f.id.toString().trim(),
          Film_strTitle: f.title.trim(),
          Film_strCensor: f.rating || 'UA',
          Film_intDuration: f.durationMinutes || 120,
          Film_strDescription: f.synopsis || 'No description available.',
          Film_strURL3: f.posterUrl,
          Film_strURL4: f.backdropUrl
        });
      });
    }

    if (dbData.activeShowtimeSessions) {
      dbData.activeShowtimeSessions.forEach(s => {
        const cleanTime = s.originalShowtime ? s.originalShowtime.replace(/\.\d+Z$/, '').replace('Z', '') : '';
        sessionRecords.push({
          Session_strCode: s.sessionId.toString().trim(),
          Film_strCode: s.filmId.toString().trim(),
          Session_dtmShowing: cleanTime,
          Screen_intNumber: s.screenNumber || 1
        });
      });
    }

    console.log(`[DATABASE SUCCESS] Loaded ${filmRecords.length} films and ${sessionRecords.length} sessions directly from Vista database export!`);
  }
} catch (e) {
  console.error('[DATABASE ERROR] Failed to load data from database export:', e);
}

// Fallback static records in case the export file is missing
if (filmRecords.length === 0) {
  filmRecords = Object.keys(KNOWN_METADATA).map(code => {
    const meta = KNOWN_METADATA[code];
    return {
      Film_strCode: code,
      Film_strTitle: meta.title,
      Film_strCensor: 'U/A',
      Film_intDuration: 130,
      Film_strDescription: meta.synopsis,
      Film_strURL3: meta.posterUrl,
      Film_strURL4: meta.backdropUrl
    };
  });
}

// Populate Alasql fallback tables
alasql('INSERT INTO tblFilm SELECT * FROM ?', [filmRecords]);
alasql('INSERT INTO tblSession SELECT * FROM ?', [sessionRecords]);

// Dynamically generate film metadata mapping
Object.keys(KNOWN_METADATA).forEach(code => {
  const f = filmRecords.find(item => item.Film_strCode === code) || {};
  const known = KNOWN_METADATA[code];
  FILM_METADATA[code] = {
    title: known.title || f.Film_strTitle,
    synopsis: known.synopsis || f.Film_strDescription,
    posterUrl: known.posterUrl || f.Film_strURL3,
    backdropUrl: known.backdropUrl || f.Film_strURL4,
    genre: known.genre || 'Action / Drama',
    language: known.language || 'Punjabi',
    cast: known.cast || [],
    director: known.director || 'Unknown'
  };
});

console.log('[SUCCESS] Database tables and movie metadata loaded successfully!');

// In-Memory Bookings Store
const bookings = [];

// Helper function to shift Vista dates from Nov 2021 to "This Week" (Today + offset)
// This fully prevents negative time values or NaN calculations!
function shiftDate(originalDateStr) {
  if (!originalDateStr) return new Date();
  const originalDate = new Date(originalDateStr);
  if (isNaN(originalDate.getTime())) return new Date();

  const baseDate = new Date('2021-11-05T00:00:00'); // Base Friday of Vista backup
  
  const diffTime = originalDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let dayOffset = diffDays % 7;
  if (dayOffset < 0) dayOffset += 7; // Force positive modulo
  
  const shifted = new Date(today.getTime() + dayOffset * 24 * 60 * 60 * 1000);
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

function resolveImageUrl(req, imgPath) {
  if (!imgPath) return '';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  // Prepend the backend host dynamically!
  const host = req.get('host') || 'localhost:5000';
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}${imgPath}`;
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

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// GET /api/films
app.get('/api/films', async (req, res) => {
  try {
    let rows = [];
    if (isSqlServerConnected) {
      try {
        const db = await getDbConnection();
        const result = await db.query(`
          SELECT DISTINCT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
          FROM tblFilm f
          JOIN tblSession s ON f.Film_strCode = s.Film_strCode
          WHERE s.Session_dtmShowing >= '2021-11-01' AND f.Film_strTitle IS NOT NULL
        `);
        rows = result.recordset;
      } catch (dbErr) {
        console.error('[SQL Server Error] Falling back to Alasql for /api/films:', dbErr.message);
        rows = alasql(`
          SELECT DISTINCT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
          FROM tblFilm f
          JOIN tblSession s ON f.Film_strCode = s.Film_strCode
          WHERE s.Session_dtmShowing >= '2021-11-01' AND f.Film_strTitle IS NOT NULL
        `);
      }
    } else {
      rows = alasql(`
        SELECT DISTINCT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
        FROM tblFilm f
        JOIN tblSession s ON f.Film_strCode = s.Film_strCode
        WHERE s.Session_dtmShowing >= '2021-11-01' AND f.Film_strTitle IS NOT NULL
      `);
    }

    const films = rows.map(row => {
      const code = row.Film_strCode.trim();
      const meta = FILM_METADATA[code] || {
        posterUrl: '/images/sooryavanshi_poster.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/fX2yq57gHjYd1sC21Z9w8c3aQG8.jpg',
        genre: 'Drama / Action',
        language: 'Hindi',
        cast: [],
        director: 'Unknown',
      };

      const rawPoster = meta.posterUrl || row.Film_strURL3?.trim();
      const rawBackdrop = meta.backdropUrl || row.Film_strURL4?.trim();

      return {
        id: code,
        title: meta.title || row.Film_strTitle.trim(),
        synopsis: meta.synopsis || row.Film_strDescription?.trim() || 'No description available.',
        genre: meta.genre,
        duration: `${Math.floor(row.Film_intDuration / 60)}h ${row.Film_intDuration % 60}min`,
        rating: row.Film_strCensor.trim() || 'UA',
        language: meta.language,
        posterUrl: resolveImageUrl(req, rawPoster),
        backdropUrl: resolveImageUrl(req, rawBackdrop),
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
    let rows = [];
    if (isSqlServerConnected) {
      try {
        const db = await getDbConnection();
        const result = await db.query(`
          SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
          FROM tblFilm f
          WHERE f.Film_strCode IN ('HO00002714', 'HO00002829', 'HO00003034', 'HO00003138')
        `);
        rows = result.recordset;
      } catch (dbErr) {
        console.error('[SQL Server Error] Falling back to Alasql for /api/coming-soon:', dbErr.message);
        rows = alasql(`
          SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
          FROM tblFilm f
          WHERE f.Film_strCode IN ('HO00002714', 'HO00002829', 'HO00003034', 'HO00003138')
        `);
      }
    } else {
      rows = alasql(`
        SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
        FROM tblFilm f
        WHERE f.Film_strCode IN ('HO00002714', 'HO00002829', 'HO00003034', 'HO00003138')
      `);
    }

    const films = rows.map(row => {
      const code = row.Film_strCode.trim();
      const meta = FILM_METADATA[code] || {
        posterUrl: '/images/sooryavanshi_poster.jpg',
        backdropUrl: 'https://image.tmdb.org/t/p/original/fX2yq57gHjYd1sC21Z9w8c3aQG8.jpg',
        genre: 'Drama / Action',
        language: 'Hindi',
        cast: [],
        director: 'Unknown',
      };

      const releaseDate = new Date();
      releaseDate.setDate(releaseDate.getDate() + 30);
      const comingSoonLabel = releaseDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

      const rawPoster = meta.posterUrl || row.Film_strURL3?.trim();
      const rawBackdrop = meta.backdropUrl || row.Film_strURL4?.trim();

      return {
        id: code,
        title: meta.title || row.Film_strTitle.trim(),
        synopsis: meta.synopsis || row.Film_strDescription?.trim() || 'No description available.',
        genre: meta.genre,
        duration: `${Math.floor(row.Film_intDuration / 60)}h ${row.Film_intDuration % 60}min`,
        rating: row.Film_strCensor.trim() || 'UA',
        language: meta.language,
        posterUrl: resolveImageUrl(req, rawPoster),
        backdropUrl: resolveImageUrl(req, rawBackdrop),
        cast: meta.cast,
        director: meta.director,
        isNowShowing: false,
        releaseDate: comingSoonLabel
      };
    });

    res.json(films);
  } catch (err) {
    console.error('Error fetching coming soon:', err);
    res.status(500).json({ error: 'Database error fetching coming soon' });
  }
});

// GET /api/films/:filmId
app.get('/api/films/:filmId', async (req, res) => {
  const { filmId } = req.params;
  try {
    let row;
    if (isSqlServerConnected) {
      try {
        const db = await getDbConnection();
        const result = await db.request()
          .input('filmId', mssql.VarChar, filmId)
          .query(`
            SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
            FROM tblFilm f
            WHERE f.Film_strCode = @filmId
          `);
        row = result.recordset[0];
      } catch (dbErr) {
        console.error('[SQL Server Error] Falling back to Alasql for /api/films/:filmId:', dbErr.message);
        row = alasql(`
          SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
          FROM tblFilm f
          WHERE f.Film_strCode = ?
        `, [filmId])[0];
      }
    } else {
      row = alasql(`
        SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
        FROM tblFilm f
        WHERE f.Film_strCode = ?
      `, [filmId])[0];
    }

    if (!row) {
      return res.status(404).json({ error: 'Film not found' });
    }

    const code = row.Film_strCode.trim();
    const meta = FILM_METADATA[code] || {
      posterUrl: '/images/sooryavanshi_poster.jpg',
      backdropUrl: 'https://image.tmdb.org/t/p/original/fX2yq57gHjYd1sC21Z9w8c3aQG8.jpg',
      genre: 'Drama / Action',
      language: 'Hindi',
      cast: [],
      director: 'Unknown',
    };

    const isComingSoon = ['HO00002714', 'HO00002829', 'HO00003034', 'HO00003138'].includes(code);

    const rawPoster = meta.posterUrl || row.Film_strURL3?.trim();
    const rawBackdrop = meta.backdropUrl || row.Film_strURL4?.trim();

    res.json({
      id: code,
      title: meta.title || row.Film_strTitle.trim(),
      synopsis: meta.synopsis || row.Film_strDescription?.trim() || 'No description available.',
      genre: meta.genre,
      duration: `${Math.floor(row.Film_intDuration / 60)}h ${row.Film_intDuration % 60}min`,
      rating: row.Film_strCensor.trim() || 'UA',
      language: meta.language,
      posterUrl: resolveImageUrl(req, rawPoster),
      backdropUrl: resolveImageUrl(req, rawBackdrop),
      cast: meta.cast,
      director: meta.director,
      isNowShowing: !isComingSoon
    });
  } catch (err) {
    console.error('Error fetching film details:', err);
    res.status(500).json({ error: 'Database error fetching film details' });
  }
});

// GET /api/films/:filmId/showtimes
app.get('/api/films/:filmId/showtimes', async (req, res) => {
  const { filmId } = req.params;
  try {
    let rows = [];
    if (isSqlServerConnected) {
      try {
        const db = await getDbConnection();
        const result = await db.request()
          .input('filmId', mssql.VarChar, filmId)
          .query(`
            SELECT s.Session_lngSessionId, s.Screen_bytNum, s.Session_dtmShowing
            FROM tblSession s
            WHERE s.Film_strCode = @filmId AND s.Session_dtmShowing >= '2021-11-01'
            ORDER BY s.Session_dtmShowing ASC
          `);
        rows = result.recordset.map(r => ({
          Session_strCode: `st-${r.Session_lngSessionId}`,
          Session_dtmShowing: r.Session_dtmShowing.toISOString(),
          Screen_intNumber: r.Screen_bytNum
        }));
      } catch (dbErr) {
        console.error('[SQL Server Error] Falling back to Alasql for /api/films/:filmId/showtimes:', dbErr.message);
        rows = alasql(`
          SELECT s.Session_strCode, s.Session_dtmShowing, s.Screen_intNumber
          FROM tblSession s
          WHERE s.Film_strCode = ? AND s.Session_dtmShowing >= '2021-11-01'
          ORDER BY s.Session_dtmShowing ASC
        `, [filmId]);
      }
    } else {
      rows = alasql(`
        SELECT s.Session_strCode, s.Session_dtmShowing, s.Screen_intNumber
        FROM tblSession s
        WHERE s.Film_strCode = ? AND s.Session_dtmShowing >= '2021-11-01'
        ORDER BY s.Session_dtmShowing ASC
      `, [filmId]);
    }

    const grouped = {};
    rows.forEach(row => {
      const originalTime = row.Session_dtmShowing;
      const shifted = shiftDate(originalTime);
      const dayLabel = getDayLabel(shifted);
      
      const timeStr = shifted.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      if (!grouped[dayLabel]) {
        grouped[dayLabel] = {
          date: shifted.toISOString(),
          label: dayLabel,
          shows: [],
        };
      }

      grouped[dayLabel].shows.push({
        id: row.Session_strCode.trim(),
        time: timeStr,
        screen: `Screen ${row.Screen_intNumber}`,
        originalTime: originalTime,
        price: row.Screen_intNumber === 2 ? 180 : 250, // Realistic pricing based on screen
        format: '2D' // Standard format
      });
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error('Error fetching showtimes:', err);
    res.status(500).json({ error: 'Database error fetching showtimes' });
  }
});

// GET /api/seat-layouts/:showtimeId
app.get('/api/seat-layouts/:showtimeId', async (req, res) => {
  const { showtimeId } = req.params;
  try {
    const seed = hashCode(showtimeId);
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;

    // Fetch booked seats from local SQL Server tblBooking_Detail table
    const dbBookedSeats = new Set();
    if (isSqlServerConnected && showtimeId.startsWith('st-')) {
      try {
        const sessionId = parseInt(showtimeId.replace('st-', ''));
        const db = await getDbConnection();
        const result = await db.request()
          .input('sessionId', mssql.Int, sessionId)
          .query(`
            SELECT ScreenD_strPhyRowId, ScreenD_strSeatId 
            FROM tblBooking_Detail 
            WHERE Session_lngSessionId = @sessionId AND BookingD_strStatus = 'P'
          `);
        result.recordset.forEach(row => {
          const rowChar = row.ScreenD_strPhyRowId.trim();
          const seatNum = row.ScreenD_strSeatId.trim();
          dbBookedSeats.add(`${rowChar}${seatNum}`);
        });
      } catch (dbErr) {
        console.error('[SQL Server Seat Fetch Error] Failed to fetch booked seats, using local memory only:', dbErr.message);
      }
    }

    const layoutRows = rows.map((rowChar, rowIndex) => {
      const seats = [];
      for (let sNum = 1; sNum <= seatsPerRow; sNum++) {
        // Booked status checks in-memory checkout bookings and live database bookings
        const isReservedInMem = bookings.some(b => b.showtimeId === showtimeId && b.seats.includes(`${rowChar}${sNum}`));
        const isReservedInDB = dbBookedSeats.has(`${rowChar}${sNum}`);
        
        const isBooked = isReservedInMem || isReservedInDB;

        seats.push({
          id: `${rowChar}${sNum}`,
          number: sNum,
          status: isBooked ? 'booked' : 'available',
          label: `${rowChar}-${sNum}`,
          price: rowIndex < 3 ? 180 : rowIndex < 7 ? 250 : 350, // Standard (rows A-C): ₹180, Executive (rows D-G): ₹250, Premium (rows H-J): ₹350
          isAisle: sNum === 3 || sNum === 9 // Create aisles for nice aesthetics
        });
      }

      return {
        row: rowChar,
        seats,
      };
    });

    res.json({
      showtimeId,
      rows: layoutRows,
    });
  } catch (err) {
    console.error('Error generating seat layout:', err);
    res.status(500).json({ error: 'Database error fetching seat layouts' });
  }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  const { showtimeId, filmId, seats, phone, ticketType } = req.body;
  const name = req.body.name || 'Guest User';
  const email = req.body.email || 'guest@rajpalcinema.com';

  if (!showtimeId || !filmId || !seats || !seats.length) {
    return res.status(400).json({ error: 'Missing required checkout information.' });
  }

  try {
    let filmTitle = 'Unknown Movie';
    
    // Fetch movie title
    if (isSqlServerConnected) {
      try {
        const db = await getDbConnection();
        const filmRow = await db.request()
          .input('filmId', mssql.VarChar, filmId)
          .query('SELECT Film_strTitle FROM tblFilm WHERE Film_strCode = @filmId');
        if (filmRow.recordset[0]) {
          filmTitle = filmRow.recordset[0].Film_strTitle.trim();
        }
      } catch (dbErr) {
        console.error('[SQL Server Title Error] Falling back to Alasql for movie title:', dbErr.message);
        const filmRow = alasql(`
          SELECT f.Film_strTitle FROM tblFilm f WHERE f.Film_strCode = ?
        `, [filmId])[0];
        filmTitle = filmRow ? filmRow.Film_strTitle.trim() : 'Unknown Movie';
      }
    } else {
      const filmRow = alasql(`
        SELECT f.Film_strTitle FROM tblFilm f WHERE f.Film_strCode = ?
      `, [filmId])[0];
      filmTitle = filmRow ? filmRow.Film_strTitle.trim() : 'Unknown Movie';
    }

    const bookingId = `BK-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newBooking = {
      bookingId,
      showtimeId,
      filmId,
      filmTitle,
      seats,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      bookingTime: new Date().toISOString(),
    };

    bookings.push(newBooking);

    // Save bookings directly into live SQL Server table tblBooking_Detail
    if (isSqlServerConnected && showtimeId.startsWith('st-')) {
      try {
        const sessionId = parseInt(showtimeId.replace('st-', ''));
        const db = await getDbConnection();
        
        for (const seat of seats) {
          const rowChar = seat.match(/^[A-Z]+/)[0];
          const seatNum = seat.match(/\d+$/)[0];
          
          await db.request()
            .input('sessionId', mssql.Int, sessionId)
            .input('rowChar', mssql.VarChar, rowChar)
            .input('seatNum', mssql.VarChar, seatNum)
            .query(`
              INSERT INTO tblBooking_Detail (
                Session_lngSessionId, ScreenD_strPhyRowId, ScreenD_strSeatId, BookingD_strStatus, 
                BookingD_intNextBookingNo, BookingD_intSequence, Area_bytNum, PGroup_strCode, 
                Price_strCode, BookingD_intNoOfSeats, BookingD_curValue
              ) VALUES (
                @sessionId, @rowChar, @seatNum, 'P', 9999, 1, 1, '0001', '0001', 1, 250
              )
            `);
        }
        console.log(`[DATABASE SUCCESS] Saved booking seats directly in SQL Server table tblBooking_Detail for session ${sessionId}!`);
      } catch (dbErr) {
        console.warn('[DATABASE WARNING] Failed to persist booking directly in SQL Server table due to database constraints, falling back to memory storage. Details:', dbErr.message);
      }
    }

    console.log(`[SUCCESS] New Dynamic Booking Saved: ${bookingId} for film ${filmTitle}`);

    res.status(201).json({
      success: true,
      bookingId,
      bookingReference: bookingId,
      filmTitle,
      seats,
      showtime: req.body.showtime || 'Today',
      totalPrice: req.body.totalPrice || 0,
      customerName: name,
      message: 'Booking completed successfully!',
    });
  } catch (err) {
    console.error('Error processing booking:', err);
    res.status(500).json({ error: 'Database error booking tickets' });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
