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
}
