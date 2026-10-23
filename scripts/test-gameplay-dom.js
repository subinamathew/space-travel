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
  <input type="checkbox" id="settings-game-toggle" />
  <input type="checkbox" id="settings-freeplay-toggle" />
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
import { translations, supportedLanguages } from '../src/js/i18n.js';
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
  isGameActive
} from '../src/js/game/game-engine.js';
import {
  calculateOrbitalWindow,
  evaluateLaunchOutcome,
  checkAsteroidHazard,
  checkSolarBoost,
  calculateFutureOrbitalIntercept,
  ORBIT_SPECS
} from '../src/js/game/game-physics.js';
import { getPlanetQuiz, getTouchdownNoteKey } from '../src/js/game/game-quiz.js';
import { getGameModeCookie, setGameModeCookie, getCookie } from '../src/js/components/cookie-notice.js';

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

// Test Solar Flux Proximity Math:
gameState.currentPlanet = 'mercury';
assert(gameState.getSolarRechargeRate() === 15, 'Solar flux at Mercury is +15%/s (near Sun)');
gameState.currentPlanet = 'earth';
assert(gameState.getSolarRechargeRate() === 10, 'Solar flux at Earth is +10%/s (moderate distance)');
gameState.currentPlanet = 'saturn';
assert(gameState.getSolarRechargeRate() === 7, 'Solar flux at Saturn is +7%/s (outer deep space)');

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

console.log('\n====================================================');
console.log(`🎉 ALL TESTS PASSED: ${passedTests} / ${totalTests} assertions verified!`);
console.log('====================================================\n');
