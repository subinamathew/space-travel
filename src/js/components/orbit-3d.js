/**
 * Interactive Orbit Manipulation Controller
 * Enables mouse drag / touch rotation, wheel / pinch zoom in 3D orbit mode,
 * and intuitive mouse wheel scrolling, drag panning, and pinch zoom in Game Mode.
 * Does not add any buttons; relies purely on direct DOM manipulation.
 */

export function init3DOrbitInteraction() {
  const solarSystem = document.getElementById('solar-system');
  const sceneEl = document.getElementById('scene');
  if (!solarSystem || !sceneEl) return;

  // Base 3D orientation defaults
  const DEFAULT_ROT_X = 58; // degrees
  const DEFAULT_ROT_Z = -20; // degrees
  const DEFAULT_ZOOM = 1.0;

  let rotX = DEFAULT_ROT_X;
  let rotZ = DEFAULT_ROT_Z;
  let zoom = DEFAULT_ZOOM;
  let panX = 0;
  let panY = 0;

  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let initialRotX = DEFAULT_ROT_X;
  let initialRotZ = DEFAULT_ROT_Z;
  let initialPanX = 0;
  let initialPanY = 0;

  // Pinch-to-zoom tracking
  let initialPinchDist = null;
  let initialPinchZoom = DEFAULT_ZOOM;

  function updateTransform(withTransition = false) {
    if (withTransition) {
      sceneEl.classList.remove('is-manipulating');
    } else {
      sceneEl.classList.add('is-manipulating');
    }

    sceneEl.style.setProperty('--orbit-rot-x', `${rotX.toFixed(2)}deg`);
    sceneEl.style.setProperty('--orbit-rot-z', `${rotZ.toFixed(2)}deg`);
    sceneEl.style.setProperty('--orbit-zoom', zoom.toFixed(3));
    sceneEl.style.setProperty('--orbit-pan-x', `${panX.toFixed(1)}px`);
    sceneEl.style.setProperty('--orbit-pan-y', `${panY.toFixed(1)}px`);
  }

  function resetTransform() {
    rotX = DEFAULT_ROT_X;
    rotZ = DEFAULT_ROT_Z;
    zoom = DEFAULT_ZOOM;
    panX = 0;
    panY = 0;
    updateTransform(true);
  }

  // Check if 3D orbit mode or Game Mode is currently interactive
  function isInteractive() {
    const pv = document.getElementById('planet-view');
    if (pv && pv.classList.contains('active')) return false;
    return sceneEl.classList.contains('real-orbits') || sceneEl.classList.contains('game-active');
  }

  function isGameActive() {
    return sceneEl.classList.contains('game-active') && !sceneEl.classList.contains('real-orbits');
  }

  // 1. Mouse Drag & Touch Rotation / 2D Panning
  solarSystem.addEventListener('pointerdown', e => {
    if (!isInteractive()) return;

    // Do not interfere with interactive inputs, HUD controls, sidebar, or modals
    if (e.target && e.target.closest('.hud-stack, #galaxy-hud, #settings-hud, #cookie-notice, .planet-view, #rocketrun-sidebar, #rocketrun-hud, .game-modal')) {
      return;
    }

    isDragging = true;
    hasMoved = false;
    startX = e.clientX;
    startY = e.clientY;
    initialRotX = rotX;
    initialRotZ = rotZ;
    initialPanX = panX;
    initialPanY = panY;

    solarSystem.classList.add('is-dragging');
    sceneEl.classList.add('is-manipulating');
  });

  window.addEventListener('pointermove', e => {
    if (!isDragging || !isInteractive()) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.hypot(dx, dy) > 5) {
      hasMoved = true;
    }

    if (isGameActive()) {
      // 2D Pan in Game Mode
      panX = initialPanX + dx;
      panY = initialPanY + dy;
    } else {
      // Horizontal drag rotates azimuth (yaw)
      rotZ = initialRotZ + dx * 0.35;
      // Vertical drag rotates elevation (pitch, clamped between 12deg and 84deg)
      rotX = Math.min(84, Math.max(12, initialRotX - dy * 0.3));
    }

    updateTransform(false);
  });

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    solarSystem.classList.remove('is-dragging');
    setTimeout(() => {
      sceneEl.classList.remove('is-manipulating');
    }, 50);
  }

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Suppress accidental planet navigation if user dragged to scroll/pan
  solarSystem.addEventListener(
    'click',
    e => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    },
    true
  );

  // 2. Mouse Wheel Zoom In / Out & Trackpad Scrolling
  solarSystem.addEventListener(
    'wheel',
    e => {
      if (!isInteractive()) return;

      // Allow scrolling inside HUD bodies, sidebar, or open modals
      if (e.target && e.target.closest('.hud-body, #cookie-notice, #planet-view, #rocketrun-sidebar, .game-modal, .sidebar-body, .accordion-content')) {
        return;
      }

      e.preventDefault();

      if (isGameActive()) {
        if (e.ctrlKey) {
          // Pinch-to-zoom on trackpad
          const zoomStep = -e.deltaY * 0.01;
          zoom = Math.min(2.5, Math.max(0.35, zoom + zoomStep));
        } else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 10) {
          // Trackpad two-finger horizontal panning
          panX -= e.deltaX * 0.8;
        } else {
          // Wheel zoom
          const zoomStep = -e.deltaY * 0.0012;
          zoom = Math.min(2.5, Math.max(0.35, zoom + zoomStep));
        }
      } else {
        const zoomStep = -e.deltaY * 0.0012;
        zoom = Math.min(2.5, Math.max(0.5, zoom + zoomStep));
      }

      updateTransform(false);
    },
    { passive: false }
  );

  // 3. Multi-Touch Pinch to Zoom
  solarSystem.addEventListener(
    'touchstart',
    e => {
      if (!isInteractive()) return;
      if (e.touches.length === 2) {
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        initialPinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        initialPinchZoom = zoom;
      }
    },
    { passive: true }
  );

  solarSystem.addEventListener(
    'touchmove',
    e => {
      if (!isInteractive()) return;
      if (e.touches.length === 2 && initialPinchDist) {
        e.preventDefault();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const factor = currentDist / initialPinchDist;
        const minZ = isGameActive() ? 0.35 : 0.5;
        zoom = Math.min(2.5, Math.max(minZ, initialPinchZoom * factor));
        updateTransform(false);
      }
    },
    { passive: false }
  );

  solarSystem.addEventListener('touchend', e => {
    if (e.touches.length < 2) {
      initialPinchDist = null;
    }
  });

  // 4. Double Click or Double Tap to Reset
  solarSystem.addEventListener('dblclick', e => {
    if (!isInteractive()) return;
    if (e.target && e.target.closest('.planet-btn, #sun, .hud-stack, #cookie-notice, #rocketrun-sidebar, .game-modal')) return;
    resetTransform();
  });

  // Reset when 3D toggle is toggled off
  const orbitToggle = document.getElementById('orbit-toggle');
  if (orbitToggle) {
    orbitToggle.addEventListener('change', () => {
      if (!orbitToggle.checked) {
        resetTransform();
      }
    });
  }

  // Reset when game mode ends
  window.addEventListener('rocketrun-exit', () => {
    resetTransform();
  });
}
