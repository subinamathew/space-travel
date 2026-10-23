import { planets } from './data/planets.js';
import { initStarfield } from './components/starfield.js';
import { buildOrrery, initSettingsSwitches } from './components/orrery.js';
import { initViewer } from './components/viewer.js';
import { initPreloader } from './components/preloader.js';
import { initHuds } from './components/hud.js';
import { initI18n } from './i18n.js';
import { initCreditsCrawl } from './components/credits.js';
import { initCookieNotice } from './components/cookie-notice.js';
import { initFeaturesPage } from './components/features.js';
import { init3DOrbitInteraction } from './components/orbit-3d.js';
import { startGame, stopGame, initGameEngine } from './game/game-engine.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n translation system
  initI18n();

  // Initialize GDPR-compliant cookie notice & data erasure
  initCookieNotice();

  // Start warp preloader
  initPreloader();

  // Initialize Galactic & Settings HUD controllers
  initHuds();

  // Initialize Star Wars Credits Crawl (if on credits page)
  initCreditsCrawl();

  // Initialize Features & Space Jokes (if on features page)
  initFeaturesPage();

  // Initialize Settings switches (Moons & 3D Real Orbits) on the solar system view
  initSettingsSwitches();

  // Initialize interactive 3D orbit manipulation (drag to rotate, wheel/pinch to zoom)
  init3DOrbitInteraction();

  // Initialize RocketRun 2D Space Navigation Game Mode
  const gameToggle = document.getElementById('settings-game-toggle');
  if (gameToggle) {
    initGameEngine();
    const savedGame = localStorage.getItem('space_game_mode') === 'true';
    if (savedGame) {
      gameToggle.checked = true;
      startGame();
    }
    gameToggle.addEventListener('change', () => {
      const active = gameToggle.checked;
      localStorage.setItem('space_game_mode', active ? 'true' : 'false');
      if (active) {
        startGame();
      } else {
        stopGame();
      }
    });
  }

  // Initialize starfield canvas background
  initStarfield('stars');

  // Initialize viewer controller
  const viewer = initViewer(planets);

  // Initialize orrery interactive planetary orbits
  const sceneEl = document.getElementById('scene');
  buildOrrery(sceneEl, planets, idx => {
    viewer.showPlanet(idx);
  });
});

