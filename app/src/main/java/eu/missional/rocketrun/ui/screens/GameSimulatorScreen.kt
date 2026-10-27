package eu.missional.rocketrun.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Leaderboard
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import eu.missional.rocketrun.data.GameRepository
import eu.missional.rocketrun.data.SolarSystemRepository
import eu.missional.rocketrun.physics.LaunchOutcome
import eu.missional.rocketrun.ui.theme.*
import eu.missional.rocketrun.viewmodel.RocketRunUiState
import kotlin.math.roundToInt

@Composable
fun GameSimulatorScreen(
    uiState: RocketRunUiState,
    onSetThrust: (Int) -> Unit,
    onSetTargetPlanet: (String) -> Unit,
    onToggleFreePlay: (Boolean) -> Unit,
    onLaunch: () -> Unit,
    onAnswerQuiz: (Int) -> Unit,
    onDismissQuiz: () -> Unit,
    onDismissAlert: () -> Unit,
    onRestart: () -> Unit,
    onUpdatePilotName: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val rank = GameRepository.getRankForMissions(uiState.completedMissionsCount)
    val dockedPlanet = SolarSystemRepository.findBySlug(uiState.dockedPlanetSlug) ?: SolarSystemRepository.earth
    val targetPlanet = SolarSystemRepository.findBySlug(uiState.targetPlanetSlug) ?: SolarSystemRepository.luna
    val metrics = uiState.windowMetrics

    var showLeaderboard by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .verticalScroll(rememberScrollState())
            .padding(14.dp)
            .testTag("game_simulator_screen")
    ) {
        // 1. Pilot Status Bar
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Rank & Name
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(text = rank.icon, fontSize = 24.sp)
                    Column {
                        Text(
                            text = uiState.pilotName,
                            color = TextPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Text(
                            text = "Rank: ${rank.title} • Score: ${uiState.score}",
                            color = SolarGold,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                // Lives & Leaderboard Icon
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Hearts
                    Row {
                        repeat(3) { i ->
                            Text(
                                text = if (i < uiState.lives) "❤️" else "🖤",
                                fontSize = 16.sp
                            )
                        }
                    }

                    IconButton(
                        onClick = { showLeaderboard = true },
                        modifier = Modifier.size(36.dp).testTag("leaderboard_btn")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Leaderboard,
                            contentDescription = "Leaderboard",
                            tint = CosmicCyan
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // 2. Fuel Tank with Live Solar Recharge Indicator
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Column(modifier = Modifier.padding(14.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(text = "⚡ Propellant Fuel Tank", color = TextPrimary, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                        if (uiState.fuel < 100f && !uiState.isFlying) {
                            Text(text = "(☀️ Solar Recharging)", color = SolarGold, fontSize = 10.sp)
                        }
                    }
                    Text(
                        text = "${uiState.fuel.roundToInt()}%",
                        color = if (uiState.fuel < 25f) MarsRed else ToxicGreen,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(6.dp))

                LinearProgressIndicator(
                    progress = { (uiState.fuel / 100f).coerceIn(0f, 1f) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = if (uiState.fuel < 25f) MarsRed else CosmicCyan,
                    trackColor = SpaceCardSurface
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // 3. Mission Briefing Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(targetPlanet.glowColor.copy(alpha = 0.5f)))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(text = "🎯 Current Mission", color = SolarGold, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text(text = "(${uiState.completedMissionsCount} Completed)", color = TextMuted, fontSize = 11.sp)
                    }

                    // Free play toggle
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(text = "Free Play", color = TextSecondary, fontSize = 11.sp)
                        Spacer(modifier = Modifier.width(4.dp))
                        Switch(
                            checked = uiState.isFreePlay,
                            onCheckedChange = onToggleFreePlay,
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = CosmicCyan,
                                checkedTrackColor = CosmicCyan.copy(alpha = 0.3f),
                                uncheckedThumbColor = TextMuted,
                                uncheckedTrackColor = SpaceCardSurface
                            ),
                            modifier = Modifier.scale(0.7f).testTag("freeplay_switch")
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Docked & Destination badges
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = SpaceCardSurface,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Text(text = "Docked World", color = TextMuted, fontSize = 10.sp)
                            Text(text = "${dockedPlanet.symbol} ${dockedPlanet.name.split(" ")[0]}", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    }

                    Text(text = "➔", color = CosmicCyan, fontSize = 18.sp, fontWeight = FontWeight.Bold)

                    Surface(
                        color = SpaceCardSurface,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Column(modifier = Modifier.padding(10.dp)) {
                            Text(text = "Target Destination", color = TextMuted, fontSize = 10.sp)
                            Text(text = "${targetPlanet.symbol} ${targetPlanet.name.split(" ")[0]}", color = SolarGold, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Mission clue
                uiState.currentMission?.let { mission ->
                    Text(
                        text = "📜 Cosmic Clue: \"${mission.clue}\"",
                        color = TextPrimary,
                        fontSize = 12.sp,
                        lineHeight = 17.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                if (uiState.currentMission?.crossesAsteroids == true) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Warning, contentDescription = "Hazard", tint = SolarGold, modifier = Modifier.size(16.dp))
                        Text(
                            text = "Warning: Flight path crosses the Asteroid Belt! Maintain precise orbital thrust.",
                            color = SolarGold,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // 4. Flight Deck & Orbital Intercept Controls
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Flight Deck & Telemetry 🛰️",
                    color = CosmicCyan,
                    fontWeight = FontWeight.Bold,
                    fontSize = 14.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Telemetry Row
                metrics?.let { m ->
                    Row(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "Current Distance", color = TextMuted, fontSize = 10.sp)
                            Text(text = "${"%.2f".format(m.currentAu)} AU", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "Intercept AU", color = TextMuted, fontSize = 10.sp)
                            Text(text = "${"%.2f".format(m.arrivalAu)} AU", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "Launch Window", color = TextMuted, fontSize = 10.sp)
                            Text(
                                text = if (m.isWindowOpen) "WINDOW OPEN" else "in ${"%.1f".format(m.timeToWindowSec)}s",
                                color = if (m.isWindowOpen) ToxicGreen else SolarGold,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Thrust Power Slider
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Thrust Power: ${uiState.thrustPower}%",
                        color = TextPrimary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    metrics?.let { m ->
                        Text(
                            text = "Target Window: ${m.minReqEnergy}% – ${m.maxCapEnergy}%",
                            color = CosmicCyan,
                            fontSize = 11.sp
                        )
                    }
                }

                Slider(
                    value = uiState.thrustPower.toFloat(),
                    onValueChange = { onSetThrust(it.roundToInt()) },
                    valueRange = 10f..100f,
                    enabled = !uiState.isFlying,
                    colors = SliderDefaults.colors(
                        thumbColor = CosmicCyan,
                        activeTrackColor = CosmicCyan,
                        inactiveTrackColor = SpaceCardSurface
                    ),
                    modifier = Modifier.testTag("thrust_slider")
                )

                // Required fuel note
                metrics?.let { m ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(text = "Flight Duration: ${"%.1f".format(m.flightDurationSec)}s", color = TextMuted, fontSize = 11.sp)
                        Text(
                            text = "Fuel Burn Required: ${m.fuelRequired}%",
                            color = if (uiState.fuel >= m.fuelRequired) ToxicGreen else MarsRed,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // LAUNCH SPACECRAFT BUTTON
                Button(
                    onClick = onLaunch,
                    enabled = !uiState.isFlying,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = CosmicCyan,
                        disabledContainerColor = CosmicCyan.copy(alpha = 0.4f)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("launch_rocket_btn")
                ) {
                    Icon(imageVector = Icons.Default.RocketLaunch, contentDescription = "Launch", tint = SpaceBlack)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (uiState.isFlying) "IN INTERPLANETARY TRANSIT..." else "LAUNCH SPACECRAFT 🚀",
                        color = SpaceBlack,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                }

                if (uiState.isFlying) {
                    Spacer(modifier = Modifier.height(12.dp))
                    LinearProgressIndicator(
                        progress = { uiState.flightProgress },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .clip(RoundedCornerShape(3.dp)),
                        color = SolarGold,
                        trackColor = SpaceCardSurface
                    )
                }
            }
        }
    }

    // --- DIALOGS ---

    // 1. Touchdown Quiz Modal
    uiState.activeQuiz?.let { quiz ->
        AlertDialog(
            onDismissRequest = {},
            containerColor = SpaceCardBg,
            title = {
                Text(
                    text = "Touchdown on ${targetPlanet.name}! 🎉",
                    color = CosmicCyan,
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp
                )
            },
            text = {
                Column {
                    Text(
                        text = quiz.question,
                        color = TextPrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    quiz.options.forEachIndexed { idx, opt ->
                        val isSelected = uiState.selectedQuizOptionIndex == idx
                        val btnColor = when {
                            !uiState.quizSubmitted -> if (isSelected) CosmicCyan else SpaceCardSurface
                            opt.isCorrect -> ToxicGreen
                            isSelected -> MarsRed
                            else -> SpaceCardSurface
                        }

                        Button(
                            onClick = { onAnswerQuiz(idx) },
                            enabled = !uiState.quizSubmitted,
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = btnColor,
                                disabledContainerColor = btnColor
                            ),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                        ) {
                            Text(
                                text = opt.text,
                                color = if (btnColor == CosmicCyan || btnColor == ToxicGreen) SpaceBlack else TextPrimary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }

                    if (uiState.quizSubmitted) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "💡 ${quiz.explanation}",
                            color = TextSecondary,
                            fontSize = 12.sp,
                            lineHeight = 16.sp
                        )
                    }
                }
            },
            confirmButton = {
                if (uiState.quizSubmitted) {
                    Button(
                        onClick = onDismissQuiz,
                        colors = ButtonDefaults.buttonColors(containerColor = SolarGold)
                    ) {
                        Text(text = "Next Mission 🚀", color = SpaceBlack, fontWeight = FontWeight.Bold)
                    }
                }
            }
        )
    }

    // 2. Launch Alert (Sub-orbital drift or Overshoot)
    uiState.launchAlert?.let { alert ->
        if (alert.outcome != LaunchOutcome.CAPTURE_SUCCESS) {
            AlertDialog(
                onDismissRequest = onDismissAlert,
                containerColor = SpaceCardBg,
                title = {
                    Text(
                        text = "⚠️ ${alert.title}",
                        color = MarsRed,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                },
                text = {
                    Column {
                        Text(
                            text = alert.explanation,
                            color = TextPrimary,
                            fontSize = 13.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (uiState.lives <= 0) "All lives lost! Tap below to restart your flight logs." else "Life lost! (${uiState.lives} lives remaining)",
                            color = SolarGold,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                },
                confirmButton = {
                    Button(
                        onClick = onDismissAlert,
                        colors = ButtonDefaults.buttonColors(containerColor = if (uiState.lives <= 0) SolarGold else CosmicCyan)
                    ) {
                        Text(
                            text = if (uiState.lives <= 0) "Restart Flight Deck" else "Re-Align Trajectory",
                            color = SpaceBlack,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            )
        }
    }

    // 3. Leaderboard Dialog
    if (showLeaderboard) {
        var pilotInput by remember { mutableStateOf(uiState.pilotName) }

        AlertDialog(
            onDismissRequest = { showLeaderboard = false },
            containerColor = SpaceCardBg,
            title = {
                Text(text = "🏆 Pilot Logs & High Scores", color = SolarGold, fontWeight = FontWeight.Bold)
            },
            text = {
                Column {
                    OutlinedTextField(
                        value = pilotInput,
                        onValueChange = {
                            pilotInput = it
                            onUpdatePilotName(it)
                        },
                        label = { Text("Your Pilot Callsign") },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedTextColor = TextPrimary,
                            unfocusedTextColor = TextPrimary,
                            focusedBorderColor = CosmicCyan,
                            unfocusedBorderColor = SpaceBorder
                        ),
                        modifier = Modifier.fillMaxWidth().testTag("pilot_name_input")
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(text = "Top Orbital Flights:", color = TextSecondary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(6.dp))

                    uiState.leaderboard.forEachIndexed { i, entry ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(text = "${i + 1}. ${entry.pilotName} (${entry.rankTitle})", color = TextPrimary, fontSize = 12.sp)
                            Text(text = "${entry.score} pts", color = SolarGold, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showLeaderboard = false }) {
                    Text(text = "Close", color = CosmicCyan)
                }
            }
        )
    }
}
