import { t } from '../i18n.js';

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
        const msg = t('ui.cookie_cleared_msg') || 'All local storage and cookies have been cleared!';
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
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
      }
    }

    // 2. Clear known localStorage keys
    const keysToRemove = [
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
      'space_calc_minimized'
    ];
    keysToRemove.forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (err) {}
    });
  } catch (e) {
    console.warn('Could not clear storage:', e);
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
      <div class="cookie-actions">
        <button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept-btn" data-i18n="ui.cookie_accept">Got it / Accept</button>
        <button type="button" class="cookie-btn cookie-btn-clear" id="cookie-clear-btn" data-i18n="ui.cookie_clear">Clear Stored Data</button>
      </div>
      <div class="cookie-toast" id="cookie-toast" aria-live="polite"></div>
    </div>
  `;

  document.body.appendChild(aside);
}
