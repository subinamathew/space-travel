/**
 * Star Wars Crawl Interactive Controls
 * Controls the pure CSS 3D crawl stage: pause/resume, restart, and toggle flat view.
 */

import { t } from '../i18n.js';

export function initCreditsCrawl() {
  const stage = document.getElementById('crawl-stage');
  const crawlContent = document.getElementById('crawl-content');
  if (!stage || !crawlContent) return;

  const pauseBtn = document.getElementById('crawl-pause-btn');
  const restartBtn = document.getElementById('crawl-restart-btn');
  const modeBtn = document.getElementById('crawl-mode-btn');

  const pauseIcon = document.getElementById('crawl-pause-icon');
  const pauseLabel = document.getElementById('crawl-pause-label');
  const modeIcon = document.getElementById('crawl-mode-icon');
  const modeLabel = document.getElementById('crawl-mode-label');

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      const isPaused = stage.classList.toggle('is-paused');
      if (pauseIcon) pauseIcon.textContent = isPaused ? '▶' : '⏸';
      if (pauseLabel) pauseLabel.textContent = isPaused ? t('ui.crawl_resume') : t('ui.crawl_pause');
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      crawlContent.style.animation = 'none';
      void crawlContent.offsetWidth; // trigger reflow
      crawlContent.style.animation = '';
      stage.classList.remove('is-paused');
      if (pauseIcon) pauseIcon.textContent = '⏸';
      if (pauseLabel) pauseLabel.textContent = t('ui.crawl_pause');
    });
  }

  if (modeBtn) {
    modeBtn.addEventListener('click', () => {
      const isFlat = stage.classList.toggle('flat-view');
      document.body.classList.toggle('credits-flat-mode', isFlat);
      if (modeIcon) modeIcon.textContent = isFlat ? '🌌' : '📄';
      if (modeLabel) modeLabel.textContent = isFlat ? t('ui.crawl_crawl_view') : t('ui.crawl_flat_view');
    });
  }

  // Update label on language change
  window.addEventListener('space:langchange', () => {
    const isPaused = stage.classList.contains('is-paused');
    const isFlat = stage.classList.contains('flat-view');
    if (pauseLabel) pauseLabel.textContent = isPaused ? t('ui.crawl_resume') : t('ui.crawl_pause');
    if (modeLabel) modeLabel.textContent = isFlat ? t('ui.crawl_crawl_view') : t('ui.crawl_flat_view');
  });

  // Navigation back to home / solar system
  function goBack() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn && backBtn.getAttribute('href')) {
      window.location.href = backBtn.getAttribute('href');
    } else {
      window.location.href = 'index.html';
    }
  }

  // 1. Desktop: Escape key to navigate back
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      e.preventDefault();
      goBack();
    }
  });

  // 2. Tablet & Mobile: Swipe right to navigate back
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  window.addEventListener(
    'touchstart',
    e => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = performance.now();
      }
    },
    { passive: true }
  );

  window.addEventListener(
    'touchend',
    e => {
      if (!touchStartX || !touchStartTime) return;
      if (e.changedTouches && e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = performance.now() - touchStartTime;

        // Reset tracking
        touchStartX = 0;
        touchStartY = 0;
        touchStartTime = 0;

        // Swipe right criteria: deltaX > 55px, deltaTime < 700ms, and deltaX > 1.3 * |deltaY|
        const isRightSwipe = deltaX > 55 && deltaTime < 700 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3;

        if (isRightSwipe) {
          goBack();
        }
      }
    },
    { passive: true }
  );
}
