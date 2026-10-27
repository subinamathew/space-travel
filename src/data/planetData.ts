export interface MoonSpec {
  name: string;
  distance: number; // relative orbit distance
  size: number;
  speed: number;
  color: string;
  isRetrograde?: boolean;
}

export interface KidsFact {
  title: string;
  content: string;
  icon?: string;
}

export interface PlanetInfo {
  slug: string;
  name: string;
  symbol: string;
  greeting: string;
  fact: string;
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  image: string;
  orbitR: number; // Relative radius in orrery
  auDistance: number; // Astronomical Units
  sizeRatio: number; // Relative display size
  periodYears: number; // Earth years for 1 orbit
  initialPhase: number; // 0..1
  gravityRatio: number; // vs Earth (1.0)
  inclinationDeg: number;
  eccentricity: number;
  temperature: string;
  dayLength: string;
  atmosphere: string;
  moonsCount: number;
  moons: MoonSpec[];
  scienceLoreTopic: string;
  scienceLoreDesc: string;
  kidsFacts: KidsFact[];
}

export const SolarSystemRepository = {
  sun: {
    slug: 'sun',
    name: 'The Sun (Sol)',
    symbol: '☀️',
    greeting: 'Hello, Golden Star!',
    fact: 'The yellow dwarf star at the heart of our solar system. It accounts for 99.86% of all mass in the solar system, generating light and life through core nuclear fusion.',
    primaryColor: '#FFF5AA',
    accentColor: '#FF8800',
    glowColor: '#FFAA00',
    image: '/images/sun.png',
    orbitR: 0,
    auDistance: 0,
    sizeRatio: 3.6,
    periodYears: 1.0,
    initialPhase: 0,
    gravityRatio: 27.9,
    inclinationDeg: 0,
    eccentricity: 0,
    temperature: '5,500°C (Surface) • 15M°C (Core)',
    dayLength: '27 Earth days',
    atmosphere: '73% Hydrogen, 25% Helium',
    moonsCount: 8,
    moons: [],
    scienceLoreTopic: 'The Coronal Heating Mystery',
    scienceLoreDesc: 'The visible surface of the Sun sits at ~5,500°C, yet its outer corona inexplicably surges to 1,000,000°C to 3,000,000°C! Scientists hypothesize magnetic nanoflares and Alfvén waves constantly pump energy into the atmosphere.',
    kidsFacts: [
      {
        title: 'Giant Fusion Engine',
        content: 'The Sun burns 600 million tons of hydrogen every second, turning it into light that takes 8 minutes to reach Earth!',
        icon: '☀️'
      },
      {
        title: 'Mega Heavyweight',
        content: 'Over 1.3 million Earths could fit inside the Sun! If you could stand on it, you would weigh almost 28 times more than on Earth.',
        icon: '⚖️'
      }
    ]
  } as PlanetInfo,

  luna: {
    slug: 'luna',
    name: 'Luna (The Moon)',
    symbol: '🌙',
    greeting: 'Hello, Silver Companion!',
    fact: "Earth's only natural satellite. Tidally locked in synchronous rotation, Luna controls Earth's ocean tides and is the only other world humans have walked upon.",
    primaryColor: '#E2E8F0',
    accentColor: '#64748B',
    glowColor: '#CBD5E1',
    image: '/images/luna.png',
    orbitR: 17.5,
    auDistance: 1.0,
    sizeRatio: 1.1,
    periodYears: 1.0,
    initialPhase: 0.70,
    gravityRatio: 0.166,
    inclinationDeg: 5.14,
    eccentricity: 0.0549,
    temperature: '-130°C to +120°C',
    dayLength: '29.5 Earth days',
    atmosphere: 'Virtually none (Exosphere)',
    moonsCount: 0,
    moons: [],
    scienceLoreTopic: 'Synchronous Tidal Locking',
    scienceLoreDesc: 'Luna rotates on its axis at the exact same rate it orbits Earth, meaning the exact same face always points toward our planet.',
    kidsFacts: [
      {
        title: 'Super Bouncy Jumps!',
        content: "Because the Moon's gravity is only 1/6th of Earth's, you can jump 6 times higher! Apollo astronauts bounced across the craters.",
        icon: '🦘'
      },
      {
        title: 'Footprints Forever',
        content: "With no wind, rain, or atmosphere, astronauts' footprints on the Moon could remain undisturbed for millions of years.",
        icon: '👣'
      }
    ]
  } as PlanetInfo,

  planets: [
    {
      slug: 'mercury',
      name: 'Mercury',
      symbol: '☿️',
      greeting: 'Hello, Scorched World!',
      fact: 'The smallest planet — a day lasts longer than a year, with temperatures ranging from −180°C to 430°C.',
      primaryColor: '#B8A99A',
      accentColor: '#5C4A3D',
      glowColor: '#D4A574',
      image: '/images/mercury.png',
      orbitR: 7.5,
      auDistance: 0.387,
      sizeRatio: 1.0,
      periodYears: 0.240846,
      initialPhase: 0.15,
      gravityRatio: 0.38,
      inclinationDeg: 7.0,
      eccentricity: 0.2056,
      temperature: '-180°C to 430°C',
      dayLength: '176 Earth days',
      atmosphere: 'Trace oxygen, sodium, hydrogen',
      moonsCount: 0,
      moons: [],
      scienceLoreTopic: '3:2 Spin-Orbit Resonance & Polar Ice',
      scienceLoreDesc: 'Mercury spins exactly three times on its axis for every two orbits around the Sun. Permanently shadowed craters at its poles harbor billions of tons of water ice shielded from blistering 430°C sunlight.',
      kidsFacts: [
        {
          title: 'Speed Demon',
          content: 'Mercury zooms around the Sun at 47 km/s (105,000 mph) — faster than any other planet!',
          icon: '🏎️'
        },
        {
          title: 'Extreme Thermometer',
          content: "By day it's hot enough to melt lead, but at night it plunges to deep freeze because there's no atmosphere to trap heat.",
          icon: '🌡️'
        }
      ]
    },
    {
      slug: 'venus',
      name: 'Venus',
      symbol: '♀️',
      greeting: 'Hello, Inferno Twin!',
      fact: 'A runaway greenhouse makes Venus the hottest planet at 465°C — hotter than Mercury despite being farther from the Sun.',
      primaryColor: '#F5C842',
      accentColor: '#8B5E00',
      glowColor: '#F5C842',
      image: '/images/venus.png',
      orbitR: 11.5,
      auDistance: 0.723,
      sizeRatio: 1.35,
      periodYears: 0.615197,
      initialPhase: 0.45,
      gravityRatio: 0.91,
      inclinationDeg: 3.39,
      eccentricity: 0.0068,
      temperature: '465°C (Uniform)',
      dayLength: '243 Earth days',
      atmosphere: '96.5% Carbon dioxide, 3.5% Nitrogen',
      moonsCount: 0,
      moons: [],
      scienceLoreTopic: 'Runaway Greenhouse & Backward Spin',
      scienceLoreDesc: 'With an atmosphere generating 92 bars of surface pressure, Venus suffers an intense runaway greenhouse effect. Venus also rotates backwards (retrograde)—the Sun rises in the west!',
      kidsFacts: [
        {
          title: 'Raining Acid',
          content: "Clouds on Venus are made of sulfuric acid! But it's so hot at the surface that the acid rain evaporates before it even lands.",
          icon: '🌧️'
        },
        {
          title: "Earth's Evil Twin",
          content: 'Venus is almost the same size and mass as Earth, but its crushing air pressure feels like being 900 meters deep under the ocean.',
          icon: '🌋'
        }
      ]
    },
    {
      slug: 'earth',
      name: 'Earth',
      symbol: '🌍',
      greeting: 'Hello, Home World!',
      fact: 'The only known world teeming with life. Our pale blue dot is 71% ocean, wrapped in a protective, life-giving atmosphere.',
      primaryColor: '#4A90D9',
      accentColor: '#1A3A6A',
      glowColor: '#4A90D9',
      image: '/images/earth.png',
      orbitR: 16.0,
      auDistance: 1.000,
      sizeRatio: 1.45,
      periodYears: 1.0,
      initialPhase: 0.70,
      gravityRatio: 1.0,
      inclinationDeg: 0.0,
      eccentricity: 0.0167,
      temperature: '-88°C to 58°C (Avg 15°C)',
      dayLength: '24 hours',
      atmosphere: '78% Nitrogen, 21% Oxygen, 1% Argon',
      moonsCount: 1,
      moons: [
        { name: 'Moon', distance: 2.2, size: 0.32, speed: 2.8, color: '#E2E8F0' }
      ],
      scienceLoreTopic: 'The Protective Geodynamo',
      scienceLoreDesc: "Earth's molten iron outer core generates a powerful magnetosphere that deflects dangerous ionizing solar wind. Combined with plate tectonics, Earth maintains stable liquid surface oceans.",
      kidsFacts: [
        {
          title: 'Cosmic Shield',
          content: 'Our atmosphere burns up thousands of meteors every day and protects us from harmful cosmic rays!',
          icon: '🛡️'
        },
        {
          title: 'Living Oasis',
          content: 'Earth is the Goldilocks planet — not too hot, not too cold, but just right for liquid water and millions of species of living creatures.',
          icon: '🌱'
        }
      ]
    },
    {
      slug: 'mars',
      name: 'Mars',
      symbol: '♂️',
      greeting: 'Hello, Red Planet!',
      fact: 'Home to Olympus Mons — the tallest volcano in the solar system at 21 km high. The rusty colour is iron-oxide dust.',
      primaryColor: '#C1440E',
      accentColor: '#5C1A00',
      glowColor: '#E05A22',
      image: '/images/mars.png',
      orbitR: 21.0,
      auDistance: 1.524,
      sizeRatio: 1.2,
      periodYears: 1.880848,
      initialPhase: 0.30,
      gravityRatio: 0.38,
      inclinationDeg: 1.85,
      eccentricity: 0.0934,
      temperature: '-125°C to 20°C (Avg -65°C)',
      dayLength: '24 hours 37 minutes',
      atmosphere: '95% Carbon dioxide, 2.6% Nitrogen',
      moonsCount: 2,
      moons: [
        { name: 'Phobos', distance: 1.8, size: 0.22, speed: 1.6, color: '#D4C4B5' },
        { name: 'Deimos', distance: 2.5, size: 0.18, speed: 3.2, color: '#B8ABA0' }
      ],
      scienceLoreTopic: 'Colossal Geology: Olympus Mons',
      scienceLoreDesc: 'Mars hosts Olympus Mons, a shield volcano 21.9 km high — nearly three times Mt. Everest! Its canyon system, Valles Marineris, stretches 4,000 km across the Martian equator.',
      kidsFacts: [
        {
          title: 'Rust World',
          content: 'Mars is orange-red because its surface rocks are literally covered in rusted iron dust!',
          icon: '🪨'
        },
        {
          title: 'Blue Sunsets',
          content: 'Because of fine dust in the thin atmosphere, sunsets on Mars appear ghostly blue instead of golden orange!',
          icon: '🌅'
        }
      ]
    },
    {
      slug: 'jupiter',
      name: 'Jupiter',
      symbol: '♃',
      greeting: 'Hello, Giant King!',
      fact: 'So massive all other planets could fit inside it. Its Great Red Spot storm has raged for over 350 years.',
      primaryColor: '#C89060',
      accentColor: '#5C3010',
      glowColor: '#C89060',
      image: '/images/jupiter.png',
      orbitR: 27.5,
      auDistance: 5.204,
      sizeRatio: 2.4,
      periodYears: 11.8626,
      initialPhase: 0.85,
      gravityRatio: 2.53,
      inclinationDeg: 1.30,
      eccentricity: 0.0484,
      temperature: '-110°C (Cloud tops)',
      dayLength: '9 hours 56 minutes',
      atmosphere: '90% Hydrogen, 10% Helium',
      moonsCount: 95,
      moons: [
        { name: 'Io', distance: 3.2, size: 0.30, speed: 1.8, color: '#FCD34D' },
        { name: 'Europa', distance: 4.1, size: 0.26, speed: 2.6, color: '#E0F2FE' },
        { name: 'Ganymede', distance: 5.0, size: 0.38, speed: 3.8, color: '#D1D5DB' },
        { name: 'Callisto', distance: 5.9, size: 0.34, speed: 5.2, color: '#9CA3AF' }
      ],
      scienceLoreTopic: 'Metallic Hydrogen & Anticyclones',
      scienceLoreDesc: 'Deep inside Jupiter, pressures exceed 2 million atmospheres, forcing hydrogen into a shimmering liquid metallic conductor that powers an immense magnetosphere.',
      kidsFacts: [
        {
          title: 'Super Fast Spin',
          content: 'Despite being a humongous gas giant, Jupiter has the shortest day in the solar system: less than 10 hours!',
          icon: '⏱️'
        },
        {
          title: 'Ocean Moon Europa',
          content: "Its moon Europa has a smooth icy crust covering a warm, liquid saltwater ocean with more water than all of Earth's oceans combined!",
          icon: '🌊'
        }
      ]
    },
    {
      slug: 'saturn',
      name: 'Saturn',
      symbol: '🪐',
      greeting: 'Hello, Ringed Beauty!',
      fact: 'Saturn’s iconic rings span 282,000 km. It’s so low-density it would float on water!',
      primaryColor: '#E0C080',
      accentColor: '#7A5A20',
      glowColor: '#E0C080',
      image: '/images/saturn.png',
      orbitR: 34.0,
      auDistance: 9.582,
      sizeRatio: 2.1,
      periodYears: 29.4475,
      initialPhase: 0.40,
      gravityRatio: 1.07,
      inclinationDeg: 2.49,
      eccentricity: 0.0565,
      temperature: '-140°C (Cloud tops)',
      dayLength: '10 hours 33 minutes',
      atmosphere: '96% Hydrogen, 3% Helium',
      moonsCount: 146,
      moons: [
        { name: 'Mimas', distance: 3.8, size: 0.22, speed: 2.2, color: '#E5E7EB' },
        { name: 'Enceladus', distance: 4.7, size: 0.26, speed: 3.2, color: '#F8FAFC' },
        { name: 'Titan', distance: 5.8, size: 0.42, speed: 5.0, color: '#FBBF24' }
      ],
      scienceLoreTopic: 'Floating Density & Hexagonal Jet Stream',
      scienceLoreDesc: "Saturn's density is only 0.687 g/cm³ — less than water! Its magnificent rings average just 10 meters thick, while a bizarre geometric hexagon storm rotates at its north pole.",
      kidsFacts: [
        {
          title: 'Bathtub Planet',
          content: 'If you could build a bathtub big enough to hold Saturn, the entire planet would float like a giant rubber duck!',
          icon: '🛁'
        },
        {
          title: "Titan's Methane Lakes",
          content: "Saturn's giant moon Titan has rain, rivers, and lakes made of liquid methane and an atmosphere thicker than Earth's.",
          icon: '⛵'
        }
      ]
    },
    {
      slug: 'uranus',
      name: 'Uranus',
      symbol: '♅',
      greeting: 'Hello, Ice Giant!',
      fact: 'Uranus has a 98° axial tilt — it rolls around the Sun on its side. Its rich blue-cyan hue comes from methane gas.',
      primaryColor: '#4CC9F0',
      accentColor: '#1D4ED8',
      glowColor: '#38BDF8',
      image: '/images/uranus.png',
      orbitR: 40.5,
      auDistance: 19.201,
      sizeRatio: 1.75,
      periodYears: 84.0168,
      initialPhase: 0.20,
      gravityRatio: 0.89,
      inclinationDeg: 0.77,
      eccentricity: 0.0472,
      temperature: '-224°C (Coldest atmosphere)',
      dayLength: '17 hours 14 minutes',
      atmosphere: '83% Hydrogen, 15% Helium, 2% Methane',
      moonsCount: 28,
      moons: [
        { name: 'Miranda', distance: 2.6, size: 0.20, speed: 2.0, color: '#CBD5E1' },
        { name: 'Ariel', distance: 3.3, size: 0.25, speed: 3.0, color: '#E2E8F0' },
        { name: 'Titania', distance: 4.1, size: 0.32, speed: 4.2, color: '#F1F5F9' }
      ],
      scienceLoreTopic: 'The Sideways Rolling World',
      scienceLoreDesc: 'With an axial tilt of 97.77° from a prehistoric cosmic collision, Uranus rolls around the Sun like a ball. Each pole experiences 42 years of daylight followed by 42 years of night.',
      kidsFacts: [
        {
          title: 'Diamond Rain',
          content: 'Extreme pressures deep within the ice giant may compress carbon atoms into sparkling diamonds that sink toward the core!',
          icon: '💎'
        },
        {
          title: 'Ice Box of the Solar System',
          content: 'Even though Neptune is further away, Uranus is actually the coldest planet, plunging down to −224°C.',
          icon: '❄️'
        }
      ]
    },
    {
      slug: 'neptune',
      name: 'Neptune',
      symbol: '♆',
      greeting: 'Hello, Windy World!',
      fact: 'The windiest planet — storms reach 2,100 km/h. One orbit of the Sun takes 165 Earth years.',
      primaryColor: '#3B6FCC',
      accentColor: '#0A1A5C',
      glowColor: '#5588FF',
      image: '/images/neptune.png',
      orbitR: 46.0,
      auDistance: 30.047,
      sizeRatio: 1.7,
      periodYears: 164.7913,
      initialPhase: 0.60,
      gravityRatio: 1.14,
      inclinationDeg: 1.77,
      eccentricity: 0.0086,
      temperature: '-214°C (Cloud tops)',
      dayLength: '16 hours 6 minutes',
      atmosphere: '80% Hydrogen, 19% Helium, 1% Methane',
      moonsCount: 16,
      moons: [
        { name: 'Proteus', distance: 2.7, size: 0.22, speed: 2.2, color: '#94A3B8' },
        { name: 'Triton', distance: 3.7, size: 0.32, speed: 3.6, color: '#BAE6FD', isRetrograde: true }
      ],
      scienceLoreTopic: 'Supersonic Winds & Cryovolcanic Triton',
      scienceLoreDesc: 'Neptune experiences the most violent supersonic winds in the solar system, topping 2,100 km/h. Its captured moon Triton features cryovolcanoes spewing liquid nitrogen.',
      kidsFacts: [
        {
          title: 'Supersonic Roar',
          content: "Neptune's winds whip around three times faster than Earth's strongest hurricanes, breaking the speed of sound!",
          icon: '🌪️'
        },
        {
          title: 'Deep Blue Mystery',
          content: 'Its intense azure hue is created by atmospheric methane absorbing red light and reflecting radiant cobalt blue back into space.',
          icon: '🔷'
        }
      ]
    }
  ] as PlanetInfo[],

  get earth(): PlanetInfo {
    return this.planets.find(p => p.slug === 'earth')!;
  },

  getAllBodies(): PlanetInfo[] {
    return [this.sun, this.luna, ...this.planets];
  },

  findBySlug(slug: string): PlanetInfo | undefined {
    if (slug === 'sun') return this.sun;
    if (slug === 'luna' || slug === 'moon') return this.luna;
    return this.planets.find(p => p.slug.toLowerCase() === slug.toLowerCase());
  }
};
