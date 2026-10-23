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
  generateScientificTransferArc
} from './game-physics.js';
import { getTouchdownNoteKey, getPlanetQuiz } from './game-quiz.js';
import { loadLeaderboard, saveLeaderboardScore } from './game-leaderboard.js';
import { playLaunchSound, playTouchdownSound, playExplosionSound, playWarningSound } from './game-audio.js';
import { t } from '../i18n.js';

let gameState = null;
let gameActive = false;
let startTime = Date.now();
let orbitalTimer = null;
let activeFlightTimeout = null;

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

  bindGlobalShortcuts();
}

export function startGame() {
  initGameEngine();
  gameActive = true;
  gameState.reset();
  startTime = Date.now();

  const solarSystem = document.getElementById('solar-system');
  const sceneEl = document.getElementById('scene');
  if (solarSystem) solarSystem.classList.add('game-active');
  if (sceneEl) sceneEl.classList.add('game-active');

  enforce2DMode(true);
  renderGameUI();
  dockRocketAtCurrentPlanet();
  updateHUD();
  updateSidebar();
  startOrbitalTelemetry();
}

export function stopGame() {
  gameActive = false;
  stopOrbitalTelemetry();
  clearFlightTimeout();
  enforce2DMode(false);

  const solarSystem = document.getElementById('solar-system');
  const sceneEl = document.getElementById('scene');
  if (solarSystem) solarSystem.classList.remove('game-active');
  if (sceneEl) sceneEl.classList.remove('game-active');

  teardownGameUI();
}

export function exitGameMode() {
  const gameToggle = document.getElementById('settings-game-toggle');
  if (gameToggle) {
    gameToggle.checked = false;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('space_game_mode', 'false');
  }
  stopGame();
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
        const fluxRate = gameState.getSolarRechargeRate ? gameState.getSolarRechargeRate() : 10;
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
  if (slug === 'moon') {
    return document.getElementById('moon-btn-moon') || document.querySelector('.moon[data-slug="moon"]');
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
        <span data-i18n="game.launch_control">Launch Control</span>
      </div>
      <div class="sidebar-header-actions">
        <div class="current-loc" id="current-location-indicator">Earth 🌍</div>
        <button type="button" class="sidebar-close-btn" id="sidebar-close-btn" title="${t('game.exit_game_aria') || 'Exit Game Mode'}" aria-label="${t('game.exit_game_aria') || 'Exit Game Mode'}">✕</button>
      </div>
    </div>
    <div class="sidebar-body">
      <label class="sidebar-label" data-i18n="game.select_destination">Select Destination:</label>
      <div class="planet-select-list" id="planet-select-list"></div>

      <div class="energy-control-block">
        <div class="energy-header">
          <span class="sidebar-label" data-i18n="game.thrust_energy">Thrust Energy:</span>
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

      <div class="sidebar-fuel-block" id="sidebar-fuel-block">
        <div class="fuel-header">
          <span class="sidebar-label" data-i18n="game.fuel_label">Fuel Tank:</span>
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

      <button type="button" id="launch-btn" class="big-launch-btn">
        <span class="btn-glow"></span>
        <span class="btn-text" id="launch-btn-text" data-i18n="game.big_launch_btn">BIG LAUNCH 🚀</span>
      </button>

      <div class="sidebar-mission-card">
        <span class="sidebar-mission-tag">🎯 <span data-i18n="game.mission_label">ACTIVE MISSION</span></span>
        <div class="sidebar-mission-clue" id="sidebar-mission-clue">Loading mission...</div>
      </div>

      <div class="sidebar-telemetry-block" id="sidebar-orbit-telemetry">
        <div class="telemetry-header">
          <span class="telemetry-title" data-i18n="game.orbital_telemetry">ORBITAL TELEMETRY</span>
          <span class="telemetry-window-tag" id="telemetry-window-tag">🟢 Perigee Window</span>
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
          <div class="telemetry-item">
            <span class="telemetry-label" data-i18n="game.target_orbit_zone">Target Orbit Zone:</span>
            <span class="telemetry-val" id="telemetry-energy-req">--</span>
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
    'game-debrief-modal',
    'asteroid-warning-banner',
    'game-leaderboard-modal',
    'flight-path-svg',
    'rocket-flight-keyframes'
  ];
  elements.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
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
  const listEl = document.getElementById('planet-select-list');
  if (listEl) {
    listEl.addEventListener('click', e => {
      const btn = e.target.closest('.dest-btn');
      if (!btn) return;
      selectDestination(btn.dataset.slug);
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
      },
      { passive: true }
    );
  }

  const launchBtn = document.getElementById('launch-btn');
  if (launchBtn) {
    launchBtn.addEventListener('click', handleLaunchClick);
  }

  const closeBtn = document.getElementById('sidebar-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', exitGameMode);
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

  const currentMission = gameState.getCurrentMission();
  const sidebarClueEl = document.getElementById('sidebar-mission-clue');
  if (sidebarClueEl && currentMission) {
    sidebarClueEl.textContent = t(currentMission.clueKey);
  }

  const listEl = document.getElementById('planet-select-list');
  if (!listEl) return;

  const destinations = ['moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'earth'];

  listEl.innerHTML = destinations
    .filter(slug => slug !== gameState.currentPlanet)
    .map(slug => {
      const isTarget = gameState.targetPlanet === slug;
      const highlightClass = isTarget ? 'is-selected' : '';
      const badge = isTarget ? '🚀' : '';
      return `
        <button type="button" class="dest-btn ${highlightClass}" data-slug="${slug}">
          <span class="dest-badge">${badge}</span>
          <span class="dest-name">${formatBodyName(slug)}</span>
        </button>
      `;
    })
    .join('');

  updateFuelUI();
  updateLaunchButtonState();
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
  const isCharging = gameState.fuel < gameState.energy;

  if (solarInd) {
    solarInd.style.display = isCharging ? 'flex' : 'none';
  }
  if (solarText && isCharging) {
    const rate = gameState.getSolarRechargeRate ? gameState.getSolarRechargeRate() : 10;
    solarText.textContent = `${t('game.solar_charging_status')} (+${rate}%/s)`;
  }
  if (fuelFill) {
    fuelFill.classList.toggle('is-charging', isCharging);
  }
}

function updateLaunchButtonState() {
  if (!gameState || gameState.state === GAME_STATES.TRANSIT || gameState.state === GAME_STATES.LAUNCHING) return;
  const btn = document.getElementById('launch-btn');
  const btnText = document.getElementById('launch-btn-text');
  if (!btn || !btnText) return;

  if (gameState.fuel < gameState.energy) {
    const deficit = gameState.energy - gameState.fuel;
    const fluxRate = gameState.getSolarRechargeRate ? gameState.getSolarRechargeRate() : 10;
    const waitSec = Math.ceil(deficit / fluxRate);
    btn.disabled = true;
    const template = t('game.solar_charging_wait') || '☀️ SOLAR CHARGING ({sec}s)... ⚡';
    btnText.textContent = template.replace('{sec}', waitSec);
  } else {
    btn.disabled = false;
    btnText.textContent = t('game.big_launch_btn') || 'BIG LAUNCH 🚀';
  }
}

function formatBodyName(slug) {
  const map = {
    moon: 'Luna 🌙',
    mercury: 'Mercury ☿',
    venus: 'Venus ♀',
    earth: 'Earth 🌍',
    mars: 'Mars ♂',
    jupiter: 'Jupiter ♃',
    saturn: 'Saturn ♄',
    uranus: 'Uranus ♅',
    neptune: 'Neptune ♆'
  };
  return map[slug] || slug;
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
  updateSidebar();
  updateOrbitalWindowUI();
}

function updateOrbitalWindowUI() {
  if (!gameState.targetPlanet) return;
  const metrics = calculateOrbitalWindow(gameState.currentPlanet, gameState.targetPlanet, getElapsedSec());

  const tagEl = document.getElementById('telemetry-window-tag');
  if (tagEl) {
    tagEl.className = `telemetry-window-tag status-${metrics.status}`;
    if (metrics.status === 'perigee') tagEl.textContent = t('game.perigee_window') || '🟢 Perigee Window';
    else if (metrics.status === 'apogee') tagEl.textContent = t('game.apogee_window') || '🔴 Apogee Window';
    else tagEl.textContent = t('game.moderate_window') || '🟡 Mid-Orbit';
  }

  const pVal = document.getElementById('telemetry-perigee-val');
  if (pVal) pVal.textContent = `${metrics.minAu.toFixed(2)} AU`;

  const aVal = document.getElementById('telemetry-apogee-val');
  if (aVal) aVal.textContent = `${metrics.maxAu.toFixed(2)} AU`;

  const dVal = document.getElementById('telemetry-dist-val');
  if (dVal) dVal.textContent = `${metrics.currentAu.toFixed(2)} AU`;

  const zVal = document.getElementById('telemetry-energy-req');
  if (zVal) zVal.textContent = `${metrics.minReq}% – ${metrics.maxCap}%`;

  updateEnergyFeedbackHint(metrics);
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

function handleLaunchClick() {
  if (!gameState.targetPlanet) {
    alert(t('game.select_destination_alert') || 'Please select a destination planet first!');
    return;
  }
  if (gameState.state === GAME_STATES.TRANSIT) return;

  const currentMission = gameState.getCurrentMission();
  if (currentMission && gameState.targetPlanet !== currentMission.targetSlug) {
    const rawTemplate =
      t('game.mission_target_mismatch') ||
      'Mission Control Alert: Objective is "{clue}". You targeted {target}. Check the clue and select the correct planet before launch!';
    const alertMsg = rawTemplate
      .replace('{clue}', t(currentMission.clueKey))
      .replace('{target}', formatBodyName(gameState.targetPlanet));
    alert(alertMsg);
    return;
  }

  if (!gameState.hasSufficientFuel(gameState.energy)) {
    const rawFuelAlert =
      t('game.insufficient_fuel_alert') ||
      '⚠️ Insufficient Propellant: This launch requires {energy}% fuel, but only {fuel}% is available. Please wait for solar recharging!';
    alert(
      rawFuelAlert
        .replace('{energy}', Math.round(gameState.energy))
        .replace('{fuel}', Math.round(gameState.fuel))
    );
    return;
  }

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
      gameState.consumeFuel(gameState.energy);
      updateFuelUI();
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
  const targetEl = getBodyElement(gameState.targetPlanet);

  const p1 = getBodyCenterRelativeToScene(originEl, sceneEl);
  const p2 = getBodyCenterRelativeToScene(targetEl, sceneEl);
  const isMoon = gameState.targetPlanet === 'moon' || gameState.currentPlanet === 'moon';
  const isOuter = ['jupiter', 'saturn', 'uranus', 'neptune'].includes(gameState.targetPlanet);

  const durationSec = isMoon ? 3.8 : (isOuter ? 6.5 : 5.2);
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

function createRocketActor() {
  const existing = document.getElementById('rocket-actor');
  if (existing) existing.remove();

  const rocket = document.createElement('div');
  rocket.id = 'rocket-actor';
  rocket.className = 'rocket-actor is-docked';
  rocket.innerHTML = `<span class="rocket-sprite">🚀</span><span class="thruster-flame">🔥</span>`;
  return rocket;
}

function injectFlightKeyframes(points) {
  let styleEl = document.getElementById('rocket-flight-keyframes');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'rocket-flight-keyframes';
    document.head.appendChild(styleEl);
  }

  const keyframeRules = points
    .map((p, i) => {
      const pct = ((i / (points.length - 1)) * 100).toFixed(1);
      return `${pct}% { transform: translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${p.angle.toFixed(1)}deg); }`;
    })
    .join('\n');

  styleEl.textContent = `
    @keyframes rocket-transfer-flight {
      ${keyframeRules}
    }
  `;
}

function renderFlightPathSvg(points, sceneEl) {
  removeFlightPathSvg();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'flight-path-svg';
  svg.setAttribute('class', 'flight-path-svg');

  const sRect = sceneEl.getBoundingClientRect();
  const cx = sRect.width / 2;
  const cy = sRect.height / 2;

  const d = points
    .map((p, i) => {
      const x = (cx + p.x).toFixed(1);
      const y = (cy + p.y).toFixed(1);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('class', 'flight-transfer-path');
  path.setAttribute('d', d);

  svg.appendChild(path);
  sceneEl.appendChild(svg);
}

function removeFlightPathSvg() {
  const existing = document.getElementById('flight-path-svg');
  if (existing) existing.remove();
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
      alert(`${t(reasonKey)}\n${t('game.try_again_life_lost')}`);
    }
  }, 900);
}

function triggerOvershoot(rocket, reasonKey) {
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
      alert(`${t(reasonKey)}\n${t('game.try_again_life_lost')}`);
    }
  }, 1000);
}

function triggerTouchdown(rocket) {
  playTouchdownSound();

  if (checkSolarBoost(gameState.currentPlanet, gameState.targetPlanet)) {
    gameState.addScore(50);
    gameState.addFuel(50);
    alert('☀️ SOLAR BOOST ACTIVATED! +50% Propellant Tank Refuel & +50 Cosmic Stars!');
  }

  gameState.currentPlanet = gameState.targetPlanet;
  gameState.targetPlanet = null;
  gameState.setState(GAME_STATES.ARRIVED);

  dockRocketAtCurrentPlanet();
  resetLaunchButton();
  updateHUD();
  updateSidebar();

  showTouchdownQuizModal(gameState.currentPlanet);
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
        gameState.advanceMission();
        updateHUD();
        updateSidebar();
        saveLeaderboardScore({
          name: 'Player',
          avatar: getAstronautAvatar(),
          rankKey: gameState.getRank().titleKey,
          score: gameState.score,
          date: new Date().toISOString().slice(0, 10)
        });
      } else {
        btn.classList.add('is-incorrect');
        btn.disabled = true;
      }
    });
  });
}

function showDebriefModal(reasonKey) {
  const existing = document.getElementById('game-debrief-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'game-debrief-modal';
  modal.className = 'game-modal-overlay';
  modal.innerHTML = `
    <div class="game-modal-card debrief-card">
      <div class="modal-badge debrief-badge">⚠️ MISSION DEBRIEF</div>
      <p class="debrief-reason">${t(reasonKey)}</p>
      <p class="debrief-lesson">${t('game.debrief_lesson')}</p>
      <div class="debrief-stats">Final Cosmic Score: ⭐ ${gameState.score}</div>
      <button type="button" class="retry-mission-btn" id="retry-mission-btn">
        Refuel & Try Again 🚀
      </button>
    </div>
  `;
  document.body.appendChild(modal);

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

function showLeaderboardModal() {
  const existing = document.getElementById('game-leaderboard-modal');
  if (existing) existing.remove();

  const entries = loadLeaderboard();
  const rows = entries
    .map(
      (e, idx) => `
      <div class="lb-row">
        <span class="lb-rank">#${idx + 1}</span>
        <span class="lb-avatar">${e.avatar || '👨‍🚀'}</span>
        <span class="lb-name">${e.name}</span>
        <span class="lb-rank-title">${t(e.rankKey)}</span>
        <span class="lb-stars">⭐ ${e.score}</span>
      </div>
    `
    )
    .join('');

  const modal = document.createElement('div');
  modal.id = 'game-leaderboard-modal';
  modal.className = 'game-modal-overlay';
  modal.innerHTML = `
    <div class="game-modal-card lb-card">
      <div class="modal-badge">🏆 TOP COSMIC NAVIGATORS</div>
      <div class="lb-list">${rows || '<div class="lb-empty">No flights logged yet! Launch a mission to join the ranks!</div>'}</div>
      <button type="button" class="lb-close-btn" id="lb-close-btn">Close ✕</button>
    </div>
  `;
  document.body.appendChild(modal);

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
