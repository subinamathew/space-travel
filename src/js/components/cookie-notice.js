import { t } from '../i18n.js';
import { lockSite } from './auth-gate.js';

/**
 * GDPR-Compliant Local Storage & Cookie Notice
 * Provides transparency on zero-tracking strictly necessary local storage,
 * and allows users to clear all cookies and cached data at any time.
 */
export function initCookieNotice() {
  ensureCookieMarkup();

  const notice = document.getElementById('cookie-notice');
  const cookieBtn = document.getElementById('cookie-btn');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const clearBtn = document.getElementById('cookie-clear-btn');
  const closeBtn = document.getElementById('cookie-close-btn');
  const toast = document.getElementById('cookie-toast');

  if (!notice) return;

  const consentGiven = localStorage.getItem('space_cookie_consent');

  // If user has not yet acknowledged or dismissed, show banner with a gentle delay
  if (!consentGiven) {
    setTimeout(() => {
      notice.classList.add('is-visible');
    }, 1500);
  }

  // Hook toggle button (the 🍪 icon in HUD or settings)
  if (cookieBtn) {
    cookieBtn.addEventListener('click', e => {
      e.stopPropagation();
      const isVisible = notice.classList.contains('is-visible');
      if (isVisible) {
        hideNotice();
      } else {
        showNotice();
      }
    });
  }

  // Hook leaderboard cookie toggle
  const lbToggle = document.getElementById('cookie-lb-toggle');
  if (lbToggle) {
    lbToggle.checked = isLeaderboardCookieAllowed();
    lbToggle.addEventListener('change', () => {
      setLeaderboardCookieAllowed(lbToggle.checked);
      if (toast) {
        const msg = lbToggle.checked
          ? (t('ui.cookie_lb_enabled') || 'Leaderboard & Pilot stats cookie storage enabled!')
          : (t('ui.cookie_lb_disabled') || 'Leaderboard cookies cleared and disabled.');
        toast.textContent = msg;
        toast.classList.add('is-active');
        setTimeout(() => toast.classList.remove('is-active'), 2500);
      }
    });
  }

  // Accept / Got it
  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      try {
        localStorage.setItem('space_cookie_consent', 'accepted');
      } catch (e) {
        // storage disabled
      }
      hideNotice();
    });
  }

  // Close / Hide (can hide at any time)
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      hideNotice();
    });
  }

  // Clear Cookies & Stored Data
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearAllCookiesAndStorage();
      if (toast) {
        const msg = t('ui.cookie_cleared_msg') || 'All local storage, cookies, high scores, and pilot details have been cleared!';
        toast.textContent = msg;
        toast.classList.add('is-active');
        setTimeout(() => {
          toast.classList.remove('is-active');
        }, 3200);
      }
    });
  }

  function showNotice() {
    notice.classList.add('is-visible');
    notice.setAttribute('aria-hidden', 'false');
    const firstBtn = notice.querySelector('button');
    if (firstBtn) firstBtn.focus();
  }

  function hideNotice() {
    notice.classList.remove('is-visible');
    notice.setAttribute('aria-hidden', 'true');
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && notice.classList.contains('is-visible')) {
      hideNotice();
    }
  });
}
/**
 * Generic First-Party Cookie Helpers (GDPR-compliant, SameSite=Lax)
 */
export function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export function setCookie(name, value, days = 30) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

/**
 * Manage gamemode cookie ('on', 'freeplay', or 'off')
 */
export function setGameModeCookie(mode) {
  const val = (mode === 'freeplay' || mode === 'on' || mode === true) ? (mode === 'freeplay' ? 'freeplay' : 'on') : 'off';
  setCookie('gamemode', val, 7);
  setCookie('gsmemode', val, 7);
}

export function getGameModeCookie() {
  return getCookie('gamemode') || getCookie('gsmemode') || 'off';
}

/**
 * Wipes document cookies and cleans application localStorage keys
 */
export function clearAllCookiesAndStorage() {
  try {
    // 1. Remove all cookies across all paths
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
    }
    // Explicitly delete site_auth session cookie
    document.cookie = 'site_auth=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax';

    // 2. Clear known localStorage keys
    const keysToRemove = [
      'site_auth',
      'space_cookie_consent',
      'space_lang',
      'space_show_moons',
      'space_real_orbits',
      'space_hud_minimized',
      'space_settings_minimized',
      'space_settings_mobile_open',
      'space_calc_weight',
      'space_calc_height',
      'space_calc_weight_unit',
      'space_calc_height_unit',
      'space_calc_minimized',
      'space_calc_astronaut',
      'space_game_leaderboard',
      'space_pilot_name',
      'space_lb_cookie_consent',
      'space_game_mode',
      'space_game_freeplay'
    ];
    keysToRemove.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (err) {}
    });

    // 3. Immediately re-lock site and restore authentication gate
    try {
      lockSite();
    } catch (_) {}
  } catch (e) {
    console.warn('Could not clear storage:', e);
  }
}

/**
 * Check if leaderboard cookie storage is allowed
 */
export function isLeaderboardCookieAllowed() {
  const cookieVal = getCookie('cookie_lb_consent');
  if (cookieVal !== null) return cookieVal !== 'false' && cookieVal !== 'off';
  try {
    const localVal = localStorage.getItem('space_lb_cookie_consent');
    if (localVal !== null) return localVal !== 'false' && localVal !== 'off';
  } catch {}
  return true;
}

/**
 * Set leaderboard cookie storage permission
 */
export function setLeaderboardCookieAllowed(allowed) {
  const val = allowed ? 'true' : 'false';
  setCookie('cookie_lb_consent', val, 365);
  try {
    localStorage.setItem('space_lb_cookie_consent', val);
  } catch {}
  if (!allowed) {
    deleteCookie('space_game_leaderboard');
    deleteCookie('pilot_name');
  }
}

/**
 * Injects cookie banner markup if not already present in static HTML
 */
function ensureCookieMarkup() {
  if (document.getElementById('cookie-notice')) return;

  const aside = document.createElement('aside');
  aside.id = 'cookie-notice';
  aside.className = 'cookie-notice';
  aside.setAttribute('role', 'dialog');
  aside.setAttribute('aria-labelledby', 'cookie-title');
  aside.setAttribute('aria-describedby', 'cookie-desc');
  aside.setAttribute('aria-hidden', 'true');

  aside.innerHTML = `
    <div class="cookie-notice-card">
      <div class="cookie-header">
        <div class="cookie-header-title">
          <span class="cookie-icon" aria-hidden="true">🍪</span>
          <h3 id="cookie-title" data-i18n="ui.cookie_title">Privacy & Local Storage</h3>
        </div>
        <button type="button" class="cookie-close-btn" id="cookie-close-btn" aria-label="Close cookie notice" data-i18n-attr="aria-label:ui.cookie_close_aria">✕</button>
      </div>
      <p id="cookie-desc" class="cookie-desc" data-i18n="ui.cookie_desc">
        RocketRun uses zero tracking or advertising cookies. We only use strictly necessary local storage to remember your language, units, and orrery preferences.
      </p>
      <div class="cookie-options">
        <div class="cookie-option-row">
          <label class="cookie-option-label" for="cookie-lb-toggle">
            <span class="cookie-option-title" data-i18n="ui.cookie_leaderboard_title">Leaderboard & Pilot Stats:</span>
            <span class="cookie-option-desc" data-i18n="ui.cookie_leaderboard_desc">Save high scores, pilot name, and space ranks in a first-party cookie.</span>
          </label>
          <label class="hud-switch" for="cookie-lb-toggle">
            <input type="checkbox" id="cookie-lb-toggle" ${isLeaderboardCookieAllowed() ? 'checked' : ''} aria-label="Toggle Leaderboard Cookie" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
      <p class="cookie-clear-note" data-i18n="ui.cookie_clear_note">
        ⚠️ Clearing stored data will also permanently remove your game high scores, pilot details, and flight ranks.
      </p>
      <div class="cookie-actions">
        <button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept-btn" data-i18n="ui.cookie_accept">Got it / Accept</button>
        <button type="button" class="cookie-btn cookie-btn-clear" id="cookie-clear-btn" data-i18n="ui.cookie_clear" title="Clear all local data, high scores, and cookies">Clear Stored Data</button>
      </div>
      <div class="cookie-toast" id="cookie-toast" aria-live="polite"></div>
    </div>
  `;

  document.body.appendChild(aside);
}
