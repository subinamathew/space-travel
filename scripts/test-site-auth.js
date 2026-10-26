/**
 * RocketRun Site-Wide Passcode Authentication Test Suite
 * Validates access gate, FOUC prevention, cookie and storage persistence,
 * accessible error feedback, zero native popups, lock/unlock lifecycle,
 * and session revocation upon clearing cookies.
 */

import { JSDOM } from 'jsdom';
import assert from 'assert';

console.log('🔒 Running RocketRun Site-Wide Access Passcode Tests...\n');

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script id="head-guard">
    (function(){
      try {
        var a = document.cookie.indexOf('site_auth=authenticated') !== -1 || localStorage.getItem('site_auth') === 'authenticated';
        if (!a) { document.documentElement.classList.add('site-locked'); }
      } catch(e) {}
    })();
  </script>
</head>
<body>
  <div id="scene">Solar System Content</div>
  <div id="top-bar">HUD Navigation</div>
  <main>Main Content</main>
</body>
</html>
`, {
  url: 'https://rocketrun.org/',
  runScripts: 'dangerously'
});

global.window = dom.window;
global.document = dom.window.document;
global.localStorage = dom.window.localStorage;
global.HTMLElement = dom.window.HTMLElement;
global.CustomEvent = dom.window.CustomEvent;

let alertCalls = 0;
let promptCalls = 0;
let confirmCalls = 0;
dom.window.alert = () => { alertCalls++; };
dom.window.prompt = () => { promptCalls++; return ''; };
dom.window.confirm = () => { confirmCalls++; return true; };

const {
  isSiteAuthenticated,
  authenticateSite,
  lockSite,
  initAuthGate,
  mountAuthGateUI,
  SITE_PASSCODE,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_VALUE
} = await import('../src/js/components/auth-gate.js');
const { clearAllCookiesAndStorage } = await import('../src/js/components/cookie-notice.js');

let passed = 0;
function check(condition, msg) {
  assert(condition, msg);
  passed++;
  console.log(`  ✓ ${msg}`);
}

// 1. Initial unauthenticated state
check(isSiteAuthenticated() === false, 'Initial state: isSiteAuthenticated() is false');
check(document.documentElement.classList.contains('site-locked'), 'FOUC Guard: html has .site-locked on fresh visit');

// 2. Mount UI and check accessible structure
initAuthGate();
const gate = document.getElementById('site-auth-gate');
check(gate !== null, '#site-auth-gate mounted in DOM');
check(gate.getAttribute('role') === 'dialog', '#site-auth-gate has role="dialog"');
check(gate.getAttribute('aria-modal') === 'true', '#site-auth-gate has aria-modal="true"');

const input = gate.querySelector('#auth-passcode-input');
const form = gate.querySelector('#auth-gate-form');
const feedback = gate.querySelector('#auth-gate-feedback');
const card = gate.querySelector('.auth-gate-card');
const badge = gate.querySelector('.auth-gate-badge');

check(input !== null, 'Passcode input exists');
check(feedback !== null, 'Accessible feedback region exists');
check(!badge.textContent.includes(SITE_PASSCODE), 'Passcode is strictly NOT exposed in public badge text');
check(!gate.textContent.includes(SITE_PASSCODE), 'Passcode is strictly NOT exposed anywhere in gate text content');

// 3. Test wrong passcodes
const wrong1 = authenticateSite('wrongpassword');
check(wrong1 === false, 'authenticateSite("wrongpassword") returns false');
check(isSiteAuthenticated() === false, 'Site remains unauthenticated');
check(document.documentElement.classList.contains('site-locked'), 'html remains .site-locked after wrong passcode');

// Test via form submission with wrong password
input.value = 'invalid123';
form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
check(feedback.classList.contains('is-error'), 'Feedback displays .is-error on invalid submission');
check(feedback.textContent.length > 0, 'Error message is rendered in feedback element');
check(alertCalls === 0, 'Zero window.alert() calls on failed authentication');
check(promptCalls === 0, 'Zero window.prompt() calls on failed authentication');

// 4. Test correct passcode variations (trimmed & case-insensitive)
let eventDispatched = false;
window.addEventListener('site:unlocked', () => {
  eventDispatched = true;
});

const mixedCasePass = '  ' + SITE_PASSCODE.slice(0, 2).toUpperCase() + SITE_PASSCODE.slice(2).toLowerCase() + '  ';
const correct = authenticateSite(mixedCasePass);
check(correct === true, 'authenticateSite() returns true for padded & mixed-case passcode');
check(isSiteAuthenticated() === true, 'isSiteAuthenticated() returns true after unlock');
check(!document.documentElement.classList.contains('site-locked'), '.site-locked class removed from html element');
check(document.cookie.includes('site_auth=authenticated'), 'Cookie site_auth=authenticated is set');
check(localStorage.getItem('site_auth') === 'authenticated', 'localStorage site_auth is set');
check(eventDispatched === true, 'site:unlocked event dispatched to window');

// 5. Verify reloading when authenticated bypasses lock
const authDom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <script>
    (function(){
      try {
        var a = document.cookie.indexOf('site_auth=authenticated') !== -1 || localStorage.getItem('site_auth') === 'authenticated';
        if (!a) { document.documentElement.classList.add('site-locked'); }
      } catch(e) {}
    })();
  </script>
</head>
<body>
  <div id="scene">Solar System Content</div>
</body>
</html>
`, {
  url: 'https://rocketrun.org/',
  runScripts: 'dangerously',
  beforeParse(window) {
    window.document.cookie = 'site_auth=authenticated; path=/';
  }
});
check(!authDom.window.document.documentElement.classList.contains('site-locked'), 'Pre-render guard does NOT lock page when authenticated cookie present (0 FOUC)');

// 6. Test lockSite()
lockSite();
check(isSiteAuthenticated() === false, 'lockSite() clears authentication state');
check(document.documentElement.classList.contains('site-locked'), 'lockSite() re-applies .site-locked');
check(!document.cookie.includes('site_auth=authenticated'), 'lockSite() cleared site_auth cookie');
check(localStorage.getItem('site_auth') === null, 'lockSite() cleared localStorage site_auth');

// 7. Test clearAllCookiesAndStorage() revokes authentication & removes cookie/storage
authenticateSite(SITE_PASSCODE);
check(isSiteAuthenticated() === true, 'Re-authenticated for cookie clearing test');
clearAllCookiesAndStorage();
check(isSiteAuthenticated() === false, 'clearAllCookiesAndStorage() revokes site authentication');
check(document.documentElement.classList.contains('site-locked'), 'clearAllCookiesAndStorage() re-applies .site-locked to html');
check(!document.cookie.includes('site_auth=authenticated'), 'clearAllCookiesAndStorage() wiped site_auth cookie');
check(localStorage.getItem('site_auth') === null, 'clearAllCookiesAndStorage() wiped localStorage site_auth');

console.log(`\n🎉 AUTH GATE TESTS PASSED: ${passed} / ${passed} checks verified!\n`);
