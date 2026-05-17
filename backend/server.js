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
    Film_strTitle: 'Warfare',
    Film_strCensor: 'A',
    Film_intDuration: 140,
    Film_strDescription: 'A raw, unfiltered look at modern combat as experienced by a platoon of Navy SEALs during a single night in Ramadi, Iraq.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BNjI4MjJiMWYtYmRhMS00OGE0LWJkMjctODc1MDllYjBmMjQ5XkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://images.hdqwalls.com/wallpapers/warfare-movie-2025-4k-4h.jpg'
  },
  {
    Film_strCode: '0020000003',
    Film_strTitle: 'Sikandar',
    Film_strCensor: 'U/A',
    Film_intDuration: 158,
    Film_strDescription: 'A gripping action-thriller that follows a fearless warrior on an epic quest for justice. Salman Khan delivers a powerhouse performance as a man caught between duty and destiny.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BM2RmMDMwYzQtNjc2YS00NjRhLTgyNzUtMGZlYzIxODE1ZTk5XkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2025/03/Sikandar.jpg'
  },
  {
    Film_strCode: '0020000004',
    Film_strTitle: 'Thunderbolts*',
    Film_strCensor: 'U/A',
    Film_intDuration: 158,
    Film_strDescription: 'Marvel\'s most dangerous anti-heroes are forced to work together on a deadly mission that none of them signed up for.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BNTg0OTljMjQtZWQxZi00OGIyLThlNjEtMjQ0ZTRjNTdmZjRkXkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://cdn.marvel.com/content/1x/thunderboltsasterisk_lob_crd_03.jpg'
  },
  {
    Film_strCode: '0020000005',
    Film_strTitle: 'Final Destination: Bloodlines',
    Film_strCensor: 'U/A',
    Film_intDuration: 114,
    Film_strDescription: 'Death returns with terrifying new designs in this blood-curdling installment. A young woman discovers she can see how people will die.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BNmRjMTdhODAtZTMxNS00OTc2LWI0ODktMzQ3Njk2MTBjODk4XkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://images.hdqwalls.com/wallpapers/final-destination-bloodlines-2025-4k-cd.jpg'
  },
  {
    Film_strCode: 'HO00002714',
    Film_strTitle: 'Deva',
    Film_strCensor: 'U/A',
    Film_intDuration: 162,
    Film_strDescription: 'Dev Ambre Rathore is a brilliant but unorthodox cop who dives headfirst into Mumbai\'s criminal underworld.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BYmI0NjA5NzgtYzY3MC00NDVjLWFiOTMtNDA0MTM1YjkwZTBiXkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://stat4.bollywoodhungama.in/wp-content/uploads/2025/01/Deva-4.jpg'
  },
  {
    Film_strCode: 'HO00003138',
    Film_strTitle: 'Fateh',
    Film_strCensor: 'U/A',
    Film_intDuration: 140,
    Film_strDescription: 'A retired special-ops agent leads a solitary life until a young girl falls victim to a ruthless cybercrime syndicate.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BMWIzMGJkNjItMjQyOC00ZjFhLWExNTktNDFiMjk2NTQ4NDg2XkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2025/01/Fateh-16.jpg'
  },
  {
    Film_strCode: 'HO00002829',
    Film_strTitle: 'Pushpa 2: The Rule',
    Film_strCensor: 'U/A',
    Film_intDuration: 182,
    Film_strDescription: 'The clash between Pushpa Raj and SP Bhanwar Singh Shekhawat continues in this high-octane sequel.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BN2JiMTkyYzktNzg4Ny00OTVkLTk0MGEtN2ZlYjdiN2Q1ZjNhXkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2024/04/Pushpa-2-%E2%80%93-The-Rule-1.jpeg'
  },
  {
    Film_strCode: 'HO00003034',
    Film_strTitle: 'Singham Again',
    Film_strCensor: 'U/A',
    Film_intDuration: 164,
    Film_strDescription: 'Bajirao Singham is back in Rohit Shetty\'s expanded cop universe, joined by India\'s top officers on a high-stakes cross-border mission.',
    Film_strURL3: 'https://m.media-amazon.com/images/M/MV5BMGUyMjc3YTUtMTU4My00MTliLThkM2UtN2FhYjFiNzI0MGFmXkEyXkFqcGc@._V1_.jpg',
    Film_strURL4: 'https://static.toiimg.com/photo/114757116.jpeg'
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
  '0020000002': {
    title: 'Warfare',
    synopsis: 'A raw, unfiltered look at modern combat as experienced by a platoon of Navy SEALs during a single night in Ramadi, Iraq.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNjI4MjJiMWYtYmRhMS00OGE0LWJkMjctODc1MDllYjBmMjQ5XkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://images.hdqwalls.com/wallpapers/warfare-movie-2025-4k-4h.jpg',
    genre: 'Action / War / Thriller',
    language: 'English',
    cast: ['Navy SEAL Platoon'],
    director: 'Alex Garland',
  },
  '0020000003': {
    title: 'Sikandar',
    synopsis: 'A gripping action-thriller that follows a fearless warrior on an epic quest for justice. Salman Khan delivers a powerhouse performance as a man caught between duty and destiny.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BM2RmMDMwYzQtNjc2YS00NjRhLTgyNzUtMGZlYzIxODE1ZTk5XkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2025/03/Sikandar.jpg',
    genre: 'Action / Thriller / Drama',
    language: 'Hindi',
    cast: ['Salman Khan', 'Rashmika Mandanna', 'Kajal Aggarwal', 'Sathyaraj'],
    director: 'A.R. Murugadoss',
  },
  '0020000004': {
    title: 'Thunderbolts*',
    synopsis: 'Marvel\'s most dangerous anti-heroes are forced to work together on a deadly mission that none of them signed up for.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNTg0OTljMjQtZWQxZi00OGIyLThlNjEtMjQ0ZTRjNTdmZjRkXkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://cdn.marvel.com/content/1x/thunderboltsasterisk_lob_crd_03.jpg',
    genre: 'Action / Adventure / Sci-Fi',
    language: 'English',
    cast: ['Florence Pugh', 'Sebastian Stan', 'David Harbour', 'Wyatt Russell', 'Olga Kurylenko', 'Hannah John-Kamen', 'Julia Louis-Dreyfus'],
    director: 'Jake Schreier',
  },
  '0020000005': {
    title: 'Final Destination: Bloodlines',
    synopsis: 'Death returns with terrifying new designs in this blood-curdling installment. A young woman discovers she can see how people will die.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BNmRjMTdhODAtZTMxNS00OTc2LWI0ODktMzQ3Njk2MTBjODk4XkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://images.hdqwalls.com/wallpapers/final-destination-bloodlines-2025-4k-cd.jpg',
    genre: 'Horror / Mystery / Thriller',
    language: 'English',
    cast: ['Brec Bassinger', 'Teo Briones', 'Kaitlyn Santa Juana', 'Richard Harmon'],
    director: 'Zach Lipovsky, Adam B. Stein',
  },
  'HO00002714': {
    title: 'Deva',
    synopsis: 'Dev Ambre Rathore is a brilliant but unorthodox cop who dives headfirst into Mumbai\'s criminal underworld.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYmI0NjA5NzgtYzY3MC00NDVjLWFiOTMtNDA0MTM1YjkwZTBiXkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://stat4.bollywoodhungama.in/wp-content/uploads/2025/01/Deva-4.jpg',
    genre: 'Action / Drama',
    language: 'Hindi',
    cast: ['Shahid Kapoor', 'Pooja Hegde', 'Pavail Gulati'],
    director: 'Rosshan Andrrews',
  },
  'HO00003138': {
    title: 'Fateh',
    synopsis: 'A retired special-ops agent leads a solitary life until a young girl falls victim to a ruthless cybercrime syndicate.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMWIzMGJkNjItMjQyOC00ZjFhLWExNTktNDFiMjk2NTQ4NDg2XkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2025/01/Fateh-16.jpg',
    genre: 'Action / Thriller',
    language: 'Hindi',
    cast: ['Sonu Sood', 'Jacqueline Fernandez', 'Naseeruddin Shah'],
    director: 'Sonu Sood',
  },
  'HO00002829': {
    title: 'Pushpa 2: The Rule',
    synopsis: 'The clash between Pushpa Raj and SP Bhanwar Singh Shekhawat continues in this high-octane sequel.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BN2JiMTkyYzktNzg4Ny00OTVkLTk0MGEtN2ZlYjdiN2Q1ZjNhXkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://stat5.bollywoodhungama.in/wp-content/uploads/2024/04/Pushpa-2-%E2%80%93-The-Rule-1.jpeg',
    genre: 'Action / Drama / Thriller',
    language: 'Telugu / Hindi / Tamil',
    cast: ['Allu Arjun', 'Fahadh Faasil', 'Rashmika Mandanna'],
    director: 'Sukumar',
  },
  'HO00003034': {
    title: 'Singham Again',
    synopsis: 'Bajirao Singham is back in Rohit Shetty\'s expanded cop universe, joined by India\'s top officers on a high-stakes cross-border mission.',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMGUyMjc3YTUtMTU4My00MTliLThkM2UtN2FhYjFiNzI0MGFmXkEyXkFqcGc@._V1_.jpg',
    backdropUrl: 'https://static.toiimg.com/photo/114757116.jpeg',
    genre: 'Action / Crime / Thriller',
    language: 'Hindi',
    cast: ['Ajay Devgn', 'Kareena Kapoor Khan', 'Ranveer Singh', 'Akshay Kumar', 'Deepika Padukone', 'Tiger Shroff', 'Arjun Kapoor'],
    director: 'Rohit Shetty',
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
        const isBooked = isReservedInDB; // Booked status comes ONLY from database bookings!

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
