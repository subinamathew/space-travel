package eu.missional.rocketrun

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChatBubbleOutline
import androidx.compose.material.icons.filled.Explore
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import eu.missional.rocketrun.ui.screens.CosmicJokesScreen
import eu.missional.rocketrun.ui.screens.GameSimulatorScreen
import eu.missional.rocketrun.ui.screens.OrreryScreen
import eu.missional.rocketrun.ui.screens.PlanetDetailScreen
import eu.missional.rocketrun.ui.theme.CosmicCyan
import eu.missional.rocketrun.ui.theme.RocketRunTheme
import eu.missional.rocketrun.ui.theme.SpaceBlack
import eu.missional.rocketrun.ui.theme.SpaceBorder
import eu.missional.rocketrun.ui.theme.SpaceCardBg
import eu.missional.rocketrun.ui.theme.TextMuted
import eu.missional.rocketrun.viewmodel.AppScreen
import eu.missional.rocketrun.viewmodel.RocketRunViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: RocketRunViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            RocketRunTheme {
                RocketRunApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun RocketRunApp(viewModel: RocketRunViewModel) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()

    // Handle system back gesture
    BackHandler(enabled = uiState.currentScreen != AppScreen.ORRERY) {
        viewModel.navigateToScreen(AppScreen.ORRERY)
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        containerColor = SpaceBlack,
        bottomBar = {
            NavigationBar(
                containerColor = SpaceCardBg,
                contentColor = CosmicCyan,
                tonalElevation = 6.dp,
                modifier = Modifier.testTag("main_navigation_bar")
            ) {
                NavigationBarItem(
                    selected = uiState.currentScreen == AppScreen.ORRERY,
                    onClick = { viewModel.navigateToScreen(AppScreen.ORRERY) },
                    icon = { Icon(Icons.Default.Public, contentDescription = "Solar System Orrery") },
                    label = { Text("Orrery", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SpaceBlack,
                        selectedTextColor = CosmicCyan,
                        indicatorColor = CosmicCyan,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    ),
                    modifier = Modifier.testTag("nav_orrery")
                )

                NavigationBarItem(
                    selected = uiState.currentScreen == AppScreen.PLANETS,
                    onClick = { viewModel.navigateToScreen(AppScreen.PLANETS) },
                    icon = { Icon(Icons.Default.Explore, contentDescription = "Planetary Atlas & Lab") },
                    label = { Text("Atlas & Lab", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SpaceBlack,
                        selectedTextColor = CosmicCyan,
                        indicatorColor = CosmicCyan,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    ),
                    modifier = Modifier.testTag("nav_planets")
                )

                NavigationBarItem(
                    selected = uiState.currentScreen == AppScreen.GAME,
                    onClick = { viewModel.navigateToScreen(AppScreen.GAME) },
                    icon = { Icon(Icons.Default.RocketLaunch, contentDescription = "Flight Simulator") },
                    label = { Text("Flight Sim", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SpaceBlack,
                        selectedTextColor = CosmicCyan,
                        indicatorColor = CosmicCyan,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    ),
                    modifier = Modifier.testTag("nav_game")
                )

                NavigationBarItem(
                    selected = uiState.currentScreen == AppScreen.JOKES_ABOUT,
                    onClick = { viewModel.navigateToScreen(AppScreen.JOKES_ABOUT) },
                    icon = { Icon(Icons.Default.ChatBubbleOutline, contentDescription = "Cosmic Jokes & Roadmap") },
                    label = { Text("Jokes & Info", fontSize = 11.sp) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = SpaceBlack,
                        selectedTextColor = CosmicCyan,
                        indicatorColor = CosmicCyan,
                        unselectedIconColor = TextMuted,
                        unselectedTextColor = TextMuted
                    ),
                    modifier = Modifier.testTag("nav_jokes")
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (uiState.currentScreen) {
                AppScreen.ORRERY -> {
                    OrreryScreen(
                        uiState = uiState,
                        onTogglePause = { viewModel.toggleOrbitPause() },
                        onSetSpeed = { viewModel.setOrbitSpeed(it) },
                        onToggle3d = { viewModel.toggle3dMode() },
                        onToggleMoons = { viewModel.toggleShowMoons() },
                        onSelectPlanet = { viewModel.selectOrreryPlanet(it) },
                        onOpenPlanetDetail = { viewModel.openPlanetDetail(it) },
                        onTargetForFlight = {
                            viewModel.setTargetPlanet(it)
                            viewModel.navigateToScreen(AppScreen.GAME)
                        }
                    )
                }
                AppScreen.PLANETS -> {
                    PlanetDetailScreen(
                        uiState = uiState,
                        onSelectPlanetSlug = { viewModel.openPlanetDetail(it) },
                        onWeightChange = { viewModel.setWeightInput(it) },
                        onHeightChange = { viewModel.setHeightInput(it) },
                        onToggleWeightUnit = { viewModel.toggleWeightUnit() },
                        onToggleHeightUnit = { viewModel.toggleHeightUnit() },
                        onToggleAvatar = { viewModel.toggleAstronautAvatar() },
                        onToggleKidsFact = { viewModel.toggleKidsFactExpansion(it) },
                        onTargetPlanetForFlight = {
                            viewModel.setTargetPlanet(it)
                            viewModel.navigateToScreen(AppScreen.GAME)
                        }
                    )
                }
                AppScreen.GAME -> {
                    GameSimulatorScreen(
                        uiState = uiState,
                        onSetThrust = { viewModel.setThrustPower(it) },
                        onSetTargetPlanet = { viewModel.setTargetPlanet(it) },
                        onToggleFreePlay = { viewModel.toggleFreePlay(it) },
                        onLaunch = { viewModel.launchSpacecraft() },
                        onAnswerQuiz = { viewModel.answerQuiz(it) },
                        onDismissQuiz = { viewModel.dismissQuiz() },
                        onDismissAlert = { viewModel.dismissLaunchAlert() },
                        onRestart = { viewModel.restartMissionGame() },
                        onUpdatePilotName = { viewModel.setPilotName(it) }
                    )
                }
                AppScreen.JOKES_ABOUT -> {
                    CosmicJokesScreen(
                        uiState = uiState,
                        onRollNextJoke = { viewModel.rollNextJoke() },
                        onRevealRandomJoke = { viewModel.revealRandomJoke() },
                        onToggleStaticJoke = { viewModel.toggleStaticJokeReveal(it) }
                    )
                }
            }
        }
    }
}
