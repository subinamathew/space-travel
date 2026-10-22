import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targets = [
  { slug: 'sun', title: 'File:3D_Sun.png' },
  { slug: 'mercury', title: 'File:3D_Mercury.png' },
  { slug: 'venus', title: 'File:3D_Venus.png' },
  { slug: 'earth', title: 'File:The_Earth_seen_from_Apollo_17_with_transparent_background.png' },
  { slug: 'mars', title: 'File:3D_Mars.png' },
  { slug: 'jupiter', title: 'File:3D_Jupiter.png' },
  { slug: 'saturn', title: 'File:3D_Saturn.png' },
  { slug: 'uranus', title: 'File:3D_Uranus.png' },
  { slug: 'neptune', title: 'File:3D_Neptune.png' }
];

const publicImagesDir = path.resolve(__dirname, '../public/images');
const rootImagesDir = path.resolve(__dirname, '../images');

[publicImagesDir, rootImagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function getImageUrl(fileTitle) {
  const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
  const res = await fetch(apiUrl, {
    headers: { 'User-Agent': 'SpaceTravelBot/1.0 (https://github.com/space-travel; info@space-travel.org) NodeFetch/3.0' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages || {};
  for (const k in pages) {
    const info = pages[k]?.imageinfo?.[0];
    if (info) {
      return info.thumburl || info.url;
    }
  }
  return null;
}

async function downloadFile(url, destPath) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'SpaceTravelBot/1.0 (https://github.com/space-travel; info@space-travel.org) NodeFetch/3.0' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

async function run() {
  console.log('Downloading high-resolution transparent planet images...');
  for (const item of targets) {
    const destFile = path.join(publicImagesDir, `${item.slug}.png`);
    if (fs.existsSync(destFile) && fs.statSync(destFile).size > 10000) {
      console.log(`✓ ${item.slug}.png already exists (${(fs.statSync(destFile).size / 1024).toFixed(1)} KB), skipping.`);
      continue;
    }

    let downloaded = false;
    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        console.log(`Querying ${item.slug} (${item.title}, attempt ${attempt})...`);
        await sleep(2000);
        const imgUrl = await getImageUrl(item.title);
        if (!imgUrl) throw new Error(`Image URL not found for ${item.title}`);

        console.log(`Downloading ${item.slug} from ${imgUrl}...`);
        await sleep(1500);
        await downloadFile(imgUrl, destFile);

        fs.copyFileSync(destFile, path.join(rootImagesDir, `${item.slug}.png`));

        const stats = fs.statSync(destFile);
        console.log(`✓ Saved ${item.slug}.png (${(stats.size / 1024).toFixed(1)} KB)`);
        downloaded = true;
        break;
      } catch (err) {
        console.warn(`Attempt ${attempt} for ${item.slug} failed:`, err.message);
        await sleep(3500 * attempt);
      }
    }

    if (!downloaded) {
      console.error(`✗ Failed downloading ${item.slug} after all attempts.`);
    }
  }
  console.log('Finished downloading planet images.');
}

run();
