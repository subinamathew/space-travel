/**
 * RocketRun Fast Gameplay Smoke Test
 * Verifies that the game can start, mount UI, target, and exit cleanly without errors.
 * Designed to run rapidly (<300ms) before any commit & push.
 */

import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  <div class="settings-modal-content">
    <input type="checkbox" id="settings-game-toggle" />
    <input type="checkbox" id="settings-freeplay-toggle" />
    <input type="checkbox" id="moons-toggle" />
    <input type="checkbox" id="orbit-toggle" />
  </div>
</body>
</html>
`, {
  url: 'https://rocketrun.org/',
  pretendToBeVisual: true
});

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.HTMLElement = dom.window.HTMLElement;
global.Event = dom.window.Event;
global.CustomEvent = dom.window.CustomEvent;

dom.window.AudioContext = class {
  createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
  createGain() { return { connect() {}, gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} } }; }
  get destination() { return {}; }
  get currentTime() { return 0; }
  resume() { return Promise.resolve(); }
};
global.window.AudioContext = dom.window.AudioContext;

// Verify imports execute with zero ReferenceErrors
const { startGame, stopGame, exitGameMode, isGameActive, initGameEngine } = await import('../src/js/game/game-engine.js');
const { calculateFlightFuelBurn } = await import('../src/js/game/game-physics.js');

let passed = 0;
function check(condition, msg) {
  if (!condition) {
    console.error(`❌ SMOKE FAIL: ${msg}`);
    process.exit(1);
  }
  passed++;
  console.log(`  ✓ ${msg}`);
}

console.log('⚡ Running RocketRun Fast Gameplay Smoke Test...\n');

// 1. Verify game is inactive initially
check(isGameActive() === false, 'Game starts in inactive state');

// 2. Start game mode
startGame();
check(isGameActive() === true, 'startGame() sets isGameActive() to true');

// 3. Verify core HUD and Launch Sidebar mount in DOM
const hud = document.getElementById('rocketrun-hud');
const sidebar = document.getElementById('rocketrun-sidebar');
const launchBtn = document.getElementById('launch-btn');
check(hud !== null, '#rocketrun-hud successfully mounted in DOM');
check(sidebar !== null, '#rocketrun-sidebar successfully mounted in DOM');
check(launchBtn !== null, '#launch-btn successfully mounted in DOM');

// 4. Verify initial target is Luna and game state is operational
const state = window.RocketRun;
check(state !== undefined, 'window.RocketRun state exists');
check(state.targetPlanet === 'moon', 'Initial target is Luna (moon)');
check(state.fuel === 100, 'Initial propellant tank is 100%');
check(launchBtn.disabled === false, 'Launch button is active with full fuel');

// 5. Test Fuel Burn calculation works
const burnMoon = calculateFlightFuelBurn(50, 'earth', 'moon');
const burnNeptune = calculateFlightFuelBurn(50, 'earth', 'neptune');
check(burnNeptune > burnMoon, `Fuel scales with distance (Neptune=${burnNeptune}% > Moon=${burnMoon}%)`);

// 6. Test Settings checkbox synchronization
const gameToggle = document.getElementById('settings-game-toggle');
check(gameToggle !== null && gameToggle.checked === true, 'settings-game-toggle is checked while game is running');

// 7. Clean teardown
exitGameMode();
check(isGameActive() === false, 'exitGameMode() resets isGameActive() to false');
check(document.getElementById('rocketrun-hud') === null, '#rocketrun-hud cleanly unmounted');
check(document.getElementById('rocketrun-sidebar') === null, '#rocketrun-sidebar cleanly unmounted');
check(gameToggle.checked === false, 'settings-game-toggle unchecked after exit');

console.log(`\n🎉 SMOKE CHECK PASSED: ${passed} / ${passed} checks verified! Game starts cleanly.\n`);
