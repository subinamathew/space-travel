/**
 * Space Travel Warp Speed Preloader
 * Renders 3D starfield warp streaks, shows arrival sequence at solar system,
 * displays Milky Way Galaxy coordinates, and morphs the notice into the HUD badge.
 */
export function initPreloader(onComplete) {
  const preloaderEl = document.getElementById('preloader');
  const canvas = document.getElementById('warp-canvas');
  const statusEl = document.querySelector('.warp-status');
  const noticeEl = document.getElementById('warp-notice');
  const ringEl = document.querySelector('.warp-center-ring');
  const galaxyHud = document.getElementById('galaxy-hud');
  const settingsHud = document.getElementById('settings-hud');

  if (!preloaderEl || !canvas) {
    if (galaxyHud) galaxyHud.classList.add('visible');
    if (settingsHud) settingsHud.classList.add('visible');
    if (onComplete) onComplete();
    return;
  }

  // Check if forced via query parameter (e.g. ?warp=1 or ?preloader=1)
  const urlParams = new URLSearchParams(window.location.search);
  const forcePreloader = urlParams.has('warp') || urlParams.has('preloader');

  // Check if returning from planet subpages, credits, or already viewed in this session
  const referrer = document.referrer || '';
  const isReturning =
    !forcePreloader &&
    (referrer.includes('/planets/') ||
      referrer.includes('credits.html') ||
      sessionStorage.getItem('rocketrun_visited') === 'true');

  if (isReturning) {
    sessionStorage.setItem('rocketrun_visited', 'true');
    preloaderEl.style.display = 'none';
    preloaderEl.classList.add('loaded');
    if (galaxyHud) galaxyHud.classList.add('visible');
    if (settingsHud) settingsHud.classList.add('visible');
    if (onComplete) onComplete();
    return;
  }

  // Clear query parameters in address bar cleanly after launching
  if (forcePreloader && window.history && window.history.replaceState) {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (e) {}
  }

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  let cx = width / 2;
  let cy = height / 2;

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const lowMemoryDevice = typeof navigator !== 'undefined' && 'deviceMemory' in navigator && navigator.deviceMemory <= 4;
  const numStars = prefersReducedMotion ? 0 : (lowMemoryDevice || window.innerWidth < 768 ? 240 : 360);
  const maxZ = 1200;
  const fov = 300;
  let animId = null;
  let isDone = false;
  let hasTriggeredArrival = false;

  if (prefersReducedMotion) {
    preloaderEl.classList.add('loaded');
    preloaderEl.style.display = 'none';
    if (galaxyHud) galaxyHud.classList.add('visible');
    if (settingsHud) settingsHud.classList.add('visible');
    sessionStorage.setItem('rocketrun_visited', 'true');
    if (onComplete) onComplete();
    return;
  }

  const stars = Array.from({ length: numStars }, () => resetStar({}, true));

  function resetStar(star, randomZ = false) {
    star.x = (Math.random() - 0.5) * width * 2.2;
    star.y = (Math.random() - 0.5) * height * 2.2;
    star.z = randomZ ? Math.random() * maxZ : maxZ;
    star.size = Math.random() * 1.5 + 0.6;
    star.hue = 190 + Math.random() * 40; // Cyan-blue hue range
    return star;
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    cx = width / 2;
    cy = height / 2;
  }
  window.addEventListener('resize', resize);

  const startTime = performance.now();
  const arrivalTime = 1350; // Switch to "REACHED SOLAR SYSTEM"
  const totalDuration = 2750; // Total sequence length

  function triggerArrival() {
    if (hasTriggeredArrival) return;
    hasTriggeredArrival = true;

    if (statusEl) {
      statusEl.textContent = 'REACHED SOLAR SYSTEM';
      statusEl.classList.add('arrived');
    }
    if (ringEl) {
      ringEl.classList.add('arrived');
    }
    if (noticeEl) {
      noticeEl.classList.add('visible');
    }
  }

  function finish() {
    if (isDone) return;
    isDone = true;
    sessionStorage.setItem('rocketrun_visited', 'true');

    triggerArrival();

    // Morph the center notice toward the top-right HUD position
    if (noticeEl) {
      noticeEl.classList.add('morph-to-hud');
    }

    setTimeout(() => {
      preloaderEl.classList.add('loaded');
      if (galaxyHud) galaxyHud.classList.add('visible');
      if (settingsHud) settingsHud.classList.add('visible');
    }, 400);

    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', handleSkip);
    preloaderEl.removeEventListener('click', handleSkip);

    setTimeout(() => {
      preloaderEl.style.display = 'none';
      if (onComplete) onComplete();
    }, 950);
  }

  function handleSkip() {
    finish();
  }

  window.addEventListener('keydown', handleSkip, { once: true });
  preloaderEl.addEventListener('click', handleSkip, { once: true });

  function draw(now) {
    const elapsed = now - startTime;

    if (elapsed >= arrivalTime && !hasTriggeredArrival) {
      triggerArrival();
    }

    if (elapsed >= totalDuration) {
      finish();
      return;
    }

    const progress = Math.min(elapsed / totalDuration, 1);

    // Warp speed curve:
    // 0 -> 1350ms: hyperspace surge (accelerate & peak warp)
    // 1350ms -> 2750ms: breakout deceleration to cruise speed
    let speed;
    if (elapsed < 350) {
      speed = 12 + (elapsed / 350) * 58;
    } else if (elapsed < arrivalTime) {
      speed = 70 + Math.sin((elapsed - 350) * 0.005) * 8;
    } else {
      // Decelerate after reaching destination
      const decelProgress = (elapsed - arrivalTime) / (totalDuration - arrivalTime);
      speed = Math.max(70 * Math.pow(1 - decelProgress, 2), 3);
    }

    // Motion blur trailing clear
    ctx.fillStyle = 'rgba(0, 2, 8, 0.32)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const prevZ = s.z;
      s.z -= speed;

      if (s.z <= 10) {
        resetStar(s, false);
        continue;
      }

      // 3D perspective projection
      const k = fov / s.z;
      const sx = cx + s.x * k;
      const sy = cy + s.y * k;

      const pk = fov / Math.min(prevZ + speed * 1.5, maxZ);
      const px = cx + s.x * pk;
      const py = cy + s.y * pk;

      // Skip offscreen
      if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) {
        resetStar(s, false);
        continue;
      }

      const depthFactor = 1 - s.z / maxZ;
      const alpha = Math.min(depthFactor * 1.4, 1);
      const lineWidth = Math.max(s.size * (0.8 + depthFactor * 2.2), 0.8);

      // Streak line with neon warp glow
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `hsla(${s.hue}, 100%, ${75 + depthFactor * 25}%, ${alpha})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Front star tip
      ctx.beginPath();
      ctx.arc(sx, sy, lineWidth * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Center hyperdrive glow bloom
    const bloomRadius = clamp(progress * 130, 20, 180);
    const bloomGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomRadius);
    const bloomAlpha = hasTriggeredArrival ? 0.45 * (1 - (elapsed - arrivalTime) / (totalDuration - arrivalTime)) : 0.2 + progress * 0.2;
    bloomGrad.addColorStop(0, `rgba(180, 245, 255, ${Math.max(bloomAlpha, 0.05)})`);
    bloomGrad.addColorStop(0.5, `rgba(74, 144, 217, ${Math.max(bloomAlpha * 0.5, 0.02)})`);
    bloomGrad.addColorStop(1, 'rgba(0, 2, 8, 0)');
    ctx.fillStyle = bloomGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, bloomRadius, 0, Math.PI * 2);
    ctx.fill();

    animId = requestAnimationFrame(draw);
  }

  animId = requestAnimationFrame(draw);
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
