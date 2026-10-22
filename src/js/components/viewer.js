import { t } from '../i18n.js';

/**
 * Planet Detail Viewer & Navigation Controller
 */
export function initViewer(planets) {
  let currentIndex = 2; // Earth by default

  const root = document.documentElement;
  const solarEl = document.getElementById('solar-system');
  const pvEl = document.getElementById('planet-view');
  const backBtn = document.getElementById('back-btn');
  const pvPlanet = document.getElementById('pv-planet');
  const pvRing = document.getElementById('pv-ring');
  const pvGreeting = document.getElementById('pv-greeting');
  const pvName = document.getElementById('pv-name');
  const pvFact = document.getElementById('pv-fact');
  const pvCounter = document.getElementById('pv-counter');
  const pvDotsEl = document.getElementById('pv-dots');
  const hintEl = document.getElementById('hint');
  const prevBtn = document.getElementById('btn-prev');
  const nextBtn = document.getElementById('btn-next');

  // Build dots
  if (pvDotsEl) {
    planets.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = 'dot';
      b.setAttribute('aria-label', p.name);
      b.setAttribute('role', 'tab');
      b.title = p.name;
      b.addEventListener('click', () => goTo(i));
      pvDotsEl.appendChild(b);
    });
  }
  const dots = pvDotsEl ? pvDotsEl.querySelectorAll('.dot') : [];

  function renderPlanet(idx) {
    const p = planets[idx];
    if (!p) return;

    root.style.setProperty('--c1', p.c1);
    root.style.setProperty('--c2', p.c2);
    root.style.setProperty('--glow', p.glow);

    if (pvEl) pvEl.style.background = p.bg;
    if (pvPlanet) {
      pvPlanet.style.width = `${p.pvSize}px`;
      pvPlanet.style.height = `${p.pvSize}px`;
      pvPlanet.style.backgroundImage = `url(images/${p.slug}.png)`;
      pvPlanet.style.backgroundSize = 'contain';
      pvPlanet.style.backgroundRepeat = 'no-repeat';
      pvPlanet.style.backgroundPosition = 'center';
    }

    if (pvRing) {
      pvRing.classList.toggle('visible', !!p.hasRing);
      if (p.hasRing) {
        pvRing.style.width = `${p.pvSize * 1.6}px`;
        pvRing.style.height = `${p.pvSize * 0.32}px`;
      }
    }

    [pvGreeting, pvName, pvFact].forEach(el => {
      if (el) {
        el.style.animation = 'none';
        void el.offsetHeight;
        el.style.animation = '';
      }
    });

    const greeting = t(`planets.${p.slug}.greeting`) || p.greeting;
    const name = t(`planets.${p.slug}.name`) || p.name;
    const fact = t(`planets.${p.slug}.fact`) || p.fact;

    if (pvGreeting) pvGreeting.textContent = greeting;
    if (pvName) pvName.textContent = `— ${name} —`;
    if (pvFact) pvFact.textContent = fact;
    if (pvCounter) pvCounter.textContent = t('ui.counter', { current: idx + 1, total: planets.length });

    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  window.addEventListener('space:langchange', () => {
    if (pvEl && pvEl.classList.contains('active')) {
      renderPlanet(currentIndex);
    }
  });

  function showPlanet(idx) {
    currentIndex = idx;
    renderPlanet(currentIndex);
    if (solarEl) solarEl.classList.add('fade-out');
    if (pvEl) pvEl.classList.add('active');
    if (backBtn) backBtn.classList.add('visible');
    if (hintEl) hintEl.style.opacity = '0';
  }

  function showHome() {
    if (solarEl) solarEl.classList.remove('fade-out');
    if (pvEl) pvEl.classList.remove('active');
    if (backBtn) backBtn.classList.remove('visible');
    if (hintEl) hintEl.style.opacity = '';
  }

  function goTo(idx) {
    currentIndex = ((idx % planets.length) + planets.length) % planets.length;
    renderPlanet(currentIndex);
  }

  if (backBtn) backBtn.addEventListener('click', showHome);
  if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  document.addEventListener('keydown', e => {
    if (pvEl && pvEl.classList.contains('active')) {
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
      if (e.key === 'Escape') showHome();
    }
  });

  return {
    showPlanet,
    showHome,
    goTo,
    renderCurrent: () => renderPlanet(currentIndex)
  };
}
