import { BASE_EARTH_SECONDS } from '../data/planets.js';

/**
 * Orrery Scene Orbit & Planet Buttons Builder
 * Computes exact astronomical orbital periods proportional to Earth = 15s.
 */
export function buildOrrery(sceneEl, planets, onPlanetSelect) {
  if (!sceneEl) return;

  planets.forEach((p, i) => {
    const o = document.createElement('div');
    o.className = 'orbit';
    const r = p.orbitR;
    o.style.width = `${r * 2}vmin`;
    o.style.height = `${r * 2}vmin`;
    o.style.marginTop = `-${r}vmin`;
    o.style.marginLeft = `-${r}vmin`;

    // Mathematical orbital duration based on Earth = 15s
    const duration = p.periodYears * BASE_EARTH_SECONDS;
    const delay = -(p.initialPhase * duration);
    const durStr = `${duration.toFixed(2)}s`;
    const delayStr = `${delay.toFixed(2)}s`;

    o.style.animationDuration = durStr;
    o.style.animationDelay = delayStr;

    const b = document.createElement('button');
    b.className = 'planet-btn';
    b.style.setProperty('--pc1', p.c1);
    b.style.setProperty('--pc2', p.c2);
    b.style.setProperty('--pglow', p.glow);
    b.style.animationDuration = durStr;
    b.style.animationDelay = delayStr;
    b.setAttribute('aria-label', `Visit ${p.name}`);
    b.title = `${p.name} (Orbit: ${p.periodYears >= 1 ? p.periodYears.toFixed(1) + ' Earth yrs' : (p.periodYears * 365.25).toFixed(0) + ' Earth days'})`;
    b.addEventListener('click', e => {
      e.stopPropagation();
      if (p.slug) {
        window.location.href = `planets/${p.slug}.html`;
      } else if (onPlanetSelect) {
        onPlanetSelect(i);
      }
    });

    const w = document.createElement('div');
    w.className = 'planet-wrap';
    if (p.hasRing) {
      const rng = document.createElement('div');
      rng.className = 'home-ring';
      rng.style.width = `${p.size * 2.1}vmin`;
      rng.style.height = `${p.size * 0.42}vmin`;
      w.appendChild(rng);
    }

    const s = document.createElement('div');
    s.className = 'planet-sphere';
    s.style.width = `${p.size}vmin`;
    s.style.height = `${p.size}vmin`;
    s.style.backgroundImage = `url(images/${p.slug}.png)`;
    s.style.backgroundSize = 'contain';
    s.style.backgroundRepeat = 'no-repeat';
    s.style.backgroundPosition = 'center';
    w.appendChild(s);
    b.appendChild(w);

    const lbl = document.createElement('span');
    lbl.className = 'planet-label';
    lbl.textContent = p.name;
    b.appendChild(lbl);

    o.appendChild(b);
    sceneEl.appendChild(o);
  });
}
