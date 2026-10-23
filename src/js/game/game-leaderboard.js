/**
 * RocketRun Leaderboard (First-Party Cookie & Local Storage)
 * Strict GDPR compliance: strictly functional, local client-side only.
 * Supports user-customized pilot names and explicit cookie consent toggling.
 */

const LEADERBOARD_KEY = 'space_game_leaderboard';
const PILOT_NAME_KEY = 'pilot_name';
const LB_CONSENT_KEY = 'cookie_lb_consent';
const MAX_ENTRIES = 5;

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name, value, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

/**
 * Check if user allows leaderboard stats to be stored in first-party cookies.
 * Default is true (functional game state), unless explicitly set to false/off.
 */
export function isLeaderboardCookieAllowed() {
  const cookieVal = getCookie(LB_CONSENT_KEY);
  if (cookieVal !== null) return cookieVal !== 'false' && cookieVal !== 'off';
  try {
    const localVal = localStorage.getItem('space_lb_cookie_consent');
    if (localVal !== null) return localVal !== 'false' && localVal !== 'off';
  } catch {}
  return true;
}

/**
 * Update leaderboard cookie storage permission.
 */
export function setLeaderboardCookieAllowed(allowed) {
  const val = allowed ? 'true' : 'false';
  setCookie(LB_CONSENT_KEY, val, 365);
  try {
    localStorage.setItem('space_lb_cookie_consent', val);
  } catch {}

  if (!allowed) {
    deleteCookie(LEADERBOARD_KEY);
    deleteCookie(PILOT_NAME_KEY);
  } else {
    // Re-sync current leaderboard and pilot name to cookie
    const current = loadLeaderboard();
    setCookie(LEADERBOARD_KEY, JSON.stringify(current), 365);
    const pilot = getPilotName();
    if (pilot) setCookie(PILOT_NAME_KEY, pilot, 365);
  }
}

/**
 * Get current player's pilot callsign name from cookie or local storage.
 */
export function getPilotName() {
  const cookieName = getCookie(PILOT_NAME_KEY);
  if (cookieName && cookieName.trim()) return cookieName.trim();
  try {
    const localName = localStorage.getItem('space_pilot_name');
    if (localName && localName.trim()) return localName.trim();
  } catch {}
  return 'Cmdr. Pilot';
}

/**
 * Save user's pilot name to cookie and local storage, and update existing entries.
 */
export function setPilotName(rawName) {
  const cleaned = (rawName || '').replace(/<[^>]*>?/gm, '').trim().slice(0, 20) || 'Cmdr. Pilot';
  const prevName = getPilotName();

  if (isLeaderboardCookieAllowed()) {
    setCookie(PILOT_NAME_KEY, cleaned, 365);
  }
  try {
    localStorage.setItem('space_pilot_name', cleaned);
  } catch {}

  // Update existing leaderboard entries that match the old name or default 'Player'
  const current = loadLeaderboard();
  let modified = false;
  const updated = current.map(e => {
    if (e.name === prevName || e.name === 'Player') {
      modified = true;
      return { ...e, name: cleaned };
    }
    return e;
  });

  if (modified) {
    const jsonStr = JSON.stringify(updated);
    if (isLeaderboardCookieAllowed()) {
      setCookie(LEADERBOARD_KEY, jsonStr, 365);
    }
    try {
      localStorage.setItem(LEADERBOARD_KEY, jsonStr);
    } catch {}
  }

  return cleaned;
}

/**
 * Load top leaderboard entries from cookie or local storage.
 */
export function loadLeaderboard() {
  try {
    const raw = (isLeaderboardCookieAllowed() ? getCookie(LEADERBOARD_KEY) : null) ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem(LEADERBOARD_KEY) : null);
    if (!raw) return getDefaultLeaderboard();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultLeaderboard();
  } catch {
    return getDefaultLeaderboard();
  }
}

/**
 * Save a new entry to the leaderboard.
 */
export function saveLeaderboardScore(entry) {
  const current = loadLeaderboard();
  const pilotName = entry.name && entry.name !== 'Player' ? entry.name : getPilotName();
  const formattedEntry = {
    ...entry,
    name: pilotName
  };

  const updated = [...current, formattedEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  const jsonStr = JSON.stringify(updated);
  if (isLeaderboardCookieAllowed()) {
    setCookie(LEADERBOARD_KEY, jsonStr, 365);
  }
  try {
    localStorage.setItem(LEADERBOARD_KEY, jsonStr);
  } catch {}
  return updated;
}

/**
 * Reset leaderboard to defaults.
 */
export function clearLeaderboard() {
  deleteCookie(LEADERBOARD_KEY);
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch {}
  return getDefaultLeaderboard();
}

function getDefaultLeaderboard() {
  return [
    { name: 'Cmdr. Zach', avatar: '👨‍🚀', rankKey: 'game.rank_master', score: 1200, date: '2026-10-20' },
    { name: 'Dr. Stella', avatar: '👩‍🚀', rankKey: 'game.rank_pioneer', score: 950, date: '2026-10-21' },
    { name: 'Cadet Leo', avatar: '👨‍🚀', rankKey: 'game.rank_navigator', score: 700, date: '2026-10-22' }
  ];
}
