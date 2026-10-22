import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { planets, sunData } from '../src/js/data/planets.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getGitCommit() {
  if (process.env.COMMIT_REF) {
    return process.env.COMMIT_REF.substring(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    return 'master';
  }
}

// Ensure public and subdirectories exist
const pubDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(pubDir)) {
  fs.mkdirSync(pubDir, { recursive: true });
}
for (const sub of ['css', 'js', 'planets', 'images', 'i18n']) {
  const dir = path.resolve(pubDir, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 1. Copy src/index.html -> public/index.html
const srcIndex = path.resolve(__dirname, '../src/index.html');
const pubIndex = path.resolve(pubDir, 'index.html');
if (fs.existsSync(srcIndex)) {
  fs.copyFileSync(srcIndex, pubIndex);
  console.log('Copied: src/index.html -> public/index.html');
}

// 2. Copy images/ -> public/images/
const srcImagesDir = path.resolve(__dirname, '../images');
const pubImagesDir = path.resolve(pubDir, 'images');
if (fs.existsSync(srcImagesDir)) {
  if (!fs.existsSync(pubImagesDir)) {
    fs.mkdirSync(pubImagesDir, { recursive: true });
  }
  const imgFiles = fs.readdirSync(srcImagesDir);
  imgFiles.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.svg') || file.endsWith('.webp')) {
      fs.copyFileSync(path.join(srcImagesDir, file), path.join(pubImagesDir, file));
    }
  });
  console.log('Copied: images/ -> public/images/');
}

// 3. Ensure public/planets exists
const outputDir = path.resolve(pubDir, 'planets');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 4. Copy i18n JSON files to public/i18n
const srcI18nDir = path.resolve(__dirname, '../src/i18n');
const pubI18nDir = path.resolve(pubDir, 'i18n');
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
  console.log('Copied: src/i18n/ -> public/i18n/');
}

// 5. Compile src/credits.html -> public/credits.html with Git commit and version
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
const appVersion = pkg.version || '1.0.0';
const gitCommit = getGitCommit();
const commitUrl = `https://github.com/subinamathew/space-travel/commit/${gitCommit}`;
const buildDate = new Date().toISOString().split('T')[0];

const srcCredits = path.resolve(__dirname, '../src/credits.html');
const pubCredits = path.resolve(pubDir, 'credits.html');
if (fs.existsSync(srcCredits)) {
  let creditsContent = fs.readFileSync(srcCredits, 'utf8');
  creditsContent = creditsContent
    .replace(/\{\{APP_VERSION\}\}/g, appVersion)
    .replace(/\{\{GIT_COMMIT\}\}/g, gitCommit)
    .replace(/\{\{COMMIT_URL\}\}/g, commitUrl)
    .replace(/\{\{BUILD_DATE\}\}/g, buildDate);
  fs.writeFileSync(pubCredits, creditsContent, 'utf8');
  console.log(`Generated: public/credits.html (commit: ${gitCommit}, version: ${appVersion})`);
}

// Write public/version.json
fs.writeFileSync(
  path.resolve(pubDir, 'version.json'),
  JSON.stringify({
    appName: 'RocketRun',
    domain: 'rocketrun.de',
    copyright: '© 2026 rocketrun.de',
    version: appVersion,
    commit: gitCommit,
    commitUrl,
    buildDate,
    time: new Date().toISOString()
  }, null, 2),
  'utf8'
);
console.log('Generated: public/version.json');



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
        <div class="info-card" role="button" tabindex="0" aria-haspopup="dialog" aria-label="${s.label}: ${s.value}. Click for kids science explanation" data-stat-idx="${sIdx}" data-body="${p.slug}" title="Click for kids science explanation">
            <span class="info-label" data-i18n="planets.${p.slug}.stats.${sIdx}.label">${s.label}</span>
            <span class="info-val" data-i18n="planets.${p.slug}.stats.${sIdx}.value">${s.value}</span>
            <span class="info-sub" data-i18n="planets.${p.slug}.stats.${sIdx}.sub">${s.sub}</span>
            <span class="info-hint-badge" data-i18n="ui.tap_kids_explainer">💡 Tap for Kids Explainer</span>
        </div>`
    )
    .join('');

  const dotsHtml = allBodies
    .map(
      (other, i) => `
        <a class="tab-link ${i === idx ? 'active' : ''}" href="${other.slug}.html" title="${other.name}" aria-label="${other.name}"></a>`
    )
    .join('');

  const defaultBodyWeight = (70 * p.gravityRatio).toFixed(p.gravityRatio * 70 >= 100 ? 0 : 1);
  const defaultEarthJump = 44; // cm for 175cm person
  const defaultBodyJump = p.gravityRatio >= 20 ? '0' : (defaultEarthJump / p.gravityRatio).toFixed((defaultEarthJump / p.gravityRatio) >= 100 ? 0 : 1);

  const htmlContent = `<!DOCTYPE html>
<html lang="en" style="--c1: ${p.c1}; --c2: ${p.c2}; --glow: ${p.glow};">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title data-i18n="ui.subpage_title" data-i18n-params='{"name":"${p.name}"}'>${p.name} — RocketRun Solar System Exploration</title>
    <meta name="description" content="Explore ${p.name} on RocketRun: scientific metrics, physical properties, gravity calculator, and NASA kids facts." data-i18n-attr="content:ui.subpage_meta_desc" data-i18n-params='{"name":"${p.name}"}' />
    <meta name="author" content="Zachary David Mathew + Papa" />
    <meta name="copyright" content="rocketrun.de" />
    <meta name="application-name" content="RocketRun" />
    <meta name="theme-color" content="#030712" />
    <link rel="canonical" href="https://rocketrun.de/planets/${p.slug}.html" />

    <!-- Open Graph / Facebook / WhatsApp / LinkedIn -->
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="RocketRun" />
    <meta property="og:url" content="https://rocketrun.de/planets/${p.slug}.html" />
    <meta property="og:title" content="${p.name} — RocketRun Solar System Exploration" />
    <meta property="og:description" content="Explore ${p.name} on RocketRun (rocketrun.de): real orbital physics, planetary atmosphere, gravity calculator, and kids mission facts." />
    <meta property="og:image" content="https://rocketrun.de/images/${p.slug}.png" />
    <meta property="og:image:secure_url" content="https://rocketrun.de/images/${p.slug}.png" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${p.name} — RocketRun Solar System Exploration" />
    <meta property="og:locale" content="en_US" />

    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@rocketrun_de" />
    <meta name="twitter:creator" content="@rocketrun_de" />
    <meta name="twitter:title" content="${p.name} — RocketRun Solar System Exploration" />
    <meta name="twitter:description" content="Explore ${p.name} on RocketRun (rocketrun.de): real orbital physics, planetary atmosphere, gravity calculator, and kids mission facts." />
    <meta name="twitter:image" content="https://rocketrun.de/images/${p.slug}.png" />
    <meta name="twitter:image:alt" content="${p.name} — RocketRun Solar System Exploration" />

    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../css/style.css?v=${appVersion}" />
    <script src="../js/planet.min.js?v=${appVersion}" defer></script>
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
                <div class="settings-row settings-credits-row">
                    <a href="../credits.html" class="settings-credits-link" aria-label="About & Credits" data-i18n-attr="aria-label:ui.credits_btn">
                        <span class="credits-icon">👥</span>
                        <span data-i18n="ui.credits_btn">About & Credits</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- Quick Access People / Credits Button -->
        <a href="../credits.html" class="hud-circle-btn hud-people-btn in-stack" aria-label="About & Credits" title="About & Credits" data-i18n-attr="aria-label:ui.credits_btn,title:ui.credits_btn">
            <span class="hud-people-icon">👥</span>
        </a>
    </div>

    <main class="planet-subpage">
        <div class="subpage-layout">
            <div class="planet-stage">
                <div class="subpage-planet-preview">
                    <img
                        src="../images/${p.slug}.png"
                        alt="${p.name}"
                        class="subpage-planet-img ${p.isSun ? 'is-sun' : ''} ${p.hasRing ? 'has-rings' : ''}"
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
            <aside class="space-calc-sidebar is-minimized" id="space-calc-sidebar" data-gravity="${p.gravityRatio}" data-body="${p.name}" data-slug="${p.slug}">
                <div class="calc-header" id="calc-header" role="button" tabindex="0" aria-expanded="false" aria-controls="sidebar-body" aria-label="Expand Cosmic Explorer Lab" title="Click to minimize or expand" data-i18n-attr="aria-label:ui.expand_lab">
                    <div class="calc-header-left">
                        <span class="calc-icon">🧑‍🚀</span>
                        <div class="calc-header-text">
                            <h3 data-i18n="ui.lab_title">Cosmic Explorer Lab</h3>
                            <p class="calc-physics-desc" data-i18n="ui.lab_physics" data-i18n-params='{"gravity":"${(p.gravityRatio).toFixed(2)}"}'>Gravity: ${(p.gravityRatio).toFixed(2)}× Earth &bull; Live Physics</p>
                            <div class="calc-min-stats" id="calc-min-stats">
                                <span class="min-stat-chip">
                                    <span class="min-stat-icon">⚖️</span>
                                    <span class="min-stat-label" data-i18n="ui.weight_short">Weight:</span>
                                    <strong id="min-weight-val">${defaultBodyWeight} kg</strong>
                                </span>
                                <span class="min-stat-divider">•</span>
                                <span class="min-stat-chip">
                                    <span class="min-stat-icon">🦘</span>
                                    <span class="min-stat-label" data-i18n="ui.jump_short">Jump:</span>
                                    <strong id="min-jump-val">${defaultBodyJump} cm</strong>
                                </span>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="sidebar-toggle-btn" id="sidebar-toggle-btn" aria-label="Expand Cosmic Explorer Lab" title="Expand Cosmic Explorer Lab" aria-expanded="false" data-i18n-attr="aria-label:ui.expand_lab">
                        <span class="toggle-icon">+</span>
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

    <!-- Kid-Friendly Science Explanation Popup Modal -->
    <div id="stat-modal-backdrop" class="stat-modal-backdrop" aria-hidden="true">
        <div id="stat-modal" class="stat-modal" role="dialog" aria-modal="true" aria-labelledby="stat-modal-label">
            <div class="stat-modal-header">
                <div class="stat-modal-badge" data-i18n="ui.kids_guide_badge">🚀 Explainer</div>
                <button type="button" class="stat-modal-close" id="stat-modal-close" aria-label="Close dialog">✕</button>
            </div>
            <div class="stat-modal-body">
                <span class="stat-modal-icon" id="stat-modal-icon">🌟</span>
                <div class="stat-modal-titles">
                    <h4 class="stat-modal-label" id="stat-modal-label">Surface Temperature</h4>
                    <div class="stat-modal-val" id="stat-modal-val">5,500°C</div>
                </div>
                <div class="stat-modal-explainer-box">
                    <p class="stat-modal-text" id="stat-modal-text"></p>
                </div>
            </div>
            <div class="stat-modal-footer">
                <button type="button" class="stat-modal-btn-ok" id="stat-modal-btn-ok" data-i18n="ui.close_popup">Got it!</button>
            </div>
        </div>
    </div>
</body>

</html>
`;

  const targetFile = path.join(outputDir, `${p.slug}.html`);
  fs.writeFileSync(targetFile, htmlContent, 'utf-8');
  console.log(`Generated: public/planets/${p.slug}.html`);
});

console.log('All celestial subpages (The Sun + 8 Planets) generated successfully.');
