import { BASE_EARTH_SECONDS } from '../data/planets.js';

/**
 * Orrery Scene Orbit & Planet Buttons Builder
 * Injects orbital ellipse geometry variables and rotating carriers
 * powered entirely by pure hardware-accelerated CSS animations.
 */
export function buildOrrery(sceneEl, planets, onPlanetSelect) {
  if (!sceneEl) return;

  planets.forEach((p, i) => {
    const o = document.createElement('div');
    o.className = 'orbit';
    const r = p.orbitR;
    const ecc3d = p.eccentricity3d !== undefined ? p.eccentricity3d : 0.1;
    const b3d = r * Math.sqrt(Math.max(0.01, 1 - ecc3d * ecc3d));
    const focalOffset = r * ecc3d;
    const peri = p.perihelionDeg || 0;
    const inc = p.inclinationDeg || 0;

    // Set geometric and timing parameters as CSS variables on each orbit element
    const periodSeconds = p.periodYears * BASE_EARTH_SECONDS;
    const delay = -((p.initialPhase || 0) * periodSeconds);

    o.style.setProperty('--orbit-a', `${r}vmin`);
    o.style.setProperty('--orbit-b-3d', `${b3d.toFixed(2)}vmin`);
    o.style.setProperty('--orbit-scale-y', `${(b3d / r).toFixed(4)}`);
    o.style.setProperty('--focal-offset', `${focalOffset.toFixed(2)}vmin`);
    o.style.setProperty('--orbit-peri', `${peri}deg`);
    o.style.setProperty('--orbit-inc', `${inc.toFixed(2)}deg`);
    o.style.setProperty('--orbit-peri-inv', `${(-peri)}deg`);
    o.style.setProperty('--orbit-inc-inv', `${(-inc).toFixed(2)}deg`);
    o.style.setProperty('--orbit-period', `${periodSeconds.toFixed(2)}s`);
    o.style.setProperty('--orbit-delay', `${delay.toFixed(2)}s`);

    const carrier = document.createElement('div');
    carrier.className = 'orbit-carrier';

    const b = document.createElement('button');
    b.className = 'planet-btn';
    b.dataset.slug = p.slug;
    b.id = `planet-btn-${p.slug}`;
    b.style.setProperty('--pc1', p.c1);
    b.style.setProperty('--pc2', p.c2);
    b.style.setProperty('--pglow', p.glow);
    b.setAttribute('aria-label', `Explore ${p.name}`);
    b.title = `🚀 Click to land & explore ${p.name}! (Orbit: ${p.periodYears >= 1 ? p.periodYears.toFixed(1) + ' Earth yrs' : (p.periodYears * 365.25).toFixed(0) + ' Earth days'})`;
    b.addEventListener('click', e => {
      e.stopPropagation();
      if (window.RocketRun && typeof window.RocketRun.selectDestinationFromCanvas === 'function') {
        const handled = window.RocketRun.selectDestinationFromCanvas(p.slug);
        if (handled) return;
      }
      if (p.slug) {
        window.location.href = `planets/${p.slug}.html`;
      } else if (onPlanetSelect) {
        onPlanetSelect(i);
      }
    });

    const w = document.createElement('div');
    w.className = 'planet-wrap';

    const s = document.createElement('div');
    if (p.hasRing) {
      // Saturn's image (960x361) includes the full ring span; scale width so the central globe is ~2.3vmin
      s.className = 'planet-sphere is-ringed';
      const ringW = 5.8;
      const ringH = ringW / (960 / 361);
      s.style.width = `${ringW}vmin`;
      s.style.height = `${ringH.toFixed(2)}vmin`;
      s.style.filter = `drop-shadow(0 0 8px var(--pglow))`;
    } else {
      s.className = 'planet-sphere';
      s.style.width = `${p.size}vmin`;
      s.style.height = `${p.size}vmin`;
    }
    s.style.backgroundImage = `url(images/${p.slug}.png)`;
    s.style.backgroundSize = 'contain';
    s.style.backgroundRepeat = 'no-repeat';
    s.style.backgroundPosition = 'center';
    w.appendChild(s);

    // Planetary Moon System (visible when Moons switch is enabled)
    if (p.moons && p.moons.length > 0) {
      const moonSys = document.createElement('div');
      moonSys.className = 'moon-system';

      p.moons.forEach((m, mIdx) => {
        const mOrbit = document.createElement('div');
        mOrbit.className = 'moon-orbit';
        if (m.isRetrograde) mOrbit.classList.add('is-retrograde');
        mOrbit.style.width = `${m.r}vmin`;
        mOrbit.style.height = `${m.r}vmin`;
        mOrbit.style.animationDuration = `${m.speed}s`;
        const mDelay = -((mIdx * 0.45 * m.speed) % m.speed);
        mOrbit.style.animationDelay = `${mDelay.toFixed(2)}s`;

        const moonEl = document.createElement('div');
        moonEl.className = 'moon';
        moonEl.dataset.slug = p.slug === 'earth' ? 'moon' : `${p.slug}-moon-${mIdx}`;
        moonEl.id = `moon-btn-${moonEl.dataset.slug}`;
        moonEl.style.width = `${m.size}vmin`;
        moonEl.style.height = `${m.size}vmin`;
        moonEl.style.backgroundColor = m.color || '#fff';
        if (m.glow) moonEl.style.boxShadow = `0 0 5px ${m.glow}`;
        moonEl.title = `${m.name} (${p.name}'s Moon)`;
        moonEl.setAttribute('aria-label', `${m.name}, moon of ${p.name}`);
        moonEl.addEventListener('click', e => {
          e.stopPropagation();
          if (window.RocketRun && typeof window.RocketRun.selectDestinationFromCanvas === 'function') {
            window.RocketRun.selectDestinationFromCanvas(moonEl.dataset.slug);
          }
        });

        mOrbit.appendChild(moonEl);
        moonSys.appendChild(mOrbit);
      });

      w.appendChild(moonSys);
    }

    b.appendChild(w);

    const lbl = document.createElement('span');
    lbl.className = 'planet-label';
    lbl.textContent = p.name;
    b.appendChild(lbl);

    carrier.appendChild(b);
    o.appendChild(carrier);
    sceneEl.appendChild(o);
  });
}

/**
 * Initialize Settings HUD Switches (Moons & 3D Real Orbits)
 * Strictly enabled on the solar system view, saving state in localStorage.
 */
export function initSettingsSwitches() {
  const solarSystem = document.getElementById('solar-system');
  const sceneEl = document.getElementById('scene');
  if (!solarSystem && !sceneEl) return;

  // 1. Moons Switch
  const moonsToggle = document.getElementById('moons-toggle');
  if (moonsToggle) {
    const savedMoons = localStorage.getItem('space_show_moons') === 'true';
    function applyMoons(show) {
      if (solarSystem) solarSystem.classList.toggle('show-moons', show);
      if (sceneEl) sceneEl.classList.toggle('show-moons', show);
      moonsToggle.checked = show;
      localStorage.setItem('space_show_moons', show ? 'true' : 'false');
    }
    applyMoons(savedMoons);
    moonsToggle.addEventListener('change', () => applyMoons(moonsToggle.checked));
  }

  // 2. Realistic 3D Orbits Switch
  const orbitToggle = document.getElementById('orbit-toggle');
  if (orbitToggle) {
    const savedOrbit = localStorage.getItem('space_real_orbits') === 'true';
    function applyOrbits(real) {
      if (solarSystem) solarSystem.classList.toggle('real-orbits', real);
      if (sceneEl) sceneEl.classList.toggle('real-orbits', real);
      orbitToggle.checked = real;
      localStorage.setItem('space_real_orbits', real ? 'true' : 'false');
    }
    applyOrbits(savedOrbit);
    orbitToggle.addEventListener('change', () => applyOrbits(orbitToggle.checked));
  }
}
