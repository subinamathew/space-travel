(function () {
  try {
    localStorage.setItem('site_auth', 'authenticated');
    localStorage.setItem('space_cookie_consent', 'accepted');
    document.cookie = 'site_auth=authenticated; path=/; max-age=31536000';
    document.cookie = 'space_cookie_consent=accepted; path=/; max-age=31536000';
  } catch (_) {}
})();
