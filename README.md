# RocketRun — Solar System Tour (Android)

Interactive 3D Solar System exploration and space flight simulator featuring authentic Keplerian orbital physics, planetary science metrics, gravity & jump height calculator, and kids space missions.

Rewritten from the original web application into a modern native **Android (Kotlin + Jetpack Compose)** app.

---

## 🌟 Key Features

### 1. Interactive 2D & 3D Solar System Orrery
- Real-time Keplerian planetary orbits for the Sun, Mercury, Venus, Earth (+ Moon), Mars (+ Phobos, Deimos), Asteroid Belt, Jupiter (+ Galilean moons), Saturn (+ iconic rings, Titan), Uranus, and Neptune.
- Toggle between planar 2D and tilted 3D perspective views.
- Speed controls (0.5×, 1×, 2×, 5×) and Play/Pause orbital simulation.
- Pinch-to-zoom and pan gestures across the solar system with touch detection on celestial bodies.
- Live Galactic HUD telemetry: Milky Way Orion Arm sector, galactic coordinates, distance to the galactic core (26,000 light-years), and Earth UTC clock.

### 2. Planetary Atlas & Specifications
- High-resolution celestial body inspection with glowing visual palettes and facts.
- Detailed astronomical specifications:
  - Orbit distance (AU)
  - Orbital period (Earth years)
  - Surface gravity (vs Earth)
  - Atmospheric composition and temperature extremes
  - Day/night rotational duration and moon counts
- **Cosmic Explorer Lab**:
  - Live interactive gravity and vertical jump height calculator.
  - Weight & height sliders with preset shortcuts (Kid, Teen, Adult) and kg/lbs, cm/in unit conversions.
  - Calculates exact weight on any world with relatable physical comparisons.
  - Interactive jumping astronaut simulator animation with male/female pilot avatar selection.
- Deep astrophysical lore and expandable Kid Science Explainer cards.

### 3. Flight Simulator & Mission Game
- Interplanetary space flight simulator operating under orbital mechanics.
- Mission briefing riddles guiding pilots to target destinations.
- Real-time orbital intercept telemetry: transfer distance, optimal launch window countdown, and hazard warnings (Asteroid belt crossings).
- Variable thrust power slider (10% to 100%) and fuel consumption burn calculations.
- Live solar recharge mechanism that replenishes fuel tank when orbiting near the Sun.
- Animated Keplerian elliptical transfer arcs during interplanetary transit.
- Touchdown Quiz Challenges: planetary trivia on arrival to earn bonus score points and promote pilot ranks (Cadet ➔ Scout ➔ Navigator ➔ Pioneer ➔ Master ➔ Explorer ➔ Voyager ➔ Legend).
- Pilot callsign customization and local high score leaderboards.

### 4. Cosmic Space Jokes & 2026 Roadmap
- Interactive Cosmic Space Joke Generator with reveal card animations.
- Curated library of kid-friendly astronomical riddles.
- Development roadmap and December 2026 accessibility standards.
- Collaboration credits (Zachary David Mathew + Papa, missional.eu, NASA/JPL sources).

---

## 🛠️ Architecture & Tech Stack

- **Target OS**: Android 8.0+ (API Level 26–36)
- **Language**: Kotlin 2.2
- **UI Framework**: Jetpack Compose with Material Design 3 (M3)
- **Build System**: Gradle 9.3.1 with Android Gradle Plugin 9.1.1
- **Architecture**: MVVM (Model-View-ViewModel) with unidirectional data flow and Kotlin Coroutines/StateFlow
- **Theme**: Deep Space theme (`#030712`, `#0B132B`, `#38BDF8`, `#FBBF24`)
- **Assets**: Adaptive vector & high-resolution planetary illustrations with launcher icon

---

## 🚀 Building & Running

To build the debug APK:

```bash
gradle :app:assembleDebug
```

The compiled APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`
