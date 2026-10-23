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
  { id: 'moon', name: 'Luna (The Moon)', clueKey: 'game.mission_clue_mixed_moon', targetSlug: 'moon' },
  { id: 'jupiter', name: 'Jupiter', clueKey: 'game.mission_clue_mixed_jupiter', targetSlug: 'jupiter', crossesAsteroids: true },
  { id: 'venus', name: 'Venus', clueKey: 'game.mission_clue_mixed_venus', targetSlug: 'venus' },
  { id: 'mars', name: 'Mars', clueKey: 'game.mission_clue_mixed_mars', targetSlug: 'mars' },
  { id: 'neptune', name: 'Neptune', clueKey: 'game.mission_clue_mixed_neptune', targetSlug: 'neptune', crossesAsteroids: true },
  { id: 'mercury', name: 'Mercury', clueKey: 'game.mission_clue_mixed_mercury', targetSlug: 'mercury' },
  { id: 'saturn', name: 'Saturn', clueKey: 'game.mission_clue_mixed_saturn', targetSlug: 'saturn', crossesAsteroids: true },
  { id: 'earth', name: 'Earth', clueKey: 'game.mission_clue_mixed_earth', targetSlug: 'earth', isSlingshot: true }
];

export const ADVANCED_RIDDLES = {
  mercury: 'game.riddle_adv_mercury',
  venus: 'game.riddle_adv_venus',
  earth: 'game.riddle_adv_earth',
  moon: 'game.riddle_adv_moon',
  mars: 'game.riddle_adv_mars',
  jupiter: 'game.riddle_adv_jupiter',
  saturn: 'game.riddle_adv_saturn',
  uranus: 'game.riddle_adv_uranus',
  neptune: 'game.riddle_adv_neptune'
};

export const RANKS = [
  { minMissions: 0, titleKey: 'game.rank_cadet', icon: '🚀' },
  { minMissions: 1, titleKey: 'game.rank_scout', icon: '🛸' },
  { minMissions: 3, titleKey: 'game.rank_navigator', icon: '🛰️' },
  { minMissions: 5, titleKey: 'game.rank_pioneer', icon: '🌌' },
  { minMissions: 8, titleKey: 'game.rank_master', icon: '👑' },
  { minMissions: 12, titleKey: 'game.rank_explorer', icon: '🔭' },
  { minMissions: 16, titleKey: 'game.rank_voyager', icon: '🌠' },
  { minMissions: 20, titleKey: 'game.rank_legend', icon: '⭐' }
];

const ALL_DESTINATIONS = ['moon', 'mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

export class GameState {
  constructor() {
    this.dynamicMission = null;
    this.reset();
  }

  reset(options = {}) {
    this.state = GAME_STATES.STANDBY;
    this.currentPlanet = options.docked || 'earth';
    this.targetPlanet = null;
    this.missionIndex = 0;
    this.lives = 3;
    this.score = 0;
    this.energy = 50;
    this.fuel = 100;
    this.solarBoostActive = false;
    this.dynamicMission = null;
    this.isFreePlay = Boolean(options.freeplay);
  }

  setFreePlay(val) {
    this.isFreePlay = Boolean(val);
    this.setState(this.state);
  }

  getCurrentMission() {
    if (this.isFreePlay) {
      return {
        id: 'freeplay',
        name: 'Free Play',
        clueKey: 'game.freeplay_clue',
        targetSlug: null,
        isFreePlay: true
      };
    }
    if (this.missionIndex < MISSIONS.length) {
      return MISSIONS[this.missionIndex];
    }
    if (!this.dynamicMission) {
      this.generateNextRandomMission();
    }
    return this.dynamicMission;
  }

  generateNextRandomMission() {
    const candidates = ALL_DESTINATIONS.filter(slug => slug !== this.currentPlanet);
    const target = candidates[Math.floor(Math.random() * candidates.length)] || 'mars';
    this.dynamicMission = {
      id: `expedition-${this.missionIndex}`,
      name: target,
      clueKey: ADVANCED_RIDDLES[target] || 'game.mission_clue_mixed_mars',
      targetSlug: target
    };
    return this.dynamicMission;
  }

  getSolarRechargeRate() {
    if (['mercury', 'venus'].includes(this.currentPlanet)) return 15;
    if (['earth', 'moon', 'mars'].includes(this.currentPlanet)) return 10;
    return 7;
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
    this.fuel = 100;
    this.state = GAME_STATES.STANDBY;
  }

  addScore(pts) {
    this.score += pts;
    return this.score;
  }

  advanceMission() {
    this.currentPlanet = this.targetPlanet || this.currentPlanet;
    this.targetPlanet = null;
    this.missionIndex++;
    this.dynamicMission = null;
    this.fuel = 100;
    this.state = GAME_STATES.STANDBY;
  }

  setEnergy(val) {
    this.energy = Math.max(0, Math.min(100, Number(val) || 0));
  }

  consumeFuel(amount) {
    this.fuel = Math.max(0, this.fuel - (Number(amount) || 0));
    return this.fuel;
  }

  addFuel(amount) {
    this.fuel = Math.min(100, this.fuel + (Number(amount) || 0));
    return this.fuel;
  }

  hasSufficientFuel(req) {
    return this.fuel >= (Number(req) || 0);
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
            fuel: this.fuel,
            lives: this.lives,
            score: this.score
          }
        })
      );
    }
  }
}
