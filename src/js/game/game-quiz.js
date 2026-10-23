/**
 * RocketRun Landing Quizzes & Touchdown Notes
 * Cyclomatic Complexity <= 3 per function
 */

export const TOUCHDOWN_NOTES = {
  moon: 'game.touchdown_moon',
  mars: 'game.touchdown_mars',
  jupiter: 'game.touchdown_jupiter',
  saturn: 'game.touchdown_saturn',
  uranus: 'game.touchdown_uranus',
  neptune: 'game.touchdown_neptune',
  earth: 'game.touchdown_earth'
};

export const PLANET_QUIZZES = {
  moon: {
    questionKey: 'game.quiz_q_moon',
    options: [
      { key: 'game.quiz_moon_opt1', correct: true },
      { key: 'game.quiz_moon_opt2', correct: false }
    ],
    hintKey: 'game.quiz_hint_moon'
  },
  mars: {
    questionKey: 'game.quiz_q_mars',
    options: [
      { key: 'game.quiz_mars_opt1', correct: true },
      { key: 'game.quiz_mars_opt2', correct: false }
    ],
    hintKey: 'game.quiz_hint_mars'
  },
  jupiter: {
    questionKey: 'game.quiz_q_jupiter',
    options: [
      { key: 'game.quiz_jupiter_opt1', correct: true },
      { key: 'game.quiz_jupiter_opt2', correct: false }
    ],
    hintKey: 'game.quiz_hint_jupiter'
  },
  saturn: {
    questionKey: 'game.quiz_q_saturn',
    options: [
      { key: 'game.quiz_saturn_opt1', correct: true },
      { key: 'game.quiz_saturn_opt2', correct: false }
    ],
    hintKey: 'game.quiz_hint_saturn'
  },
  uranus: {
    questionKey: 'game.quiz_q_uranus',
    options: [
      { key: 'game.quiz_uranus_opt1', correct: true },
      { key: 'game.quiz_uranus_opt2', correct: false }
    ],
    hintKey: 'game.quiz_hint_uranus'
  },
  neptune: {
    questionKey: 'game.quiz_q_neptune',
    options: [
      { key: 'game.quiz_neptune_opt1', correct: true },
      { key: 'game.quiz_neptune_opt2', correct: false }
    ],
    hintKey: 'game.quiz_hint_neptune'
  },
  earth: {
    questionKey: 'game.quiz_q_earth',
    options: [
      { key: 'game.quiz_earth_opt1', correct: true },
      { key: 'game.quiz_earth_opt2', correct: false }
    ],
    hintKey: 'game.quiz_hint_earth'
  }
};

export function getTouchdownNoteKey(planetSlug) {
  return TOUCHDOWN_NOTES[planetSlug] || 'game.touchdown_default';
}

export function getPlanetQuiz(planetSlug) {
  return PLANET_QUIZZES[planetSlug] || PLANET_QUIZZES.moon;
}
