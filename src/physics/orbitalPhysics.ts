export interface BodyCoordinates {
  x: number;
  y: number;
  r: number;
  angleDeg: number;
}

export interface WindowMetrics {
  currentDist: number;
  currentAu: number;
  arrivalDist: number;
  arrivalAu: number;
  flightDurationSec: number;
  timeToWindowSec: number;
  isWindowOpen: boolean;
  minReqEnergy: number;
  maxCapEnergy: number;
  fuelRequired: number;
}

export type LaunchOutcome = 'CAPTURE_SUCCESS' | 'FUEL_EXHAUSTED' | 'OVERSHOOT';

export interface LaunchResult {
  outcome: LaunchOutcome;
  title: string;
  explanation: string;
}

export interface ArcPoint {
  x: number;
  y: number;
  angleDeg: number;
}

export interface OrbitSpec {
  r: number;
  period: number;
  phase: number;
  ecc: number;
  au: number;
  moonDist?: number;
}

export const BASE_EARTH_SECONDS = 12.5;

export const ORBIT_SPECS: Record<string, OrbitSpec> = {
  sun: { r: 0, period: 1, phase: 0, ecc: 0, au: 0 },
  mercury: { r: 9, period: 0.240846, phase: 0.15, ecc: 0.2056, au: 0.387 },
  venus: { r: 13, period: 0.615197, phase: 0.45, ecc: 0.0068, au: 0.723 },
  earth: { r: 17.5, period: 1.0, phase: 0.70, ecc: 0.0167, au: 1.000 },
  moon: { r: 17.5, period: 1.0, phase: 0.70, ecc: 0.0549, au: 1.000, moonDist: 2.8 },
  luna: { r: 17.5, period: 1.0, phase: 0.70, ecc: 0.0549, au: 1.000, moonDist: 2.8 },
  mars: { r: 22.5, period: 1.880848, phase: 0.30, ecc: 0.0934, au: 1.524 },
  jupiter: { r: 29, period: 11.8626, phase: 0.85, ecc: 0.0484, au: 5.204 },
  saturn: { r: 36.5, period: 29.4475, phase: 0.40, ecc: 0.0565, au: 9.582 },
  uranus: { r: 42.5, period: 84.0168, phase: 0.20, ecc: 0.0472, au: 19.201 },
  neptune: { r: 48, period: 164.7913, phase: 0.60, ecc: 0.0086, au: 30.047 }
};

export const OrbitalPhysics = {
  specs: ORBIT_SPECS,

  getCoordinates(slug: string, elapsedSec: number): BodyCoordinates {
    const s = slug.toLowerCase();
    const spec = this.specs[s] || this.specs.earth;
    if (spec.r === 0) return { x: 0, y: 0, r: 0, angleDeg: 0 };

    const periodSec = spec.period * BASE_EARTH_SECONDS;
    const initialOffset = spec.phase * periodSec;
    const totalSec = elapsedSec + initialOffset;
    const angleDeg = ((totalSec / periodSec) * 360) % 360;
    const rad = ((angleDeg - 90) * Math.PI) / 180;

    let x = spec.r * Math.cos(rad);
    let y = spec.r * Math.sin(rad);

    if (s === 'moon' || s === 'luna') {
      const moonAngle = (elapsedSec / 2.8) * 360;
      const moonRad = (moonAngle * Math.PI) / 180;
      x += (spec.moonDist || 2.8) * Math.cos(moonRad);
      y += (spec.moonDist || 2.8) * Math.sin(moonRad);
    }

    return { x, y, r: spec.r, angleDeg };
  },

  getFlightDuration(originSlug: string, targetSlug: string): number {
    const o = originSlug.toLowerCase();
    const t = targetSlug.toLowerCase();
    if (t === 'moon' || t === 'luna' || o === 'moon' || o === 'luna') return 3.5;
    if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(t)) return 5.5;
    return 4.2;
  },

  calculateFlightFuelBurn(energy: number, originSlug: string, targetSlug: string): number {
    const s1 = this.specs[originSlug.toLowerCase()] || this.specs.earth;
    const s2 = this.specs[targetSlug.toLowerCase()] || this.specs.mars;
    const isMoon = ['moon', 'luna'].includes(targetSlug) || ['moon', 'luna'].includes(originSlug);

    const travelFactor = isMoon ? 0.65 : 0.65 + Math.abs(s2.r - s1.r) / 35;
    const burn = Math.round(energy * travelFactor);
    return Math.max(10, Math.min(100, burn));
  },

  checkAsteroidHazard(originSlug: string, targetSlug: string): boolean {
    const r1 = (this.specs[originSlug.toLowerCase()] || this.specs.earth).r;
    const r2 = (this.specs[targetSlug.toLowerCase()] || this.specs.mars).r;
    return (r1 <= 22.5 && r2 >= 29) || (r1 >= 29 && r2 <= 22.5);
  },

  checkSolarBoost(originSlug: string, targetSlug: string): boolean {
    const r1 = (this.specs[originSlug.toLowerCase()] || this.specs.earth).r;
    const r2 = (this.specs[targetSlug.toLowerCase()] || this.specs.mars).r;
    return r1 <= 13 || r2 <= 13;
  },

  calculateMetrics(
    originSlug: string,
    targetSlug: string,
    elapsedSec: number,
    currentThrust: number
  ): WindowMetrics {
    const s1 = this.specs[originSlug.toLowerCase()] || this.specs.earth;
    const s2 = this.specs[targetSlug.toLowerCase()] || this.specs.mars;
    const isMoon = ['moon', 'luna'].includes(targetSlug) || ['moon', 'luna'].includes(originSlug);

    const p1 = this.getCoordinates(originSlug, elapsedSec);
    const p2 = this.getCoordinates(targetSlug, elapsedSec);
    const currentDist = Math.hypot(p2.x - p1.x, p2.y - p1.y);

    const duration = this.getFlightDuration(originSlug, targetSlug);
    const p2Future = this.getCoordinates(targetSlug, elapsedSec + duration);
    const arrivalDist = Math.hypot(p2Future.x - p1.x, p2Future.y - p1.y);

    let minAu: number, maxAu: number, minDist: number, maxDist: number;

    if (isMoon) {
      [minAu, maxAu, minDist, maxDist] = [0.0024, 0.0027, 2.65, 2.95];
    } else {
      const minA = Math.max(0.15, Math.abs(s2.au * (1 - s2.ecc) - s1.au * (1 + s1.ecc)));
      const maxA = s1.au * (1 + s1.ecc) + s2.au * (1 + s2.ecc);
      const minD = Math.abs(s2.r - s1.r);
      const maxD = s1.r + s2.r;
      [minAu, maxAu, minDist, maxDist] = [minA, maxA, minD, maxD];
    }

    const distRange = Math.max(0.1, maxDist - minDist);
    const normDist = Math.max(0, Math.min(1, (currentDist - minDist) / distRange));
    const currentAu = minAu + normDist * (maxAu - minAu);

    const arrivalNorm = Math.max(0, Math.min(1, (arrivalDist - minDist) / distRange));
    const arrivalAu = minAu + arrivalNorm * (maxAu - minAu);

    // Find optimal window countdown
    let bestDt = 0;
    let bestDist = Number.MAX_VALUE;
    for (let dt = 0; dt <= 25; dt += 0.5) {
      const t = elapsedSec + dt;
      const ca = this.getCoordinates(originSlug, t);
      const cb = this.getCoordinates(targetSlug, t);
      const d = Math.hypot(cb.x - ca.x, cb.y - ca.y);
      if (d < bestDist) {
        bestDist = d;
        bestDt = dt;
      }
    }

    let baseReq = 48;
    if (isMoon) baseReq = 25;
    else if (['mercury', 'venus'].includes(targetSlug)) baseReq = 35;
    else if (['uranus', 'neptune'].includes(targetSlug)) baseReq = 70;

    baseReq += Math.round(normDist * 20);

    const minReq = Math.max(12, baseReq - 10);
    const maxCap = Math.min(100, baseReq + 22);
    const fuelRequired = this.calculateFlightFuelBurn(currentThrust, originSlug, targetSlug);

    return {
      currentDist,
      currentAu,
      arrivalDist,
      arrivalAu,
      flightDurationSec: duration,
      timeToWindowSec: bestDt,
      isWindowOpen: bestDt <= 1.2,
      minReqEnergy: minReq,
      maxCapEnergy: maxCap,
      fuelRequired
    };
  },

  evaluateOutcome(energy: number, metrics: WindowMetrics): LaunchResult {
    if (energy < metrics.minReqEnergy) {
      return {
        outcome: 'FUEL_EXHAUSTED',
        title: 'Sub-Orbital Drift',
        explanation: 'Thrust was insufficient to escape planetary gravitational influence. The spacecraft entered a drifting sub-orbital loop.'
      };
    }
    if (energy > metrics.maxCapEnergy) {
      return {
        outcome: 'OVERSHOOT',
        title: 'Hyperbolic Overshoot',
        explanation: 'Excessive velocity overshot target orbit and slingshotted into deep interplanetary void!'
      };
    }
    return {
      outcome: 'CAPTURE_SUCCESS',
      title: 'Orbital Insertion Successful!',
      explanation: 'Precision Hohmann transfer trajectory achieved. Retro-thrusters captured the spacecraft safely into target orbit.'
    };
  },

  generateTransferArc(
    originSlug: string,
    targetSlug: string,
    elapsedSec: number,
    durationSec: number,
    steps: number = 30
  ): ArcPoint[] {
    const p1 = this.getCoordinates(originSlug, elapsedSec);
    const p2 = this.getCoordinates(targetSlug, elapsedSec + durationSec);
    const isMoon = ['moon', 'luna'].includes(targetSlug) || ['moon', 'luna'].includes(originSlug);
    const points: ArcPoint[] = [];

    if (isMoon) {
      const midX = (p1.x + p2.x) / 2 + (p2.y - p1.y) * 0.45;
      const midY = (p1.y + p2.y) / 2 - (p2.x - p1.x) * 0.45;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const oneMinusT = 1 - t;
        const x = oneMinusT * oneMinusT * p1.x + 2 * oneMinusT * t * midX + t * t * p2.x;
        const y = oneMinusT * oneMinusT * p1.y + 2 * oneMinusT * t * midY + t * t * p2.y;
        points.push({ x, y, angleDeg: 0 });
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
        points.push({ x, y, angleDeg: 0 });
      }
    }

    // Calculate tangent rotation angles
    return points.map((pt, i) => {
      const prev = points[Math.max(0, i - 1)];
      const next = points[Math.min(steps, i + 1)];
      const dx = next.x - prev.x;
      const dy = next.y - prev.y;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      return { ...pt, angleDeg: angle };
    });
  }
};
