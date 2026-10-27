package eu.missional.rocketrun.data

data class QuizOption(
    val text: String,
    val isCorrect: Boolean
)

data class QuizQuestion(
    val planetSlug: String,
    val question: String,
    val options: List<QuizOption>,
    val explanation: String
)

data class GameMission(
    val id: String,
    val name: String,
    val targetSlug: String,
    val clue: String,
    val crossesAsteroids: Boolean = false,
    val isSlingshot: Boolean = false
)

data class PilotRank(
    val minMissions: Int,
    val title: String,
    val icon: String
)

data class SpaceJoke(
    val id: Int,
    val setup: String,
    val punchline: String,
    val emoji: String = "🚀"
)

data class LeaderboardEntry(
    val pilotName: String,
    val score: Int,
    val missionsCompleted: Int,
    val rankTitle: String
)

object GameRepository {

    val ranks = listOf(
        PilotRank(0, "Cadet", "🚀"),
        PilotRank(1, "Scout", "🛸"),
        PilotRank(3, "Navigator", "🛰️"),
        PilotRank(5, "Pioneer", "🌌"),
        PilotRank(8, "Master", "👑"),
        PilotRank(12, "Explorer", "🔭"),
        PilotRank(16, "Voyager", "🌠"),
        PilotRank(20, "Legend", "⭐")
    )

    fun getRankForMissions(completed: Int): PilotRank {
        var current = ranks[0]
        for (r in ranks) {
            if (completed >= r.minMissions) {
                current = r
            }
        }
        return current
    }

    val missionClues = mapOf(
        "moon" to "Fly to Earth's closest silver companion with Apollo craters and 1/6th gravity!",
        "mercury" to "Transit to the swift, scorched inner world where one day is longer than a year!",
        "venus" to "Chart a trajectory to our hottest sister planet shrouded in thick acid clouds and spinning backwards!",
        "earth" to "Return to the vibrant blue home world teeming with life and vast oceans!",
        "mars" to "Navigate to the rusty red neighbor harboring the solar system's tallest volcano, Olympus Mons!",
        "jupiter" to "Cross the asteroid belt and dock at the majestic king of planets with the Great Red Spot!",
        "saturn" to "Seek the lightweight jewel adorned with breathtaking rings spanning over 280,000 kilometers!",
        "uranus" to "Voyage outward to the cyan ice giant that rolls around the Sun on its side!",
        "neptune" to "Reach the outermost frontier world battered by supersonic supersonic winds exceeding 2,100 km/h!"
    )

    val quizzes: Map<String, List<QuizQuestion>> = mapOf(
        "mercury" to listOf(
            QuizQuestion(
                planetSlug = "mercury",
                question = "How long does a single day (sunrise to sunrise) last on Mercury compared to its year?",
                options = listOf(
                    QuizOption("A day lasts longer than its year! (176 Earth days)", true),
                    QuizOption("A day lasts only 10 Earth hours", false)
                ),
                explanation = "Because of its 3:2 spin-orbit resonance, Mercury rotates slowly while orbiting quickly!"
            )
        ),
        "venus" to listOf(
            QuizQuestion(
                planetSlug = "venus",
                question = "Why is Venus the hottest planet in the solar system, even hotter than Mercury?",
                options = listOf(
                    QuizOption("A runaway carbon dioxide greenhouse effect traps intense heat", true),
                    QuizOption("It has thousands of open lava geysers burning at once", false)
                ),
                explanation = "Venus's crushing CO2 atmosphere traps heat, turning the planet into an inferno at 465°C."
            )
        ),
        "moon" to listOf(
            QuizQuestion(
                planetSlug = "moon",
                question = "How high can you leap on the Moon compared to jumping on Earth?",
                options = listOf(
                    QuizOption("About 6 times higher due to low lunar gravity!", true),
                    QuizOption("Exactly the same height as on Earth", false)
                ),
                explanation = "The Moon has only 16.6% of Earth's gravity, making astronauts feel super lightweight!"
            )
        ),
        "mars" to listOf(
            QuizQuestion(
                planetSlug = "mars",
                question = "What makes the soil and rocks on Mars appear reddish-orange?",
                options = listOf(
                    QuizOption("Iron oxide dust (literally rust) covering the surface", true),
                    QuizOption("Glowing thermal heat rising from the interior", false)
                ),
                explanation = "Ancient water and atmospheric chemical reactions rusted iron in the Martian soil."
            )
        ),
        "jupiter" to listOf(
            QuizQuestion(
                planetSlug = "jupiter",
                question = "What is Jupiter's famous Great Red Spot?",
                options = listOf(
                    QuizOption("A giant anticyclone storm bigger than Earth that has raged for centuries", true),
                    QuizOption("A massive red volcanic island rising out of gas clouds", false)
                ),
                explanation = "The Great Red Spot is an enormous high-pressure atmospheric storm recorded since the 1600s."
            )
        ),
        "saturn" to listOf(
            QuizQuestion(
                planetSlug = "saturn",
                question = "If you could place Saturn in a gigantic cosmic ocean, what would happen?",
                options = listOf(
                    QuizOption("It would float because its average density is less than water!", true),
                    QuizOption("It would sink straight to the bottom like lead", false)
                ),
                explanation = "Saturn is composed predominantly of light hydrogen and helium, with density of only 0.69 g/cm³."
            )
        ),
        "uranus" to listOf(
            QuizQuestion(
                planetSlug = "uranus",
                question = "What is unique about the way Uranus rotates around the Sun?",
                options = listOf(
                    QuizOption("It is tilted 98 degrees and rolls around the Sun on its side", true),
                    QuizOption("It spins upside down every 24 hours", false)
                ),
                explanation = "A colossal ancient impact knocked Uranus sideways, causing 42-year long seasons at its poles."
            )
        ),
        "neptune" to listOf(
            QuizQuestion(
                planetSlug = "neptune",
                question = "How fast do storms and supersonic winds blow in Neptune's atmosphere?",
                options = listOf(
                    QuizOption("Over 2,100 km/h (1,300 mph) — supersonic speeds!", true),
                    QuizOption("Only gentle breezes around 20 km/h", false)
                ),
                explanation = "Neptune's frigid upper atmosphere has minimal friction, unleashing the fastest planetary winds."
            )
        ),
        "earth" to listOf(
            QuizQuestion(
                planetSlug = "earth",
                question = "What shields life on Earth from harmful solar radiation and ionizing space particles?",
                options = listOf(
                    QuizOption("The magnetic field generated by Earth's molten iron core", true),
                    QuizOption("The thick clouds of ocean water vapor", false)
                ),
                explanation = "Our planet's geodynamo creates a protective magnetosphere deflecting harsh solar wind."
            )
        )
    )

    val jokes: List<SpaceJoke> = listOf(
        SpaceJoke(1, "Why did the Sun go to school?", "To get brighter! ☀️🎓", "☀️"),
        SpaceJoke(2, "How do you organize a space party?", "You planet! 🪐🎉", "🪐"),
        SpaceJoke(3, "Why couldn't the astronaut book a room on the Moon?", "Because it was full! 🌕🏨", "🌕"),
        SpaceJoke(4, "What kind of music do planets listen to?", "Nep-tunes! 🎶🌊", "🎵"),
        SpaceJoke(5, "Why did Mickey Mouse go to outer space?", "To find Pluto! 🚀🐕", "🚀"),
        SpaceJoke(6, "How does the solar system hold up its pants?", "With an asteroid belt! ☄️👖", "☄️"),
        SpaceJoke(7, "What is an astronaut’s favorite key on the keyboard?", "The Space bar! ⌨️🧑‍🚀", "⌨️"),
        SpaceJoke(8, "Why did the alien sit on the computer?", "To keep an eye on the space bar! 👽💻", "👽"),
        SpaceJoke(9, "Why did Venus break up with Mars?", "She needed some space! 💔🚀", "❤️"),
        SpaceJoke(10, "What do stars eat for breakfast?", "Quarks and milk! 🥣⭐", "🥣"),
        SpaceJoke(11, "How do astronauts eat soup in zero gravity?", "With a flying saucer! 🛸🥣", "🛸"),
        SpaceJoke(12, "What did Mars say to Saturn?", "Give me a ring sometime! 🪐📞", "🪐")
    )
}
