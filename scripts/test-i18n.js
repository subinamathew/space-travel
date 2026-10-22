import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import our i18n module
import { t, setLanguage, getLanguage, translations, supportedLanguages } from '../src/js/i18n.js';

// In Node.js testing environment, load all supported language files from src/i18n
const i18nDir = path.resolve(__dirname, '../src/i18n');
for (const langObj of supportedLanguages) {
  const code = langObj.code;
  if (!translations[code]) {
    const file = path.join(i18nDir, `${code}.json`);
    translations[code] = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
}

console.log('--- Testing i18n Module ---');
console.log('Available languages:', Object.keys(translations));

// Test 1: Translation retrieval
console.log('\n[Test 1: Core Translations]');
console.log('EN title:', t('ui.site_title'));
console.log('DE title:', translations.de.ui.site_title);
console.log('FR title:', translations.fr.ui.site_title);
console.log('JA title:', translations.ja.ui.site_title);
console.log('ZH title:', translations.zh.ui.site_title);

// Test 2: Parameter interpolation
console.log('\n[Test 2: Parameter Interpolation]');
console.log('EN weight on Mars:', t('ui.weight_on', { name: 'Mars' }));
console.log('DE weight on Mars:', translations.de.ui.weight_on.replace('{name}', 'Mars'));
console.log('JA weight on Mars:', translations.ja.ui.weight_on.replace('{name}', '火星'));
console.log('ZH weight on Mars:', translations.zh.ui.weight_on.replace('{name}', '火星'));

// Test 3: Planet specific metrics
console.log('\n[Test 3: Planet Metrics & Kids Mission]');
console.log('Mars name (EN):', t('planets.mars.name'));
console.log('Mars name (DE):', translations.de.planets.mars.name);
console.log('Mars name (JA):', translations.ja.planets.mars.name);
console.log('Mars kids jump (ZH):', translations.zh.planets.mars.kids.jump);
console.log('Sun mass (FR):', translations.fr.planets.sun.stats[3].label, '=', translations.fr.planets.sun.stats[3].value);

// Test 4: Key parity check
console.log('\n[Test 4: Translation Parity Across All 7 Languages]');
const enUiKeys = Object.keys(translations.en.ui);
const enPlanets = Object.keys(translations.en.planets);

let allValid = true;
for (const lang of ['de', 'fr', 'es', 'it', 'ja', 'zh']) {
  const missingUi = enUiKeys.filter(k => translations[lang].ui[k] === undefined);
  const missingPlanets = enPlanets.filter(k => translations[lang].planets[k] === undefined);
  if (missingUi.length > 0) {
    console.error(`Missing UI keys in ${lang}:`, missingUi);
    allValid = false;
  }
  if (missingPlanets.length > 0) {
    console.error(`Missing planet keys in ${lang}:`, missingPlanets);
    allValid = false;
  }
}

if (allValid) {
  console.log('PERFECT PARITY: All 7 languages have 100% of the UI keys and celestial bodies!');
} else {
  process.exit(1);
}
