/**
 * i18n Internationalization Subsystem
 * Bundles multi-language dictionaries with live reactive DOM translation,
 * localStorage persistence, parameter interpolation, and custom change events.
 */

import en from '../i18n/en.json' with { type: 'json' };
import de from '../i18n/de.json' with { type: 'json' };
import fr from '../i18n/fr.json' with { type: 'json' };
import es from '../i18n/es.json' with { type: 'json' };
import it from '../i18n/it.json' with { type: 'json' };
import ja from '../i18n/ja.json' with { type: 'json' };
import zh from '../i18n/zh.json' with { type: 'json' };

export const translations = {
  en,
  de,
  fr,
  es,
  it,
  ja,
  zh
};

export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' }
];

let currentLang = 'en';

export function getLanguage() {
  const saved = localStorage.getItem('space_lang');
  if (saved && translations[saved]) return saved;
  const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase();
  if (translations[browserLang]) return browserLang;
  return 'en';
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

    // Optional params can be passed via data-i18n-params='{"name":"Mars"}'
    let params = {};
    const rawParams = el.getAttribute('data-i18n-params');
    if (rawParams) {
      try {
        params = JSON.parse(rawParams);
      } catch (e) {
        // ignore
      }
    }

    const translated = t(key, params);
    if (translated !== undefined && translated !== key) {
      // Check if translation contains HTML (like &bull; or <strong>)
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
  window.dispatchEvent(new CustomEvent('space:langchange', { detail: { lang: currentLang } }));
}

/**
 * Switch active language and update DOM
 */
export function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('space_lang', lang);
  applyTranslations();
}

/**
 * Initialize i18n subsystem
 */
export function initI18n() {
  currentLang = getLanguage();

  // Attach change listeners to any language dropdown
  document.addEventListener('change', e => {
    if (e.target && (e.target.id === 'lang-select' || e.target.classList.contains('hud-lang-select'))) {
      setLanguage(e.target.value);
    }
  });

  // Apply translations immediately
  applyTranslations();
}
