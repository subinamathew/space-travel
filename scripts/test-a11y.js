import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (name.endsWith('.html')) files.push(full);
  }
}
walk(publicDir);

let failures = 0;
function fail(file, msg) {
  failures++;
  console.error(`A11Y FAIL: ${path.relative(root, file)}: ${msg}`);
}

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(html);
  const { document } = dom.window;

  if (!document.documentElement.getAttribute('lang')) {
    fail(file, '<html> is missing lang');
  }

  const ids = new Set();
  for (const el of document.querySelectorAll('[id]')) {
    const id = el.id;
    if (ids.has(id)) fail(file, `duplicate id #${id}`);
    ids.add(id);
  }

  for (const img of document.querySelectorAll('img')) {
    if (!img.hasAttribute('alt')) fail(file, `image missing alt: ${img.getAttribute('src') || '(no src)'}`);
  }

  for (const el of document.querySelectorAll('[role="button"]')) {
    const tag = el.tagName.toLowerCase();
    if (tag !== 'button' && !el.hasAttribute('tabindex')) {
      fail(file, 'role="button" element is not keyboard focusable');
    }
  }

  for (const control of document.querySelectorAll('input, select, textarea')) {
    if (control.type === 'hidden') continue;
    const id = control.id;
    const labelled = control.hasAttribute('aria-label') ||
      control.hasAttribute('aria-labelledby') ||
      Array.from(document.querySelectorAll('label')).some(label =>
        (id && label.htmlFor === id) || label.contains(control)
      );
    if (!labelled) fail(file, `${control.tagName.toLowerCase()}#${id || '(no id)'} has no accessible label`);
  }

  for (const dialog of document.querySelectorAll('[role="dialog"]')) {
    if (!dialog.hasAttribute('aria-label') && !dialog.hasAttribute('aria-labelledby')) {
      fail(file, 'dialog has no accessible name');
    }
  }

  for (const link of document.querySelectorAll('a[target="_blank"]')) {
    const rel = (link.getAttribute('rel') || '').split(/\s+/);
    if (!rel.includes('noopener')) fail(file, 'target="_blank" link missing rel="noopener"');
  }
}

if (failures) {
  console.error(`\nAccessibility checks failed: ${failures}`);
  process.exit(1);
}
console.log(`Accessibility checks passed for ${files.length} generated HTML files.`);
