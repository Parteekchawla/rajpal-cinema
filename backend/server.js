import express from 'express';
import cors from 'cors';
import alasql from 'alasql';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and body parsing
app.use(cors());
app.use(express.json());

// Serving images locally
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// ─── INITIALIZE ALASQL DATABASE ─────────────────────────────────────────────
console.log('Initializing self-contained pure JavaScript SQL database (Alasql)...');

// Create authentic Vista tables
alasql('CREATE TABLE tblFilm (Film_strCode STRING, Film_strTitle STRING, Film_strCensor STRING, Film_intDuration INT, Film_strDescription STRING, Film_strURL3 STRING, Film_strURL4 STRING)');
alasql('CREATE TABLE tblSession (Session_strCode STRING, Film_strCode STRING, Session_dtmShowing STRING, Screen_intNumber INT)');

// Populate authentic films from SQL Server backup
const filmRecords = [
  {
    Film_strCode: '0020000002',
    Film_strTitle: 'Pani Ch Madhaani',
    Film_strCensor: 'A',
    Film_intDuration: 140,
    Film_strDescription: 'Set in the 1980s, a struggling group of Punjabi musicians search for fame, love, and their big breakthrough in the UK, leading to a series of unexpected events.',
    Film_strURL3: '/images/pani_ch_madhaani_poster.svg',
    Film_strURL4: '/images/pani_ch_madhaani_backdrop.svg'
  },
  {
    Film_strCode: '0020000003',
    Film_strTitle: 'Sooryavanshi',
    Film_strCensor: 'U/A',
    Film_intDuration: 158,
    Film_strDescription: 'A daredevil Mumbai cop joins forces with two legendary officers to stop a major terror plot threatening the city, packing high-octane stunts and blockbuster entertainment.',
    Film_strURL3: '/images/sooryavanshi_poster.svg',
    Film_strURL4: '/images/sooryavanshi_backdrop.svg'
  },
  {
    Film_strCode: '0020000004',
    Film_strTitle: 'Honsla Rakh',
    Film_strCensor: 'U/A',
    Film_intDuration: 158,
    Film_strDescription: 'A single father navigates the struggles of parenting and dating in modern Vancouver, only for his ex-wife to suddenly reappear in his life causing a hilarious love-triangle.',
    Film_strURL3: '/images/honsla_rakh_poster.svg',
    Film_strURL4: '/images/honsla_rakh_backdrop.svg'
  },
  {
    Film_strCode: '0020000005',
    Film_strTitle: 'Fuffad Ji',
    Film_strCensor: 'U/A',
    Film_intDuration: 114,
    Film_strDescription: 'A satirical comedy about family rivalry, ego, and local politics in a traditional Punjabi household as a newlywed son-in-law challenges his senior brother-in-law.',
    Film_strURL3: '/images/fuffad_ji_poster.svg',
    Film_strURL4: '/images/fuffad_ji_backdrop.svg'
  },
  {
    Film_strCode: 'HO00002714',
    Film_strTitle: 'Dangal',
    Film_strCensor: 'U',
    Film_intDuration: 161,
    Film_strDescription: 'A former wrestler trains his daughters to become world-class champions against all social odds, leading them to India\'s first-ever gold medal in wrestling.',
    Film_strURL3: '/images/dangal_poster.svg',
    Film_strURL4: '/images/dangal_backdrop.svg'
  },
  {
    Film_strCode: 'HO00003138',
    Film_strTitle: 'Carry On Jatta 2',
    Film_strCensor: 'U/A',
    Film_intDuration: 135,
    Film_strDescription: 'A hilarious comedy of errors as a young orphan tries to win the heart of a girl who only wants to marry a man with a large family, resulting in chaos and confusion.',
    Film_strURL3: '/images/carry_on_jatta_2_poster.svg',
    Film_strURL4: '/images/carry_on_jatta_2_backdrop.svg'
  },
  {
    Film_strCode: 'HO00002829',
    Film_strTitle: 'Baahubali 2: The Conclusion',
    Film_strCensor: 'U/A',
    Film_intDuration: 167,
    Film_strDescription: 'The epic conclusion to the saga of Mahendra Baahubali and his quest to reclaim the throne of Mahishmati while uncovering the dark secrets of his legendary father\'s murder.',
    Film_strURL3: '/images/baahubali_2_poster.svg',
    Film_strURL4: '/images/baahubali_2_backdrop.svg'
  },
  {
    Film_strCode: 'HO00003034',
    Film_strTitle: 'Tiger Zinda Hai',
    Film_strCensor: 'U/A',
    Film_intDuration: 161,
    Film_strDescription: 'A massive action espionage thriller following super spies Tiger and Zoya as they team up to rescue a group of Indian and Pakistani nurses held hostage in Iraq.',
    Film_strURL3: '/images/tiger_zinda_hai_poster.svg',
    Film_strURL4: '/images/tiger_zinda_hai_backdrop.svg'
  }
];

alasql('INSERT INTO tblFilm SELECT * FROM ?', [filmRecords]);

// Populate authentic sessions including showtimes for all movies!
const sessionRecords = [
  // Now Showing Movies
  { Session_strCode: 's1_1', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-05T10:30:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_2', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-05T13:45:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_3', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-05T17:00:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_4', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-05T20:15:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_5', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-06T10:30:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_6', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-06T13:45:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_7', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-06T17:00:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_8', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-06T20:15:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_9', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-07T13:45:00', Screen_intNumber: 1 },
  { Session_strCode: 's1_10', Film_strCode: '0020000003', Session_dtmShowing: '2021-11-07T20:15:00', Screen_intNumber: 1 },
  { Session_strCode: 's2_1', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-05T11:00:00', Screen_intNumber: 2 },
  { Session_strCode: 's2_2', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-05T14:15:00', Screen_intNumber: 2 },
  { Session_strCode: 's2_3', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-05T17:30:00', Screen_intNumber: 2 },
  { Session_strCode: 's2_4', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-05T20:45:00', Screen_intNumber: 2 },
  { Session_strCode: 's2_5', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-06T11:00:00', Screen_intNumber: 2 },
  { Session_strCode: 's2_6', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-06T14:15:00', Screen_intNumber: 2 },
  { Session_strCode: 's2_7', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-06T17:30:00', Screen_intNumber: 2 },
  { Session_strCode: 's2_8', Film_strCode: '0020000004', Session_dtmShowing: '2021-11-06T20:45:00', Screen_intNumber: 2 },
  { Session_strCode: 's3_1', Film_strCode: '0020000005', Session_dtmShowing: '2021-11-05T12:00:00', Screen_intNumber: 1 },
  { Session_strCode: 's3_2', Film_strCode: '0020000005', Session_dtmShowing: '2021-11-05T15:30:00', Screen_intNumber: 2 },
  { Session_strCode: 's3_3', Film_strCode: '0020000005', Session_dtmShowing: '2021-11-06T12:00:00', Screen_intNumber: 1 },
  { Session_strCode: 's3_4', Film_strCode: '0020000005', Session_dtmShowing: '2021-11-06T15:30:00', Screen_intNumber: 2 },
  { Session_strCode: 's4_1', Film_strCode: '0020000002', Session_dtmShowing: '2021-11-05T10:00:00', Screen_intNumber: 2 },
  { Session_strCode: 's4_2', Film_strCode: '0020000002', Session_dtmShowing: '2021-11-05T16:00:00', Screen_intNumber: 2 },
  { Session_strCode: 's4_3', Film_strCode: '0020000002', Session_dtmShowing: '2021-11-06T10:00:00', Screen_intNumber: 2 },
  { Session_strCode: 's4_4', Film_strCode: '0020000002', Session_dtmShowing: '2021-11-06T16:00:00', Screen_intNumber: 2 },

  // Coming Soon Movies (Dynamic showtimes added for awesome demo experience!)
  // Carry On Jatta 2 (HO00003138)
  { Session_strCode: 'sc_1_1', Film_strCode: 'HO00003138', Session_dtmShowing: '2021-11-05T11:30:00', Screen_intNumber: 2 },
  { Session_strCode: 'sc_1_2', Film_strCode: 'HO00003138', Session_dtmShowing: '2021-11-05T15:45:00', Screen_intNumber: 1 },
  { Session_strCode: 'sc_1_3', Film_strCode: 'HO00003138', Session_dtmShowing: '2021-11-06T11:30:00', Screen_intNumber: 2 },
  { Session_strCode: 'sc_1_4', Film_strCode: 'HO00003138', Session_dtmShowing: '2021-11-06T18:15:00', Screen_intNumber: 1 },

  // Dangal (HO00002714)
  { Session_strCode: 'sc_2_1', Film_strCode: 'HO00002714', Session_dtmShowing: '2021-11-05T12:30:00', Screen_intNumber: 1 },
  { Session_strCode: 'sc_2_2', Film_strCode: 'HO00002714', Session_dtmShowing: '2021-11-06T15:45:00', Screen_intNumber: 2 },

  // Baahubali 2: The Conclusion (HO00002829)
  { Session_strCode: 'sc_3_1', Film_strCode: 'HO00002829', Session_dtmShowing: '2021-11-05T14:00:00', Screen_intNumber: 1 },
  { Session_strCode: 'sc_3_2', Film_strCode: 'HO00002829', Session_dtmShowing: '2021-11-06T20:30:00', Screen_intNumber: 2 },

  // Tiger Zinda Hai (HO00003034)
  { Session_strCode: 'sc_4_1', Film_strCode: 'HO00003034', Session_dtmShowing: '2021-11-05T16:30:00', Screen_intNumber: 2 },
  { Session_strCode: 'sc_4_2', Film_strCode: 'HO00003034', Session_dtmShowing: '2021-11-06T19:45:00', Screen_intNumber: 1 }
];

alasql('INSERT INTO tblSession SELECT * FROM ?', [sessionRecords]);
console.log('[SUCCESS] Self-contained pure SQL database initialized successfully!');

// Local, premium metadata mapping for details overlay
const FILM_METADATA = {
  '0020000003': {
    title: 'Sooryavanshi',
    synopsis: 'A daredevil Mumbai cop joins forces with two legendary officers to stop a major terror plot threatening the city, packing high-octane stunts and blockbuster entertainment.',
    posterUrl: '/images/sooryavanshi_poster.svg',
    backdropUrl: '/images/sooryavanshi_backdrop.svg',
    genre: 'Action / Crime / Thriller',
    language: 'Hindi',
    cast: ['Akshay Kumar', 'Katrina Kaif', 'Ajay Devgn', 'Ranveer Singh', 'Jaaved Jaaferi'],
    director: 'Rohit Shetty',
  },
  '0020000004': {
    title: 'Honsla Rakh',
    synopsis: 'A single father navigates the struggles of parenting and dating in modern Vancouver, only for his ex-wife to suddenly reappear in his life causing a hilarious love-triangle.',
    posterUrl: '/images/honsla_rakh_poster.svg',
    backdropUrl: '/images/honsla_rakh_backdrop.svg',
    genre: 'Comedy / Drama / Romance',
    language: 'Punjabi',
    cast: ['Diljit Dosanjh', 'Shehnaaz Gill', 'Sonam Bajwa', 'Shinda Grewal'],
    director: 'Amarjit Singh Saron',
  },
  '0020000005': {
    title: 'Fuffad Ji',
    synopsis: 'A satirical comedy about family rivalry, ego, and local politics in a traditional Punjabi household as a newlywed son-in-law challenges his senior brother-in-law.',
    posterUrl: '/images/fuffad_ji_poster.svg',
    backdropUrl: '/images/fuffad_ji_backdrop.svg',
    genre: 'Comedy / Family / Drama',
    language: 'Punjabi',
    cast: ['Binnu Dhillon', 'Gurnam Bhullar', 'Jaswinder Bhalla', 'Alby Dhindsa'],
    director: 'Pankaj Batra',
  },
  '0020000002': {
    title: 'Pani Ch Madhaani',
    synopsis: 'Set in the 1980s, a struggling group of Punjabi musicians search for fame, love, and their big breakthrough in the UK, leading to a series of unexpected events.',
    posterUrl: '/images/pani_ch_madhaani_poster.svg',
    backdropUrl: '/images/pani_ch_madhaani_backdrop.svg',
    genre: 'Drama / Comedy / Musical',
    language: 'Punjabi',
    cast: ['Gippy Grewal', 'Neeru Bajwa', 'Karamjit Anmol', 'Gurpreet Ghuggi'],
    director: 'Vijay Kumar Arora',
  },
  'HO00002714': {
    title: 'Dangal',
    synopsis: 'A former wrestler trains his daughters to become world-class champions against all social odds, leading them to India\'s first-ever gold medal in wrestling.',
    posterUrl: '/images/dangal_poster.svg',
    backdropUrl: '/images/dangal_backdrop.svg',
    genre: 'Action / Biography / Drama',
    language: 'Hindi',
    cast: ['Aamir Khan', 'Sakshi Tanwar', 'Fatima Sana Shaikh', 'Sanya Malhotra'],
    director: 'Nitesh Tiwari',
  },
  'HO00003138': {
    title: 'Carry On Jatta 2',
    synopsis: 'A hilarious comedy of errors as a young orphan tries to win the heart of a girl who only wants to marry a man with a large family, resulting in chaos and confusion.',
    posterUrl: '/images/carry_on_jatta_2_poster.svg',
    backdropUrl: '/images/carry_on_jatta_2_backdrop.svg',
    genre: 'Comedy / Romance',
    language: 'Punjabi',
    cast: ['Gippy Grewal', 'Sonam Bajwa', 'Gurpreet Ghuggi', 'Jaswinder Bhalla', 'Binnu Dhillon'],
    director: 'Smeep Kang',
  },
  'HO00002829': {
    title: 'Baahubali 2: The Conclusion',
    synopsis: 'The epic conclusion to the saga of Mahendra Baahubali and his quest to reclaim the throne of Mahishmati while uncovering the dark secrets of his legendary father\'s murder.',
    posterUrl: '/images/baahubali_2_poster.svg',
    backdropUrl: '/images/baahubali_2_backdrop.svg',
    genre: 'Action / Drama / Fantasy',
    language: 'Hindi / Telugu / Tamil',
    cast: ['Prabhas', 'Rana Daggubati', 'Anushka Shetty', 'Tamannaah Bhatia'],
    director: 'S.S. Rajamouli',
  },
  'HO00003034': {
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
  
  const diffTime = originalDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
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

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// GET /api/films
app.get('/api/films', (req, res) => {
  try {
    const result = alasql(`
      SELECT DISTINCT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
      FROM tblFilm f
      JOIN tblSession s ON f.Film_strCode = s.Film_strCode
      WHERE s.Session_dtmShowing >= '2021-11-01' AND f.Film_strTitle IS NOT NULL
    `);

    const films = result.map(row => {
      const code = row.Film_strCode.trim();
      const meta = FILM_METADATA[code] || {
        posterUrl: '/images/sooryavanshi_poster.svg',
        backdropUrl: '/images/sooryavanshi_backdrop.svg',
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
app.get('/api/coming-soon', (req, res) => {
  try {
    const result = alasql(`
      SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
      FROM tblFilm f
      WHERE f.Film_strCode IN ('HO00002714', 'HO00002829', 'HO00003034', 'HO00003138')
    `);

    const films = result.map(row => {
      const code = row.Film_strCode.trim();
      const meta = FILM_METADATA[code] || {
        posterUrl: '/images/sooryavanshi_poster.svg',
        backdropUrl: '/images/sooryavanshi_backdrop.svg',
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
app.get('/api/films/:filmId', (req, res) => {
  const { filmId } = req.params;
  try {
    const row = alasql(`
      SELECT f.Film_strCode, f.Film_strTitle, f.Film_strCensor, f.Film_intDuration, f.Film_strDescription, f.Film_strURL3, f.Film_strURL4
      FROM tblFilm f
      WHERE f.Film_strCode = ?
    `, [filmId])[0];

    if (!row) {
      return res.status(404).json({ error: 'Film not found' });
    }

    const code = row.Film_strCode.trim();
    const meta = FILM_METADATA[code] || {
      posterUrl: '/images/sooryavanshi_poster.svg',
      backdropUrl: '/images/sooryavanshi_backdrop.svg',
      genre: 'Drama / Action',
      language: 'Hindi',
      cast: [],
      director: 'Unknown',
    };

    const isComingSoon = ['HO00002714', 'HO00002829', 'HO00003034', 'HO00003138'].includes(code);

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
      isNowShowing: !isComingSoon
    });
  } catch (err) {
    console.error('Error fetching film details:', err);
    res.status(500).json({ error: 'Database error fetching film details' });
  }
});

// GET /api/films/:filmId/showtimes
app.get('/api/films/:filmId/showtimes', (req, res) => {
  const { filmId } = req.params;
  try {
    const result = alasql(`
      SELECT s.Session_strCode, s.Session_dtmShowing, s.Screen_intNumber
      FROM tblSession s
      WHERE s.Film_strCode = ? AND s.Session_dtmShowing >= '2021-11-01'
      ORDER BY s.Session_dtmShowing ASC
    `, [filmId]);

    const grouped = {};
    result.forEach(row => {
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
app.get('/api/seat-layouts/:showtimeId', (req, res) => {
  const { showtimeId } = req.params;
  try {
    const seed = hashCode(showtimeId);
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;

    const layoutRows = rows.map((rowChar, rowIndex) => {
      const seats = [];
      for (let sNum = 1; sNum <= seatsPerRow; sNum++) {
        const hash = Math.abs(hashCode(`${showtimeId}-${rowChar}-${sNum}`));
        const isReservedInDB = bookings.some(b => b.showtimeId === showtimeId && b.seats.includes(`${rowChar}${sNum}`));
        const isBooked = isReservedInDB || (hash % 7 === 0 || hash % 13 === 0);

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
app.post('/api/orders', (req, res) => {
  const { showtimeId, filmId, seats, phone, ticketType } = req.body;
  const name = req.body.name || 'Guest User';
  const email = req.body.email || 'guest@rajpalcinema.com';

  if (!showtimeId || !filmId || !seats || !seats.length) {
    return res.status(400).json({ error: 'Missing required checkout information.' });
  }

  try {
    const filmRow = alasql(`
      SELECT f.Film_strTitle FROM tblFilm f WHERE f.Film_strCode = ?
    `, [filmId])[0];

    const filmTitle = filmRow ? filmRow.Film_strTitle.trim() : 'Unknown Movie';
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
