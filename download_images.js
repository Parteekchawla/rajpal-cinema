import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIR = path.join(__dirname, 'public', 'images');

// Ensure directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Media assets mapping
const assets = {
  'sooryavanshi_poster': 'https://image.tmdb.org/t/p/w500/84XP913VdD65TzHq2i7X5N45d5a.jpg',
  'sooryavanshi_backdrop': 'https://stat4.bollywoodhungama.in/wp-content/uploads/2021/11/Sooryavanshi-16.jpg',
  
  'honsla_rakh_poster': 'https://m.media-amazon.com/images/M/MV5BYzg0YmRlZTUtYzVkYS00OTlhLTlhOWUtNDQ3MDAxY2EwYmU0XkEyXkFqcGc@._V1_.jpg',
  'honsla_rakh_backdrop': 'https://images.tribuneindia.com/cms/galleries/image/489066d7-62a2-4a00-afab-8f9f7435f3df.jpg',
  
  'fuffad_ji_poster': 'https://m.media-amazon.com/images/M/MV5BMjA5OTdiYzAtNjliMy00NjcyLTlhMDYtZjhmMWZmNjg5NmY1XkEyXkFqcGc@._V1_.jpg',
  'fuffad_ji_backdrop': 'https://stat4.bollywoodhungama.in/wp-content/uploads/2021/11/Fuffad-Ji-4.jpg',
  
  'pani_ch_madhaani_poster': 'https://m.media-amazon.com/images/M/MV5BMDFkNGMwNjEtOGMzYi00MTc0LThkNDItZmNmZmY2MzE4MjQ4XkEyXkFqcGc@._V1_.jpg',
  'pani_ch_madhaani_backdrop': 'https://images.tribuneindia.com/cms/galleries/image/1d9571be-ff9e-4e78-9080-60b6bbf20a9a.jpg',
  
  'dangal_poster': 'https://upload.wikimedia.org/wikipedia/en/9/99/Dangal_Poster.jpg',
  'dangal_backdrop': 'https://stat4.bollywoodhungama.in/wp-content/uploads/2016/12/Dangal-33.jpg',
  
  'tiger_zinda_hai_poster': 'https://upload.wikimedia.org/wikipedia/en/2/23/Tiger_Zinda_Hai_poster.jpg',
  'tiger_zinda_hai_backdrop': 'https://stat4.bollywoodhungama.in/wp-content/uploads/2017/12/Tiger-Zinda-Hai-36.jpg',
  
  'baahubali_2_poster': 'https://upload.wikimedia.org/wikipedia/en/f/f9/Baahubali_2_The_Conclusion_poster.jpg',
  'baahubali_2_backdrop': 'https://images.hdqwalls.com/wallpapers/baahubali-2-the-conclusion-2017-movie-poster-w2.jpg',
  
  'carry_on_jatta_2_poster': 'https://upload.wikimedia.org/wikipedia/en/e/eb/Carry_On_Jatta_2.jpg',
  'carry_on_jatta_2_backdrop': 'https://stat5.bollywoodhungama.in/wp-content/uploads/2018/06/Carry-On-Jatta-2-3.jpg'
};

// Download helper with redirect handling and custom headers to look like a desktop client
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    const requestCaller = url.startsWith('https') ? https : http;

    requestCaller.get(options, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).href;
        }
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

// Main download runner
async function main() {
  console.log(`Starting media asset downloads to: ${TARGET_DIR}`);
  
  for (const [name, url] of Object.entries(assets)) {
    const dest = path.join(TARGET_DIR, `${name}.jpg`);
    console.log(`Downloading: ${name}...`);
    try {
      await downloadFile(url, dest);
      console.log(`[SUCCESS] Downloaded ${name}`);
    } catch (err) {
      console.error(`[ERROR] Failed downloading ${name} (${url}):`, err.message);
    }
  }
  console.log('All downloads completed!');
}

main().catch(console.error);
