package eu.missional.rocketrun.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import eu.missional.rocketrun.data.PlanetInfo
import eu.missional.rocketrun.ui.theme.*
import kotlin.math.roundToInt

@Composable
fun CosmicCalculatorView(
    planet: PlanetInfo,
    userWeight: Float,
    userHeight: Float,
    weightUnit: String,
    heightUnit: String,
    isAstronautFemale: Boolean,
    onWeightChange: (Float) -> Unit,
    onHeightChange: (Float) -> Unit,
    onToggleWeightUnit: () -> Unit,
    onToggleHeightUnit: () -> Unit,
    onToggleAvatar: () -> Unit,
    modifier: Modifier = Modifier
) {
    val g = planet.gravityRatio
    val isSun = planet.slug == "sun"

    // Calculate weight on planet
    val weightOnPlanet = userWeight * g
    val weightDiffPct = ((g - 1f) * 100f).roundToInt()

    val weightDescription = when {
        isSun -> "Colossal crushing weight (+2690%) — like a skyscraper pressing down!"
        g in 0.98f..1.02f -> "Identical to your Earth weight!"
        g > 1f -> {
            val feel = when {
                g > 20f -> "a huge locomotive on your back!"
                g > 2.0f -> "a backpack full of giant boulders!"
                else -> "heavy winter Antarctic gear!"
            }
            "+${weightDiffPct}% heavier — feels like $feel"
        }
        else -> {
            val feel = when {
                g < 0.2f -> "a light fluffy floating feather!"
                g < 0.45f -> "moon-boots bouncing shoes!"
                else -> "springy running trainers!"
            }
            "-${-weightDiffPct}% lighter — feels like $feel"
        }
    }

    // Base earth vertical leap ~ 22% of height
    val earthJump = userHeight * 0.22f
    val jumpOnPlanet = if (isSun) 0f else earthJump / g
    val jumpRatio = if (isSun) 0f else 1f / g

    val jumpDescription = when {
        isSun -> "The Sun's crushing 27.9× gravity prevents any jumping at all!"
        jumpRatio > 1.2f -> "${"%.1f".format(jumpRatio)}× your Earth leap! Soaring high into the cosmic sky!"
        jumpRatio in 0.8f..1.2f -> "Nearly identical to jumping in your backyard on Earth."
        else -> "Intense gravity pulls you down fast — only ${"%.1f".format(jumpRatio)}× your Earth jump."
    }

    // Interactive jump animation
    var triggerJump by remember { mutableStateOf(false) }
    val jumpOffset by animateFloatAsState(
        targetValue = if (triggerJump) -((jumpRatio * 18f).coerceIn(0f, 60f)) else 0f,
        animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy, stiffness = Spring.StiffnessLow),
        finishedListener = { triggerJump = false },
        label = "astronaut_jump"
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .testTag("cosmic_calculator_card"),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            // Header with Astronaut avatar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Cosmic Explorer Lab 🧪",
                        style = MaterialTheme.typography.titleMedium,
                        color = CosmicCyan,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "Gravity: ${g}× Earth • Live Physics",
                        style = MaterialTheme.typography.bodySmall,
                        color = TextSecondary
                    )
                }

                // Astronaut Avatar toggle
                Button(
                    onClick = onToggleAvatar,
                    colors = ButtonDefaults.buttonColors(containerColor = SpaceCardSurface),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                    modifier = Modifier.testTag("avatar_toggle_btn")
                ) {
                    Text(
                        text = if (isAstronautFemale) "👩‍🚀 Pilot" else "👨‍🚀 Pilot",
                        fontSize = 13.sp,
                        color = TextPrimary
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Weight Control
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Your Earth Weight: ${userWeight.roundToInt()} $weightUnit",
                    color = TextPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
                OutlinedButton(
                    onClick = onToggleWeightUnit,
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                    modifier = Modifier.height(28.dp)
                ) {
                    Text(text = "Unit: $weightUnit", fontSize = 11.sp, color = CosmicCyan)
                }
            }

            Slider(
                value = userWeight,
                onValueChange = onWeightChange,
                valueRange = if (weightUnit == "kg") 15f..120f else 30f..260f,
                colors = SliderDefaults.colors(
                    thumbColor = CosmicCyan,
                    activeTrackColor = CosmicCyan,
                    inactiveTrackColor = SpaceCardSurface
                ),
                modifier = Modifier.testTag("weight_slider")
            )

            // Weight Presets
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                PresetChip("Kid (25kg)", onClick = { onWeightChange(if (weightUnit == "kg") 25f else 55f) })
                PresetChip("Teen (50kg)", onClick = { onWeightChange(if (weightUnit == "kg") 50f else 110f) })
                PresetChip("Adult (70kg)", onClick = { onWeightChange(if (weightUnit == "kg") 70f else 154f) })
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Height Control
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Your Earth Height: ${userHeight.roundToInt()} $heightUnit",
                    color = TextPrimary,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
                OutlinedButton(
                    onClick = onToggleHeightUnit,
                    shape = RoundedCornerShape(8.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 2.dp),
                    modifier = Modifier.height(28.dp)
                ) {
                    Text(text = "Unit: $heightUnit", fontSize = 11.sp, color = SolarGold)
                }
            }

            Slider(
                value = userHeight,
                onValueChange = onHeightChange,
                valueRange = if (heightUnit == "cm") 90f..210f else 35f..82f,
                colors = SliderDefaults.colors(
                    thumbColor = SolarGold,
                    activeTrackColor = SolarGold,
                    inactiveTrackColor = SpaceCardSurface
                ),
                modifier = Modifier.testTag("height_slider")
            )

            Spacer(modifier = Modifier.height(10.dp))

            // Results Section
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = SpaceCardSurface),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    // Calculated Weight
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Weight on ${planet.name}:", color = TextSecondary, fontSize = 12.sp)
                        Text(
                            text = "${"%.1f".format(weightOnPlanet)} $weightUnit",
                            color = if (g > 1f) SolarGold else CosmicCyan,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Text(text = weightDescription, color = TextPrimary, fontSize = 12.sp, modifier = Modifier.padding(top = 2.dp))

                    Divider(color = SpaceBorder, thickness = 1.dp, modifier = Modifier.padding(vertical = 10.dp))

                    // Calculated Jump
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = "Vertical Jump Leap:", color = TextSecondary, fontSize = 12.sp)
                        Text(
                            text = if (isSun) "0 $heightUnit" else "${"%.1f".format(jumpOnPlanet)} $heightUnit",
                            color = ToxicGreen,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    Text(text = jumpDescription, color = TextPrimary, fontSize = 12.sp, modifier = Modifier.padding(top = 2.dp))

                    Spacer(modifier = Modifier.height(12.dp))

                    // Interactive jump button with animated astronaut
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(SpaceBlack.copy(alpha = 0.6f))
                            .clickable { triggerJump = true }
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "🚀 Tap to Test Jump Leap!",
                            color = CosmicCyan,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.SemiBold
                        )

                        Box(
                            modifier = Modifier
                                .height(38.dp)
                                .offset(y = jumpOffset.dp)
                        ) {
                            Text(
                                text = if (isAstronautFemale) "👩‍🚀" else "👨‍🚀",
                                fontSize = 24.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun PresetChip(label: String, onClick: () -> Unit) {
    SuggestionChip(
        onClick = onClick,
        label = { Text(text = label, fontSize = 10.sp, color = TextSecondary) },
        colors = SuggestionChipDefaults.suggestionChipColors(containerColor = SpaceCardSurface),
        border = SuggestionChipDefaults.suggestionChipBorder(enabled = true, borderColor = SpaceBorder),
        shape = RoundedCornerShape(6.dp),
        modifier = Modifier.height(28.dp)
    )
}
