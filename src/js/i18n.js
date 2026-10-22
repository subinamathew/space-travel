/**
 * i18n Internationalization Subsystem
 * Bundles English as synchronous zero-latency fallback,
 * with dynamic on-demand loading and caching for additional languages.
 * Provides live reactive DOM translation, localStorage persistence,
 * parameter interpolation, and custom change events.
 */

import en from '../i18n/en.json' with { type: 'json' };

export const translations = {
  en
};

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' }
];

let currentLang = 'en';

export function getLanguage() {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('space_lang') : null;
  if (saved && supportedLanguages.some(l => l.code === saved)) return saved;
  const browserLang = typeof navigator !== 'undefined' && navigator.language ? navigator.language.split('-')[0].toLowerCase() : 'en';
  if (supportedLanguages.some(l => l.code === browserLang)) return browserLang;
  return 'en';
}

function getI18nPath(lang) {
  if (typeof window === 'undefined') return `${lang}.json`;
  const isSubpage = window.location.pathname.includes('/planets/');
  return (isSubpage ? '../i18n/' : 'i18n/') + `${lang}.json`;
}

/**
 * Fetch and memory-cache language dictionary dynamically
 */
export async function loadLanguage(lang) {
  if (translations[lang]) return translations[lang];
  try {
    const res = await fetch(getI18nPath(lang));
    if (res.ok) {
      const data = await res.json();
      translations[lang] = data;
      return data;
    }
  } catch (err) {
    console.warn(`[i18n] Could not load ${lang}, falling back to English:`, err);
  }
  return translations.en;
}

/**
 * Translate a dot-notation key (e.g. 'ui.back_btn' or 'planets.mars.name')
 * with fallback to English and variable interpolation {var}.
 */
export function t(key, params = {}) {
  const langData = translations[currentLang] || translations.en;
  let val = resolveKey(langData, key);

  if (val === undefined || val === null) {
    // Fallback to English
    val = resolveKey(translations.en, key);
  }

  if (typeof val !== 'string') {
    return val !== undefined ? val : key;
  }

  // Replace {param} placeholders
  return val.replace(/\{(\w+)\}/g, (_, k) => (params[k] !== undefined ? params[k] : `{${k}}`));
}

function resolveKey(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split('.');
  let curr = obj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return undefined;
    curr = curr[p];
  }
  return curr;
}

/**
 * Translate all matching DOM elements:
 * - [data-i18n="key"]: translates textContent or innerHTML
 * - [data-i18n-attr="attr1:key1,attr2:key2"]: translates attributes like placeholder, title, aria-label
 */
export function applyTranslations() {
  if (typeof document === 'undefined') return;

  document.documentElement.setAttribute('lang', currentLang);

  // Sync any language selector dropdown
  const langSelects = document.querySelectorAll('#lang-select, .hud-lang-select');
  langSelects.forEach(select => {
    if (select && select.value !== currentLang) {
      select.value = currentLang;
    }
  });

  // Translate text elements
  const textEls = document.querySelectorAll('[data-i18n]');
  textEls.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;

    let params = {};
    const rawParams = el.getAttribute('data-i18n-params');
    if (rawParams) {
      try {
        params = JSON.parse(rawParams);
      } catch (e) {}
    }

    const translated = t(key, params);
    if (translated !== undefined && translated !== key) {
      if (typeof translated === 'string' && (translated.includes('<') || translated.includes('&'))) {
        el.innerHTML = translated;
      } else {
        el.textContent = translated;
      }
    }
  });

  // Translate attribute elements
  const attrEls = document.querySelectorAll('[data-i18n-attr]');
  attrEls.forEach(el => {
    const raw = el.getAttribute('data-i18n-attr');
    if (!raw) return;

    let params = {};
    const rawParams = el.getAttribute('data-i18n-params');
    if (rawParams) {
      try {
        params = JSON.parse(rawParams);
      } catch (e) {}
    }

    const pairs = raw.split(',');
    pairs.forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (attr && key) {
        const translated = t(key, params);
        if (translated !== undefined && translated !== key) {
          el.setAttribute(attr, translated);
        }
      }
    });
  });

  // Dispatch event so live JavaScript controllers (calculator, viewer, orrery) can update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('space:langchange', { detail: { lang: currentLang } }));
  }
}

/**
 * Switch active language and update DOM
 */
export async function setLanguage(lang) {
  currentLang = lang;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('space_lang', lang);
  }
  if (lang !== 'en' && !translations[lang]) {
    await loadLanguage(lang);
  }
  applyTranslations();
}

/**
 * Initialize i18n subsystem
 */
export async function initI18n() {
  currentLang = getLanguage();

  if (typeof document !== 'undefined') {
    document.addEventListener('change', e => {
      if (e.target && (e.target.id === 'lang-select' || e.target.classList.contains('hud-lang-select'))) {
        setLanguage(e.target.value);
      }
    });
  }

  // Load language if not english
  if (currentLang !== 'en' && !translations[currentLang]) {
    await loadLanguage(currentLang);
  }

  applyTranslations();
}
