# RocketRun — Solar System Tour 🚀🪐

An interactive, animated 3D-styled solar system explorer available at [rocketrun.de](https://rocketrun.de). Tour the planets, discover scientific facts, and experience smooth transitions powered by CSS animations, HTML5 Canvas, and modular modern tooling. Copyright © 2026 rocketrun.de.

---

- **Centered Planet Detail View**: The full celestial stage (planet image, title, scientific specs grid, and navigation) is centered horizontally in the viewport with responsive maximum widths.
- **Floating Cosmic Explorer Lab**:
  - Live on-the-fly JavaScript calculator for planetary weight and jump height floating over the viewport with frosted glassmorphism.
  - Dual unit toggles (`kg` / `lbs` and `cm` / `in`) with instant conversions.
  - Minimizable header toggle button with cross-page `localStorage` persistence and internal cosmic scrolling.
- **Settings HUD & Multi-Language i18n**:
  - **Settings HUD**: Positioned below the Galactic HUD with minimize/expand toggle and styled cosmic language selector.
  - **7 Popular Languages**: English (🇬🇧), German (🇩🇪), French (🇫🇷), Spanish (🇪🇸), Italian (🇮🇹), Japanese (🇯🇵), and Chinese (🇨🇳).
  - **100% Translation Coverage**: Translates UI, preloader, coordinates, planet greetings/facts, scientific metrics, dynamic gravity calculations, and NASA Kids Mission cards without page reload.
  - **Extensible Architecture**: Modular `src/i18n/<lang>.json` files make adding future translations as simple as creating a single JSON file.
- **Rewritten NASA Kids Mission Notes**:
  - Engaging, accessible educational notes tailored for 5–9 year olds on every celestial body.
  - Clear real-world jump analogies and authentic NASA discoveries.
- **Minimizable Galactic HUD Badge**:
  - Displays Sector, Galactic Coordinates, and Core Distance with a collapsible header toggle button (`−` / `+`).
- **Dedicated Celestial Subpages**: The Sun and all 8 planets each have their own dedicated subpage (`planets/<slug>.html`) equipped with rich scientific specification cards, authentic high-resolution 3D planetary photography with zero-CLS asynchronous lazy loading, and unified styling.
- **Authentic Planetary Photography**:
  - Transparent 3D photography of the Sun and all 8 planets downloaded directly into `public/images/`.
  - Native browser `loading="lazy"` and `decoding="async"` for instantaneous initial page loads.
  - Floating cosmic micro-animations and contoured atmospheric glow filters.
- **Interactive Clickable Sun**: The central star (Sol) is fully clickable and interactive, pausing orbits upon proximity/hover with an expanded coronal glow, and navigating to its dedicated scientific profile.
- **Warp Speed Preloader & Galactic HUD**: Hyperspace 3D starfield sequence announcing arrival at the Solar System with clean cosmic cyan radiance.
- **Dynamic Orrery**: Pure CSS orbital mechanics and counter-spinning planetary bodies mathematically scaled to real astronomical orbital periods (Earth = 5.00s base reference).
- **Proximity Hover Pause**: Approaching any planet with the mouse automatically freezes orbital animation, allowing easy reading and effortless clicking. As soon as the mouse moves away, planets resume their orbits smoothly in synchronized astronomical proportion.
- **Canvas Starfield**: Procedurally generated, twinkling starfield backdrop dynamically responsive to window resizing.
- **Responsive Across Devices**: Built-in Sass breakpoints tailored for mobile (`< 768px`), tablet (`768px - 1023px`), and desktop (`≥ 1024px`) viewports.
- **Ergonomic Navigation**:
  - Click or tap any orbiting planet or pagination dot.
  - Arrow buttons (`←` / `→`) to browse adjacent planets.
  - Keyboard shortcuts: `ArrowLeft` / `ArrowRight` to cycle planets, and `Escape` to return to the solar system view.
- **High Performance**: Dart Sass compiles compressed stylesheets and `esbuild` bundles and minifies JavaScript down to 6.6 KB in milliseconds.

---

## 📁 Project Structure

```text
space/
├── public/                     # Production build artifacts
│   ├── css/
│   │   └── style.css           # Compiled & compressed Sass stylesheet
│   ├── js/
│   │   └── script.min.js       # Bundled & minified JavaScript
│   └── index.html              # Production HTML distribution
├── src/
│   ├── scss/                   # Modular Sass source tree
│   │   ├── abstracts/
│   │   │   ├── _breakpoints.scss # Mobile, tablet & desktop mixins
│   │   │   └── _variables.scss   # Colors, tokens, and typography
│   │   ├── base/
│   │   │   └── _reset.scss       # Box-sizing & reset styles
│   │   ├── components/
│   │   │   ├── _controls.scss    # Back button, nav buttons, dots & hint
│   │   │   ├── _orrery.scss      # Orbits, sun, and planet triggers
│   │   │   └── _planet-view.scss # Planet detail view & animations
│   │   └── main.scss             # Central Sass manifest
│   └── js/                     # Modular JavaScript (ES modules)
│       ├── components/
│       │   ├── orrery.js         # Dynamic orbit & button builder
│       │   ├── starfield.js      # Canvas starfield loop
│       │   └── viewer.js         # Navigation, view state & keyboard listeners
│       ├── data/
│       │   └── planets.js        # Planetary data & color themes
│       └── script.js             # Main application entry point
├── index.html                  # Root HTML entry point
├── netlify.toml                # Netlify deployment configuration
├── package.json                # Project dependencies & build scripts
└── README.md
```

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- `npm`

### Installation

Clone the repository and install dev dependencies:

```bash
git clone <repository-url>
cd space
npm install
```

### Build Commands

| Command | Description |
| :--- | :--- |
| `npm run build` | Compiles Sass to compressed CSS and bundles/minifies JS into `public/` |
| `npm run build:css` | Compiles Sass (`src/scss/main.scss`) into `public/css/style.css` |
| `npm run build:js` | Bundles and minifies JS (`src/js/script.js`) into `public/js/script.min.js` |
| `npm run watch:css` | Watches `src/scss/` for changes and automatically recompiles |
| `npm run watch:js` | Watches `src/js/` for changes and rebuilds via `esbuild` |

---

## 🌐 Deploying to Netlify

This project includes a ready-to-use [`netlify.toml`](./netlify.toml) configured for zero-configuration continuous deployment.

### Method 1: Git Integration (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site"** > **"Import an existing project"**.
3. Select your repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `public`
5. Click **"Deploy site"**.

### Method 2: Netlify CLI

You can also deploy directly from your terminal using the Netlify CLI:

```bash
# Install Netlify CLI globally (if not already installed)
npm install -g netlify-cli

# Build production assets
npm run build

# Deploy to preview
ntl deploy

# Deploy to production
ntl deploy --prod
```

---

## 📱 Responsive Breakpoints

Breakpoints are defined in [`src/scss/abstracts/_breakpoints.scss`](./src/scss/abstracts/_breakpoints.scss) and can be used anywhere in the Sass source tree:

```scss
@use '../abstracts/breakpoints' as *;

.my-element {
  font-size: 1rem;

  @include mobile {
    font-size: 0.85rem; // Mobile phones (< 768px)
  }

  @include tablet {
    font-size: 0.95rem; // Tablets (768px - 1023px)
  }

  @include desktop {
    font-size: 1.1rem;  // Desktops (≥ 1024px)
  }
}
```

---

## 📄 License

MIT
