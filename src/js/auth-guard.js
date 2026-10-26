/**
 * Pre-render access-state guard.
 *
 * This prevents a flash of site content before the interactive auth gate mounts.
 * It is intentionally separate from the main bundle so a strict CSP can keep
 * executable inline scripts disabled.
 */
(function () {
  try {
    var authenticated =
      document.cookie.indexOf('site_auth=authenticated') !== -1 ||
      localStorage.getItem('site_auth') === 'authenticated';

    if (!authenticated) {
      document.documentElement.classList.add('site-locked');
    }
  } catch (_) {
    document.documentElement.classList.add('site-locked');
  }
})();
