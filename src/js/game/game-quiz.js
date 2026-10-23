/**
 * RocketRun Landing Quizzes & Touchdown Notes
 * Cyclomatic Complexity <= 3 per function
 * No hints displayed per child-accessibility policy.
 */

export const TOUCHDOWN_NOTES = {
  mercury: 'game.touchdown_mercury',
  venus: 'game.touchdown_venus',
  earth: 'game.touchdown_earth',
  moon: 'game.touchdown_moon',
  mars: 'game.touchdown_mars',
  jupiter: 'game.touchdown_jupiter',
  saturn: 'game.touchdown_saturn',
  uranus: 'game.touchdown_uranus',
  neptune: 'game.touchdown_neptune'
};

export const PLANET_QUIZZES = {
  mercury: [
    {
      questionKey: 'game.quiz_q_mercury',
      options: [
        { key: 'game.quiz_mercury_opt1', correct: true },
        { key: 'game.quiz_mercury_opt2', correct: false }
      ]
    }
  ],
  venus: [
    {
      questionKey: 'game.quiz_q_venus',
      options: [
        { key: 'game.quiz_venus_opt1', correct: true },
        { key: 'game.quiz_venus_opt2', correct: false }
      ]
    }
  ],
  moon: [
    {
      questionKey: 'game.quiz_q_moon',
      options: [
        { key: 'game.quiz_moon_opt1', correct: true },
        { key: 'game.quiz_moon_opt2', correct: false }
      ]
    }
  ],
  mars: [
    {
      questionKey: 'game.quiz_q_mars',
      options: [
        { key: 'game.quiz_mars_opt1', correct: true },
        { key: 'game.quiz_mars_opt2', correct: false }
      ]
    },
    {
      questionKey: 'game.quiz_q_mars_2',
      options: [
        { key: 'game.quiz_mars_2_opt1', correct: true },
        { key: 'game.quiz_mars_2_opt2', correct: false }
      ]
    }
  ],
  jupiter: [
    {
      questionKey: 'game.quiz_q_jupiter',
      options: [
        { key: 'game.quiz_jupiter_opt1', correct: true },
        { key: 'game.quiz_jupiter_opt2', correct: false }
      ]
    },
    {
      questionKey: 'game.quiz_q_jupiter_2',
      options: [
        { key: 'game.quiz_jupiter_2_opt1', correct: true },
        { key: 'game.quiz_jupiter_2_opt2', correct: false }
      ]
    }
  ],
  saturn: [
    {
      questionKey: 'game.quiz_q_saturn',
      options: [
        { key: 'game.quiz_saturn_opt1', correct: true },
        { key: 'game.quiz_saturn_opt2', correct: false }
      ]
    }
  ],
  uranus: [
    {
      questionKey: 'game.quiz_q_uranus',
      options: [
        { key: 'game.quiz_uranus_opt1', correct: true },
        { key: 'game.quiz_uranus_opt2', correct: false }
      ]
    }
  ],
  neptune: [
    {
      questionKey: 'game.quiz_q_neptune',
      options: [
        { key: 'game.quiz_neptune_opt1', correct: true },
        { key: 'game.quiz_neptune_opt2', correct: false }
      ]
    }
  ],
  earth: [
    {
      questionKey: 'game.quiz_q_earth',
      options: [
        { key: 'game.quiz_earth_opt1', correct: true },
        { key: 'game.quiz_earth_opt2', correct: false }
      ]
    }
  ]
};

export function getTouchdownNoteKey(planetSlug) {
  return TOUCHDOWN_NOTES[planetSlug] || 'game.touchdown_default';
}

export function getPlanetQuiz(planetSlug, missionIndex = 0) {
  const list = PLANET_QUIZZES[planetSlug] || PLANET_QUIZZES.moon;
  if (Array.isArray(list)) {
    return list[missionIndex % list.length];
  }
  return list;
}
