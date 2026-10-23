/**
 * RocketRun Leaderboard (First-Party Cookie & Local Storage)
 * Strict GDPR compliance: strictly functional, local client-side only.
 * Cyclomatic Complexity <= 4 per function
 */

const LEADERBOARD_KEY = 'space_game_leaderboard';
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

export function loadLeaderboard() {
  try {
    const raw = getCookie(LEADERBOARD_KEY) || localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return getDefaultLeaderboard();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getDefaultLeaderboard();
  } catch {
    return getDefaultLeaderboard();
  }
}

export function saveLeaderboardScore(entry) {
  const current = loadLeaderboard();
  const updated = [...current, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  const jsonStr = JSON.stringify(updated);
  setCookie(LEADERBOARD_KEY, jsonStr);
  try {
    localStorage.setItem(LEADERBOARD_KEY, jsonStr);
  } catch {}
  return updated;
}

function getDefaultLeaderboard() {
  return [
    { name: 'Cmdr. Zach', avatar: '👨‍🚀', rankKey: 'game.rank_master', score: 1200, date: '2026-10-20' },
    { name: 'Dr. Stella', avatar: '👩‍🚀', rankKey: 'game.rank_pioneer', score: 950, date: '2026-10-21' },
    { name: 'Cadet Leo', avatar: '👨‍🚀', rankKey: 'game.rank_navigator', score: 700, date: '2026-10-22' }
  ];
}
