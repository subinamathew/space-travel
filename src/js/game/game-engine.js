/**
 * RocketRun Game Engine & Orchestrator
 * Clean, lightweight, CSS-first, Fire-tablet ready.
 * Starts docked on Earth; flies via slower scientific Keplerian transfer arcs.
 * Cyclomatic Complexity <= 5 per function.
 */

import { GameState, GAME_STATES } from './game-state.js';
import {
  calculateOrbitalWindow,
  evaluateLaunchOutcome,
  checkAsteroidHazard,
  checkSolarBoost,
  generateScientificTransferArc,
  getFlightDuration,
  calculateFlightFuelBurn,
  ORBIT_SPECS,
  BASE_EARTH_SECONDS
} from './game-physics.js';
import { getTouchdownNoteKey, getPlanetQuiz } from './game-quiz.js';
import {
  loadLeaderboard,
  saveLeaderboardScore,
  getPilotName,
  setPilotName,
  isLeaderboardCookieAllowed,
  setLeaderboardCookieAllowed
} from './game-leaderboard.js';
import { playLaunchSound, playTouchdownSound, playExplosionSound, playWarningSound } from './game-audio.js';
import { setGameModeCookie } from '../components/cookie-notice.js';
import { t } from '../i18n.js';
import {
  getBodyImagePath,
  getBodyIcon,
  getBodyPlainName,
  formatBodyName,
  createRocketActor,
  injectFlightKeyframes,
  renderFlightPathSvg,
  removeFlightPathSvg,
  removeFutureInterceptMarker,
  removePlanetaryLeadArc
} from './game-view.js';

export { ALL_DESTINATIONS, getRandomDestination, shuffleDestinations } from './game-state.js';
export { getBodyImagePath, getBodyIcon, getBodyPlainName, formatBodyName } from './game-view.js';

let gameState = null;
let gameActive = false;
let startTime = Date.now();
let orbitalTimer = null;
let activeFlightTimeout = null;
let activeDrainTimer = null;
let futureOffsetSec = 0;

export function isGameActive() {
  return gameActive;
}

export function initGameEngine() {
  if (gameState) return;
  gameState = new GameState();
  window.RocketRun = gameState;

  window.RocketRun.selectDestinationFromCanvas = selectDestinationFromCanvas;
  window.RocketRun.isGameActive = isGameActive;
  window.RocketRun.exitGameMode = exitGameMode;
  window.RocketRun.setFreePlayMode = setFreePlayMode;

  bindGlobalShortcuts();
}

export function startGame(options = {}) {
  initGameEngine();
  gameActive = true;
  gameState.reset(options);
  startTime = Date.now();
  setGameModeCookie(options.freeplay ? 'freeplay' : 'on');

  if (!gameState.isFreePlay && !gameState.targetPlanet) {
    const curMission = gameState.getCurrentMission();
    if (curMission && curMission.targetSlug) {
      gameState.setTarget(curMission.targetSlug);
    } else {
      gameState.setTarget('moon');
    }
  }

  const solarSystem = document.getElementById('solar-system');
  const sceneEl = document.getElementById('scene');
  if (solarSystem) solarSystem.classList.add('game-active');
  if (sceneEl) sceneEl.classList.add('game-active');

  enforce2DMode(true);
  renderGameUI();
  dockRocketAtCurrentPlanet();
  updateCanvasTargetHighlight();
  updateHUD();
  updateSidebar();
  syncFreePlayUI(gameState.isFreePlay);

  const gameToggle = document.getElementById('settings-game-toggle');
  if (gameToggle) gameToggle.checked = true;

  startOrbitalTelemetry();

  const playBtn = document.getElementById('game-play-btn');
  if (playBtn) {
    playBtn.classList.add('is-playing');
    playBtn.setAttribute('title', t('ui.exit_game_btn') || 'Exit Game Mode');
    playBtn.setAttribute('aria-label', t('ui.exit_game_btn') || 'Exit Game Mode');
  }
}

export function setFreePlayMode(active) {
  if (!gameState) return;
  const isFree = Boolean(active);
  gameState.setFreePlay(isFree);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('space_game_freeplay', isFree ? 'true' : 'false');
  }
  syncFreePlayUI(isFree);
  updateSidebar();
}

function syncFreePlayUI(isFree) {
  const fpToggle = document.getElementById('settings-freeplay-toggle');
  if (fpToggle) fpToggle.checked = isFree;

  const missionBtn = document.getElementById('mode-missions-btn');
  const fpBtn = document.getElementById('mode-freeplay-btn');
  if (missionBtn) missionBtn.classList.toggle('is-active', !isFree);
  if (fpBtn) fpBtn.classList.toggle('is-active', isFree);
}

export function stopGame() {
  gameActive = false;
  setGameModeCookie('off');
  stopOrbitalTelemetry();
  clearFlightTimeout();
  clearDrainTimer();
  enforce2DMode(false);

  const solarSystem = document.getElementById('solar-system');
  const sceneEl = document.getElementById('scene');
  if (solarSystem) solarSystem.classList.remove('game-active');
  if (sceneEl) sceneEl.classList.remove('game-active');

  const playBtn = document.getElementById('game-play-btn');
  if (playBtn) {
    playBtn.classList.remove('is-playing');
    playBtn.setAttribute('title', t('ui.play_game_btn') || 'Play RocketRun Game');
    playBtn.setAttribute('aria-label', t('ui.play_game_btn') || 'Play RocketRun Game');
  }

  teardownGameUI();
}

export function exitGameMode() {
  const gameToggle = document.getElementById('settings-game-toggle');
  if (gameToggle) {
    gameToggle.checked = false;
  }
  const fpToggle = document.getElementById('settings-freeplay-toggle');
  if (fpToggle) {
    fpToggle.checked = false;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('space_game_mode', 'false');
    localStorage.setItem('space_game_freeplay', 'false');
  }
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.removeItem('rocketrun_freeplay');
    sessionStorage.removeItem('rocketrun_docked');
  }
  setGameModeCookie('off');
  stopGame();
}

function clearDrainTimer() {
  if (activeDrainTimer) {
    clearInterval(activeDrainTimer);
    activeDrainTimer = null;
  }
}

function clearFlightTimeout() {
  if (activeFlightTimeout) {
    clearTimeout(activeFlightTimeout);
    activeFlightTimeout = null;
  }
}

function enforce2DMode(active) {
  const solarSystem = document.getElementById('solar-system');
  const sceneEl = document.getElementById('scene');
  const orbitToggle = document.getElementById('orbit-toggle');
  const orbitRow = document.getElementById('orbit-settings-row');

  if (active) {
    if (solarSystem) solarSystem.classList.remove('real-orbits');
    if (sceneEl) sceneEl.classList.remove('real-orbits');
    if (orbitToggle) {
      orbitToggle.checked = false;
      orbitToggle.disabled = true;
    }
    if (orbitRow) orbitRow.style.opacity = '0.4';
  } else {
    if (orbitToggle) orbitToggle.disabled = false;
    if (orbitRow) orbitRow.style.opacity = '1';
  }
}

function startOrbitalTelemetry() {
  stopOrbitalTelemetry();
  orbitalTimer = setInterval(() => {
    if (!gameActive) return;
    if (gameState.state !== GAME_STATES.TRANSIT && gameState.state !== GAME_STATES.LAUNCHING) {
      if (gameState.fuel < 100) {
        const fluxRate = gameState.getSolarRechargeRate ? gameState.getSolarRechargeRate() : 1.67;
        gameState.addFuel(fluxRate * 0.4);
        updateFuelUI();
        updateLaunchButtonState();
      }
    }
    updateOrbitalWindowUI();
  }, 400);
}

function stopOrbitalTelemetry() {
  if (orbitalTimer) {
    clearInterval(orbitalTimer);
    orbitalTimer = null;
  }
}

function getElapsedSec() {
  return (Date.now() - startTime) / 1000;
}

function getAstronautAvatar() {
  const saved = localStorage.getItem('space_calc_astronaut');
  return saved === 'female' ? '👩‍🚀' : '👨‍🚀';
}

function getBodyElement(slug) {
  if (slug === 'sun') return document.getElementById('sun');
  if (slug === 'moon' || slug === 'luna') {
    return document.getElementById('moon-btn-moon') || document.querySelector('.moon[data-slug="moon"]') || document.querySelector('.moon');
  }
  return document.getElementById(`planet-btn-${slug}`) || document.querySelector(`.planet-btn[data-slug="${slug}"]`);
}

function getBodyCenterRelativeToScene(bodyEl, sceneEl) {
  if (!bodyEl || !sceneEl) return { x: 0, y: 0 };
  const bRect = bodyEl.getBoundingClientRect();
  const sRect = sceneEl.getBoundingClientRect();
  return {
    x: bRect.left + bRect.width / 2 - (sRect.left + sRect.width / 2),
    y: bRect.top + bRect.height / 2 - (sRect.top + sRect.height / 2)
  };
}

function dockRocketAtCurrentPlanet() {
  const bodyEl = getBodyElement(gameState.currentPlanet);
  if (!bodyEl) return;

  let rocket = document.getElementById('rocket-actor');
  if (!rocket) {
    rocket = createRocketActor();
  }

  rocket.className = 'rocket-actor is-docked';
  rocket.style.removeProperty('animation');
  rocket.style.removeProperty('--flight-duration');
  bodyEl.appendChild(rocket);
}

function renderGameUI() {
  teardownGameUI();

  const hud = document.createElement('aside');
  hud.id = 'rocketrun-hud';
  hud.className = 'rocketrun-hud-overlay';
  hud.innerHTML = `
    <div class="hud-inner">
      <div class="hud-col astronaut-col">
        <span class="hud-avatar" id="hud-avatar">${getAstronautAvatar()}</span>
        <span class="hud-rank" id="hud-rank">Cadet</span>
      </div>
      <div class="hud-col stats-col">
        <div class="hud-lives" id="hud-lives" aria-label="Lives">🚀 🚀 🚀</div>
        <div class="hud-stars" id="hud-stars">⭐ 0</div>
        <div class="hud-fuel" id="hud-fuel-gauge" title="Fuel Tank">⛽ 100%</div>
      </div>
      <div class="hud-col actions-col">
        <button type="button" class="hud-lb-btn" id="hud-lb-btn" title="View Leaderboard" aria-label="Leaderboard">🏆</button>
        <button type="button" class="hud-close-btn" id="hud-close-btn" title="${t('game.exit_game_aria') || 'Exit Game Mode'}" aria-label="${t('game.exit_game_aria') || 'Exit Game Mode'}">✕</button>
      </div>
    </div>
  `;
  document.body.appendChild(hud);

  const sidebar = document.createElement('aside');
  sidebar.id = 'rocketrun-sidebar';
  sidebar.className = 'rocketrun-launch-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="sidebar-title">
        <span class="sidebar-icon">🚀</span>
        <span class="sidebar-title-text" data-i18n="game.launch_control">Launch Control</span>
      </div>
      <div class="sidebar-route-banner" id="sidebar-route-banner" title="${t('game.next_destination') || 'Route'}">
        <span class="route-icon" id="route-origin-icon" title="${t('game.current_location') || 'Origin'}">${getBodyIcon(gameState.currentPlanet)}</span>
        <span class="route-arrow" id="route-arrow-icon" aria-hidden="true">➔</span>
        <span class="route-icon" id="route-dest-icon" title="${t('game.next_destination') || 'Destination'}">${gameState.targetPlanet ? getBodyIcon(gameState.targetPlanet) : '🎯'}</span>
      </div>
      <button type="button" id="launch-btn" class="big-launch-btn">
        <span class="btn-glow"></span>
        <span class="btn-text" id="launch-btn-text" data-i18n="game.big_launch_btn">BIG LAUNCH 🚀</span>
      </button>
      <div class="sidebar-min-bar" id="sidebar-min-bar">
        <div class="min-route-widget" id="min-route-widget" title="Active Route">
          <img id="min-origin-img" class="min-planet-img" src="${getBodyImagePath(gameState.currentPlanet)}" alt="Origin Planet" />
          <span class="min-route-arrow" aria-hidden="true">➔</span>
          <img id="min-dest-img" class="min-planet-img" src="${getBodyImagePath(gameState.targetPlanet || (gameState.currentPlanet === 'moon' ? 'earth' : 'moon'))}" alt="Destination Planet" />
        </div>
        <button type="button" class="luna-dest-btn min-luna-btn" id="min-luna-btn" title="${t('game.target_moon') || 'Target Moon'}" aria-label="${t('game.target_moon') || 'Target Moon'}">
          <span class="luna-icon" aria-hidden="true">${gameState.currentPlanet === 'moon' ? '🌍' : '🌙'}</span>
        </button>
        <div class="min-thrust-widget" id="min-thrust-widget" title="${t('game.thrust_energy') || 'Thrust Energy'}">
          <span class="min-thrust-icon" aria-hidden="true">⚡</span>
          <span class="min-thrust-num is-green" id="min-thrust-num">50%</span>
        </div>
        <div class="min-fuel-signal" id="min-fuel-signal" title="${t('game.fuel_label') || 'Fuel Tank Level'}">
          <span class="min-fuel-icon" aria-hidden="true">⛽</span>
          <div class="signal-bars" id="min-signal-bars" aria-label="Fuel Tank Signal">
            <span class="signal-bar bar-1 is-active"></span>
            <span class="signal-bar bar-2 is-active"></span>
            <span class="signal-bar bar-3 is-active"></span>
            <span class="signal-bar bar-4 is-active"></span>
          </div>
          <span class="min-fuel-pct" id="min-fuel-pct">100%</span>
        </div>
        <button type="button" class="min-launch-btn" id="min-launch-btn" title="${t('game.big_launch_btn') || 'Launch Rocket'}">
          <span class="btn-text" id="min-launch-btn-text">LAUNCH 🚀</span>
        </button>
      </div>
      <div class="sidebar-header-actions">
        <div class="current-loc" id="current-location-indicator">Earth 🌍</div>
        <button type="button" class="sidebar-min-btn" id="sidebar-min-btn" title="Minimize / Expand" aria-label="Minimize Launch Control">−</button>
        <button type="button" class="sidebar-close-btn" id="sidebar-close-btn" title="${t('game.exit_game_aria') || 'Exit Game Mode'}" aria-label="${t('game.exit_game_aria') || 'Exit Game Mode'}">✕</button>
      </div>
    </div>
    <div class="sidebar-body">
      <!-- Long Mission Note stretching the sidebar-body -->
      <div class="sidebar-mission-card" id="sidebar-mission-card">
        <div class="mission-card-header">
          <span class="sidebar-mission-tag" id="sidebar-mission-tag">🎯 <span data-i18n="game.mission_label">ACTIVE MISSION</span></span>
          <div class="destination-control-block">
            <span class="dest-target-status" id="dest-target-status">
              <span class="dest-target-label" data-i18n="game.target_label">TARGET:</span>
              <span class="dest-target-name" id="dest-target-name">${gameState.targetPlanet ? getBodyPlainName(gameState.targetPlanet) : (t('game.select_target_prompt') || 'Select Target')}</span>
            </span>
            <button type="button" class="luna-dest-btn" id="luna-dest-btn" title="${t('game.target_moon') || 'Target Moon'}" aria-label="${t('game.target_moon') || 'Target Moon'}">
              <span class="luna-icon" aria-hidden="true">${gameState.currentPlanet === 'moon' ? '🌍' : '🌙'}</span>
            </button>
          </div>
        </div>
        <div class="sidebar-mission-clue" id="sidebar-mission-clue">Loading mission...</div>
        <div class="dest-map-hint">
          <span>👆</span> <span data-i18n="game.tap_planet_map_hint">${t('game.tap_planet_map_hint') || 'Tap any planet on map to target!'}</span>
        </div>
      </div>

      <div class="launch-accordion" id="launch-accordion">

        <!-- Accordion 3: Thrust Energy -->
        <div class="accordion-section" id="sec-thrust">
          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-content-thrust" title="${t('game.thrust_energy') || 'Thrust Energy:'}">
            <span class="accordion-header-left">
              <span class="accordion-icon">⚡</span>
              <span class="accordion-title" data-i18n="game.thrust_energy">${t('game.thrust_energy') || 'Thrust Energy:'}</span>
            </span>
            <span class="accordion-header-right">
              <span class="accordion-summary" id="acc-summary-thrust">50%</span>
              <span class="accordion-chevron" aria-hidden="true">▾</span>
            </span>
          </button>
          <div class="accordion-content" id="acc-content-thrust">
            <div class="energy-control-block">
              <div class="energy-header">
                <span class="sidebar-label" data-i18n="game.thrust_energy">${t('game.thrust_energy') || 'Thrust Energy:'}</span>
                <span class="energy-val" id="energy-val-readout">50%</span>
              </div>
              <input type="range" id="energy-slider" class="energy-slider" min="5" max="100" value="50" step="1" aria-label="Thrust Energy Slider" />
              <div class="energy-hints">
                <span>10% (Low)</span>
                <span>50% (Cruise)</span>
                <span>100% (Max)</span>
              </div>
              <div class="energy-feedback-hint" id="energy-feedback-hint"></div>
            </div>
          </div>
        </div>

        <!-- Accordion 4: Fuel Tank -->
        <div class="accordion-section" id="sec-fuel">
          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-content-fuel" title="${t('game.fuel_label') || 'Fuel Tank:'}">
            <span class="accordion-header-left">
              <span class="accordion-icon">⛽</span>
              <span class="accordion-title" data-i18n="game.fuel_label">${t('game.fuel_label') || 'Fuel Tank:'}</span>
            </span>
            <span class="accordion-header-right">
              <span class="accordion-summary" id="acc-summary-fuel">100%</span>
              <span class="accordion-chevron" aria-hidden="true">▾</span>
            </span>
          </button>
          <div class="accordion-content" id="acc-content-fuel">
            <div class="sidebar-fuel-block" id="sidebar-fuel-block">
              <div class="fuel-header">
                <span class="sidebar-label" data-i18n="game.fuel_label">${t('game.fuel_label') || 'Fuel Tank:'}</span>
                <span class="fuel-val" id="fuel-val-readout">100%</span>
              </div>
              <div class="fuel-progress-track">
                <div class="fuel-progress-fill" id="fuel-progress-fill" style="width: 100%;"></div>
              </div>
              <div class="solar-recharge-indicator" id="solar-recharge-indicator" style="display:none;">
                <span class="solar-icon">☀️</span>
                <span class="solar-text" id="solar-recharge-text">${t('game.solar_charging_status') || '☀️ Solar Array Charging: Active'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Accordion 5: Orbital Telemetry -->
        <div class="accordion-section" id="sec-telemetry">
          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-content-telemetry" title="${t('game.orbital_telemetry') || 'Orbital Telemetry'}">
            <span class="accordion-header-left">
              <span class="accordion-icon">📡</span>
              <span class="accordion-title" data-i18n="game.orbital_telemetry">${t('game.orbital_telemetry') || 'Orbital Telemetry'}</span>
            </span>
            <span class="accordion-header-right">
              <span class="accordion-summary" id="acc-summary-telemetry">🟢 Window</span>
              <span class="accordion-chevron" aria-hidden="true">▾</span>
            </span>
          </button>
          <div class="accordion-content" id="acc-content-telemetry">
            <div class="sidebar-telemetry-block" id="sidebar-orbit-telemetry">
              <div class="telemetry-header">
                <span class="telemetry-title" data-i18n="game.orbital_telemetry">ORBITAL TELEMETRY</span>
                <span class="telemetry-window-tag" id="telemetry-window-tag">🟢 Perigee Window</span>
              </div>
              <div class="telemetry-physics-banner" id="telemetry-physics-banner">
                <span class="banner-icon">🪐</span>
                <span class="banner-text" id="telemetry-physics-text">${(t('game.future_rendezvous_principle') || '🚀 Keplerian Rendezvous: Planets orbit continuously while you fly! You must aim for where the planet will be upon arrival (T+{sec}s), not where it is today.').replace('{sec}', '5.2')}</span>
              </div>
              <div class="telemetry-grid">
                <div class="telemetry-item">
                  <span class="telemetry-label" data-i18n="game.perigee_label">Perigee (Min):</span>
                  <span class="telemetry-val" id="telemetry-perigee-val">--</span>
                </div>
                <div class="telemetry-item">
                  <span class="telemetry-label" data-i18n="game.apogee_label">Apogee (Max):</span>
                  <span class="telemetry-val" id="telemetry-apogee-val">--</span>
                </div>
                <div class="telemetry-item">
                  <span class="telemetry-label" data-i18n="game.current_separation">Current Distance:</span>
                  <span class="telemetry-val" id="telemetry-dist-val">--</span>
                </div>
                <div class="telemetry-item highlight-item">
                  <span class="telemetry-label" data-i18n="game.future_intercept_label">Arrival Intercept:</span>
                  <span class="telemetry-val" id="telemetry-arrival-val">--</span>
                </div>
                <div class="telemetry-item highlight-item">
                  <span class="telemetry-label" data-i18n="game.future_lead_label">Transit Orbit Motion:</span>
                  <span class="telemetry-val" id="telemetry-lead-val">--</span>
                </div>
                <div class="telemetry-item highlight-item">
                  <span class="telemetry-label" data-i18n="game.future_landing_location_label">Future Landing Orbit:</span>
                  <span class="telemetry-val" id="telemetry-landing-loc-val">--</span>
                </div>
                <div class="telemetry-item">
                  <span class="telemetry-label" data-i18n="game.next_window_label">Next Window:</span>
                  <span class="telemetry-val" id="telemetry-next-window-val">--</span>
                </div>
                <div class="telemetry-item">
                  <span class="telemetry-label" data-i18n="game.target_orbit_zone">Target Orbit Zone:</span>
                  <span class="telemetry-val" id="telemetry-energy-req">--</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Accordion 6: Future Orbit Planner -->
        <div class="accordion-section" id="sec-planner">
          <button type="button" class="accordion-header" aria-expanded="false" aria-controls="acc-content-planner" title="${t('game.future_orbit_planner') || 'Future Orbit Planner'}">
            <span class="accordion-header-left">
              <span class="accordion-icon">🔮</span>
              <span class="accordion-title" data-i18n="game.future_orbit_planner">${t('game.future_orbit_planner') || 'Future Orbit Planner'}</span>
            </span>
            <span class="accordion-header-right">
              <span class="accordion-summary" id="acc-summary-planner">Live</span>
              <span class="accordion-chevron" aria-hidden="true">▾</span>
            </span>
          </button>
          <div class="accordion-content" id="acc-content-planner">
            <div class="future-orbit-planner" id="future-orbit-planner">
              <div class="planner-header">
                <span class="planner-title" data-i18n="game.future_orbit_planner">🔮 FUTURE ORBIT PLANNER</span>
                <span class="planner-offset-badge" id="planner-offset-badge">T+0s (LIVE)</span>
              </div>
              <p class="planner-subtitle" data-i18n="game.planner_subtitle">
                ${t('game.planner_subtitle') || 'Planets advance along orbits over time. Preview future orbital alignments to pick optimal transfer windows.'}
              </p>
              <div class="planner-buttons">
                <button type="button" class="planner-btn is-active" data-offset="0">Live</button>
                <button type="button" class="planner-btn" data-offset="5">+5s</button>
                <button type="button" class="planner-btn" data-offset="10">+10s</button>
                <button type="button" class="planner-btn" data-offset="15">+15s</button>
                <button type="button" class="planner-btn" data-offset="20">+20s</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
  document.body.appendChild(sidebar);

  bindSidebarEvents();
  bindHUDEvents();
}

function teardownGameUI() {
  const elements = [
    'rocketrun-hud',
    'rocketrun-sidebar',
    'rocket-actor',
    'game-quiz-modal',
    'game-victory-modal',
    'game-debrief-modal',
    'asteroid-warning-banner',
    'game-leaderboard-modal',
    'flight-path-svg',
    'future-intercept-reticle',
    'future-lead-arc-svg',
    'rocket-flight-keyframes'
  ];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  document.querySelectorAll('.planet-btn, .moon').forEach(el => {
    el.classList.remove('is-game-target');
  });
}

function bindHUDEvents() {
  const lbBtn = document.getElementById('hud-lb-btn');
  if (lbBtn) {
    lbBtn.addEventListener('click', showLeaderboardModal);
  }
  const closeBtn = document.getElementById('hud-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', exitGameMode);
  }
}

function bindSidebarEvents() {
  const modeSelector = document.querySelector('.game-mode-pill-selector');
  if (modeSelector) {
    modeSelector.addEventListener('click', e => {
      const btn = e.target.closest('.mode-pill-btn');
      if (!btn) return;
      setFreePlayMode(btn.dataset.mode === 'freeplay');
    });
  }

  const accordion = document.getElementById('launch-accordion');
  if (accordion) {
    accordion.addEventListener('click', e => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;
      const section = header.closest('.accordion-section');
      if (!section) return;
      const isOpen = section.classList.contains('is-open');
      accordion.querySelectorAll('.accordion-section').forEach(s => {
        if (s !== section) {
          s.classList.remove('is-open');
          const h = s.querySelector('.accordion-header');
          if (h) h.setAttribute('aria-expanded', 'false');
        }
      });
      section.classList.toggle('is-open', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  document.querySelectorAll('.luna-dest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = gameState.currentPlanet === 'moon' ? 'earth' : 'moon';
      selectDestination(target);
    });
  });

  const minBtn = document.getElementById('sidebar-min-btn');
  if (minBtn) {
    minBtn.addEventListener('click', () => {
      const sidebar = document.getElementById('rocketrun-sidebar');
      if (!sidebar) return;
      const isMin = sidebar.classList.toggle('is-minimized');
      minBtn.textContent = isMin ? '+' : '−';
    });
  }

  const slider = document.getElementById('energy-slider');
  const readout = document.getElementById('energy-val-readout');
  if (slider && readout) {
    slider.addEventListener(
      'input',
      () => {
        readout.textContent = `${slider.value}%`;
        gameState.setEnergy(slider.value);
        updateLaunchButtonState();
        updateEnergyFeedbackHint();
        updateFuelUI();
        updateThrustMinUI();
        const sumThrust = document.getElementById('acc-summary-thrust');
        if (sumThrust) sumThrust.textContent = `${slider.value}%`;
      },
      { passive: true }
    );
  }

  const launchBtn = document.getElementById('launch-btn');
  if (launchBtn) {
    launchBtn.addEventListener('click', handleLaunchClick);
  }

  const minLaunchBtn = document.getElementById('min-launch-btn');
  if (minLaunchBtn) {
    minLaunchBtn.addEventListener('click', handleLaunchClick);
  }

  const closeBtn = document.getElementById('sidebar-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', exitGameMode);
  }

  const plannerControls = document.getElementById('future-orbit-planner');
  if (plannerControls) {
    plannerControls.addEventListener('click', e => {
      const btn = e.target.closest('.planner-btn');
      if (!btn) return;
      futureOffsetSec = Number(btn.dataset.offset) || 0;
      plannerControls.querySelectorAll('.planner-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const badge = document.getElementById('planner-offset-badge');
      if (badge) {
        badge.textContent = futureOffsetSec === 0 ? 'T+0s (LIVE)' : `T+${futureOffsetSec}s (PROJECTED)`;
      }
      const sumPlanner = document.getElementById('acc-summary-planner');
      if (sumPlanner) {
        sumPlanner.textContent = futureOffsetSec === 0 ? 'Live' : `+${futureOffsetSec}s`;
      }
      updateOrbitalWindowUI();
    });
  }
}

function updateHUD() {
  if (!gameState) return;

  const avatarEl = document.getElementById('hud-avatar');
  if (avatarEl) avatarEl.textContent = getAstronautAvatar();

  const rankEl = document.getElementById('hud-rank');
  if (rankEl) {
    const r = gameState.getRank();
    rankEl.textContent = `${r.icon} ${t(r.titleKey)}`;
  }

  const livesEl = document.getElementById('hud-lives');
  if (livesEl) {
    livesEl.textContent = '🚀 '.repeat(gameState.lives).trim() || '💥';
  }

  const starsEl = document.getElementById('hud-stars');
  if (starsEl) {
    starsEl.textContent = `⭐ ${gameState.score}`;
  }

  updateFuelUI();
}

function updateSidebar() {
  if (!gameState) return;

  const locEl = document.getElementById('current-location-indicator');
  if (locEl) {
    locEl.textContent = `${formatBodyName(gameState.currentPlanet)}`;
  }

  const originIconEl = document.getElementById('route-origin-icon');
  if (originIconEl) {
    originIconEl.textContent = getBodyIcon(gameState.currentPlanet);
  }

  const originNameEl = document.getElementById('route-origin-name');
  if (originNameEl) {
    originNameEl.textContent = getBodyPlainName(gameState.currentPlanet);
  }

  const originImgEl = document.getElementById('route-origin-img');
  if (originImgEl) {
    originImgEl.src = getBodyImagePath(gameState.currentPlanet);
    originImgEl.alt = getBodyPlainName(gameState.currentPlanet);
  }

  const destIconEl = document.getElementById('route-dest-icon');
  if (destIconEl) {
    destIconEl.textContent = gameState.targetPlanet ? getBodyIcon(gameState.targetPlanet) : '🎯';
  }

  const destImgEl = document.getElementById('route-dest-img');
  if (destImgEl) {
    const destSlug = gameState.targetPlanet || (gameState.currentPlanet === 'moon' ? 'earth' : 'moon');
    destImgEl.src = getBodyImagePath(destSlug);
    destImgEl.alt = gameState.targetPlanet ? getBodyPlainName(gameState.targetPlanet) : 'Destination';
  }

  // Minimized view route images
  const minOriginImg = document.getElementById('min-origin-img');
  if (minOriginImg) {
    minOriginImg.src = getBodyImagePath(gameState.currentPlanet);
    minOriginImg.alt = getBodyPlainName(gameState.currentPlanet);
    minOriginImg.title = `Origin: ${getBodyPlainName(gameState.currentPlanet)}`;
  }

  const minDestImg = document.getElementById('min-dest-img');
  if (minDestImg) {
    const destSlug = gameState.targetPlanet || (gameState.currentPlanet === 'moon' ? 'earth' : 'moon');
    minDestImg.src = getBodyImagePath(destSlug);
    minDestImg.alt = gameState.targetPlanet ? getBodyPlainName(gameState.targetPlanet) : 'Destination';
    minDestImg.title = `Destination: ${gameState.targetPlanet ? getBodyPlainName(gameState.targetPlanet) : 'Select Target'}`;
    minDestImg.classList.toggle('has-no-target', !gameState.targetPlanet);
  }

  const tagEl = document.getElementById('sidebar-mission-tag');
  const sumModeEl = document.getElementById('acc-summary-mode');
  if (tagEl) {
    if (gameState.isFreePlay) {
      const fpText = `🚀 ${t('game.freeplay_tag') || 'FREE PLAY EXPLORATION'}`;
      tagEl.textContent = fpText;
      if (sumModeEl) sumModeEl.textContent = t('game.mode_freeplay') || 'Free Play';
    } else {
      const mText = `🎯 ${t('game.mission_label') || 'MISSION'} #${gameState.missionIndex + 1}`;
      tagEl.textContent = mText;
      if (sumModeEl) sumModeEl.textContent = `🎯 Mission ${gameState.missionIndex + 1}`;
    }
  }

  const currentMission = gameState.getCurrentMission();
  const sidebarClueEl = document.getElementById('sidebar-mission-clue');
  if (sidebarClueEl && currentMission) {
    sidebarClueEl.textContent = t(currentMission.clueKey);
  }

  const destNameEl = document.getElementById('dest-target-name');
  const sumDestEl = document.getElementById('acc-summary-dest');
  const targetLabel = gameState.targetPlanet ? getBodyPlainName(gameState.targetPlanet) : (t('game.select_target_prompt') || 'Select on Map or tap Luna');
  if (destNameEl) destNameEl.textContent = targetLabel;
  if (sumDestEl) sumDestEl.textContent = gameState.targetPlanet ? formatBodyName(gameState.targetPlanet) : (t('game.select_target_prompt') || 'Select on Map');

  const isMoonOrigin = gameState.currentPlanet === 'moon';
  const lunaIcon = isMoonOrigin ? '🌍' : '🌙';
  const lunaLabel = isMoonOrigin ? (t('game.target_earth') || 'Target Earth') : (t('game.target_moon') || 'Target Moon');
  const isLunaTargeted = gameState.targetPlanet === (isMoonOrigin ? 'earth' : 'moon');

  document.querySelectorAll('.luna-dest-btn').forEach(btn => {
    btn.innerHTML = `<span class="luna-icon" aria-hidden="true">${lunaIcon}</span>`;
    btn.setAttribute('aria-label', lunaLabel);
    btn.setAttribute('title', lunaLabel);
    btn.classList.toggle('is-selected', isLunaTargeted);
  });

  updateCanvasTargetHighlight();
  updateFuelUI();
  updateLaunchButtonState();
  updateThrustMinUI();
}

function updateFuelUI() {
  if (!gameState) return;
  const f = Math.round(gameState.fuel);

  const fuelEl = document.getElementById('hud-fuel-gauge');
  if (fuelEl) fuelEl.textContent = `⛽ ${f}%`;

  const fuelVal = document.getElementById('fuel-val-readout');
  const fuelFill = document.getElementById('fuel-progress-fill');
  if (fuelVal && fuelFill) {
    fuelVal.textContent = `${f}%`;
    fuelFill.style.width = `${f}%`;
  }

  const solarInd = document.getElementById('solar-recharge-indicator');
  const solarText = document.getElementById('solar-recharge-text');
  const isCharging = gameState.fuel < 100;

  if (solarInd) {
    solarInd.style.display = isCharging ? 'flex' : 'none';
  }
  if (solarText && isCharging) {
    const rate = gameState.getSolarRechargeRate ? gameState.getSolarRechargeRate() : 1.67;
    solarText.textContent = `${t('game.solar_charging_status')} (+${rate}%/s)`;
  }
  if (fuelFill) {
    fuelFill.classList.toggle('is-charging', isCharging);
  }

  // Minimized fuel signal meter
  const minSignalBars = document.getElementById('min-signal-bars');
  const minFuelPct = document.getElementById('min-fuel-pct');
  if (minSignalBars) {
    const bars = minSignalBars.querySelectorAll('.signal-bar');
    bars.forEach((b, idx) => {
      // 4 bars: bar 1 (>0%), bar 2 (>=25%), bar 3 (>=50%), bar 4 (>=75%)
      const threshold = idx === 0 ? 1 : idx * 25;
      b.classList.toggle('is-active', f >= threshold);
    });
    minSignalBars.classList.toggle('is-empty', f <= 0);
    minSignalBars.classList.toggle('is-low', f > 0 && f < 25);
  }
  if (minFuelPct) {
    minFuelPct.textContent = `${f}%`;
  }
}

function updateLaunchButtonState() {
  if (!gameState || gameState.state === GAME_STATES.TRANSIT || gameState.state === GAME_STATES.LAUNCHING) return;
  const btn = document.getElementById('launch-btn');
  const btnText = document.getElementById('launch-btn-text');
  const minBtn = document.getElementById('min-launch-btn');
  const minBtnText = document.getElementById('min-launch-btn-text');
  if (!btn && !minBtn) return;

  const fluxRate = gameState.getSolarRechargeRate ? gameState.getSolarRechargeRate() : 1.67;

  if (gameState.fuel <= 0) {
    const req = gameState.energy || 50;
    const waitSec = Math.ceil(req / fluxRate);
    if (btn) {
      btn.disabled = true;
      btn.classList.add('is-fuel-empty');
      if (btnText) btnText.textContent = `⛽ FUEL EMPTY — REFUELING (${waitSec}s)...`;
    }
    if (minBtn) {
      minBtn.disabled = true;
      minBtn.classList.add('is-fuel-empty');
      if (minBtnText) minBtnText.textContent = 'EMPTY ⛽';
      else minBtn.textContent = 'EMPTY ⛽';
    }
  } else if (gameState.fuel < gameState.energy) {
    const deficit = gameState.energy - gameState.fuel;
    const waitSec = Math.ceil(deficit / fluxRate);
    if (btn) {
      btn.disabled = true;
      btn.classList.remove('is-fuel-empty');
      const template = t('game.solar_charging_wait') || '☀️ SOLAR CHARGING ({sec}s)... ⚡';
      if (btnText) btnText.textContent = template.replace('{sec}', waitSec);
    }
    if (minBtn) {
      minBtn.disabled = true;
      minBtn.classList.remove('is-fuel-empty');
      if (minBtnText) minBtnText.textContent = 'CHARGE ⚡';
      else minBtn.textContent = 'CHARGE ⚡';
    }
  } else {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('is-fuel-empty');
      if (btnText) btnText.textContent = t('game.big_launch_btn') || 'BIG LAUNCH 🚀';
    }
    if (minBtn) {
      minBtn.disabled = false;
      minBtn.classList.remove('is-fuel-empty');
      if (minBtnText) minBtnText.textContent = 'LAUNCH 🚀';
      else minBtn.textContent = 'LAUNCH 🚀';
    }
  }
}



export function updateThrustMinUI(optMetrics) {
  const minThrustNum = document.getElementById('min-thrust-num');
  if (!minThrustNum || !gameState) return;
  const e = Number(gameState.energy) || 50;
  minThrustNum.textContent = `${e}%`;

  minThrustNum.classList.remove('is-green', 'is-yellow', 'is-red');

  if (!gameState.targetPlanet) {
    minThrustNum.classList.add('is-green');
    return;
  }

  const metrics = optMetrics || calculateOrbitalWindow(gameState.currentPlanet, gameState.targetPlanet, getElapsedSec());
  if (e >= metrics.minReq && e <= metrics.maxCap) {
    minThrustNum.classList.add('is-green');
  } else if (
    (e >= metrics.minReq - 6 && e < metrics.minReq) ||
    (e > metrics.maxCap && e <= metrics.maxCap + 6)
  ) {
    minThrustNum.classList.add('is-yellow');
  } else {
    minThrustNum.classList.add('is-red');
  }
}







export function selectDestinationFromCanvas(slug) {
  if (!gameActive || gameState.state === GAME_STATES.TRANSIT) return false;
  if (slug === gameState.currentPlanet) return false;
  selectDestination(slug);
  return true;
}

function selectDestination(slug) {
  if (gameState.state === GAME_STATES.TRANSIT) return;
  gameState.targetPlanet = slug;
  gameState.setState(GAME_STATES.TARGETED);
  updateCanvasTargetHighlight();
  updateSidebar();
  updateOrbitalWindowUI();
}

function updateCanvasTargetHighlight() {
  document.querySelectorAll('.planet-btn, .moon').forEach(el => {
    el.classList.remove('is-game-target');
  });
  if (!gameState || !gameState.targetPlanet) return;
  const targetEl = getBodyElement(gameState.targetPlanet);
  if (targetEl) {
    targetEl.classList.add('is-game-target');
  }
}

function updateOrbitalWindowUI() {
  if (!gameState.targetPlanet) {
    removeFutureInterceptMarker();
    return;
  }
  const metrics = calculateOrbitalWindow(
    gameState.currentPlanet,
    gameState.targetPlanet,
    getElapsedSec(),
    futureOffsetSec
  );

  updateTelemetryHeaderAndTag(metrics);
  updateTelemetryGridValues(metrics);
  updateEnergyFeedbackHint(metrics);
  updateThrustMinUI(metrics);
  renderFutureInterceptMarker(metrics);
}

function updateTelemetryHeaderAndTag(metrics) {
  const tagEl = document.getElementById('telemetry-window-tag');
  if (tagEl) {
    tagEl.className = `telemetry-window-tag status-${metrics.status}`;
    if (metrics.status === 'perigee') tagEl.textContent = t('game.perigee_window') || '🟢 Perigee Window';
    else if (metrics.status === 'apogee') tagEl.textContent = t('game.apogee_window') || '🔴 Apogee Window';
    else tagEl.textContent = t('game.moderate_window') || '🟡 Mid-Orbit';
  }

  const sumTele = document.getElementById('acc-summary-telemetry');
  if (sumTele) {
    sumTele.textContent = metrics.status === 'perigee' ? '🟢 Perigee' : (metrics.status === 'apogee' ? '🔴 Apogee' : '🟡 Mid-Orbit');
  }

  const physicsText = document.getElementById('telemetry-physics-text');
  if (physicsText) {
    const rawPrinciple = t('game.future_rendezvous_principle') ||
      '🚀 Keplerian Rendezvous: Planets orbit continuously while you fly! You must aim for where the planet will be upon arrival (T+{sec}s), not where it is today.';
    physicsText.textContent = rawPrinciple.replace('{sec}', metrics.flightDurationSec);
  }
}

function updateTelemetryGridValues(metrics) {
  const pVal = document.getElementById('telemetry-perigee-val');
  if (pVal) pVal.textContent = `${metrics.minAu.toFixed(2)} AU`;

  const aVal = document.getElementById('telemetry-apogee-val');
  if (aVal) aVal.textContent = `${metrics.maxAu.toFixed(2)} AU`;

  const dVal = document.getElementById('telemetry-dist-val');
  if (dVal) {
    const prefix = futureOffsetSec > 0 ? `(T+${futureOffsetSec}s) ` : '';
    dVal.textContent = `${prefix}${metrics.currentAu.toFixed(2)} AU`;
  }

  const arrVal = document.getElementById('telemetry-arrival-val');
  if (arrVal) {
    arrVal.textContent = `${metrics.arrivalAu.toFixed(2)} AU (+${metrics.flightDurationSec}s)`;
  }

  const arrivalPt = calculateArrivalScenePoint(gameState.targetPlanet, document.getElementById('scene'), metrics.flightDurationSec);

  const leadVal = document.getElementById('telemetry-lead-val');
  if (leadVal) {
    leadVal.textContent = `+${arrivalPt.deltaDeg || Math.round(metrics.leadDeg || 0)}° (+${metrics.flightDurationSec}s)`;
  }

  const landingLocVal = document.getElementById('telemetry-landing-loc-val');
  if (landingLocVal) {
    landingLocVal.textContent = `@ ${arrivalPt.arrivalAngleDeg || 0}°`;
  }

  const nextWinVal = document.getElementById('telemetry-next-window-val');
  if (nextWinVal) {
    if (metrics.nextWindow.isOpen) {
      nextWinVal.textContent = t('game.window_open_now') || '🟢 Open Now!';
    } else {
      const tmpl = t('game.window_countdown') || '⏳ In ~{sec}s';
      nextWinVal.textContent = tmpl.replace('{sec}', Math.round(metrics.nextWindow.timeToWindow));
    }
  }

  const zVal = document.getElementById('telemetry-energy-req');
  if (zVal) zVal.textContent = `${metrics.minReq}% – ${metrics.maxCap}%`;
}

function calculateArrivalScenePoint(targetSlug, sceneEl, durationSec) {
  const targetEl = getBodyElement(targetSlug);
  if (!targetEl || !sceneEl) return { x: 0, y: 0, r: 0, deltaDeg: 0, arrivalAngleDeg: 0, currentPos: { x: 0, y: 0 } };
  const currentPos = getBodyCenterRelativeToScene(targetEl, sceneEl);
  if (targetSlug === 'moon') {
    return {
      x: currentPos.x,
      y: currentPos.y,
      r: Math.hypot(currentPos.x, currentPos.y),
      deltaDeg: 0,
      arrivalAngleDeg: 0,
      currentPos
    };
  }

  const r = Math.hypot(currentPos.x, currentPos.y);
  if (r === 0) return { x: 0, y: 0, r: 0, deltaDeg: 0, arrivalAngleDeg: 0, currentPos };

  const currentAngle = Math.atan2(currentPos.y, currentPos.x);
  const spec = ORBIT_SPECS[targetSlug] || ORBIT_SPECS.mars;
  const periodSec = spec.period * BASE_EARTH_SECONDS;
  const deltaAngle = (durationSec / periodSec) * (Math.PI * 2);
  const arrivalAngle = currentAngle + deltaAngle;

  const deltaDeg = Math.round(((deltaAngle * 180) / Math.PI) * 10) / 10;
  const arrivalAngleDeg = Math.round(((((arrivalAngle * 180) / Math.PI) + 360) % 360) * 10) / 10;

  return {
    x: r * Math.cos(arrivalAngle),
    y: r * Math.sin(arrivalAngle),
    r,
    deltaDeg,
    arrivalAngleDeg,
    currentPos
  };
}

function renderFutureInterceptMarker(metrics) {
  const sceneEl = document.getElementById('scene');
  if (!sceneEl || !gameState.targetPlanet) {
    removeFutureInterceptMarker();
    return;
  }

  const arrivalPt = calculateArrivalScenePoint(gameState.targetPlanet, sceneEl, metrics.flightDurationSec);
  const sRect = sceneEl.getBoundingClientRect();
  const left = sRect.width / 2 + arrivalPt.x;
  const top = sRect.height / 2 + arrivalPt.y;

  let reticle = document.getElementById('future-intercept-reticle');
  if (!reticle) {
    reticle = document.createElement('div');
    reticle.id = 'future-intercept-reticle';
    reticle.className = 'future-intercept-reticle';
    sceneEl.appendChild(reticle);
  }

  reticle.style.left = `${left.toFixed(1)}px`;
  reticle.style.top = `${top.toFixed(1)}px`;
  const reticleTemplate = t('game.future_rendezvous_reticle') || '🎯 Future Landing Rendezvous (+{sec}s)';
  const reticleLabel = reticleTemplate.replace('{sec}', metrics.flightDurationSec);
  reticle.innerHTML = `
    <span class="reticle-ring"></span>
    <span class="reticle-crosshair">🎯</span>
    <span class="reticle-label">${reticleLabel}</span>
  `;

  renderPlanetaryLeadArc(arrivalPt, sceneEl);
}

function renderPlanetaryLeadArc(arrivalPt, sceneEl) {
  removePlanetaryLeadArc();
  if (gameState.targetPlanet === 'moon' || arrivalPt.deltaDeg === 0 || arrivalPt.r === 0) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'future-lead-arc-svg';
  svg.setAttribute('class', 'future-lead-arc-svg');

  const sRect = sceneEl.getBoundingClientRect();
  const cx = sRect.width / 2;
  const cy = sRect.height / 2;
  const r = arrivalPt.r;

  const x1 = cx + arrivalPt.currentPos.x;
  const y1 = cy + arrivalPt.currentPos.y;
  const x2 = cx + arrivalPt.x;
  const y2 = cy + arrivalPt.y;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('class', 'future-lead-arc-path');
  path.setAttribute('d', `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`);

  svg.appendChild(path);
  sceneEl.appendChild(svg);
}





function updateEnergyFeedbackHint(optMetrics) {
  const hintEl = document.getElementById('energy-feedback-hint');
  if (!hintEl || !gameState || !gameState.targetPlanet) return;

  const metrics = optMetrics || calculateOrbitalWindow(gameState.currentPlanet, gameState.targetPlanet, getElapsedSec());
  const e = gameState.energy;

  if (e < metrics.minReq) {
    hintEl.className = 'energy-feedback-hint is-low';
    const tmpl = t('game.apogee_short_warning') || '⚠️ Apogee will fall short of target orbit (Need {minReq}%+)';
    hintEl.textContent = tmpl.replace('{minReq}', metrics.minReq);
  } else if (e > metrics.maxCap) {
    hintEl.className = 'energy-feedback-hint is-high';
    const tmpl = t('game.apogee_overshoot_warning') || '⚠️ Apogee exceeds capture limit (Max {maxCap}%)';
    hintEl.textContent = tmpl.replace('{maxCap}', metrics.maxCap);
  } else {
    hintEl.className = 'energy-feedback-hint is-optimal';
    hintEl.textContent = t('game.apogee_optimal_hint') || '✅ Optimal thrust: Apogee will match target orbit!';
  }
}

export function showGameNotification(message, type = 'info', duration = 3500) {
  let container = document.getElementById('game-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'game-notification-container';
    container.className = 'game-notification-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `game-notification-toast is-${type}`;
  toast.setAttribute('role', 'status');

  const icons = {
    warning: '⚠️',
    error: '🚨',
    success: '✨',
    info: '🚀'
  };
  const icon = icons[type] || '🚀';

  const iconSpan = document.createElement('span');
  iconSpan.className = 'game-toast-icon';
  iconSpan.setAttribute('aria-hidden', 'true');
  iconSpan.textContent = icon;

  const msgSpan = document.createElement('span');
  msgSpan.className = 'game-toast-msg';
  msgSpan.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'game-toast-close';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.textContent = '✕';

  toast.appendChild(iconSpan);
  toast.appendChild(msgSpan);
  toast.appendChild(closeBtn);
  function dismiss() {
    if (toast.classList.contains('is-leaving')) return;
    toast.classList.add('is-leaving');
    setTimeout(() => toast.remove(), 250);
  }

  if (closeBtn) closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismiss();
  });
  toast.addEventListener('click', dismiss);

  container.appendChild(toast);

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => toast.classList.add('is-active'));
  } else {
    toast.classList.add('is-active');
  }

  if (duration > 0) {
    setTimeout(dismiss, duration);
  }

  return toast;
}

function handleLaunchClick() {
  if (!gameState.targetPlanet) {
    showGameNotification(t('game.select_destination_alert') || 'Please select a destination planet first!', 'warning');
    return;
  }
  if (gameState.state === GAME_STATES.TRANSIT || gameState.state === GAME_STATES.LAUNCHING) return;

  if (isDestinationBlockedByMission()) return;

  if (gameState.fuel <= 0 || !gameState.hasSufficientFuel(gameState.energy)) {
    alertInsufficientFuel();
    return;
  }

  startLaunchCountdown();
}

function alertInsufficientFuel() {
  if (gameState.fuel <= 0) {
    showGameNotification('⚠️ Propellant Tank Empty: Waiting for solar recharge to generate fuel!', 'warning');
    return;
  }
  const rawFuelAlert =
    t('game.insufficient_fuel_alert') ||
    '⚠️ Insufficient Propellant: This launch requires {energy}% fuel, but only {fuel}% is available. Please wait for solar recharging!';
  showGameNotification(
    rawFuelAlert
      .replace('{energy}', Math.round(gameState.energy))
      .replace('{fuel}', Math.round(gameState.fuel)),
    'warning'
  );
}

function isDestinationBlockedByMission() {
  if (gameState.isFreePlay) return false;
  const currentMission = gameState.getCurrentMission();
  if (!currentMission || gameState.targetPlanet === currentMission.targetSlug) {
    return false;
  }
  const rawTemplate =
    t('game.mission_target_mismatch') ||
    'Mission Control Alert: Objective is "{clue}". You targeted {target}. Check the clue and select the correct planet before launch!';
  const alertMsg = rawTemplate
    .replace('{clue}', t(currentMission.clueKey))
    .replace('{target}', formatBodyName(gameState.targetPlanet));
  showGameNotification(alertMsg, 'warning', 4500);
  return true;
}

function startLaunchCountdown() {
  gameState.setState(GAME_STATES.LAUNCHING);
  const btn = document.getElementById('launch-btn');
  const btnText = document.getElementById('launch-btn-text');

  if (btn) btn.disabled = true;
  let count = 3;
  btnText.textContent = `IGNITION IN ${count}...`;

  const countdown = setInterval(() => {
    count--;
    if (count > 0) {
      btnText.textContent = `IGNITION IN ${count}...`;
    } else {
      clearInterval(countdown);
      btnText.textContent = 'BLASTOFF! 🚀';
      executeFlightTransit();
    }
  }, 400);
}

function executeFlightTransit() {
  gameState.setState(GAME_STATES.TRANSIT);
  playLaunchSound();

  const metrics = calculateOrbitalWindow(gameState.currentPlanet, gameState.targetPlanet, getElapsedSec());
  const outcomeData = evaluateLaunchOutcome(gameState.energy, metrics);

  if (checkAsteroidHazard(gameState.currentPlanet, gameState.targetPlanet)) {
    triggerAsteroidWarning();
  }

  const sceneEl = document.getElementById('scene') || document.body;
  const originEl = getBodyElement(gameState.currentPlanet);

  const p1 = getBodyCenterRelativeToScene(originEl, sceneEl);
  const durationSec = getFlightDuration(gameState.currentPlanet, gameState.targetPlanet);
  const p2 = calculateArrivalScenePoint(gameState.targetPlanet, sceneEl, durationSec);
  const isMoon = gameState.targetPlanet === 'moon' || gameState.currentPlanet === 'moon';

  // Smooth continuous fuel drain scaling with power and travel duration/distance
  const totalBurn = calculateFlightFuelBurn(gameState.energy, gameState.currentPlanet, gameState.targetPlanet);
  const startFuel = gameState.fuel;
  const targetFuel = Math.max(0, startFuel - totalBurn);

  clearDrainTimer();
  const drainIntervalMs = 100;
  const totalSteps = Math.max(1, Math.round((durationSec * 1000) / drainIntervalMs));
  const drainPerStep = (startFuel - targetFuel) / totalSteps;

  activeDrainTimer = setInterval(() => {
    if (gameState.state !== GAME_STATES.TRANSIT) {
      clearDrainTimer();
      return;
    }
    if (gameState.fuel > targetFuel) {
      gameState.fuel = Math.max(targetFuel, gameState.fuel - drainPerStep);
      updateFuelUI();
    } else {
      gameState.fuel = targetFuel;
      updateFuelUI();
      clearDrainTimer();
    }
  }, drainIntervalMs);

  removeFutureInterceptMarker();
  const points = generateScientificTransferArc(p1, p2, isMoon);

  injectFlightKeyframes(points);
  renderFlightPathSvg(points, sceneEl);

  let rocket = document.getElementById('rocket-actor');
  if (!rocket) rocket = createRocketActor();

  rocket.className = 'rocket-actor is-flying';
  rocket.style.setProperty('--flight-duration', `${durationSec}s`);
  sceneEl.appendChild(rocket);

  handleTransitOutcome(rocket, outcomeData, durationSec);
}









function triggerAsteroidWarning() {
  playWarningSound();
  const existing = document.getElementById('asteroid-warning-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'asteroid-warning-banner';
  banner.className = 'asteroid-warning-banner';
  banner.textContent = t('game.asteroid_warning') || '⚠️ WARNING: Traversing Main Asteroid Belt — Cosmic Shields Up!';
  document.body.appendChild(banner);

  setTimeout(() => banner.remove(), 2500);
}

function handleTransitOutcome(rocket, outcomeData, durationSec) {
  clearFlightTimeout();

  if (outcomeData.outcome === 'fuel_out') {
    activeFlightTimeout = setTimeout(() => {
      triggerExplosion(rocket, outcomeData.reason);
    }, durationSec * 500);
    return;
  }

  if (outcomeData.outcome === 'overshoot') {
    activeFlightTimeout = setTimeout(() => {
      triggerOvershoot(rocket, outcomeData.reason);
    }, durationSec * 1000);
    return;
  }

  activeFlightTimeout = setTimeout(() => {
    triggerTouchdown(rocket);
  }, durationSec * 1000);
}

function triggerExplosion(rocket, reasonKey) {
  clearDrainTimer();
  playExplosionSound();
  rocket.innerHTML = `<span class="explosion-sprite">💥</span>`;
  rocket.className = 'rocket-actor is-exploded';

  const lives = gameState.deductLife();
  updateHUD();

  setTimeout(() => {
    removeFlightPathSvg();
    dockRocketAtCurrentPlanet();
    if (lives <= 0) {
      showDebriefModal(reasonKey);
    } else {
      gameState.setState(GAME_STATES.STANDBY);
      resetLaunchButton();
      showGameNotification(`${t(reasonKey)} — ${t('game.try_again_life_lost')}`, 'error', 4500);
    }
  }, 900);
}

function triggerOvershoot(rocket, reasonKey) {
  clearDrainTimer();
  rocket.className = 'rocket-actor is-overshot';
  playWarningSound();

  const lives = gameState.deductLife();
  updateHUD();

  setTimeout(() => {
    removeFlightPathSvg();
    dockRocketAtCurrentPlanet();
    if (lives <= 0) {
      showDebriefModal(reasonKey);
    } else {
      gameState.setState(GAME_STATES.STANDBY);
      resetLaunchButton();
      showGameNotification(`${t(reasonKey)} — ${t('game.try_again_life_lost')}`, 'error', 4500);
    }
  }, 1000);
}

function triggerTouchdown(rocket) {
  clearDrainTimer();
  playTouchdownSound();

  if (checkSolarBoost(gameState.currentPlanet, gameState.targetPlanet)) {
    gameState.addScore(50);
    gameState.addFuel(50);
    showGameNotification('☀️ SOLAR BOOST ACTIVATED! +50% Propellant Tank Refuel & +50 Cosmic Stars!', 'success', 4000);
  }

  gameState.currentPlanet = gameState.targetPlanet;
  gameState.targetPlanet = null;
  gameState.setState(GAME_STATES.ARRIVED);

  dockRocketAtCurrentPlanet();
  resetLaunchButton();
  updateHUD();
  updateSidebar();

  if (gameState.isFreePlay) {
    handleFreePlayTouchdown(gameState.currentPlanet);
  } else {
    showTouchdownQuizModal(gameState.currentPlanet);
  }
}

function handleFreePlayTouchdown(planetSlug) {
  const existing = document.getElementById('freeplay-touchdown-banner');
  if (existing) existing.remove();

  const name = formatBodyName(planetSlug);
  const rawMsg = t('game.freeplay_touchdown_opening') || '🎉 TOUCHDOWN! Opening planetary briefing for {name}... 🚀';
  const msg = rawMsg.replace('{name}', name);

  const banner = document.createElement('div');
  banner.id = 'freeplay-touchdown-banner';
  banner.className = 'game-modal-overlay';
  banner.innerHTML = `
    <div class="game-modal-card freeplay-touchdown-card">
      <div class="modal-badge">🎉 TOUCHDOWN ON ${name.toUpperCase()}!</div>
      <p class="touchdown-note">${msg}</p>
      <div class="touchdown-spinner" aria-hidden="true">🚀 🌌 ✨</div>
    </div>
  `;
  document.body.appendChild(banner);

  setGameModeCookie('freeplay');
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('rocketrun_freeplay', 'true');
    sessionStorage.setItem('rocketrun_docked', planetSlug);
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('space_game_mode', 'true');
    localStorage.setItem('space_game_freeplay', 'true');
  }

  const targetFile = (planetSlug === 'moon' || planetSlug === 'luna') ? 'luna.html' : `${planetSlug}.html`;
  setTimeout(() => {
    window.location.href = `planets/${targetFile}?mode=freeplay&docked=${encodeURIComponent(planetSlug)}`;
  }, 1200);
}

function resetLaunchButton() {
  updateLaunchButtonState();
}

function showTouchdownQuizModal(planetSlug) {
  const existing = document.getElementById('game-quiz-modal');
  if (existing) existing.remove();

  const noteKey = getTouchdownNoteKey(planetSlug);
  const quiz = getPlanetQuiz(planetSlug, gameState.missionIndex);

  const modal = document.createElement('div');
  modal.id = 'game-quiz-modal';
  modal.className = 'game-modal-overlay';
  modal.innerHTML = `
    <div class="game-modal-card">
      <div class="modal-badge">🎉 TOUCHDOWN ON ${formatBodyName(planetSlug).toUpperCase()}!</div>
      <p class="touchdown-note">${t(noteKey)}</p>
      <hr class="modal-divider" />
      <div class="quiz-question">${t(quiz.questionKey)}</div>
      <div class="quiz-options">
        <button type="button" class="quiz-btn" data-correct="${quiz.options[0].correct}">
          ${t(quiz.options[0].key)}
        </button>
        <button type="button" class="quiz-btn" data-correct="${quiz.options[1].correct}">
          ${t(quiz.options[1].key)}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelectorAll('.quiz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.correct === 'true';
      if (isCorrect) {
        modal.remove();
        gameState.addScore(100);
        showGameNotification(`✨ Mission #${gameState.missionIndex + 1} Accomplished! ⭐ +100`, 'success', 3000);
        handleMissionAdvancement();
      } else {
        btn.classList.add('is-incorrect');
        btn.disabled = true;
      }
    });
  });
}

function handleMissionAdvancement() {
  gameState.advanceMission();
  if (!gameState.isFreePlay) {
    const nextMission = gameState.getCurrentMission();
    if (nextMission && nextMission.targetSlug) {
      gameState.setTarget(nextMission.targetSlug);
    }
  }
  dockRocketAtCurrentPlanet();
  updateCanvasTargetHighlight();
  updateHUD();
  updateSidebar();
  updateOrbitalWindowUI();
  saveLeaderboardScore({
    name: getPilotName(),
    avatar: getAstronautAvatar(),
    rankKey: gameState.getRank().titleKey,
    score: gameState.score,
    date: new Date().toISOString().slice(0, 10)
  });
}

function showGrandTourVictoryModal(onContinue) {
  const existing = document.getElementById('game-victory-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'game-victory-modal';
  modal.className = 'game-modal-overlay';
  modal.innerHTML = `
    <div class="game-modal-card victory-card">
      <div class="modal-badge victory-badge">${t('game.grand_tour_completed_title')}</div>
      <p class="touchdown-note">${t('game.grand_tour_completed_desc')}</p>
      <div class="debrief-stats">Bonus Stars: ⭐ +250 | Total Score: ⭐ ${gameState.score}</div>
      <button type="button" class="retry-mission-btn grand-tour-continue-btn" id="grand-tour-continue-btn">
        ${t('game.grand_tour_continue_btn') || 'Embark on Deep Space Expeditions 🚀'}
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  const btn = document.getElementById('grand-tour-continue-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      modal.remove();
      if (typeof onContinue === 'function') onContinue();
    });
  }
}

export function showDebriefModal(reasonKey) {
  const existing = document.getElementById('game-debrief-modal');
  if (existing) existing.remove();

  const energy = gameState ? gameState.energy : 50;
  let whyMattersKey = 'game.debrief_why_matters_general';
  if (reasonKey === 'game.fuel_exhausted_detail') {
    whyMattersKey = 'game.debrief_why_matters_fuel';
  } else if (reasonKey === 'game.overshoot_detail') {
    whyMattersKey = 'game.debrief_why_matters_overshoot';
  }

  const whyMattersTmpl = t(whyMattersKey) || '';
  const whyMattersText = whyMattersTmpl.replace('{thrust}', energy);

  const modal = document.createElement('div');
  modal.id = 'game-debrief-modal';
  modal.className = 'game-modal-overlay';
  modal.innerHTML = `
    <div class="game-modal-card debrief-card">
      <div class="modal-badge debrief-badge">⚠️ MISSION DEBRIEF: ORBITAL MECHANICS</div>
      <p class="debrief-reason">${t(reasonKey)}</p>

      <div class="debrief-orbital-guide" id="debrief-orbital-guide">
        <div class="orbital-concept-card concept-perigee">
          <div class="concept-header">
            <span class="concept-icon" aria-hidden="true">🟢</span>
            <span class="concept-title" data-i18n="game.debrief_perigee_title">${t('game.debrief_perigee_title') || 'Perigee (Closest Approach)'}</span>
          </div>
          <p class="concept-desc" data-i18n="game.debrief_perigee_desc">${t('game.debrief_perigee_desc') || 'The orbital point where origin and destination planets are closest together. Launching near Perigee requires minimum thrust (delta-v) and fuel for orbital capture.'}</p>
        </div>

        <div class="orbital-concept-card concept-apogee">
          <div class="concept-header">
            <span class="concept-icon" aria-hidden="true">🔴</span>
            <span class="concept-title" data-i18n="game.debrief_apogee_title">${t('game.debrief_apogee_title') || 'Apogee (Farthest Distance)'}</span>
          </div>
          <p class="concept-desc" data-i18n="game.debrief_apogee_desc">${t('game.debrief_apogee_desc') || 'The orbital point of maximum separation. In your trajectory, Apogee is the peak altitude your rocket reaches before falling back toward the Sun.'}</p>
        </div>

        <div class="orbital-concept-card concept-why-matters">
          <div class="concept-header">
            <span class="concept-icon" aria-hidden="true">💡</span>
            <span class="concept-title" data-i18n="game.debrief_why_matters_title">${t('game.debrief_why_matters_title') || 'Why It Caused Mission Failure'}</span>
          </div>
          <p class="concept-desc" id="debrief-why-matters-text">${whyMattersText}</p>
        </div>
      </div>

      <div class="debrief-stats">Final Cosmic Score: ⭐ ${gameState.score}</div>
      <button type="button" class="retry-mission-btn" id="retry-mission-btn">
        Refuel & Try Again 🚀
      </button>
    </div>
  `;
  document.body.appendChild(modal);

  saveLeaderboardScore({
    name: getPilotName(),
    avatar: getAstronautAvatar(),
    rankKey: gameState.getRank().titleKey,
    score: gameState.score,
    date: new Date().toISOString().slice(0, 10)
  });

  const retryBtn = document.getElementById('retry-mission-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      modal.remove();
      gameState.restoreLives();
      dockRocketAtCurrentPlanet();
      resetLaunchButton();
      updateHUD();
      updateSidebar();
    });
  }
}

export function showLeaderboardModal() {
  const existing = document.getElementById('game-leaderboard-modal');
  if (existing) existing.remove();

  const currentPilot = getPilotName();
  const entries = loadLeaderboard();

  function buildRowsHtml(list, pilotName) {
    if (!list || list.length === 0) {
      return '<div class="lb-empty">No flights logged yet! Launch a mission to join the ranks!</div>';
    }
    return list
      .map(
        (e, idx) => `
        <div class="lb-row ${e.name === pilotName ? 'is-current-pilot' : ''}">
          <span class="lb-rank">#${idx + 1}</span>
          <span class="lb-avatar">${e.avatar || '👨‍🚀'}</span>
          <span class="lb-name">${e.name}</span>
          <span class="lb-rank-title">${t(e.rankKey)}</span>
          <span class="lb-stars">⭐ ${e.score}</span>
        </div>
      `
      )
      .join('');
  }

  const modal = document.createElement('div');
  modal.id = 'game-leaderboard-modal';
  modal.className = 'game-modal-overlay';
  modal.innerHTML = `
    <div class="game-modal-card lb-card">
      <div class="modal-badge">🏆 TOP COSMIC NAVIGATORS</div>

      <div class="lb-pilot-box">
        <label for="lb-pilot-input" class="lb-pilot-label" data-i18n="ui.pilot_name_label">🧑‍🚀 Pilot Name & Callsign:</label>
        <div class="lb-pilot-input-group">
          <input type="text" id="lb-pilot-input" class="lb-pilot-input" maxlength="20" placeholder="e.g. Cmdr. Nova" value="${currentPilot}" />
          <button type="button" id="lb-save-name-btn" class="lb-save-name-btn" data-i18n="ui.save_pilot_name">Save Name</button>
        </div>
        <div class="lb-cookie-toggle-row">
          <label for="lb-cookie-pref-toggle" class="lb-cookie-label">
            <span>🍪 <span data-i18n="ui.allow_lb_cookie">Allow Leaderboard Stats in Cookie</span></span>
          </label>
          <label class="hud-switch" for="lb-cookie-pref-toggle">
            <input type="checkbox" id="lb-cookie-pref-toggle" ${isLeaderboardCookieAllowed() ? 'checked' : ''} aria-label="Toggle Leaderboard Cookie" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="lb-pilot-status" id="lb-pilot-status" aria-live="polite"></div>
      </div>

      <div class="lb-list" id="lb-list">${buildRowsHtml(entries, currentPilot)}</div>
      <button type="button" class="lb-close-btn" id="lb-close-btn">Close ✕</button>
    </div>
  `;
  document.body.appendChild(modal);

  const saveBtn = document.getElementById('lb-save-name-btn');
  const pilotInput = document.getElementById('lb-pilot-input');
  const statusEl = document.getElementById('lb-pilot-status');
  const listEl = document.getElementById('lb-list');

  if (saveBtn && pilotInput) {
    saveBtn.addEventListener('click', () => {
      const val = pilotInput.value.trim();
      if (!val) return;
      const saved = setPilotName(val);
      if (statusEl) {
        statusEl.textContent = `✓ Saved as ${saved}! Stats updated.`;
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
      }
      if (listEl) {
        listEl.innerHTML = buildRowsHtml(loadLeaderboard(), saved);
      }
    });

    pilotInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveBtn.click();
    });
  }

  const cookieToggle = document.getElementById('lb-cookie-pref-toggle');
  if (cookieToggle) {
    cookieToggle.addEventListener('change', e => {
      setLeaderboardCookieAllowed(cookieToggle.checked);
      if (statusEl) {
        statusEl.textContent = cookieToggle.checked
          ? '✓ Leaderboard stats saved in first-party cookie.'
          : '⚠️ Leaderboard cookies cleared and disabled.';
        setTimeout(() => { if (statusEl) statusEl.textContent = ''; }, 3000);
      }
    });
  }

  const closeBtn = document.getElementById('lb-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.remove());
}

function bindGlobalShortcuts() {
  window.addEventListener('keydown', e => {
    if (e.shiftKey && (e.key === 'D' || e.key === 'd')) {
      if (gameActive && gameState.state === GAME_STATES.TRANSIT) {
        clearFlightTimeout();
        triggerTouchdown(document.getElementById('rocket-actor'));
      }
    }
  });
}
