import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEST_PATH = path.join(__dirname, 'playit.exe');
const PLAYIT_URL = 'https://github.com/playit-gg/playit-agent/releases/download/v0.15.26/playit-windows-x86_64-v0.15.26.exe';

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    const requestCaller = url.startsWith('https') ? https : http;

    requestCaller.get(options, (res) => {
      // Handle redirects (GitHub uses redirects for releases)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          redirectUrl = new URL(redirectUrl, url).href;
        }
        return downloadFile(redirectUrl, destPath).then(resolve).catch(reject);
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download Playit: status code ${res.statusCode}`));
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

async function main() {
  console.log(`Downloading Playit.gg executable directly to D: drive...`);
  try {
    await downloadFile(PLAYIT_URL, DEST_PATH);
    console.log(`[SUCCESS] Playit.exe downloaded perfectly to: ${DEST_PATH}`);
  } catch (err) {
    console.error(`[ERROR] Failed downloading Playit.exe:`, err.message);
  }
}

main().catch(console.error);
