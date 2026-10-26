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
import { initAuthGate } from './components/auth-gate.js';
import { startGame, stopGame, exitGameMode, isGameActive, initGameEngine, setFreePlayMode } from './game/game-engine.js';
import { getGameModeCookie, setGameModeCookie } from './components/cookie-notice.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize site-wide access gate
  initAuthGate();

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
  initGameModeSettings();

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

function initGameModeSettings() {
  const playBtn = document.getElementById('game-play-btn');
  const gameToggle = document.getElementById('settings-game-toggle');
  const freePlayToggle = document.getElementById('settings-freeplay-toggle');
  if (!playBtn && !gameToggle && !freePlayToggle) return;

  initGameEngine();

  const urlParams = new URLSearchParams(window.location.search);
  const isFreePlayParam = urlParams.get('mode') === 'freeplay';
  const dockedParam = urlParams.get('docked');
  const cookieMode = getGameModeCookie();
  const isCookieOff = cookieMode === 'off';
  const isCookieOn = cookieMode === 'on' || cookieMode === 'freeplay';
  const savedGame = localStorage.getItem('space_game_mode') === 'true';
  const savedFreePlay = localStorage.getItem('space_game_freeplay') === 'true';

  const shouldStartGame = isFreePlayParam || (isCookieOn && !isCookieOff) || (savedGame && !isCookieOff);
  const isFreePlayActive = isFreePlayParam || (cookieMode === 'freeplay') || (savedFreePlay && !isCookieOff);

  if (gameToggle) gameToggle.checked = shouldStartGame;
  if (freePlayToggle) freePlayToggle.checked = isFreePlayActive;

  if (shouldStartGame) {
    const sessionDocked = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('rocketrun_docked') : null;
    const docked = dockedParam || (isFreePlayActive ? sessionDocked : null) || 'earth';
    startGame({ freeplay: isFreePlayActive, docked });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isGameActive()) {
        exitGameMode();
      } else {
        const isFp = localStorage.getItem('space_game_freeplay') === 'true';
        startGame({ freeplay: isFp });
      }
    });
  }

  bindGameModeToggles(gameToggle, freePlayToggle);
}

function bindGameModeToggles(gameToggle, freePlayToggle) {
  if (gameToggle) {
    gameToggle.addEventListener('change', () => {
      const active = gameToggle.checked;
      localStorage.setItem('space_game_mode', active ? 'true' : 'false');
      setGameModeCookie(active ? (freePlayToggle?.checked ? 'freeplay' : 'on') : 'off');
      if (active) {
        const isFp = freePlayToggle ? freePlayToggle.checked : false;
        startGame({ freeplay: isFp });
      } else {
        exitGameMode();
      }
    });
  }

  if (freePlayToggle) {
    freePlayToggle.addEventListener('change', () => {
      const fpActive = freePlayToggle.checked;
      localStorage.setItem('space_game_freeplay', fpActive ? 'true' : 'false');
      if (fpActive && (!gameToggle || !gameToggle.checked)) {
        if (gameToggle) gameToggle.checked = true;
        localStorage.setItem('space_game_mode', 'true');
        setGameModeCookie('freeplay');
        startGame({ freeplay: true });
      } else {
        setGameModeCookie(fpActive ? 'freeplay' : (gameToggle?.checked ? 'on' : 'off'));
        setFreePlayMode(fpActive);
      }
    });
  }
}

