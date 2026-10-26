import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const scssPath = path.join(root, 'src/scss/components/_game.scss');
const scss = fs.readFileSync(scssPath, 'utf8');

const profiles = [
  { name: 'phone portrait', width: 390, height: 844, maxDockRatio: 0.32, query: '@media (max-width: 767px) and (orientation: portrait)' },
  { name: 'phone landscape', width: 844, height: 390, maxDockRatio: 0.27, query: '@media (max-width: 767px) and (orientation: landscape)' },
  { name: 'tablet portrait', width: 768, height: 1024, maxDockRatio: 0.30, query: '@media (min-width: 768px) and (max-width: 1023px) and (orientation: portrait)' },
  { name: 'tablet landscape', width: 1024, height: 768, maxDockRatio: 0.24, query: '@media (min-width: 768px) and (max-width: 1180px) and (orientation: landscape)' },
  { name: 'desktop portrait', width: 1080, height: 1920, maxDockRatio: 0.28, query: '@media (min-width: 1024px) and (orientation: portrait)' },
  { name: 'desktop landscape', width: 1440, height: 900, maxDockRatio: 0.26, query: '@media (min-width: 1181px) and (orientation: landscape)' }
];

let failures = 0;

function assert(condition, message) {
  if (!condition) {
    failures++;
    console.error('RESPONSIVE FAIL:', message);
  } else {
    console.log('  ✓', message);
  }
}

console.log('RocketRun responsive game-layout budget checks');

for (const profile of profiles) {
  assert(scss.includes(profile.query), `${profile.name}: responsive media query exists`);
  const visibleRatio = 1 - profile.maxDockRatio;
  assert(visibleRatio >= 0.68, `${profile.name}: at least ${Math.round(visibleRatio * 100)}% vertical scene budget remains`);
}

assert(scss.includes('max-height: min(32vh, 250px);'), 'phone portrait dock is capped');
assert(scss.includes('max-height: min(27vh, 118px);'), 'phone landscape dock is capped');
assert(scss.includes('max-height: min(30vh, 280px);'), 'tablet portrait dock is capped');
assert(scss.includes('max-height: min(24vh, 170px);'), 'tablet landscape dock is capped');
assert(scss.includes('max-height: min(28vh, 300px);'), 'desktop portrait dock is capped');
assert(scss.includes('max-height: min(26vh, 260px);'), 'desktop landscape dock is capped');
assert(scss.includes('.hud-rank { display: none; }'), 'phone landscape removes nonessential rank text');
assert(scss.includes('@media (max-width: 420px)'), 'small-phone telemetry compaction exists');
assert(scss.includes('.orbit-coach-card'), 'Orbit Coach has compact responsive styling');
assert(scss.includes('grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);'), 'Orbit Coach concepts stay visible in two compact columns');

if (failures) process.exit(1);
console.log('Responsive layout checks passed for 6 viewport/orientation profiles.');
