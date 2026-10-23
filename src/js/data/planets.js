/**
 * Planetary Data & Astronomical Specifications
 * Astronomical orbital periods, geometric parameters, visual palettes,
 * and gravity ratios for RocketRun (rocketrun.org).
 *
 * Localized textual copy and stat cards live in src/i18n/*.json (Single Source of Truth).
 */

export const BASE_EARTH_SECONDS = 5;

export const sunData = {
  slug: 'sun',
  name: 'The Sun (Sol)',
  greeting: 'Hello, Golden Star!',
  fact: 'The yellow dwarf star at the heart of our solar system. It accounts for 99.86% of all mass in the solar system, generating light and life through core nuclear fusion.',
  c1: '#fff5aa',
  c2: '#ff8800',
  glow: '#ffaa00',
  bg: 'radial-gradient(ellipse at 50% 25%, #471900 0%, #1a0800 50%, #020510 85%)',
  pvSize: 280,
  isSun: true,
  gravityRatio: 27.9
};

export const planets = [
  {
    slug: 'mercury',
    name: 'Mercury',
    greeting: 'Hello, Scorched World!',
    fact: 'The smallest planet — a day lasts longer than a year, with temperatures ranging from −180°C to 430°C.',
    c1: '#b8a99a',
    c2: '#5c4a3d',
    glow: '#d4a574',
    bg: 'radial-gradient(ellipse at 60% 20%, #1a0f08 0%, #020510 70%)',
    orbitR: 9,
    size: 0.9,
    periodYears: 0.240846,
    initialPhase: 0.15,
    pvSize: 110,
    gravityRatio: 0.38,
    inclinationDeg: 7.0,
    eccentricity: 0.2056,
    eccentricity3d: 0.24,
    perihelionDeg: 77,
    moons: []
  },
  {
    slug: 'venus',
    name: 'Venus',
    greeting: 'Hello, Inferno Twin!',
    fact: 'A runaway greenhouse makes Venus the hottest planet at 465°C — hotter than Mercury despite being farther from the Sun.',
    c1: '#f5c842',
    c2: '#8b5e00',
    glow: '#f5c842',
    bg: 'radial-gradient(ellipse at 60% 20%, #1a1200 0%, #020510 70%)',
    orbitR: 13,
    size: 1.5,
    periodYears: 0.615197,
    initialPhase: 0.45,
    pvSize: 150,
    gravityRatio: 0.91,
    inclinationDeg: 3.39,
    eccentricity: 0.0068,
    eccentricity3d: 0.08,
    perihelionDeg: 131,
    moons: []
  },
  {
    slug: 'earth',
    name: 'Earth',
    greeting: 'Hello, Home World!',
    fact: 'The only known world teeming with life. Our pale blue dot is 71% ocean, wrapped in a life-giving atmosphere.',
    c1: '#4a90d9',
    c2: '#1a3a6a',
    glow: '#4a90d9',
    bg: 'radial-gradient(ellipse at 60% 20%, #020d1a 0%, #020510 70%)',
    orbitR: 17.5,
    size: 1.6,
    periodYears: 1.0,
    initialPhase: 0.70,
    pvSize: 158,
    gravityRatio: 1.0,
    inclinationDeg: 0.0,
    eccentricity: 0.0167,
    eccentricity3d: 0.10,
    perihelionDeg: 103,
    moons: [
      { name: 'Moon', r: 2.8, size: 0.34, speed: 2.8, color: '#e2e8f0', glow: 'rgba(255,255,255,0.7)' }
    ]
  },
  {
    slug: 'mars',
    name: 'Mars',
    greeting: 'Hello, Red Planet!',
    fact: 'Home to Olympus Mons — the tallest volcano in the solar system at 21 km high. The rusty colour is iron-oxide dust.',
    c1: '#c1440e',
    c2: '#5c1a00',
    glow: '#e05a22',
    bg: 'radial-gradient(ellipse at 60% 20%, #1a0500 0%, #020510 70%)',
    orbitR: 22.5,
    size: 1.2,
    periodYears: 1.880848,
    initialPhase: 0.30,
    pvSize: 128,
    gravityRatio: 0.38,
    inclinationDeg: 1.85,
    eccentricity: 0.0934,
    eccentricity3d: 0.18,
    perihelionDeg: 336,
    moons: [
      { name: 'Phobos', r: 2.0, size: 0.22, speed: 1.6, color: '#d4c4b5', glow: 'rgba(212,196,181,0.6)' },
      { name: 'Deimos', r: 2.8, size: 0.18, speed: 3.2, color: '#b8aba0', glow: 'rgba(184,171,160,0.5)' }
    ]
  },
  {
    slug: 'jupiter',
    name: 'Jupiter',
    greeting: 'Hello, Giant King!',
    fact: 'So massive all other planets could fit inside it. Its Great Red Spot storm has raged for over 350 years.',
    c1: '#c89060',
    c2: '#5c3010',
    glow: '#c89060',
    bg: 'radial-gradient(ellipse at 60% 20%, #1a0d00 0%, #020510 70%)',
    orbitR: 29,
    size: 2.8,
    periodYears: 11.8626,
    initialPhase: 0.85,
    pvSize: 220,
    gravityRatio: 2.53,
    inclinationDeg: 1.30,
    eccentricity: 0.0484,
    eccentricity3d: 0.13,
    perihelionDeg: 15,
    moons: [
      { name: 'Io', r: 4.6, size: 0.32, speed: 1.8, color: '#fcd34d', glow: 'rgba(252,211,77,0.7)' },
      { name: 'Europa', r: 5.6, size: 0.28, speed: 2.6, color: '#e0f2fe', glow: 'rgba(224,242,254,0.7)' },
      { name: 'Ganymede', r: 6.7, size: 0.40, speed: 3.8, color: '#d1d5db', glow: 'rgba(209,213,219,0.7)' },
      { name: 'Callisto', r: 7.8, size: 0.36, speed: 5.2, color: '#9ca3af', glow: 'rgba(156,163,175,0.6)' }
    ]
  },
  {
    slug: 'saturn',
    name: 'Saturn',
    greeting: 'Hello, Ringed Beauty!',
    fact: 'Saturn’s iconic rings span 282,000 km. It’s so low-density it would float on water!',
    c1: '#e0c080',
    c2: '#7a5a20',
    glow: '#e0c080',
    bg: 'radial-gradient(ellipse at 60% 20%, #1a1500 0%, #020510 70%)',
    orbitR: 36.5,
    size: 2.3,
    periodYears: 29.4475,
    initialPhase: 0.40,
    hasRing: true,
    pvSize: 195,
    gravityRatio: 1.07,
    inclinationDeg: 2.49,
    eccentricity: 0.0565,
    eccentricity3d: 0.15,
    perihelionDeg: 92,
    moons: [
      { name: 'Mimas', r: 6.2, size: 0.22, speed: 2.2, color: '#e5e7eb', glow: 'rgba(229,231,235,0.6)' },
      { name: 'Enceladus', r: 7.2, size: 0.26, speed: 3.2, color: '#f8fafc', glow: 'rgba(248,250,252,0.8)' },
      { name: 'Titan', r: 8.5, size: 0.44, speed: 5.0, color: '#fbbf24', glow: 'rgba(251,191,36,0.8)' }
    ]
  },
  {
    slug: 'uranus',
    name: 'Uranus',
    greeting: 'Hello, Ice Giant!',
    fact: 'Uranus has a 98° axial tilt — it rolls around the Sun on its side. Its rich blue-cyan hue comes from methane gas.',
    c1: '#4cc9f0',
    c2: '#1d4ed8',
    glow: '#38bdf8',
    bg: 'radial-gradient(ellipse at 60% 20%, #031c36 0%, #020510 70%)',
    orbitR: 42.5,
    size: 1.9,
    periodYears: 84.0168,
    initialPhase: 0.20,
    pvSize: 172,
    gravityRatio: 0.89,
    inclinationDeg: 0.77,
    eccentricity: 0.0472,
    eccentricity3d: 0.12,
    perihelionDeg: 171,
    moons: [
      { name: 'Miranda', r: 3.0, size: 0.22, speed: 2.0, color: '#cbd5e1', glow: 'rgba(203,213,225,0.6)' },
      { name: 'Ariel', r: 3.9, size: 0.28, speed: 3.0, color: '#e2e8f0', glow: 'rgba(226,232,240,0.6)' },
      { name: 'Titania', r: 4.8, size: 0.35, speed: 4.2, color: '#f1f5f9', glow: 'rgba(241,245,249,0.7)' }
    ]
  },
  {
    slug: 'neptune',
    name: 'Neptune',
    greeting: 'Hello, Windy World!',
    fact: 'The windiest planet — storms reach 2,100 km/h. One orbit of the Sun takes 165 Earth years.',
    c1: '#3b6fcc',
    c2: '#0a1a5c',
    glow: '#5588ff',
    bg: 'radial-gradient(ellipse at 60% 20%, #000a1a 0%, #020510 70%)',
    orbitR: 48,
    size: 1.8,
    periodYears: 164.7913,
    initialPhase: 0.60,
    pvSize: 162,
    gravityRatio: 1.14,
    inclinationDeg: 1.77,
    eccentricity: 0.0086,
    eccentricity3d: 0.09,
    perihelionDeg: 45,
    moons: [
      { name: 'Proteus', r: 3.0, size: 0.22, speed: 2.2, color: '#94a3b8', glow: 'rgba(148,163,184,0.6)' },
      { name: 'Triton', r: 4.1, size: 0.35, speed: 3.6, color: '#bae6fd', glow: 'rgba(186,230,253,0.7)', isRetrograde: true }
    ]
  }
];
