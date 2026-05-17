import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, 'public', 'images');

// Ensure directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const movies = {
  'sooryavanshi': {
    title: 'SOORYAVANSHI',
    tagline: 'Action / Crime / Thriller',
    info: 'Hindi  •  2h 38m  •  U/A',
    badge: 'NOW SHOWING',
    badgeColor: '#DC2626',
    gradStart: '#e11d48',
    gradEnd: '#1e1b4b',
    goldStart: '#F59E0B',
    goldEnd: '#D97706'
  },
  'honsla_rakh': {
    title: 'HONSLA RAKH',
    tagline: 'Comedy / Drama / Romance',
    info: 'Punjabi  •  2h 38m  •  U/A',
    badge: 'NOW SHOWING',
    badgeColor: '#DC2626',
    gradStart: '#db2777',
    gradEnd: '#311042',
    goldStart: '#F472B6',
    goldEnd: '#BE185D'
  },
  'fuffad_ji': {
    title: 'FUFFAD JI',
    tagline: 'Comedy / Family / Drama',
    info: 'Punjabi  •  1h 54m  •  U/A',
    badge: 'NOW SHOWING',
    badgeColor: '#DC2626',
    gradStart: '#0d9488',
    gradEnd: '#0f172a',
    goldStart: '#2DD4BF',
    goldEnd: '#0D9488'
  },
  'pani_ch_madhaani': {
    title: 'PANI CH MADHAANI',
    tagline: 'Drama / Comedy / Musical',
    info: 'Punjabi  •  2h 20m  •  A',
    badge: 'NOW SHOWING',
    badgeColor: '#DC2626',
    gradStart: '#ea580c',
    gradEnd: '#311042',
    goldStart: '#FB923C',
    goldEnd: '#C2410C'
  },
  'dangal': {
    title: 'DANGAL',
    tagline: 'Action / Biography / Drama',
    info: 'Hindi  •  2h 42m  •  U',
    badge: 'COMING SOON',
    badgeColor: '#D97706',
    gradStart: '#854d0e',
    gradEnd: '#172554',
    goldStart: '#F59E0B',
    goldEnd: '#B45309'
  },
  'tiger_zinda_hai': {
    title: 'TIGER ZINDA HAI',
    tagline: 'Action / Thriller / Adventure',
    info: 'Hindi  •  2h 44m  •  U/A',
    badge: 'COMING SOON',
    badgeColor: '#D97706',
    gradStart: '#3f6212',
    gradEnd: '#0f172a',
    goldStart: '#A3E635',
    goldEnd: '#4D7C0F'
  },
  'baahubali_2': {
    title: 'BAAHUBALI 2',
    tagline: 'Action / Drama / Fantasy',
    info: 'Hindi / Telugu / Tamil  •  2h 47m  •  U/A',
    badge: 'COMING SOON',
    badgeColor: '#D97706',
    gradStart: '#6b21a8',
    gradEnd: '#1e1b4b',
    goldStart: '#F59E0B',
    goldEnd: '#D97706'
  },
  'carry_on_jatta_2': {
    title: 'CARRY ON JATTA 2',
    tagline: 'Comedy / Romance',
    info: 'Punjabi  •  2h 00m  •  U/A',
    badge: 'COMING SOON',
    badgeColor: '#D97706',
    gradStart: '#0284c7',
    gradEnd: '#0f172a',
    goldStart: '#38BDF8',
    goldEnd: '#0369A1'
  }
};

function generatePoster(movie) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-${movie.title.toLowerCase().replace(/ /g, '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${movie.gradStart}" />
      <stop offset="100%" stop-color="${movie.gradEnd}" />
    </linearGradient>
    <linearGradient id="gold-${movie.title.toLowerCase().replace(/ /g, '_')}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${movie.goldStart}" />
      <stop offset="100%" stop-color="${movie.goldEnd}" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Rect -->
  <rect width="100%" height="100%" fill="url(#bg-${movie.title.toLowerCase().replace(/ /g, '_')})" rx="24" />

  <!-- Elegant Interior Border -->
  <rect x="20" y="20" width="360" height="560" fill="none" stroke="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="2" stroke-opacity="0.35" rx="16" />

  <!-- Stylized Cinema Graphic in the center -->
  <g transform="translate(200, 230) scale(1.6)">
    <circle cx="0" cy="0" r="50" fill="#ffffff" fill-opacity="0.03" />
    <circle cx="0" cy="0" r="40" fill="none" stroke="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="1.5" stroke-opacity="0.2" />
    
    <!-- Reel Projector Icons / Artistic Shapes -->
    <path d="M-15,-15 L15,15 M-15,15 L15,-15" stroke="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="3" stroke-linecap="round" stroke-opacity="0.7" />
    <circle cx="0" cy="0" r="28" fill="none" stroke="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="4" filter="url(#glow)" />
    <circle cx="0" cy="0" r="14" fill="none" stroke="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="2" />
    
    <!-- Outer accent dots -->
    <circle cx="0" cy="-38" r="3" fill="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" />
    <circle cx="38" cy="0" r="3" fill="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" />
    <circle cx="0" cy="38" r="3" fill="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" />
    <circle cx="-38" cy="0" r="3" fill="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" />
  </g>

  <!-- Movie Status Badge -->
  <rect x="40" y="40" width="125" height="30" fill="${movie.badgeColor}" rx="8" />
  <text x="102.5" y="59" fill="#ffffff" font-family="'Outfit', 'Inter', sans-serif" font-size="11" font-weight="800" letter-spacing="1" text-anchor="middle">${movie.badge}</text>

  <!-- Movie Censor Rating Badge (top right) -->
  <rect x="310" y="40" width="50" height="30" fill="#000000" fill-opacity="0.6" stroke="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="1.5" rx="8" />
  <text x="335" y="59" fill="#ffffff" font-family="'Outfit', 'Inter', sans-serif" font-size="12" font-weight="800" text-anchor="middle">${movie.info.split('•')[2].trim()}</text>

  <!-- Film Title & Details Box at the bottom -->
  <rect x="30" y="420" width="340" height="135" fill="#030712" fill-opacity="0.75" rx="16" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1" />
  
  <text x="200" y="465" fill="url(#gold-${movie.title.toLowerCase().replace(/ /g, '_')})" font-family="'Outfit', 'Inter', sans-serif" font-size="24" font-weight="900" letter-spacing="0.5" text-anchor="middle">${movie.title}</text>
  
  <text x="200" y="498" fill="#D1D5DB" font-family="'Outfit', 'Inter', sans-serif" font-size="13" font-weight="600" text-anchor="middle">${movie.tagline}</text>
  
  <text x="200" y="525" fill="#9CA3AF" font-family="'Outfit', 'Inter', sans-serif" font-size="12" font-weight="500" letter-spacing="0.5" text-anchor="middle">${movie.info}</text>

  <!-- Decorative Branding at the very bottom -->
  <text x="200" y="580" fill="#ffffff" fill-opacity="0.2" font-family="'Outfit', 'Inter', sans-serif" font-size="9" font-weight="700" letter-spacing="5" text-anchor="middle">RAJPAL CINEMA</text>
</svg>`;
}

function generateBackdrop(movie) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="100%" height="100%">
  <defs>
    <linearGradient id="bg-back-${movie.title.toLowerCase().replace(/ /g, '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${movie.gradStart}" />
      <stop offset="100%" stop-color="${movie.gradEnd}" />
    </linearGradient>
    <linearGradient id="gold-back-${movie.title.toLowerCase().replace(/ /g, '_')}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${movie.goldStart}" />
      <stop offset="100%" stop-color="${movie.goldEnd}" />
    </linearGradient>
    <filter id="glow-back" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bg-back-${movie.title.toLowerCase().replace(/ /g, '_')})" />

  <!-- Premium Cinematic Overlays -->
  <rect x="30" y="30" width="1140" height="615" fill="none" stroke="url(#gold-back-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="3" stroke-opacity="0.2" rx="20" />

  <!-- Huge elegant glowing graphic -->
  <g transform="translate(600, 300) scale(2.5)">
    <circle cx="0" cy="0" r="80" fill="#ffffff" fill-opacity="0.02" />
    <circle cx="0" cy="0" r="60" fill="none" stroke="url(#gold-back-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="1" stroke-opacity="0.15" />
    <path d="M-25,-25 L25,25 M-25,25 L25,-25" stroke="url(#gold-back-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="2" stroke-linecap="round" stroke-opacity="0.5" />
    <circle cx="0" cy="0" r="45" fill="none" stroke="url(#gold-back-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="5" filter="url(#glow-back)" />
    <circle cx="0" cy="0" r="20" fill="none" stroke="url(#gold-back-${movie.title.toLowerCase().replace(/ /g, '_')})" stroke-width="2" />
  </g>

  <!-- Bottom vignette fade for modern overlay contrast -->
  <rect x="0" y="400" width="1200" height="275" fill="black" fill-opacity="0.6" />

  <!-- Text elements on the left corner -->
  <g transform="translate(80, 520)">
    <!-- Movie Title -->
    <text x="0" y="0" fill="url(#gold-back-${movie.title.toLowerCase().replace(/ /g, '_')})" font-family="'Outfit', 'Inter', sans-serif" font-size="54" font-weight="900" letter-spacing="1">${movie.title}</text>
    
    <!-- Genre & Tags -->
    <text x="0" y="45" fill="#E5E7EB" font-family="'Outfit', 'Inter', sans-serif" font-size="20" font-weight="600">${movie.tagline}  •  ${movie.info}</text>
  </g>

  <!-- Cinema Brand on top-right -->
  <text x="1120" y="80" fill="#ffffff" fill-opacity="0.3" font-family="'Outfit', 'Inter', sans-serif" font-size="16" font-weight="800" letter-spacing="6" text-anchor="end">RAJPAL CINEMA PREMIUM</text>
</svg>`;
}

async function main() {
  console.log(`Generating custom vector SVG posters to: ${TARGET_DIR}`);
  
  for (const [key, movie] of Object.entries(movies)) {
    const posterPath = path.join(TARGET_DIR, `${key}_poster.svg`);
    const backdropPath = path.join(TARGET_DIR, `${key}_backdrop.svg`);
    
    fs.writeFileSync(posterPath, generatePoster(movie));
    console.log(`[SUCCESS] Generated local poster: ${key}_poster.svg`);
    
    fs.writeFileSync(backdropPath, generateBackdrop(movie));
    console.log(`[SUCCESS] Generated local backdrop: ${key}_backdrop.svg`);
  }
  
  console.log('All local SVG vector assets generated successfully!');
}

main().catch(console.error);
