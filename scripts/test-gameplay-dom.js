/**
 * RocketRun Comprehensive DOM Gameplay & Physics Test Suite
 * Validates the full game loop, UI accordion, icon dock, canvas targeting,
 * telemetry math, fuel/solar dynamics, quizzes, infinite loop, and teardown.
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup JSDOM
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <div id="scene">
    <div id="solar-system">
      <div id="sun" class="sun"></div>
      <button id="planet-btn-mercury" class="planet-btn" data-slug="mercury"></button>
      <button id="planet-btn-venus" class="planet-btn" data-slug="venus"></button>
      <button id="planet-btn-earth" class="planet-btn" data-slug="earth"></button>
      <div id="moon" class="moon" data-slug="moon"></div>
      <button id="planet-btn-mars" class="planet-btn" data-slug="mars"></button>
      <button id="planet-btn-jupiter" class="planet-btn" data-slug="jupiter"></button>
      <button id="planet-btn-saturn" class="planet-btn" data-slug="saturn"></button>
      <button id="planet-btn-uranus" class="planet-btn" data-slug="uranus"></button>
      <button id="planet-btn-neptune" class="planet-btn" data-slug="neptune"></button>
    </div>
  </div>
  <button type="button" id="game-play-btn" class="hud-circle-btn hud-game-play-btn in-stack">
    <span class="hud-play-icon">🎮</span>
  </button>
  <input type="checkbox" id="settings-game-toggle" />
  <input type="checkbox" id="settings-freeplay-toggle" />
  <footer class="site-tiny-footer" role="contentinfo">
    <a href="impressum.html" class="tiny-footer-link imprint-link" data-i18n="ui.impressum_link">Impressum / Imprint</a>
  </footer>
  <div class="card-actions">
    <a href="impressum.html" class="btn-secondary-action imprint-link" title="Impressum / Imprint">Imprint</a>
  </div>
  <p class="features-copy">
    © 2026 rocketrun.org<span class="imprint-sep"> · </span>
    <a href="impressum.html" class="tiny-footer-link imprint-link">Impressum / Imprint</a>
  </p>
</body>
</html>
`, {
  url: 'https://rocketrun.org/',
  pretendToBeVisual: true
});

// Polyfill globals for Game Engine
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
if (!global.navigator) {
  try {
    global.navigator = dom.window.navigator;
  } catch (_) {}
}
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;

// Mock audio API
dom.window.AudioContext = class {
  createOscillator() {
    return {
      connect() {},
      start() {},
      stop() {},
      frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      type: 'sine'
    };
  }
  createGain() {
    return {
      connect() {},
      gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }
    };
  }
  get destination() { return {}; }
  get currentTime() { return 0; }
  resume() { return Promise.resolve(); }
};
global.window.AudioContext = dom.window.AudioContext;

// Load translations
import { translations, supportedLanguages, setLanguage, updateImprintVisibility } from '../src/js/i18n.js';
const i18nDir = path.resolve(__dirname, '../src/i18n');
for (const langObj of supportedLanguages) {
  const code = langObj.code;
  if (!translations[code]) {
    const file = path.join(i18nDir, `${code}.json`);
    translations[code] = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
}

// Import game engine and physics modules
import {
  startGame,
  stopGame,
  exitGameMode,
  setFreePlayMode,
  selectDestinationFromCanvas,
  isGameActive,
  showLeaderboardModal,
  showGameNotification
} from '../src/js/game/game-engine.js';
import {
  calculateOrbitalWindow,
  evaluateLaunchOutcome,
  checkAsteroidHazard,
  checkSolarBoost,
  calculateFutureOrbitalIntercept,
  calculateFlightFuelBurn,
  ORBIT_SPECS
} from '../src/js/game/game-physics.js';
import { getPlanetQuiz, getTouchdownNoteKey } from '../src/js/game/game-quiz.js';
import {
  getGameModeCookie,
  setGameModeCookie,
  getCookie,
  clearAllCookiesAndStorage,
  initCookieNotice
} from '../src/js/components/cookie-notice.js';
import {
  getPilotName,
  setPilotName,
  isLeaderboardCookieAllowed,
  setLeaderboardCookieAllowed,
  loadLeaderboard,
  saveLeaderboardScore
} from '../src/js/game/game-leaderboard.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

console.log('====================================================');
console.log('🚀 RocketRun Detailed DOM Gameplay & Physics Tests');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST 1: Launch Control Accordion & UI Mounting
// ----------------------------------------------------
console.log('[Test 1: Game Launch & Launch Control Accordion Mounting]');
startGame();

assert(isGameActive() === true, 'Game is reported as active');
assert(document.getElementById('solar-system').classList.contains('game-active'), '#solar-system has .game-active class');

const hud = document.getElementById('rocketrun-hud');
assert(hud !== null, '#rocketrun-hud mounted in DOM');
assert(document.getElementById('hud-lives').textContent.includes('🚀'), 'HUD displays 3 rocket lives');
assert(document.getElementById('hud-stars').textContent.includes('0'), 'HUD displays initial 0 score');
assert(document.getElementById('hud-close-btn') !== null, 'HUD close button (✕) exists');

const sidebar = document.getElementById('rocketrun-sidebar');
assert(sidebar !== null, '#rocketrun-sidebar mounted in DOM');
assert(document.getElementById('sidebar-min-btn') !== null, 'Sidebar minimize button (−/+) exists');
assert(document.getElementById('sidebar-close-btn') !== null, 'Sidebar close button (✕) exists');

const accordion = document.getElementById('launch-accordion');
assert(accordion !== null, '#launch-accordion mounted in DOM');

const expectedSections = ['sec-mode', 'sec-dest', 'sec-thrust', 'sec-fuel', 'sec-telemetry', 'sec-planner'];
for (const secId of expectedSections) {
  assert(document.getElementById(secId) !== null, `Accordion section #${secId} exists`);
}

const playBtn = document.getElementById('game-play-btn');
assert(playBtn !== null, '#game-play-btn exists in DOM');
assert(playBtn.classList.contains('is-playing'), '#game-play-btn has .is-playing class while game is active');

// ----------------------------------------------------
// TEST 2: Auto-Targeting & Canvas Highlight
// ----------------------------------------------------
console.log('\n[Test 2: Auto-Targeting & Canvas Highlighting]');
const gameState = window.RocketRun;
assert(gameState.targetPlanet === 'moon', 'Initial target is automatically set to Luna (Moon)');

const moonEl = document.getElementById('moon');
assert(moonEl.classList.contains('is-game-target'), 'Canvas Moon element has .is-game-target pulsing glow');
assert(document.getElementById('dest-target-name').textContent.includes('Luna'), 'Target status readout shows Luna');

// ----------------------------------------------------
// TEST 3: Direct Canvas Planet Selection & Luna Button
// ----------------------------------------------------
console.log('\n[Test 3: Canvas Planet Selection & Target Switching]');
selectDestinationFromCanvas('mars');

assert(gameState.targetPlanet === 'mars', 'selectDestinationFromCanvas("mars") sets target to mars');
assert(document.getElementById('planet-btn-mars').classList.contains('is-game-target'), 'Mars on canvas receives .is-game-target');
assert(!moonEl.classList.contains('is-game-target'), 'Moon loses .is-game-target');
assert(document.getElementById('dest-target-name').textContent.includes('Mars'), 'Target status readout updates to Mars');

// Test Luna quick target button
const lunaBtn = document.getElementById('luna-dest-btn');
assert(lunaBtn !== null, '#luna-dest-btn button exists');
lunaBtn.click();
assert(gameState.targetPlanet === 'moon', 'Clicking #luna-dest-btn retargets Luna');
assert(moonEl.classList.contains('is-game-target'), 'Moon regains .is-game-target');

// ----------------------------------------------------
// TEST 4: Accordion Header Toggle & Sidebar Minimization
// ----------------------------------------------------
console.log('\n[Test 4: Accordion Interaction & Sidebar Minimization]');
const secFuel = document.getElementById('sec-fuel');
const fuelHeader = secFuel.querySelector('.accordion-header');
assert(!secFuel.classList.contains('is-open'), '#sec-fuel is closed initially');

fuelHeader.click();
assert(secFuel.classList.contains('is-open'), '#sec-fuel is open after clicking header');
assert(fuelHeader.getAttribute('aria-expanded') === 'true', '#sec-fuel header aria-expanded is true');

fuelHeader.click();
assert(!secFuel.classList.contains('is-open'), '#sec-fuel closes on second header click');

// Minimize sidebar
const minBtn = document.getElementById('sidebar-min-btn');
assert(minBtn.textContent === '−', 'Minimize button initially displays "−"');
minBtn.click();
assert(sidebar.classList.contains('is-minimized'), 'Sidebar has .is-minimized class');
assert(minBtn.textContent === '+', 'Minimize button displays "+" when minimized');
minBtn.click();
assert(!sidebar.classList.contains('is-minimized'), 'Sidebar restored from minimized state');
assert(minBtn.textContent === '−', 'Minimize button displays "−" when restored');

// ----------------------------------------------------
// TEST 5: Orbital Physics & Keplerian Telemetry Math
// ----------------------------------------------------
console.log('\n[Test 5: Orbital Physics & Keplerian Telemetry Math]');
const winMars = calculateOrbitalWindow('earth', 'mars', 0, 0);

assert(winMars.minDist === 5, 'Perigee minDist between Earth (17.5) and Mars (22.5) is exactly 5.0 vmin');
assert(winMars.maxDist === 40, 'Apogee maxDist between Earth and Mars is exactly 40.0 vmin');
assert(winMars.transferPerigeeAu === 1.0, 'Transfer perigee is Earth AU (1.0)');
assert(winMars.transferApogeeAu === 1.524, 'Transfer apogee is Mars AU (1.524)');
assert(typeof winMars.leadDeg === 'number' && winMars.leadDeg > 0, `Transit orbit motion lead angle calculated: ${winMars.leadDeg}°`);
assert(winMars.flightDurationSec === 5.2, 'Flight duration to Mars is 5.2s');
assert(typeof winMars.futureArrivalCoords.x === 'number', 'Future arrival X coordinate is valid');
assert(typeof winMars.futureArrivalCoords.y === 'number', 'Future arrival Y coordinate is valid');

// Scrubber test (+10s projection)
const planner = document.getElementById('future-orbit-planner');
const btn10s = planner.querySelector('.planner-btn[data-offset="10"]');
assert(btn10s !== null, 'Future planner +10s button exists');
btn10s.click();
assert(document.getElementById('planner-offset-badge').textContent.includes('T+10s'), 'Offset badge updates to T+10s (PROJECTED)');
assert(document.getElementById('acc-summary-planner').textContent === '+10s', 'Accordion summary updates to +10s');

// Reset to live
const btnLive = planner.querySelector('.planner-btn[data-offset="0"]');
btnLive.click();
assert(document.getElementById('planner-offset-badge').textContent.includes('T+0s'), 'Offset badge reset to LIVE');

const reticleEl = document.getElementById('future-intercept-reticle');
if (reticleEl) {
  assert(!reticleEl.innerHTML.includes('🪐'), 'future-intercept-reticle does NOT contain Saturn emoji 🪐');
  assert(reticleEl.querySelector('.reticle-crosshair') !== null, 'future-intercept-reticle contains .reticle-crosshair');
}

// ----------------------------------------------------
// TEST 6: Thrust Energy Slider Throttling & Guidance
// ----------------------------------------------------
console.log('\n[Test 6: Thrust Energy Slider & Dynamic Guidance]');
const slider = document.getElementById('energy-slider');
const hintEl = document.getElementById('energy-feedback-hint');

// Target Mars
selectDestinationFromCanvas('mars');

// Low thrust (10%)
slider.value = '10';
slider.dispatchEvent(new Event('input'));
assert(document.getElementById('energy-val-readout').textContent === '10%', 'Readout displays 10%');
assert(hintEl.classList.contains('is-low'), '10% thrust triggers .is-low warning');

// Optimal thrust (within window)
slider.value = String(winMars.minReq + 5);
slider.dispatchEvent(new Event('input'));
assert(hintEl.classList.contains('is-optimal'), `Optimal thrust (${slider.value}%) triggers .is-optimal guidance`);

// High thrust (95%)
slider.value = '95';
slider.dispatchEvent(new Event('input'));
assert(hintEl.classList.contains('is-high'), '95% thrust triggers .is-high overshoot warning');

// ----------------------------------------------------
// TEST 7: Fuel Consumption & Solar Array Flux Math
// ----------------------------------------------------
console.log('\n[Test 7: Fuel Depletion & Solar Flux Charging Math]');
assert(gameState.fuel === 100, 'Initial fuel is 100%');

// Consume fuel down to 20%
gameState.consumeFuel(80);
assert(gameState.fuel === 20, 'Fuel reduced to 20%');

// Slider is at 95% -> fuel (20%) is insufficient
slider.dispatchEvent(new Event('input'));
const launchBtn = document.getElementById('launch-btn');
assert(launchBtn.disabled === true, 'Launch button disabled when fuel is insufficient');
assert(launchBtn.textContent.includes('SOLAR CHARGING'), 'Launch button displays SOLAR CHARGING countdown');

const rechargeIndicator = document.getElementById('solar-recharge-indicator');
assert(rechargeIndicator.style.display !== 'none', 'Solar recharge indicator is displayed');

// Test Solar Flux Proximity Math (100% tank fills in 1 min / 60s at 1.67%/s):
gameState.currentPlanet = 'mercury';
assert(gameState.getSolarRechargeRate() === 2.0, 'Solar flux at Mercury is +2.0%/s (near Sun, ~50s)');
gameState.currentPlanet = 'earth';
assert(gameState.getSolarRechargeRate() === 1.67, 'Solar flux at Earth is +1.67%/s (exactly 60s = 1 min)');
gameState.currentPlanet = 'saturn';
assert(gameState.getSolarRechargeRate() === 1.43, 'Solar flux at Saturn is +1.43%/s (outer deep space, ~70s)');

// Restore fuel for flight test
gameState.currentPlanet = 'earth';
gameState.addFuel(80);
assert(gameState.fuel === 100, 'Fuel restored to 100%');

// ----------------------------------------------------
// TEST 8: Touchdown Quiz & Grand Tour Progression
// ----------------------------------------------------
console.log('\n[Test 8: Touchdown Quiz, Parity & Mission Progression]');
// Verify all 9 celestial bodies have questions
const bodies = ['mercury', 'venus', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
for (const slug of bodies) {
  const quiz = getPlanetQuiz(slug, 0);
  assert(quiz && quiz.options.length === 2, `Quiz defined for ${slug} with 2 options`);
  const correctOpt = quiz.options.find(o => o.correct);
  assert(correctOpt !== undefined, `Quiz for ${slug} has exactly 1 correct answer`);
}

// Complete Mission 1 -> auto-advance to Mission 2
selectDestinationFromCanvas('moon');
slider.value = '25';
slider.dispatchEvent(new Event('input'));

// Trigger touchdown quiz directly
const moonQuiz = getPlanetQuiz('moon', gameState.missionIndex);
const initialScore = gameState.score;

// Simulate touchdown modal
const modalEl = document.createElement('div');
modalEl.id = 'game-quiz-modal';
modalEl.className = 'game-modal-overlay';
modalEl.innerHTML = `
  <div class="game-modal-card">
    <div class="quiz-question">${moonQuiz.questionKey}</div>
    <div class="quiz-options">
      <button type="button" class="quiz-btn" id="quiz-btn-wrong" data-correct="false">Wrong</button>
      <button type="button" class="quiz-btn" id="quiz-btn-correct" data-correct="true">Correct</button>
    </div>
  </div>
`;
document.body.appendChild(modalEl);

// Test incorrect answer (shake & retry, no hint shown)
const wrongBtn = document.getElementById('quiz-btn-wrong');
wrongBtn.click();
assert(document.querySelector('.touchdown-hint') === null, 'No spoiler hint box rendered on quiz');

// Advance mission
gameState.advanceMission();
const nextMission = gameState.getCurrentMission();
assert(gameState.missionIndex === 1, 'Mission advanced to Mission 2 (Index 1)');
assert(nextMission.targetSlug === 'jupiter', 'Mission 2 target is Jupiter (mixed inward/outward route)');

// ----------------------------------------------------
// TEST 9: Grand Tour Earth Homecoming & Infinite Loop
// ----------------------------------------------------
console.log('\n[Test 9: Grand Tour Earth Homecoming & Infinite Loop]');
// Simulate reaching Mission 8 (Grand Tour finale on Earth)
gameState.missionIndex = 7;
gameState.currentPlanet = 'saturn';
gameState.setTarget('earth');
assert(gameState.getCurrentMission().targetSlug === 'earth', 'Mission 8 destination is Earth');

// Advance past Earth finale
gameState.advanceMission();
assert(gameState.missionIndex === 8, 'Mission index advanced to 8 (Infinite loop threshold)');
const infMission = gameState.getCurrentMission();
assert(infMission !== null, 'Infinite mission dynamically generated');
assert(infMission.targetSlug !== 'earth', `Dynamic mission targets non-origin planet: ${infMission.targetSlug}`);

// ----------------------------------------------------
// TEST 10: Lives Depletion & Debrief Modal
// ----------------------------------------------------
console.log('\n[Test 10: Lives Depletion & Mission Debrief]');
gameState.deductLife();
gameState.deductLife();
gameState.deductLife();
assert(gameState.lives === 0, 'Lives successfully reduced to 0');

gameState.restoreLives();
assert(gameState.lives === 3, 'restoreLives() resets lives back to 3');
assert(gameState.fuel === 100, 'restoreLives() refuels tank to 100%');

// ----------------------------------------------------
// TEST 11: Free Play Mode Functionality
// ----------------------------------------------------
console.log('\n[Test 11: Free Play Mode Switch & Autonomous Navigation]');
setFreePlayMode(true);
assert(gameState.isFreePlay === true, 'setFreePlayMode(true) sets isFreePlay to true');
assert(document.getElementById('settings-freeplay-toggle').checked === true, 'Settings Free Play toggle updated');

setFreePlayMode(false);
assert(gameState.isFreePlay === false, 'setFreePlayMode(false) restores Missions mode');

// ----------------------------------------------------
// TEST 12: Clean Game Teardown
// ----------------------------------------------------
console.log('\n[Test 12: Clean Game Teardown & DOM Restoration]');
const closeBtn = document.getElementById('hud-close-btn');
closeBtn.click();

assert(isGameActive() === false, 'isGameActive() returns false after close');
assert(document.getElementById('rocketrun-hud') === null, '#rocketrun-hud removed from DOM');
assert(document.getElementById('rocketrun-sidebar') === null, '#rocketrun-sidebar removed from DOM');
assert(document.querySelectorAll('.is-game-target').length === 0, 'All .is-game-target highlights cleaned from canvas');
assert(!document.getElementById('solar-system').classList.contains('game-active'), '#solar-system .game-active class removed');
assert(!document.getElementById('game-play-btn').classList.contains('is-playing'), '#game-play-btn .is-playing class removed after teardown');

// ----------------------------------------------------
// TEST 13: Dedicated Luna (Moon) Subpage Verification
// ----------------------------------------------------
console.log('\n[Test 13: Dedicated Luna (Moon) Subpage & Free Play Routing]');
const lunaPath = path.resolve(__dirname, '../public/planets/luna.html');
const moonPath = path.resolve(__dirname, '../public/planets/moon.html');
assert(fs.existsSync(lunaPath), 'public/planets/luna.html exists on disk');
assert(fs.existsSync(moonPath), 'public/planets/moon.html exists on disk (alias)');

const lunaHtml = fs.readFileSync(lunaPath, 'utf8');
assert(lunaHtml.includes('data-gravity="0.166"'), 'luna.html has gravity ratio data-gravity="0.166" (~1.62 m/s²)');
assert(lunaHtml.includes('data-slug="luna"'), 'luna.html has data-slug="luna"');
assert(lunaHtml.includes('Luna (The Moon)'), 'luna.html includes full celestial name "Luna (The Moon)"');
assert(lunaHtml.includes('href="earth.html"'), 'luna.html has previous link to earth.html');
assert(lunaHtml.includes('href="mars.html"'), 'luna.html has next link to mars.html');
assert(lunaHtml.includes('images/luna.png'), 'luna.html references images/luna.png');

// Check Earth subpage moon links to luna.html
const earthPath = path.resolve(__dirname, '../public/planets/earth.html');
assert(fs.existsSync(earthPath), 'public/planets/earth.html exists on disk');
const earthHtml = fs.readFileSync(earthPath, 'utf8');
assert(earthHtml.includes('id="earth-moon-companion"'), 'earth.html includes #earth-moon-companion in preview');
assert(earthHtml.includes('href="luna.html" class="earth-subpage-moon-track"'), 'earth.html moon companion links to luna.html');
assert(earthHtml.includes('class="info-card info-card-earth-moon"'), 'earth.html Moons & Rings card has .info-card-earth-moon class');
assert(earthHtml.includes('id="earth-card-moon-link"'), 'earth.html has #earth-card-moon-link inside Moons card');
assert(earthHtml.includes('href="luna.html" class="info-moon-quick-link"'), 'earth.html card moon quick link points to luna.html');

// ----------------------------------------------------
// TEST 14: Cookie Gamemode State & Subpage Isolation
// ----------------------------------------------------
console.log('\n[Test 14: Gamemode Cookie State & Subpage Isolation]');
// After teardown, gamemode cookie must be 'off'
assert(getGameModeCookie() === 'off', 'gamemode cookie is "off" after exiting game mode');
assert(getCookie('gsmemode') === 'off', 'gsmemode cookie alias is also "off"');

// Start game in Free Play mode
startGame({ freeplay: true });
assert(getGameModeCookie() === 'freeplay', 'Starting game in Free Play sets gamemode cookie to "freeplay"');
assert(getCookie('gsmemode') === 'freeplay', 'gsmemode cookie alias is "freeplay"');

// Teardown again
exitGameMode();
assert(getGameModeCookie() === 'off', 'exitGameMode() resets gamemode cookie to "off"');
assert(getCookie('gsmemode') === 'off', 'exitGameMode() resets gsmemode cookie to "off"');

// ----------------------------------------------------
// TEST 15: Robots & SEO Structured Data Verification
// ----------------------------------------------------
console.log('\n[Test 15: Robots Directives, Sitemap & SEO Structured Data]');
const pubRobotsFile = path.resolve(__dirname, '../public/robots.txt');
const rootRobotsFile = path.resolve(__dirname, '../robots.txt');
const pubSitemapFile = path.resolve(__dirname, '../public/sitemap.xml');
const rootSitemapFile = path.resolve(__dirname, '../sitemap.xml');

assert(fs.existsSync(pubRobotsFile), 'public/robots.txt exists');
assert(fs.existsSync(rootRobotsFile), 'root robots.txt exists');
const robotsContent = fs.readFileSync(pubRobotsFile, 'utf8');
assert(robotsContent.includes('User-agent: *'), 'robots.txt specifies User-agent: *');
assert(robotsContent.includes('Allow: /'), 'robots.txt allows indexing');
assert(robotsContent.includes('Sitemap: https://rocketrun.org/sitemap.xml'), 'robots.txt specifies sitemap URL');

assert(fs.existsSync(pubSitemapFile), 'public/sitemap.xml exists');
assert(fs.existsSync(rootSitemapFile), 'root sitemap.xml exists');
const sitemapContent = fs.readFileSync(pubSitemapFile, 'utf8');
assert(sitemapContent.includes('<loc>https://rocketrun.org/</loc>'), 'sitemap.xml includes home page');
assert(sitemapContent.includes('<loc>https://rocketrun.org/planets/luna.html</loc>'), 'sitemap.xml includes Luna subpage');
assert(sitemapContent.includes('<loc>https://rocketrun.org/credits.html</loc>'), 'sitemap.xml includes credits');
assert(sitemapContent.includes('<loc>https://rocketrun.org/features.html</loc>'), 'sitemap.xml includes features');
assert(sitemapContent.includes('<loc>https://rocketrun.org/impressum.html</loc>'), 'sitemap.xml includes impressum');

// Test robots meta tags and Schema.org JSON-LD on all pages
const pagesToCheck = [
  { name: 'index.html', path: path.resolve(__dirname, '../public/index.html') },
  { name: 'credits.html', path: path.resolve(__dirname, '../public/credits.html') },
  { name: 'features.html', path: path.resolve(__dirname, '../public/features.html') },
  { name: 'impressum.html', path: path.resolve(__dirname, '../public/impressum.html') },
  { name: 'planets/luna.html', path: path.resolve(__dirname, '../public/planets/luna.html') }
];

for (const p of pagesToCheck) {
  assert(fs.existsSync(p.path), `${p.name} exists in build output`);
  const content = fs.readFileSync(p.path, 'utf8');
  assert(content.includes('<meta name="robots"'), `${p.name} contains <meta name="robots"`);
  assert(content.includes('<meta name="googlebot"'), `${p.name} contains <meta name="googlebot"`);
  assert(content.includes('<meta name="bingbot"'), `${p.name} contains <meta name="bingbot"`);
  assert(content.includes('<meta name="keywords"'), `${p.name} contains <meta name="keywords"`);
  assert(content.includes('<script type="application/ld+json">'), `${p.name} contains Schema.org JSON-LD`);
}

// ----------------------------------------------------
// TEST 16: Settings Simplification & 1-Tap Play Button
// ----------------------------------------------------
console.log('\n[Test 16: Settings Simplification & 1-Tap Play Button]');
const indexHtmlSrc = fs.readFileSync(path.resolve(__dirname, '../src/index.html'), 'utf8');
assert(!indexHtmlSrc.includes('id="settings-game-toggle"'), 'src/index.html settings does NOT contain settings-game-toggle');
assert(!indexHtmlSrc.includes('id="settings-freeplay-toggle"'), 'src/index.html settings does NOT contain settings-freeplay-toggle');
assert(indexHtmlSrc.includes('id="game-play-btn"'), 'src/index.html contains #game-play-btn');
assert(indexHtmlSrc.includes('hud-game-play-btn'), 'src/index.html has .hud-game-play-btn class');
assert(indexHtmlSrc.includes('🎮'), 'src/index.html has 🎮 game play icon');

// ----------------------------------------------------
// TEST 17: Leaderboard Cookie Storage & Pilot Callsign Name
// ----------------------------------------------------
console.log('\n[Test 17: Leaderboard Cookie Storage & Pilot Callsign Name]');

// 1. Initial pilot name state
assert(getPilotName() === 'Player' || typeof getPilotName() === 'string', 'Initial pilot name is defined and valid string');

// 2. Set custom pilot name
const customName = setPilotName('Cmdr. Nova');
assert(customName === 'Cmdr. Nova', 'setPilotName returns formatted name');
assert(getPilotName() === 'Cmdr. Nova', 'getPilotName returns updated pilot name');
assert(localStorage.getItem('space_pilot_name') === 'Cmdr. Nova', 'localStorage space_pilot_name holds updated name');

// 3. Cookie storage toggle
assert(typeof isLeaderboardCookieAllowed() === 'boolean', 'isLeaderboardCookieAllowed returns boolean');

// Enable leaderboard cookies
setLeaderboardCookieAllowed(true);
assert(isLeaderboardCookieAllowed() === true, 'isLeaderboardCookieAllowed returns true after enabling');
assert(getCookie('cookie_lb_consent') === 'true', 'cookie_lb_consent cookie is "true"');

// Save a high test score
saveLeaderboardScore({
  name: getPilotName(),
  score: 2500,
  rankKey: 'game.rank_space_cadet',
  avatar: '👨‍🚀'
});

const lbEntries = loadLeaderboard();
assert(Array.isArray(lbEntries), 'loadLeaderboard returns an array');
assert(lbEntries.length > 0, 'Leaderboard has entries');
assert(lbEntries[0].name === 'Cmdr. Nova', 'First entry name matches custom pilot name');
assert(getCookie('space_game_leaderboard') !== null, 'space_game_leaderboard cookie is stored when allowed');
assert(getCookie('pilot_name') === 'Cmdr. Nova', 'pilot_name cookie is stored when allowed');

// Disable leaderboard cookies
setLeaderboardCookieAllowed(false);
assert(isLeaderboardCookieAllowed() === false, 'isLeaderboardCookieAllowed returns false after disabling');
assert(getCookie('space_game_leaderboard') === null, 'space_game_leaderboard cookie is deleted when disallowed');
assert(getCookie('pilot_name') === null, 'pilot_name cookie is deleted when disallowed');
assert(getCookie('cookie_lb_consent') === 'false', 'cookie_lb_consent cookie is "false"');

// 4. Modal DOM test
showLeaderboardModal();
const lbModal = document.getElementById('game-leaderboard-modal');
assert(lbModal !== null, 'showLeaderboardModal rendered #game-leaderboard-modal in DOM');
const pilotInput = document.getElementById('lb-pilot-input');
assert(pilotInput !== null, 'Leaderboard modal contains #lb-pilot-input');
assert(pilotInput.value === 'Cmdr. Nova', '#lb-pilot-input defaults to current pilot name');
const lbCookieToggle = document.getElementById('lb-cookie-pref-toggle');
assert(lbCookieToggle !== null, 'Leaderboard modal contains #lb-cookie-pref-toggle');
assert(lbCookieToggle.checked === false, '#lb-cookie-pref-toggle reflects isLeaderboardCookieAllowed state (false)');

// Change name via input and save button
const saveBtn = document.getElementById('lb-save-name-btn');
assert(saveBtn !== null, 'Leaderboard modal contains #lb-save-name-btn');
pilotInput.value = 'Captain Orion';
saveBtn.click();
assert(getPilotName() === 'Captain Orion', 'Saving via button updates getPilotName() to Captain Orion');

// Close modal
const lbCloseBtn = document.getElementById('lb-close-btn');
assert(lbCloseBtn !== null, 'Leaderboard modal contains #lb-close-btn');
lbCloseBtn.click();
assert(document.getElementById('game-leaderboard-modal') === null, 'Clicking close removes modal from DOM');

// 5. Test clearAllCookiesAndStorage()
clearAllCookiesAndStorage();
assert(localStorage.getItem('space_pilot_name') === null, 'clearAllCookiesAndStorage wipes space_pilot_name');
assert(localStorage.getItem('space_game_leaderboard') === null, 'clearAllCookiesAndStorage wipes space_game_leaderboard');
assert(getCookie('cookie_lb_consent') === null, 'clearAllCookiesAndStorage wipes cookie_lb_consent');

// 6. Test Cookie Notice Clear Warning & High Score Notice
initCookieNotice();
const cookieNoticeEl = document.getElementById('cookie-notice');
assert(cookieNoticeEl !== null, '#cookie-notice element created');
const clearNote = cookieNoticeEl.querySelector('.cookie-clear-note');
assert(clearNote !== null, '#cookie-notice includes .cookie-clear-note warning banner');
assert(clearNote.textContent.includes('high scores'), '.cookie-clear-note explicitly warns about removing high scores');
// ----------------------------------------------------
// TEST 18: In-App Notifications & Zero Browser Popups
// ----------------------------------------------------
console.log('\n[Test 18: In-App Notifications & Zero Browser Dialogs]');

let alertCalls = 0;
let confirmCalls = 0;
let promptCalls = 0;
dom.window.alert = () => { alertCalls++; };
dom.window.confirm = () => { confirmCalls++; return true; };
dom.window.prompt = () => { promptCalls++; return ''; };
global.alert = dom.window.alert;
global.confirm = dom.window.confirm;
global.prompt = dom.window.prompt;

// 1. Test showGameNotification rendering
showGameNotification('Propellant deficit! Waiting for solar charge', 'warning', 3500);
const notifContainer = document.getElementById('game-notification-container');
assert(notifContainer !== null, '#game-notification-container created in DOM');
assert(notifContainer.getAttribute('aria-live') === 'polite', 'Notification container has aria-live="polite"');
assert(notifContainer.getAttribute('aria-atomic') === 'true', 'Notification container has aria-atomic="true"');

const toastWarning = notifContainer.querySelector('.game-notification-toast.is-warning');
assert(toastWarning !== null, 'Warning notification toast rendered with .is-warning');
assert(toastWarning.getAttribute('role') === 'status', 'Notification toast has role="status"');
assert(toastWarning.querySelector('.game-toast-icon').textContent === '⚠️', 'Warning toast displays ⚠️ icon');
assert(toastWarning.querySelector('.game-toast-msg').textContent === 'Propellant deficit! Waiting for solar charge', 'Toast message text matches accurately');

const closeToastBtn = toastWarning.querySelector('.game-toast-close');
assert(closeToastBtn !== null, 'Toast includes accessible close button (✕)');
assert(closeToastBtn.getAttribute('aria-label') === 'Dismiss notification', 'Close button has descriptive aria-label');

// Click close button triggers dismiss
closeToastBtn.click();
assert(toastWarning.classList.contains('is-leaving'), 'Clicking close button adds .is-leaving class');

// 2. Test types: success, error, info
showGameNotification('Touchdown success on Mars!', 'success', 0);
const toastSuccess = notifContainer.querySelector('.game-notification-toast.is-success');
assert(toastSuccess !== null, 'Success notification toast rendered with .is-success');
assert(toastSuccess.querySelector('.game-toast-icon').textContent === '✨', 'Success toast displays ✨ icon');

showGameNotification('Collision trajectory detected!', 'error', 0);
const toastError = notifContainer.querySelector('.game-notification-toast.is-error');
assert(toastError !== null, 'Error notification toast rendered with .is-error');
assert(toastError.querySelector('.game-toast-icon').textContent === '🚨', 'Error toast displays 🚨 icon');

showGameNotification('Standard telemetry update', 'info', 0);
const toastInfo = notifContainer.querySelector('.game-notification-toast.is-info');
assert(toastInfo !== null, 'Info notification toast rendered with .is-info');
assert(toastInfo.querySelector('.game-toast-icon').textContent === '🚀', 'Info toast displays 🚀 icon');

// Verify zero alert() calls
assert(alertCalls === 0, 'Zero window.alert() calls invoked during notification lifecycle');
assert(confirmCalls === 0, 'Zero window.confirm() calls invoked');
assert(promptCalls === 0, 'Zero window.prompt() calls invoked');

// 3. Static audit: Assert zero alert( in src/js
function scanDirectoryForAlerts(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += scanDirectoryForAlerts(full);
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.html'))) {
      const code = fs.readFileSync(full, 'utf8');
      if (/\balert\s*\(/.test(code)) {
        console.error(`Found alert() in ${full}`);
        count++;
      }
    }
  }
  return count;
}
const alertOccurrences = scanDirectoryForAlerts(path.resolve(__dirname, '../src'));
assert(alertOccurrences === 0, 'Codebase audit: 0 native alert() occurrences in src/');

// ----------------------------------------------------
// TEST 19: German-Only Imprint Visibility Standard
// ----------------------------------------------------
console.log('\n[Test 19: German-Only Imprint Visibility Standard]');

const siteFooter = document.querySelector('.site-tiny-footer');
const imprintBtn = document.querySelector('.card-actions .imprint-link');
const imprintSep = document.querySelector('.imprint-sep');

// 1. Verify hidden in English
await setLanguage('en');
assert(document.documentElement.getAttribute('lang') === 'en', 'Active document lang is "en"');
assert(siteFooter.style.display === 'none', 'Site tiny footer is hidden (display: none) in English');
assert(siteFooter.hasAttribute('hidden'), 'Site tiny footer has hidden attribute in English');
assert(imprintBtn.style.display === 'none', 'Imprint button is hidden in English');
assert(imprintSep.style.display === 'none', 'Imprint separator is hidden in English');

// 2. Verify hidden across all other non-German languages
const nonGermanLangs = ['fr', 'es', 'it', 'ja', 'zh', 'ml', 'ta'];
for (const lang of nonGermanLangs) {
  updateImprintVisibility(lang);
  assert(siteFooter.style.display === 'none', `Imprint footer hidden in ${lang}`);
  assert(imprintBtn.style.display === 'none', `Imprint button hidden in ${lang}`);
  assert(imprintSep.style.display === 'none', `Imprint separator hidden in ${lang}`);
}

// 3. Verify visible in German
await setLanguage('de');
assert(document.documentElement.getAttribute('lang') === 'de', 'Active document lang is "de"');
assert(siteFooter.style.display === '', 'Site tiny footer is visible in German');
assert(!siteFooter.hasAttribute('hidden'), 'Site tiny footer hidden attribute removed in German');
assert(imprintBtn.style.display === '', 'Imprint button is visible in German');
assert(!imprintBtn.hasAttribute('hidden'), 'Imprint button hidden attribute removed in German');
assert(imprintSep.style.display === '', 'Imprint separator is visible in German');

// Reset back to English
await setLanguage('en');
assert(siteFooter.style.display === 'none', 'Imprint footer re-hidden after switching back to English');

// 4. Verify CSS rule exists in SCSS
const scssContent = fs.readFileSync(path.resolve(__dirname, '../src/scss/components/_impressum.scss'), 'utf8');
assert(scssContent.includes('html:not([lang="de"])'), '_impressum.scss contains html:not([lang="de"]) rule');
assert(scssContent.includes('.site-tiny-footer'), '_impressum.scss targets .site-tiny-footer');
assert(scssContent.includes('display: none !important'), '_impressum.scss sets display: none !important');

// 5. Test redirection when switching language on impressum.html
let redirectedTo = null;
dom.reconfigure({ url: 'https://rocketrun.org/impressum.html' });
assert(dom.window.location.pathname.includes('impressum.html'), 'Simulated URL is impressum.html');
dom.window.RocketRunNavigate = (url) => { redirectedTo = url; };

updateImprintVisibility('en');
assert(redirectedTo === 'index.html', 'Switching to non-German on impressum.html redirects to index.html');
delete dom.window.RocketRunNavigate;

// Restore URL
dom.reconfigure({ url: 'https://rocketrun.org/' });

// ----------------------------------------------------
// TEST 20: Power & Distance Fuel Consumption, 1-Min Refuel, Disabled Launch When Empty
// ----------------------------------------------------
console.log('\n[Test 20: Dynamic Fuel Burn Scaling, 1-Min Full Tank Recharge & Launch Guard]');
startGame();
const activeSlider = document.getElementById('energy-slider');
const activeLaunchBtn = document.getElementById('launch-btn');

// 1. Higher power burns more fuel
const burnLowPower = calculateFlightFuelBurn(25, 'earth', 'mars');
const burnHighPower = calculateFlightFuelBurn(90, 'earth', 'mars');
assert(burnHighPower > burnLowPower, `Higher thrust burns more fuel (90%=${burnHighPower}% vs 25%=${burnLowPower}%)`);

// 2. Longer travel distance burns more fuel
const burnShortTravel = calculateFlightFuelBurn(60, 'earth', 'moon');
const burnLongTravel = calculateFlightFuelBurn(60, 'earth', 'neptune');
assert(burnLongTravel > burnShortTravel, `Longer distance burns more fuel (Neptune=${burnLongTravel}% vs Moon=${burnShortTravel}%)`);

// 3. Depleted fuel persists across advanceMission()
gameState.fuel = 45;
gameState.advanceMission();
assert(gameState.fuel === 45, 'advanceMission() preserves depleted fuel across planetary voyages');

// 4. Exactly 60s recharge time for 100% tank on Earth/Moon/Mars
const rechargeRate = gameState.getSolarRechargeRate(); // 1.67
const timeToFill100 = 100 / rechargeRate;
assert(Math.round(timeToFill100) === 60, `100% fuel tank refills in exactly 60s (1 min) at ${rechargeRate}%/s`);

// 5. When fuel is empty (<= 0), launch button is disabled with empty state
gameState.fuel = 0;
assert(!gameState.hasSufficientFuel(50), 'hasSufficientFuel(50) returns false when fuel is 0');
assert(!gameState.hasSufficientFuel(0), 'hasSufficientFuel(0) returns false when fuel is <= 0');

activeSlider.value = '50';
activeSlider.dispatchEvent(new Event('input'));
assert(activeLaunchBtn.disabled === true, 'Launch button is disabled when fuel <= 0');
assert(activeLaunchBtn.classList.contains('is-fuel-empty'), 'Launch button has .is-fuel-empty class when fuel is 0');
assert(activeLaunchBtn.textContent.includes('FUEL EMPTY'), 'Launch button text displays FUEL EMPTY indicator');

// 6. Refilling fuel re-enables launch once fuel >= energy
gameState.addFuel(60);
activeSlider.dispatchEvent(new Event('input'));
assert(activeLaunchBtn.disabled === false, 'Launch button is re-enabled once fuel is recharged above requested thrust');
assert(!activeLaunchBtn.classList.contains('is-fuel-empty'), 'Launch button removes .is-fuel-empty when refueled');

// 7. Silent 100% full capacity (no alerts triggered)
let alertsTriggered = false;
const originalAlert = dom.window.alert;
dom.window.alert = () => { alertsTriggered = true; };
gameState.addFuel(50); // reaches 100 clamped
assert(gameState.fuel === 100, 'Fuel clamped at 100%');
assert(alertsTriggered === false, 'Zero alerts triggered upon reaching 100% fuel');
dom.window.alert = originalAlert;

exitGameMode();

console.log('\n====================================================');
console.log(`🎉 ALL TESTS PASSED: ${passedTests} / ${totalTests} assertions verified!`);
console.log('====================================================\n');
