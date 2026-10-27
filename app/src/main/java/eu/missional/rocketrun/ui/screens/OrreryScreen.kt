package eu.missional.rocketrun.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.ViewInAr
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import eu.missional.rocketrun.data.PlanetInfo
import eu.missional.rocketrun.ui.components.GalacticHud
import eu.missional.rocketrun.ui.components.OrreryCanvas
import eu.missional.rocketrun.ui.theme.*
import eu.missional.rocketrun.viewmodel.RocketRunUiState

@Composable
fun OrreryScreen(
    uiState: RocketRunUiState,
    onTogglePause: () -> Unit,
    onSetSpeed: (Float) -> Unit,
    onToggle3d: () -> Unit,
    onToggleMoons: () -> Unit,
    onSelectPlanet: (PlanetInfo) -> Unit,
    onOpenPlanetDetail: (String) -> Unit,
    onTargetForFlight: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxSize()
            .background(SpaceBlack)
    ) {
        // 1. Orrery Canvas
        OrreryCanvas(
            elapsedSec = uiState.elapsedOrbitTimeSec,
            is3dMode = uiState.is3dMode,
            showMoons = uiState.showMoons,
            selectedPlanet = uiState.selectedOrreryPlanet,
            flyingPoint = uiState.flightCurrentPoint,
            transferArc = uiState.flightArcPoints,
            onPlanetSelected = onSelectPlanet
        )

        // 2. Top Galactic HUD
        GalacticHud(
            utcTime = uiState.utcEarthTime,
            modifier = Modifier.align(Alignment.TopCenter)
        )

        // 3. Floating Simulation Controls Bar
        Card(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 78.dp, end = 12.dp),
            shape = RoundedCornerShape(12.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg.copy(alpha = 0.9f)),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                // Play / Pause
                IconButton(
                    onClick = onTogglePause,
                    modifier = Modifier.size(34.dp).testTag("orbit_pause_play_btn")
                ) {
                    Icon(
                        imageVector = if (uiState.isOrbitPaused) Icons.Default.PlayArrow else Icons.Default.Pause,
                        contentDescription = "Toggle Orbit Simulation",
                        tint = if (uiState.isOrbitPaused) SolarGold else CosmicCyan
                    )
                }

                // Speed buttons
                SpeedButton(label = "1×", active = uiState.orbitSpeedMultiplier == 1.0f, onClick = { onSetSpeed(1.0f) })
                SpeedButton(label = "2×", active = uiState.orbitSpeedMultiplier == 2.0f, onClick = { onSetSpeed(2.0f) })
                SpeedButton(label = "5×", active = uiState.orbitSpeedMultiplier == 5.0f, onClick = { onSetSpeed(5.0f) })

                // 3D toggle
                IconButton(
                    onClick = onToggle3d,
                    modifier = Modifier.size(34.dp).testTag("orbit_3d_toggle_btn")
                ) {
                    Icon(
                        imageVector = Icons.Default.ViewInAr,
                        contentDescription = "Toggle 3D Perspective",
                        tint = if (uiState.is3dMode) CosmicCyan else TextMuted
                    )
                }

                // Moons toggle
                IconButton(
                    onClick = onToggleMoons,
                    modifier = Modifier.size(34.dp).testTag("orbit_moons_toggle_btn")
                ) {
                    Icon(
                        imageVector = if (uiState.showMoons) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                        contentDescription = "Toggle Planetary Moons",
                        tint = if (uiState.showMoons) CosmicCyan else TextMuted
                    )
                }
            }
        }

        // 4. Bottom Selected Planet Quick Inspection Sheet
        AnimatedVisibility(
            visible = uiState.selectedOrreryPlanet != null,
            enter = slideInVertically(initialOffsetY = { it }),
            exit = slideOutVertically(targetOffsetY = { it }),
            modifier = Modifier.align(Alignment.BottomCenter)
        ) {
            uiState.selectedOrreryPlanet?.let { planet ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp)
                        .testTag("planet_quick_sheet"),
                    shape = RoundedCornerShape(18.dp),
                    colors = CardDefaults.cardColors(containerColor = SpaceCardBg.copy(alpha = 0.95f)),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(planet.glowColor.copy(alpha = 0.6f)))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        Image(
                            painter = painterResource(id = planet.imageRes),
                            contentDescription = planet.name,
                            modifier = Modifier
                                .size(56.dp)
                                .clip(CircleShape),
                            contentScale = ContentScale.Fit
                        )

                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = planet.name,
                                    color = TextPrimary,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp
                                )
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = planet.symbol, fontSize = 14.sp)
                            }
                            Text(
                                text = planet.greeting,
                                color = planet.glowColor,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = "Orbit: ${planet.auDistance} AU • Gravity: ${planet.gravityRatio}× Earth",
                                color = TextSecondary,
                                fontSize = 11.sp
                            )
                        }

                        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Button(
                                onClick = { onOpenPlanetDetail(planet.slug) },
                                colors = ButtonDefaults.buttonColors(containerColor = CosmicCyan),
                                shape = RoundedCornerShape(8.dp),
                                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                                modifier = Modifier.testTag("explore_planet_btn")
                            ) {
                                Text(text = "Atlas & Lab", fontSize = 11.sp, color = SpaceBlack, fontWeight = FontWeight.Bold)
                            }

                            if (planet.slug != "sun") {
                                OutlinedButton(
                                    onClick = { onTargetForFlight(planet.slug) },
                                    shape = RoundedCornerShape(8.dp),
                                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                                    modifier = Modifier.testTag("target_flight_btn")
                                ) {
                                    Text(text = "Target Flight 🚀", fontSize = 11.sp, color = SolarGold)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SpeedButton(label: String, active: Boolean, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        shape = RoundedCornerShape(6.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (active) CosmicCyan else SpaceCardSurface,
            contentColor = if (active) SpaceBlack else TextSecondary
        ),
        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
        modifier = Modifier.height(26.dp)
    ) {
        Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
    }
}
