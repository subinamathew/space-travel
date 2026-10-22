import { planets } from './data/planets.js';
import { initStarfield } from './components/starfield.js';
import { buildOrrery } from './components/orrery.js';
import { initViewer } from './components/viewer.js';
import { initPreloader } from './components/preloader.js';
import { initHuds } from './components/hud.js';
import { initI18n } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n translation system
  initI18n();

  // Start warp preloader
  initPreloader();

  // Initialize Galactic & Settings HUD controllers
  initHuds();

  // Initialize starfield canvas background
  initStarfield('stars');

  // Initialize viewer controller
  const viewer = initViewer(planets);

  // Initialize orrery interactive planetary orbits
  const sceneEl = document.getElementById('scene');
  buildOrrery(sceneEl, planets, idx => {
    viewer.showPlanet(idx);
  });
});
