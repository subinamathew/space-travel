/**
 * RocketRun Orbital Physics & Transfer Calculator
 * Cyclomatic Complexity <= 4 per function
 */

export const ORBIT_SPECS = {
  sun: { r: 0, period: 1.0, phase: 0, ecc: 0, au: 0 },
  mercury: { r: 9, period: 0.240846, phase: 0.15, ecc: 0.2056, au: 0.387 },
  venus: { r: 13, period: 0.615197, phase: 0.45, ecc: 0.0068, au: 0.723 },
  earth: { r: 17.5, period: 1.0, phase: 0.70, ecc: 0.0167, au: 1.000 },
  moon: { r: 17.5, period: 1.0, phase: 0.70, ecc: 0.0549, au: 1.000, moonDist: 2.8, moonAu: 0.00257 },
  mars: { r: 22.5, period: 1.880848, phase: 0.30, ecc: 0.0934, au: 1.524 },
  asteroid_belt: { r: 25.5, period: 4.6, phase: 0.0, ecc: 0.08, au: 2.700 },
  jupiter: { r: 29, period: 11.8626, phase: 0.85, ecc: 0.0484, au: 5.204 },
  saturn: { r: 36.5, period: 29.4475, phase: 0.40, ecc: 0.0565, au: 9.582 },
  uranus: { r: 42.5, period: 84.0168, phase: 0.20, ecc: 0.0472, au: 19.201 },
  neptune: { r: 48, period: 164.7913, phase: 0.60, ecc: 0.0086, au: 30.047 }
};

export const ORBIT_RADII = Object.fromEntries(Object.entries(ORBIT_SPECS).map(([k, v]) => [k, v.r]));
export const ORBIT_PERIODS = Object.fromEntries(Object.entries(ORBIT_SPECS).map(([k, v]) => [k, v.period]));

// In Game Mode, Earth orbit takes 12.5s (2.5x slower than default 5s)
export const BASE_EARTH_SECONDS = 12.5;

export function getBodyCoordinates(slug, elapsedSec) {
  const spec = ORBIT_SPECS[slug] ?? ORBIT_SPECS.earth;
  if (spec.r === 0) return { x: 0, y: 0, r: 0, angleDeg: 0 };

  const periodSec = spec.period * BASE_EARTH_SECONDS;
  const initialOffset = (spec.phase || 0) * periodSec;
  const totalSec = elapsedSec + initialOffset;
  const angleDeg = ((totalSec / periodSec) * 360) % 360;
  const rad = ((angleDeg - 90) * Math.PI) / 180;

  let x = spec.r * Math.cos(rad);
  let y = spec.r * Math.sin(rad);

  if (slug === 'moon') {
    const moonAngle = (elapsedSec / 2.8) * 360;
    const moonRad = (moonAngle * Math.PI) / 180;
    x += spec.moonDist * Math.cos(moonRad);
    y += spec.moonDist * Math.sin(moonRad);
  }

  return { x, y, r: spec.r, angleDeg };
}

function calculateSeparationBounds(s1, s2, isMoon) {
  if (isMoon) {
    return {
      minAu: 0.0024,
      maxAu: 0.0027,
      minDist: 2.65,
      maxDist: 2.95
    };
  }
  const minAu = Math.max(0.15, Math.abs(s2.au * (1 - s2.ecc) - s1.au * (1 + s1.ecc)));
  const maxAu = s1.au * (1 + s1.ecc) + s2.au * (1 + s2.ecc);
  const minDist = Math.abs(s2.r - s1.r);
  const maxDist = s1.r + s2.r;
  return { minAu, maxAu, minDist, maxDist };
}

function computeEnergyWindow(targetSlug, normDist) {
  const isMoon = targetSlug === 'moon';
  const isInner = ['mercury', 'venus'].includes(targetSlug);
  const isFar = ['uranus', 'neptune'].includes(targetSlug);
  const isMid = ['mars', 'jupiter', 'saturn'].includes(targetSlug);

  let base = 40;
  if (isMoon) base = 25;
  else if (isInner) base = 35;
  else if (isFar) base = 75;
  else if (isMid) base = 50;

  const baseReq = Math.round(base + normDist * 20);
  const minReq = Math.max(10, baseReq - 10);
  const maxCap = Math.min(100, baseReq + 20);

  return { minReq, maxCap };
}

export function calculateOrbitalWindow(originSlug, targetSlug, elapsedSec) {
  const s1 = ORBIT_SPECS[originSlug] ?? ORBIT_SPECS.earth;
  const s2 = ORBIT_SPECS[targetSlug] ?? ORBIT_SPECS.mars;
  const isMoon = targetSlug === 'moon' || originSlug === 'moon';

  const bounds = calculateSeparationBounds(s1, s2, isMoon);
  const p1 = getBodyCoordinates(originSlug, elapsedSec);
  const p2 = getBodyCoordinates(targetSlug, elapsedSec);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const currentDist = Math.hypot(dx, dy);

  const distRange = Math.max(0.1, bounds.maxDist - bounds.minDist);
  const normDist = Math.max(0, Math.min(1, (currentDist - bounds.minDist) / distRange));

  const status = normDist <= 0.35 ? 'perigee' : (normDist >= 0.65 ? 'apogee' : 'moderate');
  const energyWin = computeEnergyWindow(targetSlug, normDist);
  const currentAu = bounds.minAu + normDist * (bounds.maxAu - bounds.minAu);

  return {
    currentDist,
    currentAu,
    minDist: bounds.minDist,
    maxDist: bounds.maxDist,
    minAu: bounds.minAu,
    maxAu: bounds.maxAu,
    transferPerigeeAu: Math.min(s1.au, s2.au),
    transferApogeeAu: Math.max(s1.au, s2.au),
    normDist,
    status,
    minReq: energyWin.minReq,
    maxCap: energyWin.maxCap,
    dx,
    dy
  };
}

export function evaluateLaunchOutcome(playerEnergy, windowMetrics) {
  const energy = Number(playerEnergy) || 0;
  if (energy < windowMetrics.minReq) {
    return { outcome: 'fuel_out', reason: 'game.fuel_exhausted_detail' };
  }
  if (energy > windowMetrics.maxCap) {
    return { outcome: 'overshoot', reason: 'game.overshoot_detail' };
  }
  return { outcome: 'capture', reason: 'game.capture_success' };
}

export function checkAsteroidHazard(originSlug, targetSlug) {
  const r1 = (ORBIT_SPECS[originSlug] ?? ORBIT_SPECS.earth).r;
  const r2 = (ORBIT_SPECS[targetSlug] ?? ORBIT_SPECS.mars).r;
  const crosses = (r1 <= 22.5 && r2 >= 29) || (r1 >= 29 && r2 <= 22.5);
  return crosses;
}

export function checkSolarBoost(originSlug, targetSlug) {
  const r1 = (ORBIT_SPECS[originSlug] ?? ORBIT_SPECS.earth).r;
  const r2 = (ORBIT_SPECS[targetSlug] ?? ORBIT_SPECS.mars).r;
  return r1 <= 13 || r2 <= 13;
}

export function generateScientificTransferArc(p1, p2, isMoon = false) {
  const points = [];
  const steps = 24;

  if (isMoon) {
    const midX = (p1.x + p2.x) / 2 + (p2.y - p1.y) * 0.45;
    const midY = (p1.y + p2.y) / 2 - (p2.x - p1.x) * 0.45;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
      const y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;
      points.push({ x, y });
    }
  } else {
    const r1 = Math.hypot(p1.x, p1.y);
    const r2 = Math.hypot(p2.x, p2.y);
    const theta1 = Math.atan2(p1.y, p1.x);
    const theta2 = Math.atan2(p2.y, p2.x);

    let dTheta = theta2 - theta1;
    while (dTheta <= 0.3) dTheta += Math.PI * 2;
    if (dTheta > Math.PI * 1.6) {
      dTheta -= Math.PI * 2;
      if (Math.abs(dTheta) < 0.3) dTheta = Math.PI * 0.8;
    }

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = r1 + (r2 - r1) * (0.5 - 0.5 * Math.cos(Math.PI * t));
      const theta = theta1 + dTheta * t;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      points.push({ x, y });
    }
  }

  for (let i = 0; i <= steps; i++) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(steps, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    points[i].angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  }

  return points;
}
