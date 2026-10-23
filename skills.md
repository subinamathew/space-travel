---
name: rocketrun-development-standards
description: >-
  Core engineering skills, architectural principles, multi-agent contracts,
  pedagogical standards, web security anti-hacking rules, open source licensing,
  and quality guidelines for RocketRun (rocketrun.org). Enforces CSS over JS,
  conventional commits, lightweight semantic HTML, low cyclomatic complexity (<= 8),
  procedural asset rendering, strict i18n parity, enterprise security headers (CSP),
  MIT attribution licensing, and 60fps performance on lower-end devices.
---

# Engineering Skills & Development Guidelines

This document defines the core engineering skills, architectural principles, quality standards, and development rules for the **RocketRun (rocketrun.org)** project. All contributors, agents, and pipelines must adhere to these practices to ensure high performance, maintainability, rock-solid stability, security, and an optimal experience across all devices.

---

## Table of Contents

1. [Skill 1: Conventional & Descriptive Commit Messages](#skill-1-conventional--descriptive-commit-messages)
2. [Skill 2: Software Engineering Best Practices & Architecture](#skill-2-software-engineering-best-practices--architecture)
3. [Skill 3: CSS Over JavaScript (Declarative Compositor-First)](#skill-3-css-over-javascript-declarative-compositor-first)
4. [Skill 4: Lightweight HTML & Minimal DOM Footprint](#skill-4-lightweight-html--minimal-dom-footprint)
5. [Skill 5: Manageable Cyclomatic Complexity & Clean Logic](#skill-5-manageable-cyclomatic-complexity--clean-logic)
6. [Skill 6: Asset Handling, Zero External Assets & Tooling Constraints](#skill-6-asset-handling-zero-external-assets--tooling-constraints)
7. [Skill 7: Robust CI/CD (Continuous Integration & Delivery)](#skill-7-robust-cicd-continuous-integration--delivery)
8. [Skill 8: Automated Testing & Verification](#skill-8-automated-testing--verification)
9. [Skill 9: Low-End Hardware & Handheld Performance Optimization](#skill-9-low-end-hardware--handheld-performance-optimization)
10. [Skill 10: Full Internationalization (i18n) & Accessibility (a11y)](#skill-10-full-internationalization-i18n--accessibility-a11y)
11. [Skill 11: Child Pedagogy & Metaphor Design for Scientific Explanations](#skill-11-child-pedagogy--metaphor-design-for-scientific-explanations)
12. [Skill 12: Metadata, OpenGraph & Social Sharing Standards](#skill-12-metadata-opengraph--social-sharing-standards)
13. [Skill 13: Web Security, Anti-Hacking & Defense-in-Depth](#skill-13-web-security-anti-hacking--defense-in-depth)
14. [Skill 14: Open Source Licensing, Attribution & Trademark Integrity](#skill-14-open-source-licensing-attribution--trademark-integrity)
15. [Skill 15: GDPR-Compliant Local Storage, Data Erasure & Accessible Features Standard](#skill-15-gdpr-compliant-local-storage-data-erasure--accessible-features-standard)
16. [Skill 16: Zero Native Browser Dialogs (No window.alert, confirm, or prompt — In-App Notifications Only)](#skill-16-zero-native-browser-dialogs-no-windowalert-confirm-or-prompt--in-app-notifications-only)
17. [Pre-Flight Verification Checklist](#pre-flight-verification-checklist)

---

## Skill 1: Conventional & Descriptive Commit Messages

### Core Rule
Every commit must be **atomic**, **descriptive**, and follow the **Conventional Commits** specification. A commit should do one logical thing and do it completely, ensuring a clean `git log` and effortless bisections.

### Format
```text
<type>(<scope>): <short imperative summary>

[optional body explaining motivation, technical rationale, and non-obvious choices]

[optional footer: issue references, breaking changes, or deployment notes]
```

### Allowed Types
- `feat`: A new user-facing feature or enhancement (e.g., adding a new celestial popup or crawl effect).
- `fix`: A bug fix (e.g., resolving unstyled switches or stale cache headers).
- `perf`: A code change that improves rendering or compute performance without altering functionality.
- `refactor`: Code restructuring without bug fixes or feature additions (e.g., moving math from JS into CSS).
- `style`: Changes that do not affect code logic (formatting, white-space, CSS layout cleanup).
- `test`: Adding missing tests or correcting existing tests.
- `docs`: Documentation updates (e.g., `README.md`, `skills.md`, code comments).
- `ci`: CI/CD pipeline or deployment configuration changes (e.g., `netlify.toml`, build scripts).
- `chore`: Maintenance tasks, dependency updates, or internal build tooling changes.

### Best Practices & Rules
- **Imperative Mood**: Write `"add feature"` or `"fix orbit alignment"`, NOT `"added feature"` or `"fixes orbit alignment"`.
- **Character Limit**: Keep the summary line strictly under 72 characters.
- **Explain the "Why", Not Just the "What"**: Use the commit body to document *why* a particular decision was made (e.g., why CSS custom properties were chosen over `requestAnimationFrame`).
- **Never Commit Secrets or Ephemeral Files**: Never commit `.env`, `.DS_Store`, build outputs (`public/`), or scratch scripts.

---

## Skill 2: Software Engineering Best Practices & Architecture

### Core Rule
Write modular, defensive, self-documenting code with clear separation of concerns: HTML provides structure, SCSS provides layout/presentation, and JavaScript coordinates user interaction and state dispatch.

### Principles
1. **Single Source of Truth (SSOT)**:
   - Planetary metrics and orbital constants live exclusively in `src/js/data/planets.js`.
   - Localized strings live exclusively in `src/i18n/*.json`.
   - Never duplicate numerical data, copy strings, or hardcode magic numbers across templates.
2. **Defensive Programming**:
   - Guard against `null` or `undefined` DOM references before attaching listeners.
   - Fail gracefully with fallbacks (e.g., if a translation key is missing or a storage quota is exceeded).
   - Use strict type checks (`===`) and avoid silent type coercions.
3. **No Dead or Unused Code**:
   - Prune obsolete helper functions, commented-out debug code, and unused CSS rules.
4. **Cache Invalidation & Asset Versioning**:
   - All production asset links (`style.css`, `script.min.js`) must include query hashes or build versions (`?v=X.Y.Z`) to prevent stale browser disk caching.
   - Configure cache headers defensively (`max-age=0, must-revalidate` for HTML and version-controlled bundles).
5. **Zero Native Browser Dialogs (`alert`, `confirm`, `prompt`)**:
   - Never invoke `window.alert()`, `confirm()`, or `prompt()`. They block the JavaScript event loop, freeze 60fps animations, cause audio hitching, and break user immersion.
   - Deliver all notices, warnings, and error messages via accessible, non-blocking in-app toasts (`showGameNotification(message, type, duration)`) with `aria-live="polite"` and GPU-composited styling.

---

## Skill 3: CSS Over JavaScript (Declarative Compositor-First)

### Core Rule
**Always prefer pure CSS over JavaScript for animations, transitions, responsive layouts, and visual states.** Delegate rendering and motion to the browser's hardware-accelerated compositor thread.

### Guidelines
1. **Zero-JS Animation Loops**:
   - Never run continuous `requestAnimationFrame` or `setInterval` loops to update DOM styles (`element.style.left`, `style.transform`, etc.).
   - Use CSS `@keyframes`, transitions, and CSS Custom Properties (`var(--*)`) instead.
2. **Hardware Compositing (GPU Acceleration)**:
   - Animate ONLY `transform` and `opacity`.
   - Avoid animating layout-triggering properties (`top`, `left`, `width`, `height`, `margin`, `padding`) or paint-heavy properties (`box-shadow`, `border-radius`, `filter`).
   - Use `will-change: transform` sparingly on active animation layers to promote elements to dedicated GPU render layers without exhausting VRAM.
3. **Pure CSS State & Hover Logic**:
   - Use `:hover`, `:focus-visible`, `:active`, and modern `:has()` selector patterns for hover-pausing, disclosure, and interactive UI states.
   - *Example*: `#scene:has(:hover) .orbit-carrier { animation-play-state: paused; }` pauses 3D planetary motion without a single line of JS.
4. **CSS Mathematical Calculations**:
   - Leverage `calc()`, `min()`, `max()`, `clamp()`, and trigonometric CSS functions (`sin()`, `cos()`) to compute ratios, orbital eccentricity scalings, and responsive proportions directly in the stylesheet.
5. **3D Orbit Direct Manipulation & Dynamic Billboarding**:
   - In 3D orbit mode, direct DOM manipulation (drag rotation, wheel/pinch zoom) sets CSS variables (`--orbit-rot-x`, `--orbit-rot-z`, `--orbit-zoom`) without cluttering the UI with buttons.
   - All celestial billboard wraps dynamically counter-rotate via `calc(-1 * var(--orbit-rot-z))` and `calc(-1 * var(--orbit-rot-x))` to perpetually face the viewer.

---

## Skill 4: Lightweight HTML & Minimal DOM Footprint

### Core Rule
HTML documents must remain lightweight, semantic, and streamable. Avoid bloated DOM trees that bog down mobile memory and layout engines.

### Guidelines
1. **DOM Budget**:
   - Keep total DOM nodes under **1,500** per page.
   - Keep maximum DOM depth under **32** nested levels.
   - Keep initial uncompressed HTML payloads under **50 KB**.
2. **Semantic HTML5**:
   - Use native semantic tags (`<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<dialog>`, `<button>`) instead of deeply nested `<div>` soup.
   - Use native `<button>` elements for all interactive clickables to retain built-in keyboard navigation and screen reader semantics.
3. **On-the-Fly Template Generation**:
   - Never manually duplicate repetitive HTML across subpages.
   - Use declarative build scripts (`scripts/build-subpages.js`) to generate clean, minimal, semantic HTML pages on the fly from shared templates.
4. **Lean Asset Inlining**:
   - Avoid embedding massive base64 image strings or heavy inline SVGs into HTML documents.
   - Keep icons lightweight, vectorized, and externalized with appropriate browser caching.
5. **Deterministic Structural UI Anchors**:
   - UI views, modals, and screen transitions must bind to deterministic element IDs (e.g., `#start-screen`, `#orbit-view`, `#dialog-overlay`, `#rocketrun-sidebar`).
   - Text must scale gracefully and never clip or overlap container boundaries.

---

## Skill 5: Manageable Cyclomatic Complexity & Clean Logic

### Core Rule
Functions must remain short, focused, and understandable. Maintain a **Cyclomatic Complexity (CC) ≤ 8** for all functions.

### Guidelines
1. **Single Responsibility Principle (SRP)**:
   - Each function should perform exactly one task. If a function parses data, validates input, formats strings, and updates the DOM, decompose it into smaller helper functions.
2. **Flatten Control Flow with Guard Clauses**:
   - Avoid deeply nested `if/else` ladders. Return early as soon as an edge case or invalid condition is met.
   ```javascript
   // Anti-Pattern: Deep nesting
   function showPlanet(id) {
     if (id) {
       const planet = getPlanet(id);
       if (planet) {
         if (!planet.hidden) {
           render(planet);
         }
       }
     }
   }

   // Best Practice: Guard clauses
   function showPlanet(id) {
     if (!id) return;
     const planet = getPlanet(id);
     if (!planet || planet.hidden) return;
     render(planet);
   }
   ```
3. **Table-Driven / Dictionary Lookups**:
   - Replace complex `switch` or multi-case `else if` chains with concise lookup tables or `Map` structures.
4. **Pure Utility Functions**:
   - Keep mathematical calculations (e.g., gravity multipliers, orbital period transformations, jump heights) pure and side-effect free so they are trivial to test.
5. **Decoupled Global State Contract (`window.RocketRun`)**:
   - Coordinate cross-feature state via an explicit global bridge (`window.RocketRun`) using state enums (`STANDBY`, `TARGETED`, `LAUNCHING`, `TRANSIT`, `ARRIVED`).
   - Dispatch custom event `window.dispatchEvent(new CustomEvent('rocketrun:statechange', { detail: { state, from, to } }))` rather than tightly coupling module imports.

---

## Skill 6: Asset Handling, Zero External Assets & Tooling Constraints

### Core Rule
Keep the application self-contained, lightweight, and resilient to network partitions.

### Guidelines
1. **Zero External Heavy Assets**:
   - Do not load external raster images or asset bundles.
   - Procedurally render space visuals, rocket crafts, and planetary features using inline SVGs, CSS shapes/gradients, or lightweight canvas math.
2. **Tooling Sandboxing**:
   - Rely strictly on the configured local toolchain and npm scripts. Do not introduce arbitrary command-line dependencies that are not declared in the project environment.

---

## Skill 7: Robust CI/CD (Continuous Integration & Delivery)

### Core Rule
Every deployment must be reproducible, automated, and strictly verified. If a test fails or a build step produces an error, deployment must halt immediately.

### Pipeline Standards
1. **Automated Verification Order**:
   - **Step 1**: Lint & Test (`npm test`) — validates all i18n key parity and data schemas.
   - **Step 2**: Generate Pages (`npm run build:pages`) — extracts dynamic Git SHA, app version, and builds all subpages.
   - **Step 3**: Compile SCSS (`npm run build:css`) — compiles and minifies CSS.
   - **Step 4**: Bundle & Minify JS (`npm run build:js`, `npm run build:planet-js`) — esbuild minification.
2. **Netlify Continuous Deployment**:
   - Keep `netlify.toml` checked into version control.
   - Configure deterministic Node versions (`NODE_VERSION = "20"`).
   - Ensure `public/` is untracked in Git (`.gitignore`) and constructed 100% on the fly during the build step.
3. **Deployment Auditability**:
   - Inject the current Git commit SHA (`COMMIT_REF` or `git rev-parse --short HEAD`) into `credits.html` and `version.json` at build time so deployed versions are immediately identifiable.

---

## Skill 8: Automated Testing & Verification

### Core Rule
Code changes to core logic, data models, or translations must be accompanied by automated verification.

### Testing Rules
1. **Zero-Dependency Fast Tests**:
   - Keep unit tests fast (< 1 second runtime) so they can run on every pre-commit hook and CI run.
2. **100% i18n Parity Enforcement**:
   - Any addition of a UI string or planet metric must be mirrored in all 9 supported languages (`en`, `de`, `fr`, `es`, `it`, `ja`, `zh`, `ml`, `ta`).
   - Run `node scripts/test-i18n.js` to assert that no key is missing, misspelled, or orphaned.
3. **Visual & Behavioral Verification**:
   - Test UI components across narrow viewports (360px mobile), tablet viewports (768px), and desktop viewports (1440px+).
   - Verify keyboard navigability (`Tab`, `Enter`, `Escape`) for all interactive modals and controls.

---

## Skill 9: Low-End Hardware & Handheld Performance Optimization

### Core Rule
The application must run smoothly (target 60fps) on budget smartphones, older tablets, and low-spec laptops with integrated GPUs.

### Optimization Rules
1. **GPU & Memory Conservation**:
   - Never create excessive 3D canvas contexts or massive off-screen textures.
   - Keep texture dimensions optimized for web display.
   - Prefer vector SVGs and CSS gradients over multi-megabyte bitmap images.
2. **Touch-Target Sizing & Usability**:
   - All interactive controls, planet buttons, and HUD icons must provide a minimum touch target of **44 × 44 pixels** (conforming to WCAG 2.5.5).
   - Provide generous tap spacing to prevent accidental mis-taps on small handheld screens.
3. **Battery & CPU Conservation**:
   - Avoid infinite JavaScript animation timers when the browser tab is hidden or when the user is inactive.
   - Leverage `IntersectionObserver` or CSS pause-states for elements outside the active viewport.
4. **Motion Sensitivity & Accessibility**:
   - Always honor `@media (prefers-reduced-motion: reduce)`:
     - Flatten 3D perspective crawls into standard vertical scrolling documents.
     - Slow down or halt orbital spinning animations for users with vestibular disorders.
5. **Modern Viewport Units**:
   - Use dynamic viewport height (`100dvh` or `100svh`) to avoid layout jumps when mobile address bars expand and collapse.
6. **Touch Hover Parity & Orbital Pause Toggle**:
   - Touchscreens (smartphones and tablets) do not support the mouse `:hover` pseudo-class.
   - Provide a dedicated, touch-accessible pause button (minimum 44 × 44px touch target) that toggles orbital motion in place using declarative CSS `animation-play-state: paused !important`.
7. **Circadian / Night-Time Solar Dimming**:
   - Handheld devices used in dim/night environments require glare reduction for young explorers and parents.
   - Between 18:00 and 07:00 local time, dim the central Sun by 5% to 20% on mobile and tablet devices via CSS brightness filters (`brightness(0.80)` to `brightness(0.95)`) driven by CSS custom properties (`--sun-brightness`).

---

## Skill 10: Full Internationalization (i18n) & Accessibility (a11y)

### Core Rule
Educational content must be universally accessible worldwide regardless of language, physical capability, or reading level.

### Guidelines
1. **Child-Friendly & Clear Phrasing**:
   - Metric explanations and scientific popups must communicate real astronomical concepts in simple, evocative language suitable for 5-to-8-year-old explorers.
   - Relate unfamiliar units to tangible everyday concepts (e.g., bath water temperature, cars parked in a row, kitchen freezers).
2. **No Hardcoded English Strings**:
   - All text rendered in the DOM must bind to a `data-i18n` attribute or invoke `t(key)`.
3. **Accessibility (a11y)**:
   - Provide explicit `aria-label` attributes on icon-only buttons (e.g., `👥`, `⚙️`, `✕`).
   - Maintain color contrast ratios of at least **4.5:1** for regular text against dark cosmic backgrounds.
   - Ensure focus visible rings (`:focus-visible`) are prominent and unobstructed for keyboard accessibility.
4. **German-Only Legal Imprint Standard (§ 5 DDG)**:
   - The legal Impressum / Imprint link (`.site-tiny-footer`, `.subpage-tiny-footer`, `.imprint-link`, `a[href*="impressum.html"]`) must be displayed exclusively when the active language is German (`de`).
   - In all other languages (`en`, `fr`, `es`, `it`, `ja`, `zh`, `ml`, `ta`), the imprint link is strictly hidden via declarative CSS (`html:not([lang="de"])`) and `applyTranslations()`.
   - If a user changes their active language to a non-German language while on `impressum.html`, they are seamlessly redirected back to `index.html`.

---

## Skill 11: Child Pedagogy & Metaphor Design for Scientific Explanations

### Core Rule
Astronomical facts, chemical formulas, and mathematical metrics must be rendered **crystal clear, evocative, and intuitive for young minds aged 5 to 8** without diluting scientific precision. Always bridge abstract mathematical or chemical notation into sensory, tangible everyday experiences.

### Pedagogical Guidelines & Standards

1. **The "100 Marbles / 100 Scoops" Rule for Percentages (`%`)**:
   - Children in early elementary grades have not yet mastered abstract fractions or ratios.
   - **Never leave `%` unexplained** in child-facing popups or mission notes.
   - Ground every percentage in a concrete count:
     - *"Percent (%) means parts out of 100! Imagine a jar filled with 100 marbles of air..."*
     - *"If you took 100 scoops of the planet's atmosphere / Sun's matter..."*
     - For extreme ratios (e.g., the Sun holding `99.86%` of system mass): *"If all 8 planets, moons, and asteroids were 10,000 toy building blocks, the Sun alone would be 9,986 blocks, leaving just 14 tiny blocks for everything else combined!"*

2. **Chemical Formula Decryption & Characterization**:
   - Letter-subscript codes (`N₂`, `O₂`, `Ar`, `CO₂`, `H₂`, `He`, `CH₄`, `H₂SO₄`) look like alien hieroglyphs to a child unless deciphered immediately into familiar sensory metaphors:
     - **`N₂` (Nitrogen)**: *"An invisible, calm gas that fills most of our blue sky and helps trees and plants grow green and strong."*
     - **`O₂` (Oxygen)**: *"The magical life breath that you, your family, puppies, and birds breathe in with every breath to live!"*
     - **`CO₂` (Carbon Dioxide)**: *"The tickly fizzy gas in soda pop that we breathe out; on Venus, it locks in heat like a closed oven door!"*
     - **`H₂` (Hydrogen)**: *"The lightest, simplest gas in the universe! It catches fire easily and acts like fuel for the Sun's giant nuclear engine."*
     - **`He` (Helium)**: *"The floaty gas that makes birthday party balloons fly up to the ceiling!"*
     - **`CH₄` (Methane)**: *"Cow-burp gas / natural gas that acts like a blue sunglasses filter, swallowing red sunlight and bouncing back bright cyan and azure blue."*
     - **`Ar` (Argon)**: *"A shy, peaceful noble gas that drifts quietly without bothering anyone."*
     - **`H₂SO₄` (Sulfuric Acid)**: *"Clouds raining real corrosive battery acid that would melt metal into puddles."*

3. **Multiplication Phrasing Standard ("times" NOT "×" or "x")**:
   - Never write shorthand math expressions like `9x`, `9×`, `55x`, or `150000x`.
   - Write out complete, evocative comparative sentences:
     - *"55 times hotter than your hot bath water"*
     - *"150,000 times hotter than boiling water"*
     - *"9 times colder than a kitchen freezer ice cube"*
     - *"11 times colder than a freezer"*

4. **Kinesthetic, Gravitational & Movement Metaphors**:
   - **Jump Heights**: Compare jumps to familiar physical hurdles:
     - Mars (0.38g): *"You can leap right over a parked car with a single bounce!"*
     - Moon (0.16g): *"You could soar over a house roof like an astronaut superhero!"*
     - Sun (28g): *"Colossal gravity pulls you down flat like toast—jump height is zero inches!"*
   - **Planetary Density & Buoyancy**:
     - Saturn: *"So light and fluffy that if you had a bathtub big enough, the whole planet would float like a rubber ducky!"*
   - **Planetary Surface Appearance**:
     - Mercury: *"Covered in space meteorite craters, looking like a giant dusty golf ball."*
     - Mars: *"A rust-red desert with giant sand dunes and robot rovers rolling across it right now."*

5. **Orbital Motion, Tilts & Retrograde Spins**:
   - **Backwards Spin (Retrograde Rotation)**:
     - Venus: *"Venus spins backwards! The Sun rises in the west and sets in the east, and one daytime is longer than its whole year!"*
     - Triton: *"Orbits backwards in the opposite direction of Neptune's spin, proving it was a captured dwarf planet shooting active nitrogen ice volcanoes into space!"*
   - **Sideways Roll (Axial Tilt)**:
     - Uranus: *"Rolls on its side around the Sun like a giant bowling ball!"*

6. **Atmospheric Layers & Boundary Concepts (e.g., Exosphere & Ozone Shield)**:
   - Technical terms for atmospheric layers must always be contextualized in relation to Earth's familiar sky:
     - **Exosphere**: Define it as *"the outermost layer of Earth's atmosphere (hundreds of kilometers high), where air thins out into the black vacuum of space and satellites orbit."*
     - Contrast this with airless celestial bodies (Mercury, the Moon): *"Because Mercury has no blanket of air or sky, its exosphere begins right at the rocky ground—a tiny whisper of loose atoms kicked up by the solar wind that almost never collide."*
     - **Ozone Layer**: Explain as *"a protective sunscreen shield high in the sky that blocks harmful sunburn rays from reaching the ground."*

7. **Typography, Formatting & DOM Safety**:
   - Format multi-gas breakdowns with clean bullet lists (`•`) to facilitate shared reading between parents and young explorers.
   - Enforce `white-space: pre-line;` in CSS on all explainer text containers to ensure natural line breaking while safely populating text via `textContent` (zero `innerHTML` injection risk).
   - Require 100% translation parity across all 9 supported languages (`en`, `de`, `fr`, `es`, `it`, `ja`, `zh`, `ml`, `ta`) with culturally natural idioms.

---

## Skill 12: Metadata, OpenGraph & Social Sharing Standards

### Core Rule
Every public endpoint and generated subpage in **RocketRun** must include comprehensive, valid, and rich metadata optimized for **Facebook, Twitter/X, WhatsApp, LinkedIn, Discord, and Telegram**. The official canonical domain is **`https://rocketrun.org`**, and all content is copyrighted under **`rocketrun.org`**.

### Standard Metadata Requirements
1. **Canonical URLs & Absolute Paths**:
   - Every page must declare its canonical URL: `<link rel="canonical" href="https://rocketrun.org/path" />`.
   - Never use relative paths for `og:image` or `og:url`. Social scrapers (especially WhatsApp and Facebook) strictly ignore relative URLs.

2. **OpenGraph Protocol**:
   - `og:site_name`: Must be `RocketRun`.
   - `og:type`: `website` for root/credits; `article` for celestial subpages.
   - `og:title`: Concise, brand-aligned title (e.g., `RocketRun — Solar System Tour` or `${name} — RocketRun Solar System Exploration`).
   - `og:description`: Engaging summary highlighting interactive 3D physics, planetary science, and NASA kids missions.
   - `og:image`: High-contrast, transparent or deep-space PNG (e.g., `https://rocketrun.org/images/earth.png` or `https://rocketrun.org/images/${slug}.png`).
   - `og:image:width`: `1200`, `og:image:height`: `630`, `og:image:type`: `image/png`.
   - `og:locale`: `en_US` with alternate locales (`de_DE`, `fr_FR`, `es_ES`, `it_IT`, `ja_JP`, `zh_CN`, `ml_IN`, `ta_IN`).

3. **Twitter / X Card**:
   - `twitter:card`: `summary_large_image`.
   - `twitter:site` & `twitter:creator`: `@rocketrun_de`.
   - `twitter:title` and `twitter:description` matching OpenGraph.
   - `twitter:image`: Absolute HTTPS URL matching `og:image`.

4. **WhatsApp Specifics**:
   - WhatsApp unfurls rich cards exclusively when `og:title`, `og:description`, and `og:image` are present and served over HTTPS.
   - Target images must be optimized under 300KB (maximum 1MB) with a clean 1.91:1 or 1:1 aspect ratio to ensure instant card rendering on cellular networks.

5. **Copyright & Authorship**:
   - `<meta name="author" content="Zachary David Mathew + Papa" />`
   - `<meta name="copyright" content="rocketrun.org" />`
   - Visible and i18n-backed copyright in app footers and credits: `© 2026 rocketrun.org. All rights reserved.`

---

## Skill 13: Web Security, Anti-Hacking & Defense-in-Depth

### Core Rule
**Assume all client-side runtime environments and user inputs are untrusted and actively hostile.** Deploy comprehensive defense-in-depth measures against information disclosure, reconnaissance, Cross-Site Scripting (XSS), clickjacking, tabnabbing, and storage poisoning.

### Security Principles & Rules

1. **Zero Information Leakage of Infrastructure & Deployment Endpoints**:
   - **Never expose internal deployment infrastructure URLs, CI/CD webhook links, dashboard URLs, or host-specific project IDs inside the client-facing application UI or client-side bundles.**
   - Badges, build dashboards, and administrative links (e.g. Netlify deploy logs, GitHub Action workflows) belong strictly in the developer repository (`README.md`), never in the production client web views.
   - Revealing provider-specific project names or deployment hashes exposes the system to targeted reconnaissance, account enumeration, and automated denial-of-service attempts.

2. **Enterprise Content Security Policy (CSP)**:
   - Configure a strict HTTP Content Security Policy in `netlify.toml`:
     - `default-src 'self'`: Disallow loading external assets from arbitrary domains.
     - `script-src 'self'`: Disallow untrusted inline scripts and forbid `eval()`, `new Function()`, and `WebAssembly` compilation unless specifically isolated.
     - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`: Restrict font styles to trusted CDN origins while permitting essential CSS custom property manipulations.
     - `font-src 'self' https://fonts.gstatic.com`: Restrict downloadable fonts to trusted Google Font CDN origins.
     - `img-src 'self' data: https://rocketrun.org`: Block rogue image exfiltration channels.
     - `connect-src 'self'`: Prevent background AJAX/fetch calls from leaking data to unauthorized third-party endpoints.
     - `frame-ancestors 'none'`: Strictly forbid framing on any domain to prevent clickjacking.
     - `base-uri 'self'`: Block `<base>` tag hijacking attacks.
     - `form-action 'self'`: Block unauthorized form data transmission.

3. **Anti-Clickjacking & UI Redressing Defense**:
   - Never allow RocketRun to be loaded in an `<iframe>` on an adversary's site.
   - Enforce both `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'` on all endpoints to prevent invisible click-stealing overlays.

4. **Zero Unsafe DOM Injection (`textContent` over `innerHTML`)**:
   - Dynamic user-facing text, translated strings, planet metrics, and gravity calculations must always be rendered via `.textContent` or `setAttribute()`.
   - Never pass raw user inputs, URL search parameters, or untrusted translations to `.innerHTML`, `.outerHTML`, or `document.write`.

5. **Reverse Tabnabbing & Window Opener Hijacking Defense**:
   - Every external hyperlink targeting a new browsing context (`target="_blank"`) must mandate `rel="noopener noreferrer"`.
   - Without `rel="noopener noreferrer"`, the target site acquires access to the opener document via `window.opener.location`, enabling malicious phishing redirect attacks against users.

6. **MIME Sniffing Prevention & Strict Content Typing**:
   - Always set `X-Content-Type-Options: nosniff` in server headers to prevent browsers from executing non-script assets (images, stylesheets) as executable code.

7. **Transport Security (HSTS) & Referrer Isolation**:
   - Enforce HTTPS across all pages: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`.
   - Set `Referrer-Policy: strict-origin-when-cross-origin` to avoid leaking full URL query parameters when users navigate away.
   - Set `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Resource-Policy: same-origin`.

8. **Hardware & Feature Permissions Lockdown**:
   - Set `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()` in server headers to completely disable device sensor APIs that could be weaponized if third-party code were ever introduced.

9. **Stateless Client Architecture & Storage Sandboxing**:
   - Maintain zero backend server attack surface: all planetary orbits, calculations, and animations run purely on the client with zero database credentials, serverless API keys, or cookies.
   - Validate and guard all data read from `localStorage` (`space_lang`, unit preferences) against unexpected schema mutations.

---

## Skill 14: Open Source Licensing, Attribution & Trademark Integrity

### Core Rule
RocketRun is an educational, community-friendly initiative. Others are encouraged to learn from, copy, adapt, and build upon its architectural concepts, **provided they visibly and permanently give credit and maintain attribution.**

### Guidelines & Legal Requirements
1. **MIT License with Mandatory Attribution**:
   - The project is governed by the `LICENSE` file in the root directory.
   - Users are permitted to use, modify, copy, and distribute the code, provided that:
     1. The copyright notice and license notice are preserved in all copies.
     2. Derivative works, educational forks, or adaptations must display prominent visible attribution:
        `"RocketRun by Zachary David Mathew + Papa (https://rocketrun.org)"`.
2. **Trademark & Domain Protection**:
   - The brand name `"RocketRun"`, domain `rocketrun.org`, and original planetary narratives remain the intellectual property of `rocketrun.org`.
   - Forks and clones must not claim to be the official `rocketrun.org` service or imply endorsement.

---

## Skill 15: GDPR-Compliant Local Storage, Data Erasure & Accessible Features Standard

### Core Rule
RocketRun respects user privacy to the highest standard: zero trackers, zero advertisement cookies, and total user sovereignty over local storage with one-click data erasure. All features must adhere to the December 2026 Accessibility Standard.

### Guidelines & Requirements
1. **Zero-Tracking Storage Transparency**:
   - Only strictly necessary client-side storage is utilized (`space_lang`, `space_calc_*`, `space_show_moons`, `space_real_orbits`).
   - A discreet cookie icon (`🍪`) in the HUD stack must allow users to view, manage, or dismiss storage preferences at any time.
2. **Right to Erasure / Data Purging**:
   - Provide an instant "Clear Stored Data" action that expires any cookies and removes all application `localStorage` keys without page destruction.
3. **December 2026 Accessibility Suite**:
   - WCAG 2.2 Level AA / AAA compliance across contrast, keyboard navigation, focus indicators, and touch targets (≥ 44×44px).
   - Polite screen reader telemetry via `aria-live` and vestibular protection via `prefers-reduced-motion`.

---

## Skill 16: Zero Native Browser Dialogs (No window.alert, confirm, or prompt — In-App Notifications Only)

### Core Rule
**Native browser dialogs (`window.alert()`, `window.confirm()`, and `window.prompt()`) are strictly forbidden across the entire codebase.** All user-facing alerts, warnings, errors, and announcements must be rendered exclusively through lightweight, non-blocking in-app notification toasts or accessible DOM dialogs.

### Rationale & Constraints
1. **Thread-Blocking Event Loop Freezes**:
   - Native dialogs freeze the browser's JavaScript execution thread, interrupting ongoing CSS animations, halting Web Audio playback, and breaking orbital rendezvous calculations.
2. **Poor Mobile & Handheld Experience**:
   - On Amazon Fire tablets, budget Android devices, and iOS WebViews, native alert modals cover the entire screen, drop hardware acceleration contexts, and frequently trigger OS-level permission dialogs or viewport resizing glitches.
3. **Accessibility & Screen Reader Compliance (a11y)**:
   - In-app notification toasts utilize explicit `aria-live="polite"`, `aria-atomic="true"`, and `role="status"`, ensuring assistive technologies can announce notifications seamlessly without hijacking user focus.

### Guidelines & Implementation Standards
1. **In-App Notification API (`showGameNotification`)**:
   - Use `showGameNotification(message, type = 'info', duration = 3500)`:
     - `type`: `'info'`, `'warning'`, `'error'`, or `'success'`.
     - `duration`: Auto-dismiss duration in milliseconds (defaults to 3500ms; `0` for persistent).
   - Must provide an accessible close button (`✕`) with `aria-label="Dismiss notification"`.
   - Must support tap/click-to-dismiss for handheld touchscreens.
2. **Compositor-Friendly CSS Motion**:
   - Toasts animate strictly using GPU-composited transforms (`translateY` / `opacity`) via `.is-active` and `.is-leaving` classes.
   - Glassmorphism backdrop-filter with high contrast (compliant with WCAG 2.2 AA).
3. **DOM Safety**:
   - Content must be injected via `.textContent`, never `.innerHTML`, guarding against any XSS vectors.

---

## Pre-Flight Verification Checklist

Before pushing any commit or releasing to production, verify:

- [ ] **Commit Message**: Conforms to Conventional Commits format with imperative summary.
- [ ] **CSS First**: Visual effects, animations, and transitions use pure CSS rather than JavaScript interval loops.
- [ ] **DOM Size**: Page structure is lean, semantic, and contains no unnecessary wrapper divs.
- [ ] **Zero Native Browser Popups**: Zero `alert()`, `confirm()`, or `prompt()` calls; all status/error messages use non-blocking in-app toasts with polite aria-live regions.
- [ ] **Complexity**: Functions are small, guard clauses are used, and cyclomatic complexity is low.
- [ ] **Kid Explainer Pedagogy**:
  - [ ] Every `%` symbol is grounded in concrete counts (*"parts out of 100"* / *"100 scoops"* / *"100 marbles"*).
  - [ ] All chemical abbreviations (`N₂`, `O₂`, `CO₂`, `H₂`, `He`, `CH₄`) are deciphered into everyday metaphors.
  - [ ] Multiplication uses written-out *"times"* rather than *"x"*.
- [ ] **Social & Metadata**:
  - [ ] Canonical URL points to `https://rocketrun.org/...`.
  - [ ] OpenGraph (`og:title`, `og:image`, `og:url`, `og:site_name`) and Twitter Card tags are present.
  - [ ] Social images are served over absolute HTTPS and optimized for WhatsApp (< 300KB).
  - [ ] Copyright declared as `rocketrun.org`.
- [ ] **Anti-Hacking & Web Security**:
  - [ ] Zero internal deployment, dashboard, or pipeline URLs exposed in production HTML or JS bundles.
  - [ ] Enterprise security headers (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, `HSTS`, `COOP`, `CORP`) active in `netlify.toml`.
  - [ ] All external `target="_blank"` links include `rel="noopener noreferrer"`.
  - [ ] All dynamic DOM rendering uses `textContent` with zero unsanitized `innerHTML` injection.
- [ ] **Licensing & Attribution**:
  - [ ] Root `LICENSE` present with MIT license and explicit attribution clause.
  - [ ] `package.json` contains `"license": "MIT"`.
- [ ] **i18n Parity**: `npm test` passes with 100% parity across all 9 language files.
- [ ] **German-Only Imprint**: Imprint / Impressum is strictly hidden in all non-German languages and visible in German.
- [ ] **Build Validation**: `npm run build` generates all pages and bundles without errors or warnings.
- [ ] **Mobile & Handheld Test**: Tested on narrow mobile screen (360px–414px) with touch-friendly tap targets (≥ 44px).
- [ ] **Reduced Motion**: Verified that `@media (prefers-reduced-motion: reduce)` disables heavy 3D motion cleanly.
- [ ] **Clean Working Tree**: No untracked build artifacts, scratch scripts, or temporary test files.