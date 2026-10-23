/**
 * RocketRun Game State Machine
 * Cyclomatic Complexity <= 4 per function
 */

export const GAME_STATES = {
  STANDBY: 'STANDBY',
  TARGETED: 'TARGETED',
  LAUNCHING: 'LAUNCHING',
  TRANSIT: 'TRANSIT',
  ARRIVED: 'ARRIVED',
  DEBRIEF: 'DEBRIEF'
};

export const MISSIONS = [
  { id: 'moon', name: 'Luna (The Moon)', clueKey: 'game.mission_clue_moon', targetSlug: 'moon' },
  { id: 'mars', name: 'Mars', clueKey: 'game.mission_clue_mars', targetSlug: 'mars' },
  { id: 'jupiter', name: 'Jupiter', clueKey: 'game.mission_clue_jupiter', targetSlug: 'jupiter', crossesAsteroids: true },
  { id: 'saturn', name: 'Saturn', clueKey: 'game.mission_clue_saturn', targetSlug: 'saturn' },
  { id: 'uranus', name: 'Uranus', clueKey: 'game.mission_clue_uranus', targetSlug: 'uranus' },
  { id: 'neptune', name: 'Neptune', clueKey: 'game.mission_clue_neptune', targetSlug: 'neptune' },
  { id: 'earth', name: 'Earth', clueKey: 'game.mission_clue_earth_slingshot', targetSlug: 'earth', isSlingshot: true }
];

export const RANKS = [
  { minMissions: 0, titleKey: 'game.rank_cadet', icon: '🚀' },
  { minMissions: 1, titleKey: 'game.rank_scout', icon: '🛸' },
  { minMissions: 3, titleKey: 'game.rank_navigator', icon: '🛰️' },
  { minMissions: 5, titleKey: 'game.rank_pioneer', icon: '🌌' },
  { minMissions: 7, titleKey: 'game.rank_master', icon: '👑' }
];

export class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = GAME_STATES.STANDBY;
    this.currentPlanet = 'earth';
    this.targetPlanet = null;
    this.missionIndex = 0;
    this.lives = 3;
    this.score = 0;
    this.energy = 50;
    this.solarBoostActive = false;
  }

  getCurrentMission() {
    if (this.missionIndex >= MISSIONS.length) {
      return MISSIONS[MISSIONS.length - 1];
    }
    return MISSIONS[this.missionIndex];
  }

  getRank() {
    let rank = RANKS[0];
    for (const r of RANKS) {
      if (this.missionIndex >= r.minMissions) {
        rank = r;
      }
    }
    return rank;
  }

  deductLife() {
    this.lives = Math.max(0, this.lives - 1);
    return this.lives;
  }

  restoreLives() {
    this.lives = 3;
    this.state = GAME_STATES.STANDBY;
  }

  addScore(pts) {
    this.score += pts;
    return this.score;
  }

  advanceMission() {
    this.currentPlanet = this.targetPlanet || this.currentPlanet;
    this.targetPlanet = null;
    this.missionIndex = Math.min(this.missionIndex + 1, MISSIONS.length);
    this.state = GAME_STATES.STANDBY;
  }

  setEnergy(val) {
    this.energy = Math.max(0, Math.min(100, Number(val) || 0));
  }

  setState(nextState) {
    this.state = nextState;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('rocketrun:statechange', {
          detail: {
            state: nextState,
            currentPlanet: this.currentPlanet,
            targetPlanet: this.targetPlanet,
            energy: this.energy,
            lives: this.lives,
            score: this.score
          }
        })
      );
    }
  }
}
