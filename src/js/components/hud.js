import { t } from '../i18n.js';

export function initGalaxyHud() {
  setupCollapsibleHud('galaxy-hud', 'hud-toggle-btn', 'hud-toggle-icon', 'space_hud_minimized', 'Galactic HUD');
}

export function initSettingsHud() {
  setupCollapsibleHud('settings-hud', 'settings-toggle-btn', 'settings-toggle-icon', 'space_settings_minimized', 'Settings HUD');
}

/**
 * Live Clock in Galactic HUD & Dynamic Night-time Sun Dimmer for Mobile & Tablets
 * Dims the Sun 5% to 20% by CSS between 18:00 and 07:00
 */
export function initLiveClockAndSunDimmer() {
  function update() {
    const now = new Date();

    // 1. Update live clock display
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const pad = n => (n < 10 ? '0' + n : String(n));
    const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    const timeEl = document.getElementById('hud-live-time');
    if (timeEl) timeEl.textContent = timeStr;

    const headerTimeEl = document.getElementById('hud-header-time');
    if (headerTimeEl) headerTimeEl.textContent = timeStr;

    // 2. Mobile & Tablet Sun Dimmer (18:00 to 07:00)
    updateSunDimmer(now);
  }

  update();
  setInterval(update, 1000);
}

/**
 * Calculates graduated sun dimming (5% to 20% dimmer) during night hours (18:00 to 07:00)
 */
export function updateSunDimmer(date = new Date()) {
  const currentDecimalHours = date.getHours() + date.getMinutes() / 60;

  // Active between 18:00 (18.0) and 07:00 (7.0)
  const isNightWindow = currentDecimalHours >= 18 || currentDecimalHours < 7;

  if (!isNightWindow) {
    document.body.classList.remove('sun-night-dimmed');
    document.documentElement.style.removeProperty('--sun-brightness');
    document.documentElement.style.removeProperty('--sun-dim-pct');
    return;
  }

  document.body.classList.add('sun-night-dimmed');

  // Smooth curve: 5% at 18:00 / 07:00, reaching up to 20% around midnight
  let hoursFromMidnight;
  if (currentDecimalHours >= 18) {
    hoursFromMidnight = 24 - currentDecimalHours; // 18:00 -> 6, 24:00 -> 0
  } else {
    hoursFromMidnight = currentDecimalHours; // 00:00 -> 0, 07:00 -> 7
  }

  // Ratio from 0 (at edges 18:00 & 07:00) to 1 (at midnight 00:00)
  const nightDepthRatio = Math.max(0, Math.min(1, 1 - hoursFromMidnight / 6.5));
  const dimPercent = 5 + 15 * nightDepthRatio; // 5% to 20% dimmer
  const brightness = (100 - dimPercent) / 100; // 0.95 to 0.80

  document.documentElement.style.setProperty('--sun-brightness', brightness.toFixed(3));
  document.documentElement.style.setProperty('--sun-dim-pct', `${dimPercent.toFixed(1)}%`);
}

/**
 * Mobile / Tablet Orbit Pause Toggle Button
 * Freezes orbital animation in place via CSS animation-play-state: paused
 */
export function initOrbitPauseToggle() {
  const pauseBtn = document.getElementById('orbit-pause-btn');
  const sceneEl = document.getElementById('scene');
  const iconEl = document.getElementById('hud-pause-icon');
  if (!pauseBtn || !sceneEl) return;

  let isPaused = false;

  function setPaused(paused) {
    isPaused = paused;
    sceneEl.classList.toggle('is-paused', paused);
    pauseBtn.classList.toggle('is-paused', paused);
    if (iconEl) {
      iconEl.textContent = paused ? '▶️' : '⏸️';
    }
    const labelKey = paused ? 'ui.resume_orbits_aria' : 'ui.pause_orbits_aria';
    const label = t(labelKey) || (paused ? 'Resume orbital motion' : 'Pause orbital motion');
    pauseBtn.setAttribute('aria-label', label);
    pauseBtn.title = label;
  }

  pauseBtn.addEventListener('click', e => {
    e.stopPropagation();
    setPaused(!isPaused);
  });

  // Keyboard shortcut: Space or 'p' key toggles pause when viewing solar system
  document.addEventListener('keydown', e => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }
    if (e.key === 'p' || e.key === 'P' || e.key === ' ') {
      // Only toggle if planet view modal is not active
      const pv = document.getElementById('planet-view');
      if (pv && pv.classList.contains('active')) return;
      e.preventDefault();
      setPaused(!isPaused);
    }
  });
}

export function initHuds() {
  initGalaxyHud();
  initSettingsHud();
  initLiveClockAndSunDimmer();
  initOrbitPauseToggle();
}

function setupCollapsibleHud(hudId, btnId, iconClass, storageKey, labelName) {
  const hud = document.getElementById(hudId);
  if (!hud) return;

  const toggleBtn = document.getElementById(btnId);
  const header = hud.querySelector('.hud-header');

  const isMobileOrTablet = window.innerWidth <= 1023;
  const savedVal = localStorage.getItem(storageKey);
  let isMinimizedSaved;
  if (hudId === 'settings-hud' && isMobileOrTablet) {
    const mobileSaved = localStorage.getItem('space_settings_mobile_open');
    isMinimizedSaved = mobileSaved === 'true' ? false : true;
  } else {
    isMinimizedSaved = savedVal === 'true';
  }

  function setMinimized(minimized) {
    hud.classList.toggle('is-minimized', minimized);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(!minimized));
      toggleBtn.setAttribute('aria-label', minimized ? `Expand ${labelName}` : `Minimize ${labelName}`);
      toggleBtn.title = minimized ? `Expand ${labelName}` : `Minimize ${labelName}`;
      const icon = toggleBtn.querySelector(`.${iconClass}`) || toggleBtn.querySelector('.hud-toggle-icon');
      if (icon) icon.textContent = minimized ? '+' : '−';
    }
    if (window.innerWidth <= 1023 && hudId === 'settings-hud') {
      localStorage.setItem('space_settings_mobile_open', String(!minimized));
    } else {
      localStorage.setItem(storageKey, minimized ? 'true' : 'false');
    }
  }

  setMinimized(isMinimizedSaved);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      const current = hud.classList.contains('is-minimized');
      setMinimized(!current);
    });
  }

  if (header) {
    header.addEventListener('click', e => {
      if (e.target && (e.target.closest(`#${btnId}`) || e.target.id === btnId)) {
        return;
      }
      const current = hud.classList.contains('is-minimized');
      setMinimized(!current);
    });
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const current = hud.classList.contains('is-minimized');
        setMinimized(!current);
      }
    });
  }

  // On mobile/tablet, close settings HUD when tapping outside
  if (hudId === 'settings-hud') {
    document.addEventListener('click', e => {
      if (window.innerWidth <= 1023 && !hud.classList.contains('is-minimized')) {
        if (!hud.contains(e.target)) {
          setMinimized(true);
        }
      }
    });
  }
}
