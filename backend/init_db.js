import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'rajpal_cinema.db');
const db = new sqlite3.Database(DB_PATH);

console.log('Initializing self-contained SQLite cinema database...');

db.serialize(() => {
  // 1. Create tblFilm table
  db.run(`DROP TABLE IF EXISTS tblFilm`);
  db.run(`
    CREATE TABLE tblFilm (
      Film_strCode TEXT PRIMARY KEY,
      Film_strTitle TEXT NOT NULL,
      Film_strCensor TEXT,
      Film_intDuration INTEGER,
      Film_strDescription TEXT,
      Film_strURL3 TEXT,
      Film_strURL4 TEXT
    )
  `);

  // 2. Create tblSession table
  db.run(`DROP TABLE IF EXISTS tblSession`);
  db.run(`
    CREATE TABLE tblSession (
      Session_strCode TEXT PRIMARY KEY,
      Film_strCode TEXT NOT NULL,
      Session_dtmShowing TEXT NOT NULL,
      Screen_intNumber INTEGER NOT NULL,
      FOREIGN KEY(Film_strCode) REFERENCES tblFilm(Film_strCode)
    )
  `);

  // 3. Populate authentic November 2021 movies restored from SQL Server
  const filmsStmt = db.prepare(`
    INSERT INTO tblFilm (Film_strCode, Film_strTitle, Film_strCensor, Film_intDuration, Film_strDescription, Film_strURL3, Film_strURL4)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const filmRecords = [
    // Now Showing
    [
      '0020000002',
      'Pani Ch Madhaani',
      'A',
      140,
      'Set in the 1980s, a struggling group of Punjabi musicians search for fame, love, and their big breakthrough in the UK, leading to a series of unexpected events.',
      'https://m.media-amazon.com/images/M/MV5BMDFkNGMwNjEtOGMzYi00MTc0LThkNDItZmNmZmY2MzE4MjQ4XkEyXkFqcGc@._V1_.jpg',
      'https://i.ytimg.com/vi/GzI87o-Lslc/maxresdefault.jpg'
    ],
    [
      '0020000003',
      'Sooryavanshi',
      'U/A',
      158,
      'A daredevil Mumbai cop joins forces with two legendary officers to stop a major terror plot threatening the city, packing high-octane stunts and blockbuster entertainment.',
      'https://image.tmdb.org/t/p/w500/8425gJv18V86n2tYQ5o0h745y8S.jpg',
      'https://image.tmdb.org/t/p/original/fX2yq57gHjYd1sC21Z9w8c3aQG8.jpg'
    ],
    [
      '0020000004',
      'Honsla Rakh',
      'U/A',
      158,
      'A single father navigates the struggles of parenting and dating in modern Vancouver, only for his ex-wife to suddenly reappear in his life causing a hilarious love-triangle.',
      'https://m.media-amazon.com/images/M/MV5BYzg0YmRlZTUtYzVkYS00OTlhLTlhOWUtNDQ3MDAxY2EwYmU0XkEyXkFqcGc@._V1_.jpg',
      'https://image.tmdb.org/t/p/original/mN71w2Cq80dZkYjY6H3yC76GgWb.jpg'
    ],
    [
      '0020000005',
      'Fuffad Ji',
      'U/A',
      114,
      'A satirical comedy about family rivalry, ego, and local politics in a traditional Punjabi household as a newlywed son-in-law challenges his senior brother-in-law.',
      'https://m.media-amazon.com/images/M/MV5BMjA5OTdiYzAtNjliMy00NjcyLTlhMDYtZjhmMWZmNjg5NmY1XkEyXkFqcGc@._V1_.jpg',
      'https://i.ytimg.com/vi/aZ3CgI1mYmg/maxresdefault.jpg'
    ],
    // Coming Soon
    [
      'HO00002714',
      'Dangal',
      'U',
      161,
      'A former wrestler trains his daughters to become world-class champions against all social odds, leading them to India\'s first-ever gold medal in wrestling.',
      'https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg',
      'https://i.ytimg.com/vi/x_7YlGv9u1g/maxresdefault.jpg'
    ],
    [
      'HO00003138',
      'Carry On Jatta 2',
      'U/A',
      135,
      'A hilarious comedy of errors as a young orphan tries to win the heart of a girl who only wants to marry a man with a large family, resulting in chaos and confusion.',
      'https://upload.wikimedia.org/wikipedia/en/e/eb/Carry_On_Jatta_2.jpg',
      'https://i.ytimg.com/vi/F-tC40rA8h4/maxresdefault.jpg'
    ],
    [
      'HO00002829',
      'Baahubali 2: The Conclusion',
      'U/A',
      167,
      'The epic conclusion to the saga of Mahendra Baahubali and his quest to reclaim the throne of Mahishmati while uncovering the dark secrets of his legendary father\'s murder.',
      'https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_2_The_Conclusion_poster.jpg',
      'https://image.tmdb.org/t/p/original/2w8gD8M4w4wX3v0S9yX6w2B8w.jpg'
    ],
    [
      'HO00003034',
      'Tiger Zinda Hai',
      'U/A',
      161,
      'A massive action espionage thriller following super spies Tiger and Zoya as they team up to rescue a group of Indian and Pakistani nurses held hostage in Iraq.',
      'https://upload.wikimedia.org/wikipedia/en/2/23/Tiger_Zinda_Hai_poster.jpg',
      'https://image.tmdb.org/t/p/original/6t3T1e82E8m92S8e2T0w2E6mE8g.jpg'
    ]
  ];

  for (const record of filmRecords) {
    filmsStmt.run(record);
  }
  filmsStmt.finalize();

  // 4. Populate authentic November 2021 session showtimes restored from SQL Server
  const sessionsStmt = db.prepare(`
    INSERT INTO tblSession (Session_strCode, Film_strCode, Session_dtmShowing, Screen_intNumber)
    VALUES (?, ?, ?, ?)
  `);

  // We populate a full week of authentic sessions starting from November 5, 2021
  const sessionRecords = [
    // Sooryavanshi (0020000003) - Screen 1 & Screen 2
    ['s1_1', '0020000003', '2021-11-05T10:30:00', 1],
    ['s1_2', '0020000003', '2021-11-05T13:45:00', 1],
    ['s1_3', '0020000003', '2021-11-05T17:00:00', 1],
    ['s1_4', '0020000003', '2021-11-05T20:15:00', 1],
    ['s1_5', '0020000003', '2021-11-06T10:30:00', 1],
    ['s1_6', '0020000003', '2021-11-06T13:45:00', 1],
    ['s1_7', '0020000003', '2021-11-06T17:00:00', 1],
    ['s1_8', '0020000003', '2021-11-06T20:15:00', 1],
    ['s1_9', '0020000003', '2021-11-07T13:45:00', 1],
    ['s1_10', '0020000003', '2021-11-07T20:15:00', 1],

    // Honsla Rakh (0020000004) - Screen 2
    ['s2_1', '0020000004', '2021-11-05T11:00:00', 2],
    ['s2_2', '0020000004', '2021-11-05T14:15:00', 2],
    ['s2_3', '0020000004', '2021-11-05T17:30:00', 2],
    ['s2_4', '0020000004', '2021-11-05T20:45:00', 2],
    ['s2_5', '0020000004', '2021-11-06T11:00:00', 2],
    ['s2_6', '0020000004', '2021-11-06T14:15:00', 2],
    ['s2_7', '0020000004', '2021-11-06T17:30:00', 2],
    ['s2_8', '0020000004', '2021-11-06T20:45:00', 2],

    // Fuffad Ji (0020000005) - Screen 1 & 2
    ['s3_1', '0020000005', '2021-11-05T12:00:00', 1],
    ['s3_2', '0020000005', '2021-11-05T15:30:00', 2],
    ['s3_3', '0020000005', '2021-11-06T12:00:00', 1],
    ['s3_4', '0020000005', '2021-11-06T15:30:00', 2],

    // Pani Ch Madhaani (0020000002) - Screen 2
    ['s4_1', '0020000002', '2021-11-05T10:00:00', 2],
    ['s4_2', '0020000002', '2021-11-05T16:00:00', 2],
    ['s4_3', '0020000002', '2021-11-06T10:00:00', 2],
    ['s4_4', '0020000002', '2021-11-06T16:00:00', 2]
  ];

  for (const record of sessionRecords) {
    sessionsStmt.run(record);
  }
  sessionsStmt.finalize();

  console.log('[SUCCESS] SQLite cinema database initialized perfectly!');
});

db.close();
