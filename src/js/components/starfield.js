/**
 * Twinkling Starfield Background Canvas
 */
export function initStarfield(canvasId = 'stars') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let stars = [];
  let animId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mkStars() {
    stars = Array.from({ length: 260 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      op: Math.random() * 0.6 + 0.1,
      speed: Math.random() * 0.5 + 0.1,
      phase: Math.random() * Math.PI * 2
    }));
  }

  let t = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += 0.012;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      ctx.globalAlpha = s.op * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    mkStars();
  });

  resize();
  mkStars();
  draw();

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}
