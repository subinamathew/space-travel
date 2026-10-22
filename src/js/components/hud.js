/**
 * HUD Controller (Galactic Location HUD & Settings HUD)
 * Supports minimizing/expanding with persistent localStorage states.
 */

export function initGalaxyHud() {
  setupCollapsibleHud('galaxy-hud', 'hud-toggle-btn', 'hud-toggle-icon', 'space_hud_minimized', 'Galactic HUD');
}

export function initSettingsHud() {
  setupCollapsibleHud('settings-hud', 'settings-toggle-btn', 'settings-toggle-icon', 'space_settings_minimized', 'Settings HUD');
}

export function initHuds() {
  initGalaxyHud();
  initSettingsHud();
}

function setupCollapsibleHud(hudId, btnId, iconClass, storageKey, labelName) {
  const hud = document.getElementById(hudId);
  if (!hud) return;

  const toggleBtn = document.getElementById(btnId);
  const header = hud.querySelector('.hud-header');

  const isMinimizedSaved = localStorage.getItem(storageKey) === 'true';

  function setMinimized(minimized) {
    hud.classList.toggle('is-minimized', minimized);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(!minimized));
      toggleBtn.setAttribute('aria-label', minimized ? `Expand ${labelName}` : `Minimize ${labelName}`);
      toggleBtn.title = minimized ? `Expand ${labelName}` : `Minimize ${labelName}`;
      const icon = toggleBtn.querySelector(`.${iconClass}`) || toggleBtn.querySelector('.hud-toggle-icon');
      if (icon) icon.textContent = minimized ? '+' : '−';
    }
    localStorage.setItem(storageKey, minimized ? 'true' : 'false');
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
    header.addEventListener('click', () => {
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
}
