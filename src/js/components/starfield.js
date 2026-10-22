/**
 * Twinkling Starfield Background Canvas
 * High-performance batched drawing with automatic tab visibility throttling
 * and prefers-reduced-motion battery conservation.
 */
export function initStarfield(canvasId = 'stars') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let stars = [];
  let animId = null;
  let isRunning = false;
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mkStars() {
    const count = window.innerWidth < 768 ? 160 : 260;
    stars = Array.from({ length: count }, () => {
      const size = Math.random() * 1.5 + 0.6;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        half: size * 0.5,
        op: Math.random() * 0.6 + 0.15,
        speed: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2
      };
    });
  }

  let t = 0;
  function renderFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.012;
    ctx.fillStyle = '#ffffff';

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const alpha = prefersReduced ? s.op : s.op * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.globalAlpha = alpha;
      ctx.fillRect(s.x - s.half, s.y - s.half, s.size, s.size);
    }
  }

  function loop() {
    renderFrame();
    if (!prefersReduced && isRunning) {
      animId = requestAnimationFrame(loop);
    }
  }

  function start() {
    if (isRunning) return;
    isRunning = true;
    if (prefersReduced) {
      renderFrame();
    } else {
      animId = requestAnimationFrame(loop);
    }
  }

  function stop() {
    isRunning = false;
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
  }

  // Handle tab visibility to pause animation in background tabs
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      mkStars();
      renderFrame();
    }, 150);
  });

  resize();
  mkStars();
  start();

  return stop;
}
