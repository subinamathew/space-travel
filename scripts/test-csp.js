import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const htmlFiles = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (name.endsWith('.html')) htmlFiles.push(full);
  }
}
walk(publicDir);

let failures = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  const inlineHandlers = html.match(/\son[a-z]+\s*=/gi) || [];
  const scriptTags = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const executableInline = scriptTags.filter(([, attrs, body]) => {
    if (/\bsrc\s*=/.test(attrs)) return false;
    if (/\btype\s*=\s*["']application\/ld\+json["']/i.test(attrs)) return false;
    return body.trim().length > 0;
  });
  if (inlineHandlers.length || executableInline.length) {
    failures++;
    console.error(`CSP FAIL: ${rel} has ${inlineHandlers.length} inline handler(s) and ${executableInline.length} executable inline script(s)`);
  }
}
if (failures) process.exit(1);
console.log(`CSP check passed for ${htmlFiles.length} generated HTML files.`);
