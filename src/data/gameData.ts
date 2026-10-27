export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  planetSlug: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface GameMission {
  id: string;
  name: string;
  targetSlug: string;
  clue: string;
  crossesAsteroids?: boolean;
  isSlingshot?: boolean;
}

export interface PilotRank {
  minMissions: IntRange;
  title: string;
  icon: string;
}

type IntRange = number;

export interface SpaceJoke {
  id: number;
  setup: string;
  punchline: string;
  emoji?: string;
}

export interface LeaderboardEntry {
  pilotName: string;
  score: number;
  missionsCompleted: number;
  rankTitle: string;
}

export const GameRepository = {
  ranks: [
    { minMissions: 0, title: 'Cadet', icon: '🚀' },
    { minMissions: 1, title: 'Scout', icon: '🛸' },
    { minMissions: 3, title: 'Navigator', icon: '🛰️' },
    { minMissions: 5, title: 'Pioneer', icon: '🌌' },
    { minMissions: 8, title: 'Master', icon: '👑' },
    { minMissions: 12, title: 'Explorer', icon: '🔭' },
    { minMissions: 16, title: 'Voyager', icon: '🌠' },
    { minMissions: 20, title: 'Legend', icon: '⭐' }
  ],

  getRankForMissions(completed: number) {
    let current = this.ranks[0];
    for (const r of this.ranks) {
      if (completed >= r.minMissions) {
        current = r;
      }
    }
    return current;
  },

  missionClues: {
    moon: "Fly to Earth's closest silver companion with Apollo craters and 1/6th gravity!",
    mercury: "Transit to the swift, scorched inner world where one day is longer than a year!",
    venus: "Chart a trajectory to our hottest sister planet shrouded in thick acid clouds and spinning backwards!",
    earth: "Return to the vibrant blue home world teeming with life and vast oceans!",
    mars: "Navigate to the rusty red neighbor harboring the solar system's tallest volcano, Olympus Mons!",
    jupiter: "Cross the asteroid belt and dock at the majestic king of planets with the Great Red Spot!",
    saturn: "Seek the lightweight jewel adorned with breathtaking rings spanning over 280,000 kilometers!",
    uranus: "Voyage outward to the cyan ice giant that rolls around the Sun on its side!",
    neptune: "Reach the outermost frontier world battered by supersonic winds exceeding 2,100 km/h!"
  } as Record<string, string>,

  quizzes: {
    mercury: [
      {
        planetSlug: 'mercury',
        question: 'How long does a single day (sunrise to sunrise) last on Mercury compared to its year?',
        options: [
          { text: 'A day lasts longer than its year! (176 Earth days)', isCorrect: true },
          { text: 'A day lasts only 10 Earth hours', isCorrect: false }
        ],
        explanation: 'Because of its 3:2 spin-orbit resonance, Mercury rotates slowly while orbiting quickly around the Sun!'
      }
    ],
    venus: [
      {
        planetSlug: 'venus',
        question: 'Why is Venus the hottest planet in the solar system, even hotter than Mercury?',
        options: [
          { text: 'A runaway carbon dioxide greenhouse effect traps intense heat', isCorrect: true },
          { text: 'It has thousands of open lava geysers burning at once', isCorrect: false }
        ],
        explanation: "Venus's crushing CO2 atmosphere traps heat like a planetary oven, turning the surface into an inferno at 465°C."
      }
    ],
    moon: [
      {
        planetSlug: 'moon',
        question: 'How high can you leap on the Moon compared to jumping on Earth?',
        options: [
          { text: 'About 6 times higher due to low lunar gravity!', isCorrect: true },
          { text: 'Exactly the same height as on Earth', isCorrect: false }
        ],
        explanation: "The Moon has only 16.6% of Earth's gravity, making astronauts and rovers feel super lightweight!"
      }
    ],
    mars: [
      {
        planetSlug: 'mars',
        question: 'What makes the soil and rocks on Mars appear reddish-orange?',
        options: [
          { text: 'Iron oxide dust (literally rust) covering the surface', isCorrect: true },
          { text: 'Glowing thermal heat rising from the interior', isCorrect: false }
        ],
        explanation: 'Ancient water and atmospheric chemical reactions rusted iron minerals in the Martian soil billions of years ago.'
      }
    ],
    jupiter: [
      {
        planetSlug: 'jupiter',
        question: "What is Jupiter's famous Great Red Spot?",
        options: [
          { text: 'A giant anticyclone storm bigger than Earth that has raged for centuries', isCorrect: true },
          { text: 'A massive red volcanic island rising out of gas clouds', isCorrect: false }
        ],
        explanation: 'The Great Red Spot is an enormous high-pressure atmospheric storm recorded continuously since the 1600s.'
      }
    ],
    saturn: [
      {
        planetSlug: 'saturn',
        question: 'If you could place Saturn in a gigantic cosmic ocean, what would happen?',
        options: [
          { text: 'It would float because its average density is less than water!', isCorrect: true },
          { text: 'It would sink straight to the bottom like lead', isCorrect: false }
        ],
        explanation: 'Saturn is composed predominantly of light hydrogen and helium gas, with an overall density of only 0.69 g/cm³.'
      }
    ],
    uranus: [
      {
        planetSlug: 'uranus',
        question: 'What is unique about the way Uranus rotates around the Sun?',
        options: [
          { text: 'It is tilted 98 degrees and rolls around the Sun on its side', isCorrect: true },
          { text: 'It spins upside down every 24 hours', isCorrect: false }
        ],
        explanation: 'A colossal ancient impact knocked Uranus sideways, causing 42-year long periods of constant sunlight followed by 42 years of night at its poles.'
      }
    ],
    neptune: [
      {
        planetSlug: 'neptune',
        question: 'How fast do storms and supersonic winds blow in Neptune’s atmosphere?',
        options: [
          { text: 'Over 2,100 km/h (1,300 mph) — supersonic speeds!', isCorrect: true },
          { text: 'Only gentle breezes around 20 km/h', isCorrect: false }
        ],
        explanation: "Neptune's frigid upper atmosphere has minimal friction, unleashing the fastest planetary winds in the solar system."
      }
    ],
    earth: [
      {
        planetSlug: 'earth',
        question: 'What shields life on Earth from harmful solar radiation and ionizing space particles?',
        options: [
          { text: "The magnetic field generated by Earth's molten iron core", isCorrect: true },
          { text: 'The thick clouds of ocean water vapor', isCorrect: false }
        ],
        explanation: 'Our planet’s geodynamo creates a protective magnetosphere deflecting harsh solar wind.'
      }
    ]
  } as Record<string, QuizQuestion[]>,

  jokes: [
    { id: 1, setup: 'Why did the Sun go to school?', punchline: 'To get brighter! ☀️🎓', emoji: '☀️' },
    { id: 2, setup: 'How do you organize a space party?', punchline: 'You planet! 🪐🎉', emoji: '🪐' },
    { id: 3, setup: "Why couldn't the astronaut book a room on the Moon?", punchline: 'Because it was full! 🌕🏨', emoji: '🌕' },
    { id: 4, setup: 'What kind of music do planets listen to?', punchline: 'Nep-tunes! 🎶🌊', emoji: '🎵' },
    { id: 5, setup: 'Why did Mickey Mouse go to outer space?', punchline: 'To find Pluto! 🚀🐕', emoji: '🚀' },
    { id: 6, setup: 'How does the solar system hold up its pants?', punchline: 'With an asteroid belt! ☄️👖', emoji: '☄️' },
    { id: 7, setup: 'What is an astronaut’s favorite key on the keyboard?', punchline: 'The Space bar! ⌨️🧑‍🚀', emoji: '⌨️' },
    { id: 8, setup: 'Why did the alien sit on the computer?', punchline: 'To keep an eye on the space bar! 👽💻', emoji: '👽' },
    { id: 9, setup: 'Why did Venus break up with Mars?', punchline: 'She needed some space! 💔🚀', emoji: '❤️' },
    { id: 10, setup: 'What do stars eat for breakfast?', punchline: 'Quarks and milk! 🥣⭐', emoji: '🥣' },
    { id: 11, setup: 'How do astronauts eat soup in zero gravity?', punchline: 'With a flying saucer! 🛸🥣', emoji: '🛸' },
    { id: 12, setup: 'What did Mars say to Saturn?', punchline: 'Give me a ring sometime! 🪐📞', emoji: '🪐' }
  ] as SpaceJoke[],

  initialLeaderboard: [
    { pilotName: 'Captain Zack', score: 1250, missionsCompleted: 5, rankTitle: 'Pioneer' },
    { pilotName: 'Papa Orbit', score: 950, missionsCompleted: 4, rankTitle: 'Navigator' },
    { pilotName: 'Astro Explorer', score: 600, missionsCompleted: 2, rankTitle: 'Scout' },
    { pilotName: 'Comet Scout', score: 300, missionsCompleted: 1, rankTitle: 'Scout' }
  ] as LeaderboardEntry[]
};
