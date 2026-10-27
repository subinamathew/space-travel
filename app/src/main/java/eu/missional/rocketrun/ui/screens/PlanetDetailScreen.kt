package eu.missional.rocketrun.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.RocketLaunch
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
import eu.missional.rocketrun.data.KidsFact
import eu.missional.rocketrun.data.PlanetInfo
import eu.missional.rocketrun.data.SolarSystemRepository
import eu.missional.rocketrun.ui.components.CosmicCalculatorView
import eu.missional.rocketrun.ui.theme.*
import eu.missional.rocketrun.viewmodel.RocketRunUiState

@Composable
fun PlanetDetailScreen(
    uiState: RocketRunUiState,
    onSelectPlanetSlug: (String) -> Unit,
    onWeightChange: (Float) -> Unit,
    onHeightChange: (Float) -> Unit,
    onToggleWeightUnit: () -> Unit,
    onToggleHeightUnit: () -> Unit,
    onToggleAvatar: () -> Unit,
    onToggleKidsFact: (Int) -> Unit,
    onTargetPlanetForFlight: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val planet = SolarSystemRepository.findBySlug(uiState.currentPlanetSlug) ?: SolarSystemRepository.earth
    val allBodies = SolarSystemRepository.getAllBodies()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .verticalScroll(rememberScrollState())
            .padding(bottom = 24.dp)
            .testTag("planet_detail_screen")
    ) {
        // 1. Horizontal Celestial Body Selector Pills
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(horizontal = 12.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            allBodies.forEach { body ->
                val isSelected = body.slug == planet.slug
                FilterChip(
                    selected = isSelected,
                    onClick = { onSelectPlanetSlug(body.slug) },
                    label = {
                        Text(
                            text = "${body.symbol} ${body.name.split(" ")[0]}",
                            fontSize = 12.sp,
                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                        )
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = CosmicCyan,
                        selectedLabelColor = SpaceBlack,
                        containerColor = SpaceCardBg,
                        labelColor = TextSecondary
                    ),
                    border = FilterChipDefaults.filterChipBorder(
                        enabled = true,
                        selected = isSelected,
                        borderColor = if (isSelected) CosmicCyan else SpaceBorder
                    ),
                    modifier = Modifier.testTag("planet_chip_${body.slug}")
                )
            }
        }

        // 2. Planet Hero Banner
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 6.dp),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(planet.glowColor.copy(alpha = 0.5f)))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(18.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Large Planet Image
                Box(
                    modifier = Modifier
                        .size(140.dp)
                        .clip(CircleShape)
                        .background(planet.glowColor.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = planet.imageRes),
                        contentDescription = planet.name,
                        modifier = Modifier
                            .size(130.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Fit
                    )
                }

                Spacer(modifier = Modifier.height(14.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = planet.name,
                        color = TextPrimary,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = planet.symbol, fontSize = 20.sp)
                }

                Text(
                    text = planet.greeting,
                    color = planet.glowColor,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.padding(top = 2.dp)
                )

                Text(
                    text = planet.fact,
                    color = TextSecondary,
                    fontSize = 13.sp,
                    lineHeight = 18.sp,
                    modifier = Modifier.padding(top = 8.dp)
                )

                if (planet.slug != "sun") {
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { onTargetPlanetForFlight(planet.slug) },
                        colors = ButtonDefaults.buttonColors(containerColor = SolarGold),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.testTag("hero_target_flight_btn")
                    ) {
                        Icon(
                            imageVector = Icons.Default.RocketLaunch,
                            contentDescription = "Target Flight",
                            tint = SpaceBlack,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(text = "Target This World in Flight Simulator", color = SpaceBlack, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // 3. Astronomical Specifications Grid
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 6.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Astronomical Specifications 🔭",
                    color = CosmicCyan,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Spacer(modifier = Modifier.height(12.dp))

                Row(modifier = Modifier.fillMaxWidth()) {
                    SpecMetricItem(label = "Orbit Distance", value = "${planet.auDistance} AU", modifier = Modifier.weight(1f))
                    SpecMetricItem(label = "Orbital Period", value = "${planet.periodYears} Earth Yrs", modifier = Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(10.dp))
                Row(modifier = Modifier.fillMaxWidth()) {
                    SpecMetricItem(label = "Surface Gravity", value = "${planet.gravityRatio}× Earth", modifier = Modifier.weight(1f))
                    SpecMetricItem(label = "Avg Temperature", value = planet.temperature, modifier = Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(10.dp))
                Row(modifier = Modifier.fillMaxWidth()) {
                    SpecMetricItem(label = "Day Duration", value = planet.dayLength, modifier = Modifier.weight(1f))
                    SpecMetricItem(label = "Moons Count", value = "${planet.moonsCount} Moons", modifier = Modifier.weight(1f))
                }
                Spacer(modifier = Modifier.height(10.dp))
                SpecMetricItem(label = "Atmosphere Composition", value = planet.atmosphere, modifier = Modifier.fillMaxWidth())
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // 4. Cosmic Explorer Lab — Gravity & Jump Calculator
        CosmicCalculatorView(
            planet = planet,
            userWeight = uiState.userWeight,
            userHeight = uiState.userHeight,
            weightUnit = uiState.weightUnit,
            heightUnit = uiState.heightUnit,
            isAstronautFemale = uiState.isAstronautFemale,
            onWeightChange = onWeightChange,
            onHeightChange = onHeightChange,
            onToggleWeightUnit = onToggleWeightUnit,
            onToggleHeightUnit = onToggleHeightUnit,
            onToggleAvatar = onToggleAvatar,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        )

        Spacer(modifier = Modifier.height(8.dp))

        // 5. Deep Planetary Science & Lore
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 6.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Astrophysical Lore & Curiosities 🌌",
                    color = SolarGold,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp
                )
                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = planet.scienceLoreTopic,
                    color = TextPrimary,
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = planet.scienceLoreDesc,
                    color = TextSecondary,
                    fontSize = 12.sp,
                    lineHeight = 18.sp
                )
            }
        }

        // 6. Kids Explainer Cards (Expandable)
        if (planet.kidsFacts.isNotEmpty()) {
            Spacer(modifier = Modifier.height(8.dp))
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 6.dp),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Kids Science Guide 🚀 Explainer",
                        color = ToxicGreen,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    planet.kidsFacts.forEachIndexed { index, fact ->
                        KidsFactAccordion(
                            fact = fact,
                            isExpanded = uiState.expandedKidsFactIndex == index,
                            onToggle = { onToggleKidsFact(index) }
                        )
                        if (index < planet.kidsFacts.size - 1) {
                            Divider(color = SpaceBorder, thickness = 1.dp, modifier = Modifier.padding(vertical = 8.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SpecMetricItem(label: String, value: String, modifier: Modifier = Modifier) {
    Column(modifier = modifier) {
        Text(text = label, color = TextMuted, fontSize = 11.sp)
        Text(text = value, color = TextPrimary, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
private fun KidsFactAccordion(
    fact: KidsFact,
    isExpanded: Boolean,
    onToggle: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onToggle() }
            .padding(vertical = 4.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(text = fact.icon, fontSize = 16.sp)
                Text(text = fact.title, color = TextPrimary, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
            }
            Icon(
                imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                contentDescription = "Expand fact",
                tint = TextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }

        AnimatedVisibility(visible = isExpanded) {
            Text(
                text = fact.content,
                color = TextSecondary,
                fontSize = 12.sp,
                lineHeight = 17.sp,
                modifier = Modifier.padding(top = 6.dp, start = 24.dp)
            )
        }
    }
}
