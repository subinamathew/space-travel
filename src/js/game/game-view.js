/**
 * Stateless presentation helpers for the RocketRun game.
 *
 * This module owns body labels/icons and DOM-only flight rendering primitives.
 * It deliberately has no access to mission state, timers, fuel, scoring, or physics.
 */

export function getBodyImagePath(slug) {
  if (!slug) return 'images/moon.png';
  const clean = String(slug).toLowerCase().trim();
  if (clean === 'moon' || clean === 'luna') return 'images/moon.png';
  return `images/${clean}.png`;
}

export function getBodyIcon(slug) {
  const map = {
    moon: '🌙', luna: '🌙', mercury: '🟤', venus: '🟡', earth: '🌍',
    mars: '🔴', jupiter: '🟠', saturn: '🪐', uranus: '🔵', neptune: '🔷', sun: '☀️'
  };
  return map[slug] || '🪐';
}

export function getBodyPlainName(slug) {
  const map = {
    moon: 'Luna', luna: 'Luna', mercury: 'Mercury', venus: 'Venus', earth: 'Earth',
    mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune'
  };
  return map[slug] || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '');
}

export function formatBodyName(slug) {
  const map = {
    moon: 'Luna 🌙', luna: 'Luna 🌙', mercury: 'Mercury ☿', venus: 'Venus ♀',
    earth: 'Earth 🌍', mars: 'Mars ♂', jupiter: 'Jupiter ♃', saturn: 'Saturn ♄',
    uranus: 'Uranus ♅', neptune: 'Neptune ♆'
  };
  return map[slug] || slug;
}

export function createRocketActor() {
  const existing = document.getElementById('rocket-actor');
  if (existing) existing.remove();

  const rocket = document.createElement('div');
  rocket.id = 'rocket-actor';
  rocket.className = 'rocket-actor is-docked';

  const sprite = document.createElement('span');
  sprite.className = 'rocket-sprite';
  sprite.textContent = '🚀';

  const flame = document.createElement('span');
  flame.className = 'thruster-flame';
  flame.textContent = '🔥';

  rocket.append(sprite, flame);
  return rocket;
}

export function injectFlightKeyframes(points) {
  let styleEl = document.getElementById('rocket-flight-keyframes');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'rocket-flight-keyframes';
    document.head.appendChild(styleEl);
  }

  const keyframeRules = points.map((p, i) => {
    const pct = ((i / (points.length - 1)) * 100).toFixed(1);
    return `${pct}% { transform: translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) rotate(${p.angle.toFixed(1)}deg); }`;
  }).join('\n');

  styleEl.textContent = `@keyframes rocket-transfer-flight {\n${keyframeRules}\n}`;
}

export function renderFlightPathSvg(points, sceneEl) {
  removeFlightPathSvg();

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.id = 'flight-path-svg';
  svg.setAttribute('class', 'flight-path-svg');

  const sRect = sceneEl.getBoundingClientRect();
  const cx = sRect.width / 2;
  const cy = sRect.height / 2;
  const d = points.map((p, i) => {
    const x = (cx + p.x).toFixed(1);
    const y = (cy + p.y).toFixed(1);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('class', 'flight-transfer-path');
  path.setAttribute('d', d);
  svg.appendChild(path);
  sceneEl.appendChild(svg);
}

export function removeFlightPathSvg() {
  document.getElementById('flight-path-svg')?.remove();
}

export function removePlanetaryLeadArc() {
  document.getElementById('future-lead-arc-svg')?.remove();
}

export function removeFutureInterceptMarker() {
  document.getElementById('future-intercept-reticle')?.remove();
  removePlanetaryLeadArc();
}
