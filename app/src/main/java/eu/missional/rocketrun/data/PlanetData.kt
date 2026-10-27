package eu.missional.rocketrun.data

import androidx.annotation.DrawableRes
import androidx.compose.ui.graphics.Color
import eu.missional.rocketrun.R

data class MoonSpec(
    val name: String,
    val distance: Float, // relative orbit distance
    val size: Float,
    val speed: Float,
    val color: Color,
    val isRetrograde: Boolean = false
)

data class KidsFact(
    val title: String,
    val content: String,
    val icon: String = "🚀"
)

data class PlanetInfo(
    val slug: String,
    val name: String,
    val symbol: String,
    val greeting: String,
    val fact: String,
    val primaryColor: Color,
    val accentColor: Color,
    val glowColor: Color,
    @DrawableRes val imageRes: Int,
    val orbitR: Float, // Relative radius in orrery
    val auDistance: Float, // Astronomical Units
    val sizeRatio: Float, // Relative display size
    val periodYears: Float, // Earth years for 1 orbit
    val initialPhase: Float, // 0..1
    val gravityRatio: Float, // vs Earth (1.0)
    val inclinationDeg: Float,
    val eccentricity: Float,
    val temperature: String,
    val dayLength: String,
    val atmosphere: String,
    val moonsCount: Int,
    val moons: List<MoonSpec> = emptyList(),
    val scienceLoreTopic: String,
    val scienceLoreDesc: String,
    val kidsFacts: List<KidsFact> = emptyList()
)

object SolarSystemRepository {
    val sun = PlanetInfo(
        slug = "sun",
        name = "The Sun (Sol)",
        symbol = "☀️",
        greeting = "Hello, Golden Star!",
        fact = "The yellow dwarf star at the heart of our solar system. It accounts for 99.86% of all mass in the solar system, generating light and life through core nuclear fusion.",
        primaryColor = Color(0xFFFFF5AA),
        accentColor = Color(0xFFFF8800),
        glowColor = Color(0xFFFFAA00),
        imageRes = R.drawable.planet_sun,
        orbitR = 0f,
        auDistance = 0f,
        sizeRatio = 3.6f,
        periodYears = 1.0f,
        initialPhase = 0f,
        gravityRatio = 27.9f,
        inclinationDeg = 0f,
        eccentricity = 0f,
        temperature = "5,500°C (Surface) • 15M°C (Core)",
        dayLength = "27 Earth days",
        atmosphere = "73% Hydrogen, 25% Helium",
        moonsCount = 8,
        scienceLoreTopic = "The Coronal Heating Mystery",
        scienceLoreDesc = "The visible surface of the Sun sits at ~5,500°C, yet its outer corona inexplicably surges to 1,000,000°C to 3,000,000°C! Scientists hypothesize magnetic nanoflares and Alfvén waves constantly pump energy into the atmosphere.",
        kidsFacts = listOf(
            KidsFact("Giant Fusion Engine", "The Sun burns 600 million tons of hydrogen every second, turning it into light that takes 8 minutes to reach Earth!"),
            KidsFact("Mega Heavyweight", "Over 1.3 million Earths could fit inside the Sun! If you could stand on it, you would weigh almost 28 times more than on Earth.")
        )
    )

    val luna = PlanetInfo(
        slug = "luna",
        name = "Luna (The Moon)",
        symbol = "🌙",
        greeting = "Hello, Silver Companion!",
        fact = "Earth's only natural satellite. Tidally locked in synchronous rotation, Luna controls Earth's ocean tides and is the only other world humans have walked upon.",
        primaryColor = Color(0xFFE2E8F0),
        accentColor = Color(0xFF64748B),
        glowColor = Color(0xFFCBD5E1),
        imageRes = R.drawable.planet_luna,
        orbitR = 17.5f,
        auDistance = 1.0f,
        sizeRatio = 1.1f,
        periodYears = 1.0f,
        initialPhase = 0.70f,
        gravityRatio = 0.166f,
        inclinationDeg = 5.14f,
        eccentricity = 0.0549f,
        temperature = "-130°C to +120°C",
        dayLength = "29.5 Earth days",
        atmosphere = "Virtually none (Exosphere)",
        moonsCount = 0,
        scienceLoreTopic = "Synchronous Tidal Locking",
        scienceLoreDesc = "Luna rotates on its axis at the exact same rate it orbits Earth, meaning the exact same face always points toward our planet.",
        kidsFacts = listOf(
            KidsFact("Super Bouncy Jumps!", "Because the Moon's gravity is only 1/6th of Earth's, you can jump 6 times higher! Apollo astronauts bounced across the craters."),
            KidsFact("Footprints Forever", "With no wind, rain, or atmosphere, astronauts' footprints on the Moon could remain undisturbed for millions of years.")
        )
    )

    val planets: List<PlanetInfo> = listOf(
        PlanetInfo(
            slug = "mercury",
            name = "Mercury",
            symbol = "☿️",
            greeting = "Hello, Scorched World!",
            fact = "The smallest planet — a day lasts longer than a year, with temperatures ranging from −180°C to 430°C.",
            primaryColor = Color(0xFFB8A99A),
            accentColor = Color(0xFF5C4A3D),
            glowColor = Color(0xFFD4A574),
            imageRes = R.drawable.planet_mercury,
            orbitR = 7.5f,
            auDistance = 0.387f,
            sizeRatio = 1.0f,
            periodYears = 0.240846f,
            initialPhase = 0.15f,
            gravityRatio = 0.38f,
            inclinationDeg = 7.0f,
            eccentricity = 0.2056f,
            temperature = "-180°C to 430°C",
            dayLength = "176 Earth days",
            atmosphere = "Trace oxygen, sodium, hydrogen",
            moonsCount = 0,
            scienceLoreTopic = "3:2 Spin-Orbit Resonance & Polar Ice",
            scienceLoreDesc = "Mercury spins exactly three times on its axis for every two orbits around the Sun. Permanently shadowed craters at its poles harbor billions of tons of water ice shielded from blistering 430°C sunlight.",
            kidsFacts = listOf(
                KidsFact("Speed Demon", "Mercury zooms around the Sun at 47 km/s (105,000 mph) — faster than any other planet!"),
                KidsFact("Extreme Thermometer", "By day it's hot enough to melt lead, but at night it plunges to deep freeze because there's no atmosphere to trap heat.")
            )
        ),
        PlanetInfo(
            slug = "venus",
            name = "Venus",
            symbol = "♀️",
            greeting = "Hello, Inferno Twin!",
            fact = "A runaway greenhouse makes Venus the hottest planet at 465°C — hotter than Mercury despite being farther from the Sun.",
            primaryColor = Color(0xFFF5C842),
            accentColor = Color(0xFF8B5E00),
            glowColor = Color(0xFFF5C842),
            imageRes = R.drawable.planet_venus,
            orbitR = 11.5f,
            auDistance = 0.723f,
            sizeRatio = 1.35f,
            periodYears = 0.615197f,
            initialPhase = 0.45f,
            gravityRatio = 0.91f,
            inclinationDeg = 3.39f,
            eccentricity = 0.0068f,
            temperature = "465°C (Uniform)",
            dayLength = "243 Earth days",
            atmosphere = "96.5% Carbon dioxide, 3.5% Nitrogen",
            moonsCount = 0,
            scienceLoreTopic = "Runaway Greenhouse & Backward Spin",
            scienceLoreDesc = "With an atmosphere generating 92 bars of surface pressure, Venus suffers an intense runaway greenhouse effect. Venus also rotates backwards (retrograde)—the Sun rises in the west!",
            kidsFacts = listOf(
                KidsFact("Raining Acid", "Clouds on Venus are made of sulfuric acid! But it's so hot at the surface that the acid rain evaporates before it even lands."),
                KidsFact("Earth's Evil Twin", "Venus is almost the same size and mass as Earth, but its crushing air pressure feels like being 900 meters deep under the ocean.")
            )
        ),
        PlanetInfo(
            slug = "earth",
            name = "Earth",
            symbol = "🌍",
            greeting = "Hello, Home World!",
            fact = "The only known world teeming with life. Our pale blue dot is 71% ocean, wrapped in a protective, life-giving atmosphere.",
            primaryColor = Color(0xFF4A90D9),
            accentColor = Color(0xFF1A3A6A),
            glowColor = Color(0xFF4A90D9),
            imageRes = R.drawable.planet_earth,
            orbitR = 16.0f,
            auDistance = 1.000f,
            sizeRatio = 1.45f,
            periodYears = 1.0f,
            initialPhase = 0.70f,
            gravityRatio = 1.0f,
            inclinationDeg = 0.0f,
            eccentricity = 0.0167f,
            temperature = "-88°C to 58°C (Avg 15°C)",
            dayLength = "24 hours",
            atmosphere = "78% Nitrogen, 21% Oxygen, 1% Argon",
            moonsCount = 1,
            moons = listOf(
                MoonSpec("Moon", 2.2f, 0.32f, 2.8f, Color(0xFFE2E8F0))
            ),
            scienceLoreTopic = "The Protective Geodynamo",
            scienceLoreDesc = "Earth's molten iron outer core generates a powerful magnetosphere that deflects dangerous ionizing solar wind. Combined with plate tectonics, Earth maintains stable liquid surface oceans.",
            kidsFacts = listOf(
                KidsFact("Cosmic Shield", "Our atmosphere burns up thousands of meteors every day and protects us from harmful cosmic rays!"),
                KidsFact("Living Oasis", "Earth is the Goldilocks planet — not too hot, not too cold, but just right for liquid water and millions of species of living creatures.")
            )
        ),
        PlanetInfo(
            slug = "mars",
            name = "Mars",
            symbol = "♂️",
            greeting = "Hello, Red Planet!",
            fact = "Home to Olympus Mons — the tallest volcano in the solar system at 21 km high. The rusty colour is iron-oxide dust.",
            primaryColor = Color(0xFFC1440E),
            accentColor = Color(0xFF5C1A00),
            glowColor = Color(0xFFE05A22),
            imageRes = R.drawable.planet_mars,
            orbitR = 21.0f,
            auDistance = 1.524f,
            sizeRatio = 1.2f,
            periodYears = 1.880848f,
            initialPhase = 0.30f,
            gravityRatio = 0.38f,
            inclinationDeg = 1.85f,
            eccentricity = 0.0934f,
            temperature = "-125°C to 20°C (Avg -65°C)",
            dayLength = "24 hours 37 minutes",
            atmosphere = "95% Carbon dioxide, 2.6% Nitrogen",
            moonsCount = 2,
            moons = listOf(
                MoonSpec("Phobos", 1.8f, 0.22f, 1.6f, Color(0xFFD4C4B5)),
                MoonSpec("Deimos", 2.5f, 0.18f, 3.2f, Color(0xFFB8ABA0))
            ),
            scienceLoreTopic = "Colossal Geology: Olympus Mons",
            scienceLoreDesc = "Mars hosts Olympus Mons, a shield volcano 21.9 km high — nearly three times Mt. Everest! Its canyon system, Valles Marineris, stretches 4,000 km across the Martian equator.",
            kidsFacts = listOf(
                KidsFact("Rust World", "Mars is orange-red because its surface rocks are literally covered in rusted iron dust!"),
                KidsFact("Blue Sunsets", "Because of fine dust in the thin atmosphere, sunsets on Mars appear ghostly blue instead of golden orange!")
            )
        ),
        PlanetInfo(
            slug = "jupiter",
            name = "Jupiter",
            symbol = "♃",
            greeting = "Hello, Giant King!",
            fact = "So massive all other planets could fit inside it. Its Great Red Spot storm has raged for over 350 years.",
            primaryColor = Color(0xFFC89060),
            accentColor = Color(0xFF5C3010),
            glowColor = Color(0xFFC89060),
            imageRes = R.drawable.planet_jupiter,
            orbitR = 27.5f,
            auDistance = 5.204f,
            sizeRatio = 2.4f,
            periodYears = 11.8626f,
            initialPhase = 0.85f,
            gravityRatio = 2.53f,
            inclinationDeg = 1.30f,
            eccentricity = 0.0484f,
            temperature = "-110°C (Cloud tops)",
            dayLength = "9 hours 56 minutes",
            atmosphere = "90% Hydrogen, 10% Helium",
            moonsCount = 95,
            moons = listOf(
                MoonSpec("Io", 3.2f, 0.30f, 1.8f, Color(0xFFFCD34D)),
                MoonSpec("Europa", 4.1f, 0.26f, 2.6f, Color(0xFFE0F2FE)),
                MoonSpec("Ganymede", 5.0f, 0.38f, 3.8f, Color(0xFFD1D5DB)),
                MoonSpec("Callisto", 5.9f, 0.34f, 5.2f, Color(0xFF9CA3AF))
            ),
            scienceLoreTopic = "Metallic Hydrogen & Anticyclones",
            scienceLoreDesc = "Deep inside Jupiter, pressures exceed 2 million atmospheres, forcing hydrogen into a shimmering liquid metallic conductor that powers an immense magnetosphere.",
            kidsFacts = listOf(
                KidsFact("Super Fast Spin", "Despite being a humongous gas giant, Jupiter has the shortest day in the solar system: less than 10 hours!"),
                KidsFact("Ocean Moon Europa", "Its moon Europa has a smooth icy crust covering a warm, liquid saltwater ocean with more water than all of Earth's oceans combined!")
            )
        ),
        PlanetInfo(
            slug = "saturn",
            name = "Saturn",
            symbol = "🪐",
            greeting = "Hello, Ringed Beauty!",
            fact = "Saturn’s iconic rings span 282,000 km. It’s so low-density it would float on water!",
            primaryColor = Color(0xFFE0C080),
            accentColor = Color(0xFF7A5A20),
            glowColor = Color(0xFFE0C080),
            imageRes = R.drawable.planet_saturn,
            orbitR = 34.0f,
            auDistance = 9.582f,
            sizeRatio = 2.1f,
            periodYears = 29.4475f,
            initialPhase = 0.40f,
            gravityRatio = 1.07f,
            inclinationDeg = 2.49f,
            eccentricity = 0.0565f,
            temperature = "-140°C (Cloud tops)",
            dayLength = "10 hours 33 minutes",
            atmosphere = "96% Hydrogen, 3% Helium",
            moonsCount = 146,
            moons = listOf(
                MoonSpec("Mimas", 3.8f, 0.22f, 2.2f, Color(0xFFE5E7EB)),
                MoonSpec("Enceladus", 4.7f, 0.26f, 3.2f, Color(0xFFF8FAFC)),
                MoonSpec("Titan", 5.8f, 0.42f, 5.0f, Color(0xFFFBBF24))
            ),
            scienceLoreTopic = "Floating Density & Hexagonal Jet Stream",
            scienceLoreDesc = "Saturn's density is only 0.687 g/cm³ — less than water! Its magnificent rings average just 10 meters thick, while a bizarre geometric hexagon storm rotates at its north pole.",
            kidsFacts = listOf(
                KidsFact("Bathtub Planet", "If you could build a bathtub big enough to hold Saturn, the entire planet would float like a giant rubber duck!"),
                KidsFact("Titan's Methane Lakes", "Saturn's giant moon Titan has rain, rivers, and lakes made of liquid methane and an atmosphere thicker than Earth's.")
            )
        ),
        PlanetInfo(
            slug = "uranus",
            name = "Uranus",
            symbol = "♅",
            greeting = "Hello, Ice Giant!",
            fact = "Uranus has a 98° axial tilt — it rolls around the Sun on its side. Its rich blue-cyan hue comes from methane gas.",
            primaryColor = Color(0xFF4CC9F0),
            accentColor = Color(0xFF1D4ED8),
            glowColor = Color(0xFF38BDF8),
            imageRes = R.drawable.planet_uranus,
            orbitR = 40.5f,
            auDistance = 19.201f,
            sizeRatio = 1.75f,
            periodYears = 84.0168f,
            initialPhase = 0.20f,
            gravityRatio = 0.89f,
            inclinationDeg = 0.77f,
            eccentricity = 0.0472f,
            temperature = "-224°C (Coldest atmosphere)",
            dayLength = "17 hours 14 minutes",
            atmosphere = "83% Hydrogen, 15% Helium, 2% Methane",
            moonsCount = 28,
            moons = listOf(
                MoonSpec("Miranda", 2.6f, 0.20f, 2.0f, Color(0xFFCBD5E1)),
                MoonSpec("Ariel", 3.3f, 0.25f, 3.0f, Color(0xFFE2E8F0)),
                MoonSpec("Titania", 4.1f, 0.32f, 4.2f, Color(0xFFF1F5F9))
            ),
            scienceLoreTopic = "The Sideways Rolling World",
            scienceLoreDesc = "With an axial tilt of 97.77° from a prehistoric cosmic collision, Uranus rolls around the Sun like a ball. Each pole experiences 42 years of daylight followed by 42 years of night.",
            kidsFacts = listOf(
                KidsFact("Diamond Rain", "Extreme pressures deep within the ice giant may compress carbon atoms into sparkling diamonds that sink toward the core!"),
                KidsFact("Ice Box of the Solar System", "Even though Neptune is further away, Uranus is actually the coldest planet, plunging down to −224°C.")
            )
        ),
        PlanetInfo(
            slug = "neptune",
            name = "Neptune",
            symbol = "♆",
            greeting = "Hello, Windy World!",
            fact = "The windiest planet — storms reach 2,100 km/h. One orbit of the Sun takes 165 Earth years.",
            primaryColor = Color(0xFF3B6FCC),
            accentColor = Color(0xFF0A1A5C),
            glowColor = Color(0xFF5588FF),
            imageRes = R.drawable.planet_neptune,
            orbitR = 46.0f,
            auDistance = 30.047f,
            sizeRatio = 1.7f,
            periodYears = 164.7913f,
            initialPhase = 0.60f,
            gravityRatio = 1.14f,
            inclinationDeg = 1.77f,
            eccentricity = 0.0086f,
            temperature = "-214°C (Cloud tops)",
            dayLength = "16 hours 6 minutes",
            atmosphere = "80% Hydrogen, 19% Helium, 1% Methane",
            moonsCount = 16,
            moons = listOf(
                MoonSpec("Proteus", 2.7f, 0.22f, 2.2f, Color(0xFF94A3B8)),
                MoonSpec("Triton", 3.7f, 0.32f, 3.6f, Color(0xFFBAE6FD), isRetrograde = true)
            ),
            scienceLoreTopic = "Supersonic Winds & Cryovolcanic Triton",
            scienceLoreDesc = "Neptune experiences the most violent supersonic winds in the solar system, topping 2,100 km/h. Its captured moon Triton features cryovolcanoes spewing liquid nitrogen.",
            kidsFacts = listOf(
                KidsFact("Supersonic Roar", "Neptune's winds whip around three times faster than Earth's strongest hurricanes, breaking the speed of sound!"),
                KidsFact("Deep Blue Mystery", "Its intense azure hue is created by atmospheric methane absorbing red light and reflecting radiant cobalt blue back into space.")
            )
        )
    )

    val earth: PlanetInfo get() = planets.first { it.slug == "earth" }

    fun getAllBodies(): List<PlanetInfo> = listOf(sun, luna) + planets

    fun findBySlug(slug: String): PlanetInfo? {
        if (slug == "sun") return sun
        if (slug == "luna" || slug == "moon") return luna
        return planets.find { it.slug.equals(slug, ignoreCase = true) }
    }
}
