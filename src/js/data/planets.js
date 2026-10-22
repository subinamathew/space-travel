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
    { label: 'Spectral Class', value: 'G2V (Yellow Dwarf)', sub: 'Main-sequence star; ~4.6B years old', kids: 'Even though people call the Sun a "yellow dwarf", it is not small at all! G2V is a special star code that means it is a bright, yellow powerhouse star in the best years of its life.' },
    { label: 'Surface Temperature', value: '5,500°C (5,778 K)', sub: 'Surface is 55 times boiling water; core is 150,000 times hotter than boiling water (~15M°C)', kids: 'The surface of the Sun is 5,500°C—hotter than 55 times your hot bath water! Deep inside its core, it is 150,000 times hotter than boiling water (~15 million °C)!' },
    { label: 'Equatorial Diameter', value: '1,392,700 km', sub: '109.2 × Earth diameter', kids: 'The Sun is enormous! If the Sun were a huge hollow beach ball, you could fit more than one million Earths inside it like tiny glass marbles.' },
    { label: 'Mass', value: '1.989 × 10³⁰ kg', sub: '333,000 × Earth (99.86% system mass)', kids: 'The Sun holds 99.86% of all the matter in our whole solar system! Percent (%) means parts out of 100—if all 8 planets, moons, asteroids, and comets were 10,000 building blocks, the Sun alone would be 9,986 of them, leaving just 14 tiny blocks for everything else combined!' },
    { label: 'Galactic Velocity', value: '220 km/s', sub: 'Milky Way orbit period: ~230M years', kids: 'Our Sun zooms around the Milky Way galaxy at 220 kilometers every single second! That is over 700 times faster than a speeding bullet train.' },
    { label: 'Distance to Earth', value: '149,600,000 km', sub: '1.0 AU (Light travel: 8m 20s)', kids: 'The Sun is 150 million kilometers away. Light from the Sun is the fastest traveler in the universe, but it still takes 8 minutes and 20 seconds to reach your eyes on Earth!' },
    { label: 'Rotation Period', value: '25.05 days (Equator)', sub: '34.4 days at poles (differential rotation)', kids: 'The Sun is a giant spinning ball of superhot gas and plasma. Because it is not solid rock, its middle equator spins once in 25 days, but its poles take 34 days!' },
    { label: 'Composition', value: '73.4% H₂, 25.0% He', sub: '1.6% heavier elements (C, N, O, Fe)', kids: 'The percent sign (%) means parts out of 100! If you took 100 scoops of the Sun:\n• H₂ (73 scoops) is Hydrogen gas: the lightest gas in the universe! It catches fire easily and acts like fuel for the Sun’s gigantic nuclear furnace.\n• He (25 scoops) is Helium gas: the second-lightest gas—the very same floaty gas that makes party balloons fly up to the ceiling!\nTogether, H₂ and He generate all the sunshine and warmth keeping Earth alive.' }
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
    eccentricity3d: 0.24,
    perihelionDeg: 77,
    moons: [],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'Moon-Boots Playground!',
      jump: 'You can leap nearly 3× higher than on Earth! One small hop would launch you clean over your bed.',
      fact: 'A year on Mercury is super fast (88 days), but one single daytime lasts longer than a whole year!'
    },
    stats: [
    { label: 'Distance from Sun', value: '57.9M km', sub: '0.387 AU', kids: 'Mercury is the closest planet to the Sun! If you stood on Mercury, the Sun would look 3 times bigger in the sky than it does from Earth.' },
    { label: 'Orbital Period', value: '87.97 Earth days', sub: 'Fastest orbit in solar system', kids: 'Mercury is the fastest runner in space! It zooms around the Sun in just 88 days, so you would have a birthday party every 3 months on Mercury!' },
    { label: 'Day Length', value: '175.9 Earth days', sub: 'Rotation: 58.6 days', kids: 'Mercury spins like a sleepy top. One daytime on Mercury takes 176 Earth days—that is longer than a whole Mercury year! You would have to wait 6 months between breakfast and bedtime.' },
    { label: 'Equatorial Radius', value: '2,439.7 km', sub: '0.383 × Earth', kids: 'Mercury is the baby planet of our solar system—only a little bigger than our Moon. It is covered in craters from space meteorites, looking like a giant golf ball.' },
    { label: 'Mass', value: '3.30 × 10²³ kg', sub: '0.055 × Earth', kids: 'Even though Mercury is small, it is super heavy and dense because it has a huge ball of solid iron metal inside that fills up most of the planet!' },
    { label: 'Surface Temperature', value: '−180°C to 430°C', sub: 'Day is 4 times boiling water; night is 9 times colder than a freezer', kids: 'Mercury has no blanket of air! During the day, it is 4 times hotter than boiling water. But at night, it plunges to −180°C, which is 9 times colder than a kitchen freezer!' },
    { label: 'Moons & Rings', value: '0 Moons · 0 Rings', sub: 'Mercury has no moons or natural satellites', kids: 'Mercury has 0 moons and 0 rings! It travels so close to the Sun that the Sun’s gigantic gravity would snatch away any moon that tried to circle it.' },
    { label: 'Atmosphere', value: 'Exosphere', sub: 'Trace Oxygen, Sodium, Hydrogen', kids: 'What is an Exosphere? On Earth, the exosphere is the outermost layer of the atmosphere (hundreds of kilometers high!), where air thins out into the vacuum of space and satellites orbit.\nOn Mercury, there is no lower blanket of air or sky at all—its exosphere starts right at the rocky ground! The Sun’s solar wind blasts the rocks, kicking up a tiny whisper of loose atoms (oxygen, sodium, and hydrogen) that drift into space without ever touching each other.' }
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
    eccentricity3d: 0.08,
    perihelionDeg: 131,
    moons: [],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Solar System’s Oven!',
      jump: 'You jump almost identical to Earth, but the air is yellow, crushing, and hot enough to melt a tin toy car!',
      fact: 'Venus spins backwards compared to Earth, so the Sun rises in the west and sets in the east.'
    },
    stats: [
    { label: 'Distance from Sun', value: '108.2M km', sub: '0.723 AU', kids: 'Venus is our closest neighbor planet, orbiting between Mercury and Earth. It reflects so much sunlight that it shines as the brightest object in our night sky after the Moon!' },
    { label: 'Orbital Period', value: '224.7 Earth days', sub: '0.615 Earth years', kids: 'Venus journeys around the Sun in about 225 Earth days. Because it is closer to the Sun than Earth is, its year is about 4 months shorter than ours.' },
    { label: 'Day Length', value: '243.0 Earth days', sub: 'Retrograde rotation (spins backward)', kids: 'Venus spins backwards! While Earth and most planets spin counter-clockwise, Venus spins clockwise (anticlockwise from south). That means on Venus, the Sun rises in the west and sets in the east! Plus, it spins so slowly that one day on Venus is longer than its whole year!' },
    { label: 'Equatorial Radius', value: '6,051.8 km', sub: '0.949 × Earth (Twin)', kids: 'Venus is almost the exact same size as Earth—about 95% of Earth\'s width! Scientists call Venus Earth’s twin sister, but she is an oven-hot, stormy twin.' },
    { label: 'Mass', value: '4.87 × 10²⁴ kg', sub: '0.815 × Earth', kids: 'Venus is almost as heavy as Earth. If you stood on Venus, gravity would feel almost identical to home, pulling you down with 91% of your normal weight.' },
    { label: 'Surface Temperature', value: '465°C (Average)', sub: 'Nearly 5 times hotter than boiling water — melts lead!', kids: 'Venus is the hottest planet in the entire solar system at 465°C—nearly 5 times hotter than boiling water! Thick yellow clouds trap heat like a giant greenhouse, hot enough to melt metal like lead into puddles.' },
    { label: 'Moons & Rings', value: '0 Moons · 0 Rings', sub: 'Venus has no moons or natural satellites', kids: 'Venus has 0 moons and 0 rings! Just like Mercury, any moon trying to orbit Venus would be pulled apart or stolen by the Sun’s powerful gravity.' },
    { label: 'Atmosphere', value: '96.5% CO₂, 3.5% N₂', sub: 'Sulfuric acid clouds; 92 bar pressure', kids: 'Percent (%) means parts out of 100 scoops of air:\n• CO₂ (96.5 scoops) is Carbon Dioxide: the bubbly gas in soda pop that we breathe out. On Venus, it traps heat like a locked greenhouse oven!\n• N₂ (3.5 scoops) is Nitrogen: the same calm gas in Earth’s sky.\nThere is zero O₂ (oxygen) to breathe, and yellow clouds rain real battery acid!' }
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
    eccentricity3d: 0.10,
    perihelionDeg: 103,
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
    { label: 'Distance from Sun', value: '149.6M km', sub: '1.000 AU (Astronomical Unit)', kids: 'Earth is in the cosmic Goldilocks Zone—just the right distance from the Sun so water stays liquid instead of boiling away or freezing solid. This distance is 1 AU (Astronomical Unit)!' },
    { label: 'Orbital Period', value: '365.25 days', sub: '1.000 Earth year (Base Reference)', kids: 'Earth takes 365 days and 6 hours to orbit the Sun. Those extra 6 hours add up every 4 years to give us a Leap Year with an extra day on February 29!' },
    { label: 'Day Length', value: '23h 56m 04s', sub: '24.0 hours solar day', kids: 'Earth spins around once every 24 hours, giving us daytime for learning and playing and nighttime for sleeping. We spin counter-clockwise, so the Sun rises in the east and sets in the west!' },
    { label: 'Equatorial Radius', value: '6,371.0 km', sub: 'Base unit: 1.000 R⊕', kids: 'Earth is the biggest of the four rocky planets! If you could dig a tunnel straight through the center from one side to the other, it would measure 12,742 kilometers.' },
    { label: 'Mass', value: '5.972 × 10²⁴ kg', sub: 'Base unit: 1.000 M⊕', kids: 'Earth weighs about 6 sextillion tons (that is a 6 followed by 24 zeros)! That mass gives us the perfect gravity to keep our oceans on the ground and air around us.' },
    { label: 'Surface Temperature', value: '−88°C to 58°C', sub: 'Mean: 15°C — comfortable room heat with liquid oceans', kids: 'Earth has a comfy average temperature of 15°C (room temperature)! Our atmosphere works like a cozy blanket keeping living creatures warm and happy.' },
    { label: 'Moons & Rings', value: '1 Moon · 0 Rings', sub: 'Earth\'s single natural moon is Luna (The Moon)', kids: 'Earth has one loyal moon named Luna! The Moon causes ocean tides to rise and fall twice a day, and lights up our night sky with its gentle silver glow.' },
    { label: 'Atmosphere', value: '78% N₂, 21% O₂, 1% Ar', sub: 'Protective ozone layer & magnetosphere', kids: 'What do those letters and percent numbers mean? Percent (%) means parts out of 100! Imagine a jar with 100 marbles of air:\n• N₂ (78 marbles) is Nitrogen: an invisible, quiet gas that fills most of our sky and helps plants grow green and strong.\n• O₂ (21 marbles) is Oxygen: the life gas that you, your family, puppies, and birds breathe in with every breath to live!\n• Ar (1 marble) is Argon: a shy, peaceful gas that drifts gently without bothering anyone.\nEarth’s atmosphere protects us in layers: the breathable air at the bottom, an ozone sunscreen shield in the middle, and the Exosphere at the very top (the outermost layer touching deep space where satellites orbit)!' }
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
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'High-Jump Superhero World!',
      jump: 'You jump 2.6× higher than on Earth! You could leap right over a parked car with a single bounce.',
      fact: 'Mars has robot rovers like Curiosity and Perseverance rolling across red sand dunes right now.'
    },
    stats: [
    { label: 'Distance from Sun', value: '227.9M km', sub: '1.524 AU', kids: 'Mars is 1.5 times farther from the Sun than Earth is. Because it is farther away from the Sun’s campfire, Mars is much colder than Earth.' },
    { label: 'Orbital Period', value: '686.98 Earth days', sub: '1.881 Earth years', kids: 'A Martian year lasts 687 Earth days—almost two Earth years! That means winter, spring, summer, and fall on Mars last twice as long as on Earth.' },
    { label: 'Day Length', value: '24h 37m 22s', sub: '1 Sol (~1.027 Earth days)', kids: 'A day on Mars is called a "Sol", and it lasts 24 hours and 37 minutes—almost the same as an Earth day! Robot rovers on Mars go to sleep when the Martian sun sets.' },
    { label: 'Equatorial Radius', value: '3,389.5 km', sub: '0.532 × Earth', kids: 'Mars is about half the size of Earth. But because Mars has no oceans, its dry land area is almost the same size as all of Earth’s continents put together!' },
    { label: 'Mass', value: '6.42 × 10²³ kg', sub: '0.107 × Earth', kids: 'Mars is only 10% as heavy as Earth. Lower weight means lower gravity: you would weigh only one-third of your Earth weight and can jump 2.6 times higher!' },
    { label: 'Surface Temperature', value: '−140°C to 20°C', sub: 'Mean: −63°C — over 3 times colder than kitchen freezer ice', kids: 'Mars is a freezing desert! Its average temperature is −63°C, which is over 3 times colder than kitchen freezer ice. At noon near the equator it can reach 20°C, but drops to −140°C at night.' },
    { label: 'Moons & Rings', value: '2 Moons · 0 Rings', sub: 'The two moons are Phobos and Deimos', kids: 'Mars has two tiny, lumpy moons named Phobos and Deimos! They look like flying space potatoes. Phobos zips around Mars so fast that it rises in the west and sets in the east twice every day.' },
    { label: 'Atmosphere', value: '95.3% CO₂, 2.6% N₂', sub: 'Thin atmosphere (~0.006 bar)', kids: 'Percent (%) means parts out of 100 scoops of thin Martian air:\n• CO₂ (95 scoops) is Carbon Dioxide: the fizzy gas we exhale.\n• N₂ (nearly 3 scoops) is Nitrogen.\nThere is almost no O₂ (oxygen) to breathe, and the air is 100 times thinner than on Earth—astronauts must always wear pressurized spacesuits with oxygen helmets!' }
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
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'King of the Heavyweights!',
      jump: 'Your jumps are cut in half! Running here feels like wearing iron boots while wading through peanut butter.',
      fact: 'Jupiter is so huge that 1,300 Earths fit inside it, and its Great Red Spot is a hurricane bigger than Earth!'
    },
    stats: [
    { label: 'Distance from Sun', value: '778.6M km', sub: '5.204 AU', kids: 'Jupiter is 5 times farther from the Sun than Earth! Out here in deep space, sunlight is 27 times dimmer and space is very cold.' },
    { label: 'Orbital Period', value: '11.86 Earth years', sub: '4,332.6 Earth days', kids: 'It takes Jupiter nearly 12 Earth years to circle the Sun once! A kid would finish elementary school before celebrating their first Jupiter birthday.' },
    { label: 'Day Length', value: '9h 55m 30s', sub: 'Fastest planetary rotation', kids: 'Jupiter is the fastest-spinning planet in the solar system! A whole Jupiter day lasts less than 10 hours. It spins so fast that its middle bulges out like a squished ball.' },
    { label: 'Equatorial Radius', value: '69,911 km', sub: '10.97 × Earth', kids: 'Jupiter is the King of Planets—11 times wider than Earth! It is so gigantic that over 1,300 Earth globes could easily fit inside it.' },
    { label: 'Mass', value: '1.898 × 10²⁷ kg', sub: '317.8 × Earth (2.5× all other planets)', kids: 'Jupiter is heavier than all other 7 planets put together combined, times 2.5! Its giant gravity acts like a space vacuum cleaner, pulling dangerous comets away from Earth.' },
    { label: 'Cloud-Top Temperature', value: '−110°C', sub: 'Cloud tops −110°C; deep core is 240 times hotter than boiling water (~24,000°C)', kids: 'Jupiter’s cloud tops are −110°C, but deep in its core it is 24,000°C—hotter than 240 times boiling water! It gives off more heat into space than it gets from the Sun.' },
    { label: 'Moons & Rings', value: '95 Moons · 4 Rings', sub: 'The major moons are Io, Europa, Ganymede, and Callisto', kids: 'Jupiter has 95 known moons! The four biggest are Ganymede (bigger than planet Mercury!), Europa (with a huge underground ocean of warm water!), Io (with 400 active volcanoes!), and Callisto.' },
    { label: 'Atmosphere', value: '89.8% H₂, 10.2% He', sub: 'Trace methane, ammonia, water vapor', kids: 'Percent (%) means parts out of 100 scoops of Jupiter’s swirling sky:\n• H₂ (90 scoops) is Hydrogen: the lightest gas in the universe, fuel for stars.\n• He (10 scoops) is Helium: floaty balloon gas!\nJupiter has no solid ground to stand on—just a giant swirling ball of gas with a Great Red Spot hurricane bigger than Earth!' }
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
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Great Cosmic Bath Toy!',
      jump: 'Your weight and jumps feel almost like Earth, but there is no solid ground—just fluffy gas clouds and icy rings.',
      fact: 'Saturn is so light and airy that if you had a bathtub big enough, the whole planet would float like a rubber ducky!'
    },
    stats: [
    { label: 'Distance from Sun', value: '1.434B km', sub: '9.582 AU', kids: 'Saturn is almost 10 times farther from the Sun than Earth is! It takes sunlight about 80 minutes to travel all the way out to Saturn’s golden clouds.' },
    { label: 'Orbital Period', value: '29.45 Earth years', sub: '10,759.2 Earth days', kids: 'Saturn takes 29.5 Earth years to orbit the Sun once. You would only see two or three Saturn years during your whole life on Earth!' },
    { label: 'Day Length', value: '10h 33m 38s', sub: 'Differential rapid rotation', kids: 'Even though Saturn is a giant, it spins around in just 10.5 hours! This rapid spin makes Saturn wider across its middle than from top to bottom.' },
    { label: 'Equatorial Radius', value: '58,232 km', sub: '9.14 × Earth', kids: 'Saturn is 9 times wider than Earth! Including its spectacular ring system, it spans 282,000 kilometers—almost the distance from Earth all the way to the Moon!' },
    { label: 'Mass', value: '5.683 × 10²⁶ kg', sub: '95.2 × Earth (Density: 0.687 g/cm³)', kids: 'Saturn is 95 times heavier than Earth, but it is the lightest planet for its size! It is less dense than water, so if you had a gigantic bathtub, Saturn would float like a rubber ducky!' },
    { label: 'Cloud-Top Temperature', value: '−140°C', sub: 'Upper clouds −140°C (7 times colder than a freezer); interior is 115 times boiling water', kids: 'Saturn’s upper clouds are −140°C (7 times colder than a freezer). But deep inside its core, it is crushed so hard that temperatures reach 11,500°C (115 times boiling water)!' },
    { label: 'Moons & Rings', value: '146 Moons · 7 Main Rings', sub: 'The major moons are Titan, Enceladus, and Mimas', kids: 'Saturn has 146 moons—the most in the solar system! Giant moon Titan has lakes of liquid methane. Its dazzling rings are made of billions of chunks of sparkling water ice, from tiny snowflakes to house-sized icebergs!' },
    { label: 'Atmosphere', value: '96.3% H₂, 3.25% He', sub: 'Trace methane, ammonia, ethane', kids: 'Percent (%) means parts out of 100 scoops of Saturn’s sky:\n• H₂ (96 scoops) is Hydrogen: super-light star fuel.\n• He (3 scoops) is Helium: party balloon gas!\nBecause these gases are so fluffy and light, Saturn is less dense than water and could float in a giant bathtub! Meanwhile, winds scream past at 1,800 km/h.' }
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
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Sideways Somersault World!',
      jump: 'You jump 12% higher with extra bounce in your step, floating softly through frozen cyan clouds.',
      fact: 'Uranus rolls on its side like a bowling ball around the Sun, and it is the coldest planet at −224°C!'
    },
    stats: [
    { label: 'Distance from Sun', value: '2.871B km', sub: '19.191 AU', kids: 'Uranus is 19 times farther from the Sun than Earth! It is so far away and faint that it was the first planet discovered using a telescope in 1781.' },
    { label: 'Orbital Period', value: '84.02 Earth years', sub: '30,685.4 Earth days', kids: 'It takes Uranus 84 Earth years to orbit the Sun once! Because its year is so long, each season (summer, fall, winter, spring) lasts 21 Earth years.' },
    { label: 'Day Length', value: '17h 14m 24s', sub: '97.77° axial tilt (rolls on side)', kids: 'Uranus has an extreme 98° tilt—it literally rolls on its side around the Sun like a bowling ball! Because it is tilted on its head, its spin is retrograde (anticlockwise/backwards). One pole gets 42 years of continuous sunshine, while the other pole gets 42 years of pitch-black winter!' },
    { label: 'Equatorial Radius', value: '25,362 km', sub: '3.98 × Earth', kids: 'Uranus is 4 times wider than Earth! You could line up four Earth globes side-by-side across its middle, and 63 Earths could fit inside it.' },
    { label: 'Mass', value: '8.681 × 10²⁵ kg', sub: '14.54 × Earth', kids: 'Uranus is an Ice Giant planet about 14.5 times heavier than Earth. Most of its inside is a thick slush of frozen water, ammonia, and methane ices around a rocky core.' },
    { label: 'Lowest Temperature', value: '−224°C', sub: 'Lowest −224°C — 11 times colder than a freezer, coldest atmosphere in solar system', kids: 'Uranus holds the record as the coldest planet in the whole solar system at −224°C! That is 11 times colder than a freezer. It has very little internal heat of its own.' },
    { label: 'Moons & Rings', value: '28 Moons · 13 Rings', sub: 'The major moons are Titania, Oberon, Umbriel, Ariel, and Miranda', kids: 'Uranus has 28 known moons, all named after magical characters from William Shakespeare’s plays (like Miranda and Titania)! It also has 13 dark, charcoal-colored rings.' },
    { label: 'Atmosphere', value: '82.5% H₂, 15.2% He, 2.3% CH₄', sub: 'Methane absorbs red light yielding cyan hue', kids: 'Percent (%) means parts out of 100 scoops of chilly atmosphere:\n• H₂ (82 scoops) is Hydrogen gas.\n• He (15 scoops) is Helium gas (party balloon gas).\n• CH₄ (over 2 scoops) is Methane gas: the same gas found in cow burps! Methane absorbs red sunlight and reflects brilliant cyan-blue light to our eyes.' }
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
    ],
    kidsNote: {
      badge: '🚀 NASA Kids Mission',
      title: 'The Supersonic Storm Giant!',
      jump: 'You feel a tiny bit heavier than Earth, like walking against the wind wearing a thick winter coat.',
      fact: 'Neptune has the wildest winds in the solar system—howling past at 1,200 mph, faster than a supersonic jet!'
    },
    stats: [
    { label: 'Distance from Sun', value: '4.495B km', sub: '30.070 AU', kids: 'Neptune is the farthest official planet, 30 times farther from the Sun than Earth! Sunlight takes over 4 hours to reach Neptune’s dark blue clouds.' },
    { label: 'Orbital Period', value: '164.79 Earth years', sub: '60,189.0 Earth days', kids: 'A year on Neptune lasts nearly 165 Earth years! Since it was discovered in 1846, Neptune has only completed one single orbit around the Sun.' },
    { label: 'Day Length', value: '16h 06m 36s', sub: 'Differential rotation', kids: 'Even though Neptune is a massive ice giant, it spins around once every 16 hours. Because it is made of swirling gas and slush, its equator spins faster than its poles.' },
    { label: 'Equatorial Radius', value: '24,622 km', sub: '3.86 × Earth', kids: 'Neptune is almost 4 times wider than Earth (just slightly smaller than Uranus, but heavier and denser). You could fit 57 Earths inside Neptune!' },
    { label: 'Mass', value: '1.024 × 10²⁶ kg', sub: '17.15 × Earth', kids: 'Neptune is 17 times heavier than Earth! It is packed with a deep ocean of compressed hot water, ammonia, and methane slush over a rocky iron core.' },
    { label: 'Cloud-Top Temperature', value: '−201°C', sub: 'Mean −201°C — 10 times colder than a freezer, freezes nitrogen gas', kids: 'Neptune’s cloud tops are −201°C, which is 10 times colder than a kitchen freezer. It is so cold that nitrogen gas freezes into solid snow crystals!' },
    { label: 'Moons & Rings', value: '16 Moons · 5 Rings', sub: 'The major moons are Triton, Proteus, and Nereid', kids: 'Neptune has 16 moons, led by giant icy Triton. Triton is extraordinary: it orbits backwards (anticlockwise/retrograde) in the opposite direction of Neptune’s spin! That proves Triton was an icy dwarf planet captured from the Kuiper Belt! Triton even shoots real nitrogen ice volcanoes into space.' },
    { label: 'Atmosphere', value: '80.0% H₂, 19.0% He, 1.5% CH₄', sub: 'Vivid azure blue with Great Dark Spot', kids: 'Percent (%) means parts out of 100 scoops of icy atmosphere:\n• H₂ (80 scoops) is Hydrogen gas.\n• He (19 scoops) is Helium gas (party balloon gas).\n• CH₄ (1.5 scoops) is Methane gas: this magical gas swallows red sunlight and reflects deep, gorgeous ocean-blue light!\nWild storms whip through this blue gas at over 2,100 km/h!' }
  ]
  }
];
