/**
 * RocketRun Orbital Physics & Transfer Calculator
 * Cyclomatic Complexity <= 4 per function
 */

export const ORBIT_RADII = {
  sun: 0,
  mercury: 16,
  venus: 20,
  earth: 24,
  moon: 25.5,
  mars: 30,
  jupiter: 38,
  saturn: 45,
  uranus: 52,
  neptune: 60
};

export const ORBIT_PERIODS = {
  mercury: 0.24,
  venus: 0.62,
  earth: 1.0,
  moon: 1.0,
  mars: 1.88,
  jupiter: 11.86,
  saturn: 29.46,
  uranus: 84.01,
  neptune: 164.8
};

// In Game Mode, Earth orbit is 50s (2.5x slower) to match rocket flight pace
const BASE_EARTH_SECONDS = 50;

export function getBodyCoordinates(slug, elapsedSec) {
  const r = ORBIT_RADII[slug] ?? 24;
  if (r === 0) return { x: 0, y: 0, r: 0, angleDeg: 0 };

  const periodYears = ORBIT_PERIODS[slug] ?? 1.0;
  const periodSec = periodYears * BASE_EARTH_SECONDS;
  const angleDeg = ((elapsedSec / periodSec) * 360) % 360;
  const rad = (angleDeg * Math.PI) / 180;

  return {
    x: r * Math.cos(rad),
    y: r * Math.sin(rad),
    r,
    angleDeg
  };
}

export function calculateOrbitalWindow(originSlug, targetSlug, elapsedSec) {
  const p1 = getBodyCoordinates(originSlug, elapsedSec);
  const p2 = getBodyCoordinates(targetSlug, elapsedSec);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const currentDist = Math.hypot(dx, dy);

  const minDist = Math.abs(p2.r - p1.r);
  const maxDist = p2.r + p1.r;
  const distRange = Math.max(1, maxDist - minDist);
  const normDist = Math.max(0, Math.min(1, (currentDist - minDist) / distRange));

  const status = normDist <= 0.38 ? 'perigee' : (normDist >= 0.65 ? 'apogee' : 'moderate');

  // Compute required energy window (0% - 100%)
  const baseReq = Math.round(20 + normDist * 50);
  const minReq = Math.max(10, baseReq - 12);
  const maxCap = Math.min(100, baseReq + 22);

  return {
    currentDist,
    minDist,
    maxDist,
    normDist,
    status,
    minReq,
    maxCap,
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
  const r1 = ORBIT_RADII[originSlug] ?? 24;
  const r2 = ORBIT_RADII[targetSlug] ?? 30;
  const crosses = (r1 <= 30 && r2 >= 38) || (r1 >= 38 && r2 <= 30);
  return crosses;
}

export function checkSolarBoost(originSlug, targetSlug) {
  const r1 = ORBIT_RADII[originSlug] ?? 24;
  const r2 = ORBIT_RADII[targetSlug] ?? 30;
  return r1 <= 20 || r2 <= 20;
}

export function generateScientificTransferArc(p1, p2, isMoon = false) {
  const points = [];
  const steps = 24;

  if (isMoon) {
    // Translunar injection: smooth curved leap around Earth
    const midX = (p1.x + p2.x) / 2 + (p2.y - p1.y) * 0.45;
    const midY = (p1.y + p2.y) / 2 - (p2.x - p1.x) * 0.45;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * midX + t * t * p2.x;
      const y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * midY + t * t * p2.y;
      points.push({ x, y });
    }
  } else {
    // Interplanetary Hohmann / Keplerian transfer ellipse around Sun (0, 0)
    const r1 = Math.hypot(p1.x, p1.y);
    const r2 = Math.hypot(p2.x, p2.y);
    const theta1 = Math.atan2(p1.y, p1.x);
    const theta2 = Math.atan2(p2.y, p2.x);

    let dTheta = theta2 - theta1;
    while (dTheta <= 0.3) {
      dTheta += Math.PI * 2;
    }
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
