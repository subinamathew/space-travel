/**
 * Planetary Data & Astronomical Specifications
 * Includes real astronomical orbital periods (Earth = 5s base),
 * scientific metrics, surface gravity ratios, and rewritten NASA Kids Mission notes.
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
  gravityRatio: 27.9,
  kidsNote: {
    badge: '🚀 NASA Kids Mission',
    title: 'The Mega Powerhouse!',
    jump: 'Jump height: 0 inches! The gravity is 28× stronger than Earth, so you would be glued flat like toast.',
    fact: 'One million Earths could fit inside the Sun! It holds 99.8% of all the stuff in our solar system.'
  },
  stats: [
    { label: 'Spectral Class', value: 'G2V (Yellow Dwarf)', sub: 'Main-sequence star; ~4.6B years old' },
    { label: 'Surface Temperature', value: '5,500°C (5,778 K)', sub: 'Surface is 55× boiling water; core is 150,000× hotter than boiling water (~15M°C)' },
    { label: 'Equatorial Diameter', value: '1,392,700 km', sub: '109.2 × Earth diameter' },
    { label: 'Mass', value: '1.989 × 10³⁰ kg', sub: '333,000 × Earth (99.86% system mass)' },
    { label: 'Galactic Velocity', value: '220 km/s', sub: 'Milky Way orbit period: ~230M years' },
    { label: 'Distance to Earth', value: '149,600,000 km', sub: '1.0 AU (Light travel: 8m 20s)' },
    { label: 'Rotation Period', value: '25.05 days (Equator)', sub: '34.4 days at poles (differential rotation)' },
    { label: 'Composition', value: '73.4% H₂, 25.0% He', sub: '1.6% heavier elements (C, N, O, Fe)' }
  ]
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
    moons: [],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'Moon-Boots Playground!',
      jump: 'You can leap nearly 3× higher than on Earth! One small hop would launch you clean over your bed.',
      fact: 'A year on Mercury is super fast (88 days), but one single daytime lasts longer than a whole year!'
    },
    stats: [
      { label: 'Distance from Sun', value: '57.9M km', sub: '0.387 AU' },
      { label: 'Orbital Period', value: '87.97 Earth days', sub: 'Fastest orbit in solar system' },
      { label: 'Day Length', value: '175.9 Earth days', sub: 'Rotation: 58.6 days' },
      { label: 'Equatorial Radius', value: '2,439.7 km', sub: '0.383 × Earth' },
      { label: 'Mass', value: '3.30 × 10²³ kg', sub: '0.055 × Earth' },
      { label: 'Surface Temperature', value: '−180°C to 430°C', sub: 'Day is 4× boiling water; night is 9× colder than a freezer' },
      { label: 'Moons & Rings', value: '0 Moons · 0 Rings', sub: 'Mercury has no moons or natural satellites' },
      { label: 'Atmosphere', value: 'Exosphere', sub: 'Trace Oxygen, Sodium, Hydrogen' }
    ]
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
    moons: [],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Solar System’s Oven!',
      jump: 'You jump almost identical to Earth, but the air is yellow, crushing, and hot enough to melt a tin toy car!',
      fact: 'Venus spins backwards compared to Earth, so the Sun rises in the west and sets in the east.'
    },
    stats: [
      { label: 'Distance from Sun', value: '108.2M km', sub: '0.723 AU' },
      { label: 'Orbital Period', value: '224.7 Earth days', sub: '0.615 Earth years' },
      { label: 'Day Length', value: '243.0 Earth days', sub: 'Retrograde rotation (spins backward)' },
      { label: 'Equatorial Radius', value: '6,051.8 km', sub: '0.949 × Earth (Twin)' },
      { label: 'Mass', value: '4.87 × 10²⁴ kg', sub: '0.815 × Earth' },
      { label: 'Surface Temperature', value: '465°C (Average)', sub: 'Nearly 5× hotter than boiling water — melts lead!' },
      { label: 'Moons & Rings', value: '0 Moons · 0 Rings', sub: 'Venus has no moons or natural satellites' },
      { label: 'Atmosphere', value: '96.5% CO₂, 3.5% N₂', sub: 'Sulfuric acid clouds; 92 bar pressure' }
    ]
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
    moons: [
      { name: 'Moon', r: 2.8, size: 0.34, speed: 2.8, color: '#e2e8f0', glow: 'rgba(255,255,255,0.7)' }
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Just-Right Oasis!',
      jump: 'Your home playground! Perfect gravity for kicking soccer goals, riding bikes, and splashing in puddles.',
      fact: 'Earth is the only known planet with breathable oxygen, liquid oceans, blue skies, and living animals!'
    },
    stats: [
      { label: 'Distance from Sun', value: '149.6M km', sub: '1.000 AU (Astronomical Unit)' },
      { label: 'Orbital Period', value: '365.25 days', sub: '1.000 Earth year (Base Reference)' },
      { label: 'Day Length', value: '23h 56m 04s', sub: '24.0 hours solar day' },
      { label: 'Equatorial Radius', value: '6,371.0 km', sub: 'Base unit: 1.000 R⊕' },
      { label: 'Mass', value: '5.972 × 10²⁴ kg', sub: 'Base unit: 1.000 M⊕' },
      { label: 'Surface Temperature', value: '−88°C to 58°C', sub: 'Mean: 15°C — comfortable room heat with liquid oceans' },
      { label: 'Moons & Rings', value: '1 Moon · 0 Rings', sub: "Earth's single natural moon is Luna (The Moon)" },
      { label: 'Atmosphere', value: '78% N₂, 21% O₂, 1% Ar', sub: 'Protective ozone layer & magnetosphere' }
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
    moons: [
      { name: 'Phobos', r: 2.0, size: 0.22, speed: 1.6, color: '#d4c4b5', glow: 'rgba(212,196,181,0.6)' },
      { name: 'Deimos', r: 2.8, size: 0.18, speed: 3.2, color: '#b8aba0', glow: 'rgba(184,171,160,0.5)' }
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'High-Jump Superhero World!',
      jump: 'You jump 2.6× higher than on Earth! You could leap right over a parked car with a single bounce.',
      fact: 'Mars has robot rovers like Curiosity and Perseverance rolling across red sand dunes right now.'
    },
    stats: [
      { label: 'Distance from Sun', value: '227.9M km', sub: '1.524 AU' },
      { label: 'Orbital Period', value: '686.98 Earth days', sub: '1.881 Earth years' },
      { label: 'Day Length', value: '24h 37m 22s', sub: '1 Sol (~1.027 Earth days)' },
      { label: 'Equatorial Radius', value: '3,389.5 km', sub: '0.532 × Earth' },
      { label: 'Mass', value: '6.42 × 10²³ kg', sub: '0.107 × Earth' },
      { label: 'Surface Temperature', value: '−140°C to 20°C', sub: 'Mean: −63°C — over 3× colder than kitchen freezer ice' },
      { label: 'Moons & Rings', value: '2 Moons · 0 Rings', sub: 'The two moons are Phobos and Deimos' },
      { label: 'Atmosphere', value: '95.3% CO₂, 2.6% N₂', sub: 'Thin atmosphere (~0.006 bar)' }
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
    moons: [
      { name: 'Io', r: 4.6, size: 0.32, speed: 1.8, color: '#fcd34d', glow: 'rgba(252,211,77,0.7)' },
      { name: 'Europa', r: 5.6, size: 0.28, speed: 2.6, color: '#e0f2fe', glow: 'rgba(224,242,254,0.7)' },
      { name: 'Ganymede', r: 6.7, size: 0.40, speed: 3.8, color: '#d1d5db', glow: 'rgba(209,213,219,0.7)' },
      { name: 'Callisto', r: 7.8, size: 0.36, speed: 5.2, color: '#9ca3af', glow: 'rgba(156,163,175,0.6)' }
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'King of the Heavyweights!',
      jump: 'Your jumps are cut in half! Running here feels like wearing iron boots while wading through peanut butter.',
      fact: 'Jupiter is so huge that 1,300 Earths fit inside it, and its Great Red Spot is a hurricane bigger than Earth!'
    },
    stats: [
      { label: 'Distance from Sun', value: '778.6M km', sub: '5.204 AU' },
      { label: 'Orbital Period', value: '11.86 Earth years', sub: '4,332.6 Earth days' },
      { label: 'Day Length', value: '9h 55m 30s', sub: 'Fastest planetary rotation' },
      { label: 'Equatorial Radius', value: '69,911 km', sub: '10.97 × Earth' },
      { label: 'Mass', value: '1.898 × 10²⁷ kg', sub: '317.8 × Earth (2.5× all other planets)' },
      { label: 'Cloud-Top Temperature', value: '−110°C', sub: 'Cloud tops −110°C; deep core is 240× hotter than boiling water (~24,000°C)' },
      { label: 'Moons & Rings', value: '95 Moons · 4 Rings', sub: 'The major moons are Io, Europa, Ganymede, and Callisto' },
      { label: 'Atmosphere', value: '89.8% H₂, 10.2% He', sub: 'Trace methane, ammonia, water vapor' }
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
    moons: [
      { name: 'Mimas', r: 6.2, size: 0.22, speed: 2.2, color: '#e5e7eb', glow: 'rgba(229,231,235,0.6)' },
      { name: 'Enceladus', r: 7.2, size: 0.26, speed: 3.2, color: '#f8fafc', glow: 'rgba(248,250,252,0.8)' },
      { name: 'Titan', r: 8.5, size: 0.44, speed: 5.0, color: '#fbbf24', glow: 'rgba(251,191,36,0.8)' }
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Great Cosmic Bath Toy!',
      jump: 'Your weight and jumps feel almost like Earth, but there is no solid ground—just fluffy gas clouds and icy rings.',
      fact: 'Saturn is so light and airy that if you had a bathtub big enough, the whole planet would float like a rubber ducky!'
    },
    stats: [
      { label: 'Distance from Sun', value: '1.434B km', sub: '9.582 AU' },
      { label: 'Orbital Period', value: '29.45 Earth years', sub: '10,759.2 Earth days' },
      { label: 'Day Length', value: '10h 33m 38s', sub: 'Differential rapid rotation' },
      { label: 'Equatorial Radius', value: '58,232 km', sub: '9.14 × Earth' },
      { label: 'Mass', value: '5.683 × 10²⁶ kg', sub: '95.2 × Earth (Density: 0.687 g/cm³)' },
      { label: 'Cloud-Top Temperature', value: '−140°C', sub: 'Upper clouds −140°C (7× colder than a freezer); interior is 115× boiling water' },
      { label: 'Moons & Rings', value: '146 Moons · 7 Main Rings', sub: 'The major moons are Titan, Enceladus, and Mimas' },
      { label: 'Atmosphere', value: '96.3% H₂, 3.25% He', sub: 'Trace methane, ammonia, ethane' }
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
    moons: [
      { name: 'Miranda', r: 3.0, size: 0.22, speed: 2.0, color: '#cbd5e1', glow: 'rgba(203,213,225,0.6)' },
      { name: 'Ariel', r: 3.9, size: 0.28, speed: 3.0, color: '#e2e8f0', glow: 'rgba(226,232,240,0.6)' },
      { name: 'Titania', r: 4.8, size: 0.35, speed: 4.2, color: '#f1f5f9', glow: 'rgba(241,245,249,0.7)' }
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Sideways Somersault World!',
      jump: 'You jump 12% higher with extra bounce in your step, floating softly through frozen cyan clouds.',
      fact: 'Uranus rolls on its side like a bowling ball around the Sun, and it is the coldest planet at −224°C!'
    },
    stats: [
      { label: 'Distance from Sun', value: '2.871B km', sub: '19.191 AU' },
      { label: 'Orbital Period', value: '84.02 Earth years', sub: '30,685.4 Earth days' },
      { label: 'Day Length', value: '17h 14m 24s', sub: '97.77° axial tilt (rolls on side)' },
      { label: 'Equatorial Radius', value: '25,362 km', sub: '3.98 × Earth' },
      { label: 'Mass', value: '8.681 × 10²⁵ kg', sub: '14.54 × Earth' },
      { label: 'Lowest Temperature', value: '−224°C', sub: 'Lowest −224°C — 11× colder than a freezer, coldest atmosphere in solar system' },
      { label: 'Moons & Rings', value: '28 Moons · 13 Rings', sub: 'The major moons are Titania, Oberon, Umbriel, Ariel, and Miranda' },
      { label: 'Atmosphere', value: '82.5% H₂, 15.2% He, 2.3% CH₄', sub: 'Methane absorbs red light yielding cyan hue' }
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
    moons: [
      { name: 'Proteus', r: 3.0, size: 0.22, speed: 2.2, color: '#94a3b8', glow: 'rgba(148,163,184,0.6)' },
      { name: 'Triton', r: 4.1, size: 0.35, speed: 3.6, color: '#bae6fd', glow: 'rgba(186,230,253,0.7)', isRetrograde: true }
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Supersonic Storm Giant!',
      jump: 'You feel a tiny bit heavier than Earth, like walking against the wind wearing a thick winter coat.',
      fact: 'Neptune has the wildest winds in the solar system—howling past at 1,200 mph, faster than a supersonic jet!'
    },
    stats: [
      { label: 'Distance from Sun', value: '4.495B km', sub: '30.070 AU' },
      { label: 'Orbital Period', value: '164.79 Earth years', sub: '60,189.0 Earth days' },
      { label: 'Day Length', value: '16h 06m 36s', sub: 'Differential rotation' },
      { label: 'Equatorial Radius', value: '24,622 km', sub: '3.86 × Earth' },
      { label: 'Mass', value: '1.024 × 10²⁶ kg', sub: '17.15 × Earth' },
      { label: 'Cloud-Top Temperature', value: '−201°C', sub: 'Mean −201°C — 10× colder than a freezer, freezes nitrogen gas' },
      { label: 'Moons & Rings', value: '16 Moons · 5 Rings', sub: 'The major moons are Triton, Proteus, and Nereid' },
      { label: 'Atmosphere', value: '80.0% H₂, 19.0% He, 1.5% CH₄', sub: 'Vivid azure blue with Great Dark Spot' }
    ]
  }
];
