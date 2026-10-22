import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { planets, sunData } from '../src/js/data/planets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../public/planets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy i18n JSON files to public/i18n as well
const srcI18nDir = path.resolve(__dirname, '../src/i18n');
const pubI18nDir = path.resolve(__dirname, '../public/i18n');
if (fs.existsSync(srcI18nDir)) {
  if (!fs.existsSync(pubI18nDir)) {
    fs.mkdirSync(pubI18nDir, { recursive: true });
  }
  const i18nFiles = fs.readdirSync(srcI18nDir);
  i18nFiles.forEach(file => {
    if (file.endsWith('.json')) {
      fs.copyFileSync(path.join(srcI18nDir, file), path.join(pubI18nDir, file));
    }
  });
}

// Keep public/index.html in sync with root index.html
const rootIndex = path.resolve(__dirname, '../index.html');
const pubIndex = path.resolve(__dirname, '../public/index.html');
if (fs.existsSync(rootIndex)) {
  fs.copyFileSync(rootIndex, pubIndex);
}

// Celestial bodies in order: Sun -> Mercury -> ... -> Neptune
const allBodies = [sunData, ...planets];

allBodies.forEach((p, idx) => {
  const prevIdx = (idx - 1 + allBodies.length) % allBodies.length;
  const nextIdx = (idx + 1) % allBodies.length;
  const prevBody = allBodies[prevIdx];
  const nextBody = allBodies[nextIdx];

  const cardsHtml = p.stats
    .map(
      (s, sIdx) => `
        <div class="info-card">
            <span class="info-label" data-i18n="planets.${p.slug}.stats.${sIdx}.label">${s.label}</span>
            <span class="info-val" data-i18n="planets.${p.slug}.stats.${sIdx}.value">${s.value}</span>
            <span class="info-sub" data-i18n="planets.${p.slug}.stats.${sIdx}.sub">${s.sub}</span>
        </div>`
    )
    .join('');

  const dotsHtml = allBodies
    .map(
      (other, i) => `
        <a class="tab-link ${other.isSun ? 'sun-tab' : ''} ${i === idx ? 'active' : ''}" href="${other.slug}.html" title="${other.name}" aria-label="${other.name}"></a>`
    )
    .join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="en" style="--c1: ${p.c1}; --c2: ${p.c2}; --glow: ${p.glow};">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title data-i18n="ui.subpage_title" data-i18n-params='{"name":"${p.name}"}'>${p.name} — Solar System Exploration</title>
    <meta name="description" content="Explore ${p.name}: scientific metrics, physical properties, gravity calculator, and NASA kids facts." data-i18n-attr="content:ui.subpage_meta_desc" data-i18n-params='{"name":"${p.name}"}' />
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../css/style.css" />
    <script src="../js/planet.min.js" defer></script>
</head>

<body class="subpage-body" style="background: ${p.bg};">
    <canvas id="stars"></canvas>

    <a id="back-btn" class="visible" href="../index.html" aria-label="Back to solar system" data-i18n="ui.back_btn" data-i18n-attr="aria-label:ui.back_btn">← Solar System</a>

    <!-- Top-Right HUD Stack: Galactic Location + Settings HUD -->
    <div class="hud-stack">
        <div id="galaxy-hud" class="in-stack visible" aria-label="Galactic location">
            <div class="hud-header" role="button" tabindex="0" aria-label="Toggle Galactic HUD" title="Minimize / Expand HUD" data-i18n-attr="aria-label:ui.toggle_hud,title:ui.toggle_hud">
                <div class="hud-header-title">
                    <span>🌌</span>
                    <span data-i18n="ui.sector_full">Sector: Milky Way Galaxy &bull; Orion Arm</span>
                </div>
                <button type="button" class="hud-toggle-btn" id="hud-toggle-btn" aria-label="Minimize Galactic HUD" title="Minimize / Expand HUD" data-i18n-attr="aria-label:ui.minimize_hud,title:ui.minimize_hud">
                    <span class="hud-toggle-icon">−</span>
                </button>
            </div>
            <div class="hud-body" id="hud-body">
                <div class="hud-row">
                    <span><span data-i18n="ui.galactic_coords_label">Galactic Coordinates:</span> <strong data-i18n="ui.galactic_coords_val">RA 17h 45.6m, Dec -29°00′</strong></span>
                </div>
                <div class="hud-row">
                    <span><span data-i18n="ui.core_distance_label">Core Distance:</span> <strong data-i18n="ui.core_distance_val">26,000 Light-Years</strong></span>
                </div>
            </div>
        </div>

        <div id="settings-hud" class="in-stack visible" aria-label="Settings and Language">
            <div class="hud-header" role="button" tabindex="0" aria-label="Toggle Settings HUD" title="Minimize / Expand Settings" data-i18n-attr="aria-label:ui.toggle_settings,title:ui.toggle_settings">
                <div class="hud-header-title">
                    <span>⚙️</span>
                    <span data-i18n="ui.settings_title">Settings</span>
                </div>
                <button type="button" class="hud-toggle-btn" id="settings-toggle-btn" aria-label="Minimize Settings HUD" title="Minimize / Expand Settings" data-i18n-attr="aria-label:ui.minimize_settings,title:ui.minimize_settings">
                    <span class="settings-toggle-icon">−</span>
                </button>
            </div>
            <div class="hud-body" id="settings-hud-body">
                <div class="settings-row">
                    <label for="lang-select" class="settings-label" data-i18n="ui.language_label">Language:</label>
                    <select id="lang-select" class="hud-lang-select" aria-label="Select Language">
                        <option value="en">🇬🇧 English</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="it">🇮🇹 Italiano</option>
                        <option value="ja">🇯🇵 日本語</option>
                        <option value="zh">🇨🇳 中文</option>
                    </select>
                </div>
            </div>
        </div>
    </div>

    <main class="planet-subpage">
        <div class="subpage-layout">
            <div class="planet-stage">
                <div class="subpage-planet-preview">
                    <img
                        src="../images/${p.slug}.png"
                        alt="${p.name}"
                        class="subpage-planet-img ${p.isSun ? 'is-sun' : ''}"
                        width="${p.hasRing ? Math.round(p.pvSize * 1.6) : p.pvSize}"
                        height="${p.pvSize}"
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div class="planet-title-group">
                    <p class="planet-tagline" data-i18n="planets.${p.slug}.greeting">— ${p.greeting} —</p>
                    <h1 data-i18n="planets.${p.slug}.name">${p.name}</h1>
                    <p class="planet-summary" data-i18n="planets.${p.slug}.fact">${p.fact}</p>
                </div>

                <section class="planet-info-grid" aria-label="Scientific specifications" data-i18n-attr="aria-label:ui.specs_heading">
                    ${cardsHtml}
                </section>

                <nav class="subpage-controls" aria-label="Planet navigation" data-i18n-attr="aria-label:ui.planet_nav_aria">
                    <div class="subpage-arrows">
                        <a id="subpage-btn-prev" class="subpage-nav-link" href="${prevBody.slug}.html" data-prev-slug="${prevBody.slug}" aria-label="Previous: ${prevBody.name}">← ${prevBody.name}</a>
                        <span class="subpage-counter" data-i18n="ui.counter" data-i18n-params='{"current":${idx + 1},"total":${allBodies.length}}'>${idx + 1} / ${allBodies.length}</span>
                        <a id="subpage-btn-next" class="subpage-nav-link" href="${nextBody.slug}.html" data-next-slug="${nextBody.slug}" aria-label="Next: ${nextBody.name}">${nextBody.name} →</a>
                    </div>
                    <div class="subpage-tabs" role="tablist" aria-label="Direct celestial body selector" data-i18n-attr="aria-label:ui.selector_aria">
                        ${dotsHtml}
                    </div>
                </nav>
            </div>

            <!-- Floating Cosmic Explorer Lab & NASA Kids Corner -->
            <aside class="space-calc-sidebar" id="space-calc-sidebar" data-gravity="${p.gravityRatio}" data-body="${p.name}" data-slug="${p.slug}">
                <div class="calc-header" id="calc-header" role="button" tabindex="0" aria-expanded="true" aria-controls="sidebar-body" aria-label="Toggle Cosmic Explorer Lab" title="Click to minimize or expand" data-i18n-attr="aria-label:ui.toggle_lab">
                    <div class="calc-header-left">
                        <span class="calc-icon">🧑‍🚀</span>
                        <div class="calc-header-text">
                            <h3 data-i18n="ui.lab_title">Cosmic Explorer Lab</h3>
                            <p data-i18n="ui.lab_physics" data-i18n-params='{"gravity":"${(p.gravityRatio).toFixed(2)}"}'>Gravity: ${(p.gravityRatio).toFixed(2)}× Earth &bull; Live Physics</p>
                        </div>
                    </div>
                    <button type="button" class="sidebar-toggle-btn" id="sidebar-toggle-btn" aria-label="Minimize Cosmic Explorer Lab" title="Minimize / Expand" data-i18n-attr="aria-label:ui.minimize_lab">
                        <span class="toggle-icon">−</span>
                    </button>
                </div>

                <div class="sidebar-body" id="sidebar-body">
                    <form class="calc-form" onsubmit="return false;">
                        <div class="calc-field">
                            <div class="field-label-row">
                                <label for="input-weight" data-i18n="ui.your_weight">Your Weight</label>
                                <div class="unit-toggle" id="weight-unit-toggle">
                                    <button type="button" class="unit-btn active" data-unit="kg">kg</button>
                                    <button type="button" class="unit-btn" data-unit="lbs">lbs</button>
                                </div>
                            </div>
                            <div class="input-wrap">
                                <input type="number" id="input-weight" min="5" max="500" step="1" value="45" placeholder="Weight" data-i18n-attr="placeholder:ui.weight_placeholder" />
                                <span class="input-suffix" id="weight-suffix">kg</span>
                            </div>
                            <div class="calc-presets">
                                <button type="button" class="preset-btn" data-target="weight" data-val-kg="25" data-val-lbs="55" data-i18n="ui.preset_kid">Kid (25kg/55lb)</button>
                                <button type="button" class="preset-btn" data-target="weight" data-val-kg="50" data-val-lbs="110" data-i18n="ui.preset_teen">Teen (50kg/110lb)</button>
                                <button type="button" class="preset-btn" data-target="weight" data-val-kg="70" data-val-lbs="154" data-i18n="ui.preset_adult">Adult (70kg/154lb)</button>
                            </div>
                        </div>

                        <div class="calc-field">
                            <div class="field-label-row">
                                <label for="input-height" data-i18n="ui.your_height">Your Height</label>
                                <div class="unit-toggle" id="height-unit-toggle">
                                    <button type="button" class="unit-btn active" data-unit="cm">cm</button>
                                    <button type="button" class="unit-btn" data-unit="in">in</button>
                                </div>
                            </div>
                            <div class="input-wrap">
                                <input type="number" id="input-height" min="40" max="260" step="1" value="140" placeholder="Height" data-i18n-attr="placeholder:ui.height_placeholder" />
                                <span class="input-suffix" id="height-suffix">cm</span>
                            </div>
                            <div class="calc-presets">
                                <button type="button" class="preset-btn" data-target="height" data-val-cm="120" data-val-in="47" data-i18n="ui.preset_7yr">7 yr (120cm)</button>
                                <button type="button" class="preset-btn" data-target="height" data-val-cm="138" data-val-in="54" data-i18n="ui.preset_10yr">10 yr (138cm)</button>
                                <button type="button" class="preset-btn" data-target="height" data-val-cm="170" data-val-in="67" data-i18n="ui.preset_adult_h">Adult (170cm)</button>
                            </div>
                        </div>
                    </form>

                    <div class="calc-results">
                        <div class="result-card primary">
                            <span class="result-label" data-i18n="ui.weight_on" data-i18n-params='{"name":"${p.name}"}'>Your Weight on ${p.name}</span>
                            <div class="result-value-row">
                                <span class="result-number" id="output-weight">—</span>
                                <span class="result-unit" id="output-weight-unit">kg</span>
                            </div>
                            <p class="result-comparison" id="output-weight-comparison" data-i18n="ui.prompt_enter_weight">Calculating cosmic scale...</p>
                        </div>

                        <div class="result-card secondary">
                            <span class="result-label" data-i18n="ui.jump_on" data-i18n-params='{"name":"${p.name}"}'>Your Jump Height on ${p.name}</span>
                            <div class="result-value-row">
                                <span class="result-number" id="output-jump">—</span>
                                <span class="result-unit" id="output-jump-unit">cm</span>
                            </div>
                            <p class="result-comparison" id="output-jump-comparison" data-i18n="ui.prompt_enter_height">Calculating leap power...</p>
                        </div>
                    </div>

                    <div class="kids-corner">
                        <span class="kids-badge" data-i18n="planets.${p.slug}.kids.badge">${p.kidsNote.badge}</span>
                        <h4 class="kids-title" data-i18n="planets.${p.slug}.kids.title">${p.kidsNote.title}</h4>
                        <p class="kids-item">🦘 <strong>Super Jump:</strong> <span data-i18n="planets.${p.slug}.kids.jump">${p.kidsNote.jump}</span></p>
                        <p class="kids-item">💡 <strong>Cosmic Wonder:</strong> <span data-i18n="planets.${p.slug}.kids.fact">${p.kidsNote.fact}</span></p>
                    </div>
                </div>
            </aside>
        </div>
    </main>
</body>

</html>
`;

  const targetFile = path.join(outputDir, `${p.slug}.html`);
  fs.writeFileSync(targetFile, htmlContent, 'utf-8');
  console.log(`Generated: public/planets/${p.slug}.html`);
});

console.log('All celestial subpages (The Sun + 8 Planets) generated successfully.');
