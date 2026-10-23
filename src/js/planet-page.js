import { initStarfield } from './components/starfield.js';
import { initHuds } from './components/hud.js';
import { initI18n, t } from './i18n.js';
import { initCookieNotice, getGameModeCookie } from './components/cookie-notice.js';
import { initAuthGate } from './components/auth-gate.js';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Initialize site-wide access gate ('gorocket')
  initAuthGate();

  // 1. Initialize i18n translation system
  initI18n();

  // 1b. Initialize GDPR-compliant cookie notice & data erasure
  initCookieNotice();

  // 2. Initialize starfield canvas background
  initStarfield('stars');

  // 3. Initialize Galactic & Settings HUD controllers
  initHuds();

  // 4. Keyboard navigation between planets
  const prevBtn = document.getElementById('subpage-btn-prev');
  const nextBtn = document.getElementById('subpage-btn-next');
  const backBtn = document.getElementById('back-btn');

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft' && prevBtn) {
      window.location.href = prevBtn.getAttribute('href');
    } else if (e.key === 'ArrowRight' && nextBtn) {
      window.location.href = nextBtn.getAttribute('href');
    } else if (e.key === 'Escape' && backBtn) {
      window.location.href = backBtn.getAttribute('href');
    }
  });

  // 5. Cosmic Explorer Lab — Gravity & Jump Height Calculator
  initCosmicCalculator();

  // 6. Kid-Friendly Science Stat Card Popups
  initStatCardPopups();

  // 7. Free Play Floating Navigation Banner
  initFreePlayReturnBanner();
});

function initCosmicCalculator() {
  const sidebar = document.querySelector('.space-calc-sidebar');
  if (!sidebar) return;

  const gravity = parseFloat(sidebar.dataset.gravity) || 1.0;
  const planetSlug = sidebar.dataset.slug || 'earth';

  const inputWeight = document.getElementById('input-weight');
  const inputHeight = document.getElementById('input-height');
  const weightSuffix = document.getElementById('weight-suffix');
  const heightSuffix = document.getElementById('height-suffix');

  const weightUnitToggle = document.getElementById('weight-unit-toggle');
  const heightUnitToggle = document.getElementById('height-unit-toggle');

  const outputWeight = document.getElementById('output-weight');
  const outputWeightUnit = document.getElementById('output-weight-unit');
  const outputWeightComp = document.getElementById('output-weight-comparison');

  const outputJump = document.getElementById('output-jump');
  const outputJumpUnit = document.getElementById('output-jump-unit');
  const outputJumpComp = document.getElementById('output-jump-comparison');

  // Restore units and user values from localStorage or defaults
  let weightUnit = localStorage.getItem('space_calc_weight_unit') || 'kg';
  let heightUnit = localStorage.getItem('space_calc_height_unit') || 'cm';

  const savedWeight = localStorage.getItem('space_calc_weight');
  const savedHeight = localStorage.getItem('space_calc_height');

  let weightVal = savedWeight ? parseFloat(savedWeight) : (weightUnit === 'lbs' ? 99 : 45);
  let heightVal = savedHeight ? parseFloat(savedHeight) : (heightUnit === 'in' ? 55 : 140);

  // Sync unit toggle button classes
  function updateToggleUI(toggleContainer, activeUnit) {
    if (!toggleContainer) return;
    const buttons = toggleContainer.querySelectorAll('.unit-btn');
    buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === activeUnit);
    });
  }

  updateToggleUI(weightUnitToggle, weightUnit);
  updateToggleUI(heightUnitToggle, heightUnit);
  if (weightSuffix) weightSuffix.textContent = weightUnit;
  if (heightSuffix) heightSuffix.textContent = heightUnit;
  if (inputWeight) inputWeight.value = Math.round(weightVal);
  if (inputHeight) inputHeight.value = Math.round(heightVal);

  // Astronaut Avatar selection (male 👨‍🚀 or female 👩‍🚀)
  const astronautIcon = document.getElementById('calc-astronaut-icon');
  const avatarToggle = document.getElementById('avatar-toggle');
  let currentAvatar = localStorage.getItem('space_calc_astronaut') || 'male';

  function setAvatar(avatar) {
    currentAvatar = avatar === 'female' ? 'female' : 'male';
    localStorage.setItem('space_calc_astronaut', currentAvatar);
    if (astronautIcon) {
      astronautIcon.textContent = currentAvatar === 'female' ? '👩‍🚀' : '👨‍🚀';
    }
    if (avatarToggle) {
      const btns = avatarToggle.querySelectorAll('.avatar-btn');
      btns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.avatar === currentAvatar);
      });
    }
  }

  setAvatar(currentAvatar);

  if (avatarToggle) {
    avatarToggle.addEventListener('click', e => {
      const btn = e.target.closest('.avatar-btn');
      if (!btn) return;
      setAvatar(btn.dataset.avatar);
    });
  }

  if (astronautIcon) {
    astronautIcon.addEventListener('click', e => {
      e.stopPropagation();
      setAvatar(currentAvatar === 'male' ? 'female' : 'male');
    });
    astronautIcon.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        setAvatar(currentAvatar === 'male' ? 'female' : 'male');
      }
    });
  }

  // Minimizable toggle handling (Cosmic Explorer Lab defaults to minimized)
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const header = document.getElementById('calc-header');
  const isMinimizedSaved = localStorage.getItem('space_calc_minimized') !== 'false';

  function setMinimized(minimized) {
    sidebar.classList.toggle('is-minimized', minimized);
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', String(!minimized));
      toggleBtn.setAttribute('aria-label', minimized ? t('ui.expand_lab') : t('ui.minimize_lab'));
      toggleBtn.title = minimized ? t('ui.expand_lab') : t('ui.minimize_lab');
      const icon = toggleBtn.querySelector('.toggle-icon');
      if (icon) icon.textContent = minimized ? '+' : '−';
    }
    if (header) {
      header.setAttribute('aria-expanded', String(!minimized));
    }
    localStorage.setItem('space_calc_minimized', minimized ? 'true' : 'false');
  }

  setMinimized(isMinimizedSaved);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', e => {
      e.stopPropagation();
      const current = sidebar.classList.contains('is-minimized');
      setMinimized(!current);
    });
  }

  if (header) {
    header.addEventListener('click', () => {
      const current = sidebar.classList.contains('is-minimized');
      setMinimized(!current);
    });
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const current = sidebar.classList.contains('is-minimized');
        setMinimized(!current);
      }
    });
  }

  function calculate() {
    const rawWeight = parseFloat(inputWeight?.value);
    const rawHeight = parseFloat(inputHeight?.value);

    // Update dynamic lab subtitle
    const labSubtitle = sidebar.querySelector('.calc-header-text p');
    if (labSubtitle) {
      labSubtitle.textContent = t('ui.lab_physics', { gravity: gravity.toFixed(2) });
    }

    const minWeightVal = document.getElementById('min-weight-val');
    if (isNaN(rawWeight) || rawWeight <= 0) {
      if (outputWeight) outputWeight.textContent = '—';
      if (outputWeightComp) outputWeightComp.textContent = t('ui.prompt_enter_weight');
      if (minWeightVal) minWeightVal.textContent = '—';
    } else {
      localStorage.setItem('space_calc_weight', rawWeight);

      const earthKg = weightUnit === 'lbs' ? rawWeight / 2.20462 : rawWeight;
      const bodyKg = earthKg * gravity;
      const displayWeight = weightUnit === 'lbs' ? bodyKg * 2.20462 : bodyKg;

      const formattedWeight = displayWeight >= 100 ? displayWeight.toFixed(0) : displayWeight.toFixed(1);
      if (outputWeight) {
        outputWeight.textContent = formattedWeight;
      }
      if (outputWeightUnit) {
        outputWeightUnit.textContent = weightUnit;
      }
      if (minWeightVal) {
        minWeightVal.textContent = `${formattedWeight} ${weightUnit}`;
      }
      if (outputWeightComp) {
        if (Math.abs(gravity - 1.0) < 0.02) {
          outputWeightComp.textContent = t('ui.feel_same');
        } else if (gravity > 1.0) {
          const pct = Math.round((gravity - 1) * 100);
          const feelKey = gravity >= 20 ? 'ui.feel_car' : gravity > 2.0 ? 'ui.feel_boulders' : 'ui.feel_gear';
          outputWeightComp.textContent = t('ui.feel_heavier', { pct, feel: t(feelKey) });
        } else {
          const pct = Math.round((1 - gravity) * 100);
          const feelKey = gravity < 0.4 ? 'ui.feel_feather' : 'ui.feel_boots';
          outputWeightComp.textContent = t('ui.feel_lighter', { pct, feel: t(feelKey) });
        }
      }
    }

    const minJumpVal = document.getElementById('min-jump-val');
    if (isNaN(rawHeight) || rawHeight <= 0) {
      if (outputJump) outputJump.textContent = '—';
      if (outputJumpComp) outputJumpComp.textContent = t('ui.prompt_enter_height');
      if (minJumpVal) minJumpVal.textContent = '—';
    } else {
      localStorage.setItem('space_calc_height', rawHeight);

      const heightCm = heightUnit === 'in' ? rawHeight * 2.54 : rawHeight;
      const earthJumpCm = Math.max(15, Math.min(75, heightCm * 0.25));

      let bodyJumpCm;
      if (gravity >= 20) {
        bodyJumpCm = 0; // Sun: too massive to jump
      } else {
        bodyJumpCm = earthJumpCm / gravity;
      }

      const displayJump = heightUnit === 'in' ? bodyJumpCm / 2.54 : bodyJumpCm;
      const formattedJump = displayJump <= 0 ? '0' : displayJump >= 100 ? displayJump.toFixed(0) : displayJump.toFixed(1);

      if (outputJump) {
        outputJump.textContent = formattedJump;
      }
      if (outputJumpUnit) {
        outputJumpUnit.textContent = heightUnit;
      }
      if (minJumpVal) {
        minJumpVal.textContent = `${formattedJump} ${heightUnit}`;
      }
      if (outputJumpComp) {
        if (gravity >= 20) {
          outputJumpComp.textContent = t('ui.jump_sun');
        } else if (gravity > 1.0) {
          const ratio = (1 / gravity).toFixed(1);
          outputJumpComp.textContent = t('ui.jump_lower', { ratio });
        } else {
          const ratio = (1 / gravity).toFixed(1);
          outputJumpComp.textContent = t('ui.jump_higher', { ratio });
        }
      }
    }
  }

  // Event Listeners for inputs
  if (inputWeight) inputWeight.addEventListener('input', calculate);
  if (inputHeight) inputHeight.addEventListener('input', calculate);

  // Weight unit toggle
  if (weightUnitToggle) {
    weightUnitToggle.addEventListener('click', e => {
      const btn = e.target.closest('.unit-btn');
      if (!btn || btn.dataset.unit === weightUnit) return;

      const newUnit = btn.dataset.unit;
      const currentVal = parseFloat(inputWeight.value);
      if (!isNaN(currentVal)) {
        const converted = newUnit === 'lbs' ? Math.round(currentVal * 2.20462) : Math.round(currentVal / 2.20462);
        inputWeight.value = converted;
      }

      weightUnit = newUnit;
      localStorage.setItem('space_calc_weight_unit', weightUnit);
      if (weightSuffix) weightSuffix.textContent = weightUnit;
      updateToggleUI(weightUnitToggle, weightUnit);
      calculate();
    });
  }

  // Height unit toggle
  if (heightUnitToggle) {
    heightUnitToggle.addEventListener('click', e => {
      const btn = e.target.closest('.unit-btn');
      if (!btn || btn.dataset.unit === heightUnit) return;

      const newUnit = btn.dataset.unit;
      const currentVal = parseFloat(inputHeight.value);
      if (!isNaN(currentVal)) {
        const converted = newUnit === 'in' ? Math.round(currentVal / 2.54) : Math.round(currentVal * 2.54);
        inputHeight.value = converted;
      }

      heightUnit = newUnit;
      localStorage.setItem('space_calc_height_unit', heightUnit);
      if (heightSuffix) heightSuffix.textContent = heightUnit;
      updateToggleUI(heightUnitToggle, heightUnit);
      calculate();
    });
  }

  // Preset buttons
  const presetButtons = sidebar.querySelectorAll('.preset-btn');
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      if (target === 'weight' && inputWeight) {
        inputWeight.value = weightUnit === 'lbs' ? btn.dataset.valLbs : btn.dataset.valKg;
        calculate();
      } else if (target === 'height' && inputHeight) {
        inputHeight.value = heightUnit === 'in' ? btn.dataset.valIn : btn.dataset.valCm;
        calculate();
      }
    });
  });

  function updateSubpageDynamicTexts() {
    const planetName = t(`planets.${planetSlug}.name`);

    // Document title
    document.title = t('ui.subpage_title', { name: planetName });

    // Result card titles
    const weightLabel = sidebar.querySelector('.result-card.primary .result-label');
    if (weightLabel) {
      weightLabel.textContent = t('ui.weight_on', { name: planetName });
    }
    const jumpLabel = sidebar.querySelector('.result-card.secondary .result-label');
    if (jumpLabel) {
      jumpLabel.textContent = t('ui.jump_on', { name: planetName });
    }

    // Prev / Next button labels
    const prevBtn = document.getElementById('subpage-btn-prev');
    if (prevBtn && prevBtn.dataset.prevSlug) {
      const pName = t(`planets.${prevBtn.dataset.prevSlug}.name`);
      prevBtn.textContent = `← ${pName}`;
      prevBtn.setAttribute('aria-label', t('ui.prev_aria', { name: pName }));
    }
    const nextBtn = document.getElementById('subpage-btn-next');
    if (nextBtn && nextBtn.dataset.nextSlug) {
      const nName = t(`planets.${nextBtn.dataset.nextSlug}.name`);
      nextBtn.textContent = `${nName} →`;
      nextBtn.setAttribute('aria-label', t('ui.next_aria', { name: nName }));
    }
  }

  // Re-calculate and update on language change
  window.addEventListener('space:langchange', () => {
    updateSubpageDynamicTexts();
    calculate();
    initFreePlayReturnBanner();
  });

  // Initial calculation and dynamic texts on load
  updateSubpageDynamicTexts();
  calculate();
}

/**
 * Kid-Friendly Science Stat Card Popups Controller
 * Opens a modal with 5-8 year old explanation when any .info-card is clicked,
 * and dismisses when clicking anywhere outside, clicking close, or pressing Escape.
 */
function initStatCardPopups() {
  const backdrop = document.getElementById('stat-modal-backdrop');
  const modal = document.getElementById('stat-modal');
  const closeBtn = document.getElementById('stat-modal-close');
  const okBtn = document.getElementById('stat-modal-btn-ok');
  const labelEl = document.getElementById('stat-modal-label');
  const valEl = document.getElementById('stat-modal-val');
  const textEl = document.getElementById('stat-modal-text');
  const iconEl = document.getElementById('stat-modal-icon');

  if (!backdrop || !modal) return;

  const statIcons = {
    'spectral class': '⭐',
    'surface temperature': '🌡️',
    'cloud-top temperature': '❄️',
    'lowest temperature': '🥶',
    'equatorial diameter': '📏',
    'equatorial radius': '🌐',
    'mass': '⚖️',
    'galactic velocity': '🚀',
    'distance from sun': '☀️',
    'distance to earth': '🌍',
    'orbital period': '⏱️',
    'day length': '🔄',
    'rotation period': '💫',
    'moons & rings': '🌕',
    'composition': '🧪',
    'atmosphere': '💨'
  };

  let lastActiveEl = null;

  function openPopup(card) {
    lastActiveEl = card;
    const bodySlug = card.dataset.body;
    const statIdx = card.dataset.statIdx;

    const label = t(`planets.${bodySlug}.stats.${statIdx}.label`) || card.querySelector('.info-label')?.textContent || '';
    const value = t(`planets.${bodySlug}.stats.${statIdx}.value`) || card.querySelector('.info-val')?.textContent || '';
    const kidsText = t(`planets.${bodySlug}.stats.${statIdx}.kids`) || '';

    if (labelEl) labelEl.textContent = label;
    if (valEl) valEl.textContent = value;
    if (textEl) textEl.textContent = kidsText.replace(/\\n/g, '\n');

    const cleanLabel = (card.querySelector('.info-label')?.textContent || label).toLowerCase().trim();
    let icon = '💡';
    for (const [key, ic] of Object.entries(statIcons)) {
      if (cleanLabel.includes(key)) {
        icon = ic;
        break;
      }
    }
    if (iconEl) iconEl.textContent = icon;

    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden', 'false');
    card.setAttribute('aria-expanded', 'true');
    document.body.classList.add('modal-open');

    // Focus ok button for accessibility
    setTimeout(() => {
      if (okBtn) okBtn.focus();
    }, 50);
  }

  function closePopup() {
    if (!backdrop.classList.contains('is-open')) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (lastActiveEl) {
      lastActiveEl.setAttribute('aria-expanded', 'false');
      lastActiveEl.focus();
    }
  }

  // Click outside to dismiss (clicking the backdrop outside the modal dialog)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      closePopup();
    }
  });

  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (okBtn) okBtn.addEventListener('click', closePopup);

  // Keyboard navigation & accessibility (Escape to dismiss)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
      e.stopPropagation();
      closePopup();
    }
  });

  // Attach event listeners to all info cards
  const cards = document.querySelectorAll('.info-card');
  cards.forEach(card => {
    if (card.classList.contains('info-card-earth-moon')) {
      card.addEventListener('click', () => {
        window.location.href = 'luna.html';
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = 'luna.html';
        }
      });
      return;
    }

    card.addEventListener('click', () => openPopup(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPopup(card);
      }
    });
  });
}

/**
 * Free Play Mode: Floating return navigation button
 * Allows the astronaut to read planet specifications and jump directly back to game mode docked at this planet.
 * Only displayed when gamemode cookie is explicitly 'on' or 'freeplay'.
 */
function initFreePlayReturnBanner() {
  const cookieMode = getGameModeCookie();
  // If gamemode cookie is 'off' or missing, ensure no game mode banner is shown on subpages
  if (cookieMode !== 'on' && cookieMode !== 'freeplay') {
    const existing = document.getElementById('freeplay-floating-banner');
    if (existing) existing.remove();
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isFreePlayParam = urlParams.get('mode') === 'freeplay';
  const isSessionFreePlay = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('rocketrun_freeplay') === 'true';
  const isFreePlay = cookieMode === 'freeplay' || isFreePlayParam || isSessionFreePlay;
  if (!isFreePlay) return;

  const currentSlug = urlParams.get('docked') ||
    document.querySelector('.space-calc-sidebar')?.dataset?.slug ||
    window.location.pathname.split('/').pop().replace('.html', '') ||
    'earth';

  const lookupSlug = (currentSlug === 'moon') ? 'luna' : currentSlug;
  const planetName = t(`planets.${lookupSlug}.name`) || t(`planets.${currentSlug}.name`) || currentSlug.toUpperCase();
  const rawTemplate = t('game.freeplay_return_btn') || '🚀 Back to Game (Docked at {name}) →';
  const returnBtnText = rawTemplate.replace('{name}', planetName);

  let banner = document.getElementById('freeplay-floating-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'freeplay-floating-banner';
    banner.className = 'freeplay-floating-banner';
    document.body.appendChild(banner);
  }

  banner.innerHTML = `
    <a href="../index.html?mode=freeplay&docked=${encodeURIComponent(currentSlug)}" class="freeplay-return-btn" id="freeplay-return-btn">
      <span class="return-btn-icon">🚀</span>
      <span class="return-btn-text">${returnBtnText}</span>
    </a>
  `;
}


