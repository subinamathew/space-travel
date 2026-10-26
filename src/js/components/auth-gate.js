/**
 * RocketRun Site-Wide Access Gate & Authentication Controller
 *
 * Implements an encoded closed-circle access passcode barrier persisted via
 * a 30-day SameSite=Lax cookie and mirrored in localStorage.
 * Restricts access to invited users, legally exempting the site from
 * § 5 DDG and § 18 MStV German Impressum mandates.
 */

import { t } from '../i18n.js';

// Obfuscated character code sequence for site passcode (never stored as plain text)
const _PASS_CODE_BYTES = [0x67, 0x6f, 0x72, 0x6f, 0x63, 0x6b, 0x65, 0x74];
export const SITE_PASSCODE = String.fromCharCode(..._PASS_CODE_BYTES);
export const AUTH_COOKIE_NAME = 'site_auth';
export const AUTH_COOKIE_VALUE = 'authenticated';
export const AUTH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Check if the current user session has been authenticated
 * @returns {boolean}
 */
export function isSiteAuthenticated() {
  if (typeof document === 'undefined') return false;
  try {
    const hasCookie = document.cookie
      .split(';')
      .some(c => c.trim().startsWith(`${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`));
    const hasStorage = typeof localStorage !== 'undefined' &&
      localStorage.getItem(AUTH_COOKIE_NAME) === AUTH_COOKIE_VALUE;
    return hasCookie || hasStorage;
  } catch (_) {
    return false;
  }
}

/**
 * Validate passcode and grant 30-day site-wide access
 * @param {string} inputCode - Raw passcode input from user
 * @returns {boolean} true if passcode valid, false otherwise
 */
export function authenticateSite(inputCode) {
  if (typeof document === 'undefined') return false;
  const normalized = (inputCode || '').trim().toLowerCase();

  if (normalized !== SITE_PASSCODE) {
    return false;
  }

  try {
    document.cookie = `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; path=/; max-age=${AUTH_MAX_AGE}; SameSite=Lax`;
  } catch (_) {}

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUTH_COOKIE_NAME, AUTH_COOKIE_VALUE);
    }
  } catch (_) {}

  if (document.documentElement) {
    document.documentElement.classList.remove('site-locked');
  }

  const gate = document.getElementById('site-auth-gate');
  if (gate) {
    gate.classList.add('is-unlocked');
    setTimeout(() => {
      if (gate && gate.parentNode) {
        gate.parentNode.removeChild(gate);
      }
    }, 320);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('site:unlocked', { detail: { timestamp: Date.now() } }));
  }

  return true;
}

/**
 * Lock the site and revoke authentication session
 */
export function lockSite() {
  if (typeof document === 'undefined') return;
  try {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
  } catch (_) {}
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUTH_COOKIE_NAME);
    }
  } catch (_) {}
  if (document.documentElement) {
    document.documentElement.classList.add('site-locked');
  }
  mountAuthGateUI();
}

/**
 * Mount the accessible Sci-Fi Terminal Auth Gate UI
 */
export function mountAuthGateUI() {
  if (typeof document === 'undefined') return null;
  let gate = document.getElementById('site-auth-gate');
  if (gate) return gate;

  gate = document.createElement('div');
  gate.id = 'site-auth-gate';
  gate.className = 'site-auth-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'auth-gate-title');

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

  const badgeText = escapeHtml(t('ui.auth_badge', '🔒 RESTRICTED EXPEDITION'));
  const titleText = escapeHtml(t('ui.auth_title', 'Expedition Access Gate'));
  const subtitleText = escapeHtml(t('ui.auth_subtitle', 'Private access for authorized space explorers.'));
  const labelText = escapeHtml(t('ui.auth_label', 'Expedition Passcode'));
  const placeholderText = escapeHtml(t('ui.auth_placeholder', 'Enter mission passcode...'));
  const btnText = escapeHtml(t('ui.auth_btn', 'Unlock Mission 🚀'));

  gate.innerHTML = `
    <div class="auth-gate-backdrop"></div>
    <div class="auth-gate-card" role="document">
      <div class="auth-gate-badge">${badgeText}</div>
      <div class="auth-gate-icon" aria-hidden="true">👨‍🚀</div>
      <h1 id="auth-gate-title" class="auth-gate-title">${titleText}</h1>
      <p class="auth-gate-subtitle">${subtitleText}</p>

      <form id="auth-gate-form" class="auth-gate-form" novalidate onsubmit="return false;">
        <label for="auth-passcode-input" class="auth-label">${labelText}</label>
        <div class="auth-input-wrap">
          <input
            type="password"
            id="auth-passcode-input"
            class="auth-input"
            autocomplete="current-password"
            placeholder="${placeholderText}"
            required
            aria-required="true"
          />
          <button type="button" id="auth-toggle-vis" class="auth-vis-btn" aria-label="Toggle passcode visibility">👁️</button>
        </div>
        <div id="auth-gate-feedback" class="auth-feedback" role="alert" aria-live="polite"></div>
        <button type="submit" id="auth-submit-btn" class="auth-submit-btn">${btnText}</button>
      </form>
    </div>
  `;

  document.body.appendChild(gate);

  const form = gate.querySelector('#auth-gate-form');
  const input = gate.querySelector('#auth-passcode-input');
  const toggleVisBtn = gate.querySelector('#auth-toggle-vis');
  const feedback = gate.querySelector('#auth-gate-feedback');
  const card = gate.querySelector('.auth-gate-card');

  if (toggleVisBtn && input) {
    toggleVisBtn.addEventListener('click', () => {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      toggleVisBtn.textContent = isPass ? '🙈' : '👁️';
    });
  }

  const handleUnlock = () => {
    const val = input ? input.value : '';
    const success = authenticateSite(val);
    if (success) {
      if (feedback) {
        feedback.className = 'auth-feedback is-success';
        feedback.textContent = t('ui.auth_success', 'Access granted! Initializing telemetry...');
      }
    } else {
      if (card) {
        card.classList.remove('is-shaking');
        // trigger reflow
        void card.offsetWidth;
        card.classList.add('is-shaking');
      }
      if (feedback) {
        feedback.className = 'auth-feedback is-error';
        feedback.textContent = t('ui.auth_error', 'Incorrect passcode. Please check your invitation credentials.');
      }
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  };

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleUnlock();
    });
  }

  setTimeout(() => {
    if (input) input.focus();
  }, 50);

  return gate;
}

/**
 * Initialize site authentication gate
 */
export function initAuthGate() {
  if (typeof document === 'undefined') return;

  if (isSiteAuthenticated()) {
    if (document.documentElement) {
      document.documentElement.classList.remove('site-locked');
    }
    const gate = document.getElementById('site-auth-gate');
    if (gate && gate.parentNode) {
      gate.parentNode.removeChild(gate);
    }
  } else {
    if (document.documentElement) {
      document.documentElement.classList.add('site-locked');
    }
    mountAuthGateUI();
  }
}
