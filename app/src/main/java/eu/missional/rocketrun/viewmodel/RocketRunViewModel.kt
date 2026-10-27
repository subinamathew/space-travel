package eu.missional.rocketrun.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import eu.missional.rocketrun.data.*
import eu.missional.rocketrun.physics.ArcPoint
import eu.missional.rocketrun.physics.LaunchOutcome
import eu.missional.rocketrun.physics.LaunchResult
import eu.missional.rocketrun.physics.OrbitalPhysics
import eu.missional.rocketrun.physics.WindowMetrics
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

enum class AppScreen {
    ORRERY,
    PLANETS,
    GAME,
    JOKES_ABOUT
}

data class RocketRunUiState(
    val currentScreen: AppScreen = AppScreen.ORRERY,
    
    // Orrery State
    val isOrbitPaused: Boolean = false,
    val orbitSpeedMultiplier: Float = 1.0f,
    val is3dMode: Boolean = false,
    val showMoons: Boolean = true,
    val selectedOrreryPlanet: PlanetInfo? = null,
    val elapsedOrbitTimeSec: Float = 0f,
    val utcEarthTime: String = "12:00:00 UTC",
    
    // Planet Detail & Cosmic Lab State
    val currentPlanetSlug: String = "earth",
    val userWeight: Float = 45f,
    val userHeight: Float = 140f,
    val weightUnit: String = "kg",
    val heightUnit: String = "cm",
    val isAstronautFemale: Boolean = false,
    val expandedKidsFactIndex: Int? = null,

    // Flight Simulator / Game State
    val isGameActive: Boolean = true,
    val isFreePlay: Boolean = false,
    val dockedPlanetSlug: String = "earth",
    val targetPlanetSlug: String = "moon",
    val lives: Int = 3,
    val score: Int = 0,
    val fuel: Float = 100f,
    val thrustPower: Int = 45,
    val completedMissionsCount: Int = 0,
    val currentMission: GameMission? = null,
    val windowMetrics: WindowMetrics? = null,
    val isFlying: Boolean = false,
    val flightProgress: Float = 0f,
    val flightArcPoints: List<ArcPoint> = emptyList(),
    val flightCurrentPoint: ArcPoint? = null,
    val activeQuiz: QuizQuestion? = null,
    val selectedQuizOptionIndex: Int? = null,
    val quizSubmitted: Boolean = false,
    val launchAlert: LaunchResult? = null,
    val pilotName: String = "Captain Zack",
    val leaderboard: List<LeaderboardEntry> = listOf(
        LeaderboardEntry("Captain Zack", 1250, 5, "Pioneer"),
        LeaderboardEntry("Papa Orbit", 950, 4, "Navigator"),
        LeaderboardEntry("Astro Explorer", 600, 2, "Scout"),
        LeaderboardEntry("Comet Scout", 300, 1, "Scout")
    ),

    // Cosmic Jokes State
    val currentRandomJokeIndex: Int = 0,
    val isRandomJokeRevealed: Boolean = false,
    val revealedStaticJokeIds: Set<Int> = emptySet()
)

class RocketRunViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(RocketRunUiState())
    val uiState: StateFlow<RocketRunUiState> = _uiState.asStateFlow()

    private var orbitLoopJob: Job? = null
    private var solarRechargeJob: Job? = null
    private var missionPool = mutableListOf<String>()

    init {
        startOrbitSimulation()
        startSolarRechargeClock()
        generateNewMission()
        updateMetrics()
    }

    private fun startOrbitSimulation() {
        orbitLoopJob?.cancel()
        orbitLoopJob = viewModelScope.launch {
            val timeFormat = SimpleDateFormat("HH:mm:ss 'UTC'", Locale.US).apply {
                timeZone = TimeZone.getTimeZone("UTC")
            }
            while (isActive) {
                delay(33) // ~30 fps update
                val currentState = _uiState.value
                val dt = if (!currentState.isOrbitPaused) 0.033f * currentState.orbitSpeedMultiplier else 0f
                val newElapsed = currentState.elapsedOrbitTimeSec + dt
                val formattedTime = timeFormat.format(Date())

                _uiState.update {
                    it.copy(
                        elapsedOrbitTimeSec = newElapsed,
                        utcEarthTime = formattedTime
                    )
                }
                updateMetrics()
            }
        }
    }

    private fun startSolarRechargeClock() {
        solarRechargeJob?.cancel()
        solarRechargeJob = viewModelScope.launch {
            while (isActive) {
                delay(1000)
                _uiState.update { state ->
                    if (!state.isFlying && state.fuel < 100f) {
                        // Near Sun (Mercury/Venus) recharge is fastest
                        val rate = when (state.dockedPlanetSlug) {
                            "mercury", "venus", "sun" -> 2.5f
                            "earth", "moon", "luna", "mars" -> 1.7f
                            else -> 1.2f
                        }
                        state.copy(fuel = (state.fuel + rate).coerceAtMost(100f))
                    } else {
                        state
                    }
                }
            }
        }
    }

    fun navigateToScreen(screen: AppScreen) {
        _uiState.update { it.copy(currentScreen = screen) }
    }

    fun openPlanetDetail(slug: String) {
        _uiState.update {
            it.copy(
                currentPlanetSlug = slug,
                currentScreen = AppScreen.PLANETS,
                expandedKidsFactIndex = null
            )
        }
    }

    fun selectOrreryPlanet(planet: PlanetInfo?) {
        _uiState.update { it.copy(selectedOrreryPlanet = planet) }
    }

    fun toggleOrbitPause() {
        _uiState.update { it.copy(isOrbitPaused = !it.isOrbitPaused) }
    }

    fun setOrbitSpeed(multiplier: Float) {
        _uiState.update { it.copy(orbitSpeedMultiplier = multiplier) }
    }

    fun toggle3dMode() {
        _uiState.update { it.copy(is3dMode = !it.is3dMode) }
    }

    fun toggleShowMoons() {
        _uiState.update { it.copy(showMoons = !it.showMoons) }
    }

    // --- Planet Explorer & Cosmic Lab ---

    fun setWeightInput(weight: Float) {
        _uiState.update { it.copy(userWeight = weight.coerceIn(5f, 300f)) }
    }

    fun setHeightInput(height: Float) {
        _uiState.update { it.copy(userHeight = height.coerceIn(30f, 250f)) }
    }

    fun toggleWeightUnit() {
        _uiState.update {
            if (it.weightUnit == "kg") {
                it.copy(weightUnit = "lbs", userWeight = (it.userWeight * 2.20462f).coerceIn(10f, 650f))
            } else {
                it.copy(weightUnit = "kg", userWeight = (it.userWeight / 2.20462f).coerceIn(5f, 300f))
            }
        }
    }

    fun toggleHeightUnit() {
        _uiState.update {
            if (it.heightUnit == "cm") {
                it.copy(heightUnit = "in", userHeight = (it.userHeight / 2.54f).coerceIn(12f, 100f))
            } else {
                it.copy(heightUnit = "cm", userHeight = (it.userHeight * 2.54f).coerceIn(30f, 250f))
            }
        }
    }

    fun toggleAstronautAvatar() {
        _uiState.update { it.copy(isAstronautFemale = !it.isAstronautFemale) }
    }

    fun toggleKidsFactExpansion(index: Int) {
        _uiState.update {
            it.copy(expandedKidsFactIndex = if (it.expandedKidsFactIndex == index) null else index)
        }
    }

    // --- Flight Simulator & Game Logic ---

    fun setThrustPower(power: Int) {
        _uiState.update { it.copy(thrustPower = power.coerceIn(10, 100)) }
        updateMetrics()
    }

    fun setTargetPlanet(slug: String) {
        if (slug == _uiState.value.dockedPlanetSlug) return
        _uiState.update { it.copy(targetPlanetSlug = slug) }
        updateMetrics()
    }

    fun toggleFreePlay(isFree: Boolean) {
        _uiState.update { it.copy(isFreePlay = isFree) }
        if (!isFree && _uiState.value.currentMission == null) {
            generateNewMission()
        }
    }

    private fun updateMetrics() {
        val s = _uiState.value
        val metrics = OrbitalPhysics.calculateMetrics(
            s.dockedPlanetSlug,
            s.targetPlanetSlug,
            s.elapsedOrbitTimeSec,
            s.thrustPower
        )
        _uiState.update { it.copy(windowMetrics = metrics) }
    }

    private fun generateNewMission() {
        val currentDocked = _uiState.value.dockedPlanetSlug
        val available = listOf("moon", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune")
            .filter { it != currentDocked }

        if (missionPool.isEmpty()) {
            missionPool = available.shuffled().toMutableList()
        }
        val target = missionPool.removeFirstOrNull() ?: available.random()
        val planetInfo = SolarSystemRepository.findBySlug(target)
        val clue = GameRepository.missionClues[target] ?: "Reach ${planetInfo?.name ?: target}!"
        val crosses = OrbitalPhysics.checkAsteroidHazard(currentDocked, target)

        val mission = GameMission(
            id = "mission_${_uiState.value.completedMissionsCount + 1}",
            name = planetInfo?.name ?: target.replaceFirstChar { it.uppercase() },
            targetSlug = target,
            clue = clue,
            crossesAsteroids = crosses
        )

        _uiState.update {
            it.copy(
                currentMission = mission,
                targetPlanetSlug = target
            )
        }
        updateMetrics()
    }

    fun launchSpacecraft() {
        val s = _uiState.value
        if (s.isFlying) return
        val metrics = s.windowMetrics ?: return

        // Check fuel
        if (s.fuel < metrics.fuelRequired) {
            _uiState.update {
                it.copy(
                    launchAlert = LaunchResult(
                        LaunchOutcome.FUEL_EXHAUSTED,
                        "Low Fuel Tank!",
                        "Need ${metrics.fuelRequired}% propellant, but only ${s.fuel.toInt()}% available. Wait for solar recharge or reduce thrust power!"
                    )
                )
            }
            return
        }

        // Consume fuel
        val newFuel = (s.fuel - metrics.fuelRequired).coerceAtLeast(0f)
        val arcPoints = OrbitalPhysics.generateTransferArc(
            s.dockedPlanetSlug,
            s.targetPlanetSlug,
            s.elapsedOrbitTimeSec,
            metrics.flightDurationSec,
            steps = 40
        )

        _uiState.update {
            it.copy(
                fuel = newFuel,
                isFlying = true,
                flightProgress = 0f,
                flightArcPoints = arcPoints,
                flightCurrentPoint = arcPoints.firstOrNull(),
                launchAlert = null
            )
        }

        viewModelScope.launch {
            val totalSteps = arcPoints.size
            val stepDelay = ((metrics.flightDurationSec * 1000f) / totalSteps).toLong().coerceIn(40L, 200L)

            for (i in 0 until totalSteps) {
                delay(stepDelay)
                val progress = i.toFloat() / (totalSteps - 1)
                _uiState.update {
                    it.copy(
                        flightProgress = progress,
                        flightCurrentPoint = arcPoints.getOrNull(i)
                    )
                }
            }

            // Flight finished - evaluate outcome!
            val outcomeResult = OrbitalPhysics.evaluateOutcome(s.thrustPower, metrics)
            if (outcomeResult.outcome == LaunchOutcome.CAPTURE_SUCCESS) {
                // Dock at target planet
                val target = s.targetPlanetSlug
                val quizzes = GameRepository.quizzes[target] ?: GameRepository.quizzes["earth"]!!
                val quiz = quizzes.random()

                _uiState.update {
                    it.copy(
                        isFlying = false,
                        dockedPlanetSlug = target,
                        score = it.score + 250,
                        activeQuiz = quiz,
                        selectedQuizOptionIndex = null,
                        quizSubmitted = false,
                        launchAlert = outcomeResult
                    )
                }
            } else {
                // Deduct life
                val updatedLives = (s.lives - 1).coerceAtLeast(0)
                _uiState.update {
                    it.copy(
                        isFlying = false,
                        lives = updatedLives,
                        launchAlert = outcomeResult
                    )
                }
            }
        }
    }

    fun answerQuiz(optionIndex: Int) {
        val s = _uiState.value
        val quiz = s.activeQuiz ?: return
        if (s.quizSubmitted) return

        val isCorrect = quiz.options.getOrNull(optionIndex)?.isCorrect == true
        val bonus = if (isCorrect) 150 else 0
        val newCompleted = s.completedMissionsCount + 1

        _uiState.update {
            it.copy(
                selectedQuizOptionIndex = optionIndex,
                quizSubmitted = true,
                score = it.score + bonus,
                completedMissionsCount = newCompleted
            )
        }
    }

    fun dismissQuiz() {
        _uiState.update {
            it.copy(
                activeQuiz = null,
                selectedQuizOptionIndex = null,
                quizSubmitted = false,
                launchAlert = null
            )
        }
        generateNewMission()
    }

    fun dismissLaunchAlert() {
        _uiState.update { it.copy(launchAlert = null) }
        if (_uiState.value.lives <= 0) {
            restartMissionGame()
        }
    }

    fun restartMissionGame() {
        _uiState.update {
            it.copy(
                lives = 3,
                fuel = 100f,
                dockedPlanetSlug = "earth",
                score = 0,
                completedMissionsCount = 0,
                isFlying = false,
                launchAlert = null
            )
        }
        generateNewMission()
    }

    fun setPilotName(name: String) {
        val cleaned = name.trim().take(20)
        if (cleaned.isNotEmpty()) {
            _uiState.update { it.copy(pilotName = cleaned) }
        }
    }

    // --- Cosmic Space Jokes ---

    fun rollNextJoke() {
        val total = GameRepository.jokes.size
        _uiState.update {
            it.copy(
                currentRandomJokeIndex = (it.currentRandomJokeIndex + 1) % total,
                isRandomJokeRevealed = false
            )
        }
    }

    fun revealRandomJoke() {
        _uiState.update { it.copy(isRandomJokeRevealed = true) }
    }

    fun toggleStaticJokeReveal(jokeId: Int) {
        _uiState.update {
            val set = it.revealedStaticJokeIds.toMutableSet()
            if (set.contains(jokeId)) {
                set.remove(jokeId)
            } else {
                set.add(jokeId)
            }
            it.copy(revealedStaticJokeIds = set)
        }
    }

    override fun onCleared() {
        super.onCleared()
        orbitLoopJob?.cancel()
        solarRechargeJob?.cancel()
    }
}
