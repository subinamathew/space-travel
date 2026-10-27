package eu.missional.rocketrun.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import eu.missional.rocketrun.data.GameRepository
import eu.missional.rocketrun.ui.theme.*
import eu.missional.rocketrun.viewmodel.RocketRunUiState

@Composable
fun CosmicJokesScreen(
    uiState: RocketRunUiState,
    onRollNextJoke: () -> Unit,
    onRevealRandomJoke: () -> Unit,
    onToggleStaticJoke: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val currentRandomJoke = GameRepository.jokes.getOrElse(uiState.currentRandomJokeIndex) { GameRepository.jokes[0] }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(SpaceBlack)
            .verticalScroll(rememberScrollState())
            .padding(14.dp)
            .testTag("cosmic_jokes_screen")
    ) {
        // 1. Hero Header
        Text(
            text = "Cosmic Space Jokes & Roadmap 💬",
            style = MaterialTheme.typography.headlineSmall,
            color = CosmicCyan,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "Kid-friendly astronomical humor & universal accessibility standard",
            color = TextSecondary,
            fontSize = 12.sp,
            modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
        )

        // 2. Interactive Joke Generator Card
        Card(
            modifier = Modifier.fillMaxWidth().testTag("interactive_joke_card"),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SolarGold.copy(alpha = 0.6f)))
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "🚀 Cosmic Humor Generator", color = SolarGold, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Button(
                        onClick = onRollNextJoke,
                        colors = ButtonDefaults.buttonColors(containerColor = SolarGold),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(30.dp).testTag("another_joke_btn")
                    ) {
                        Text(text = "🎲 Another Joke!", color = SpaceBlack, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text(
                    text = currentRandomJoke.setup,
                    color = TextPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.SemiBold
                )

                Spacer(modifier = Modifier.height(12.dp))

                if (!uiState.isRandomJokeRevealed) {
                    Button(
                        onClick = onRevealRandomJoke,
                        colors = ButtonDefaults.buttonColors(containerColor = SpaceCardSurface),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.testTag("reveal_joke_btn")
                    ) {
                        Text(text = "Reveal Punchline ✨", color = CosmicCyan, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                } else {
                    Surface(
                        color = SpaceCardSurface,
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = currentRandomJoke.punchline,
                            color = ToxicGreen,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 3. Static Jokes Grid / Cards
        Text(
            text = "Curated Space Crew Riddles",
            color = TextPrimary,
            fontWeight = FontWeight.Bold,
            fontSize = 15.sp,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        GameRepository.jokes.drop(1).forEach { joke ->
            val isRevealed = uiState.revealedStaticJokeIds.contains(joke.id)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clickable { onToggleStaticJoke(joke.id) },
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = joke.setup,
                            color = TextPrimary,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.weight(1f)
                        )
                        Text(
                            text = if (isRevealed) "Hide" else "Reveal ✨",
                            color = CosmicCyan,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                    }

                    AnimatedVisibility(visible = isRevealed) {
                        Text(
                            text = joke.punchline,
                            color = SolarGold,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // 4. Mission Roadmap Section
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(text = "Mission Roadmap (2026 Schedule) 🚀", color = CosmicCyan, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(10.dp))

                RoadmapItem("Oct 2026 • Live", "Game Mode, Keplerian transfer trajectories, Circadian solar dimming, and Cosmic Space Jokes.")
                Spacer(modifier = Modifier.height(8.dp))
                RoadmapItem("Nov 2026 • Upcoming", "High-contrast planetary typography, cosmic font scale accessibility, and interactive orrery tooltips.")
                Spacer(modifier = Modifier.height(8.dp))
                RoadmapItem("Dec 2026 • Target", "Complete WCAG 2.2 AAA accessibility standard, assistive telemetry, and zero-sensory barriers.")
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // 5. About & Creators
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = SpaceCardBg),
            border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(SpaceBorder))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(text = "Creators & Collaboration 🧑‍🚀", color = TextPrimary, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Created by Zachary David Mathew + Papa. Designed to bring the wonders of the solar system to life for curious young explorers everywhere.",
                    color = TextSecondary,
                    fontSize = 12.sp,
                    lineHeight = 17.sp
                )

                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Part of missional.eu — a non-profit dedicated to fostering education, scientific curiosity, and cosmic wonder.",
                    color = CosmicCyan,
                    fontSize = 12.sp
                )

                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Astronomical sources: NASA Solar System Exploration, Jet Propulsion Laboratory (JPL), and ESA.",
                    color = TextMuted,
                    fontSize = 11.sp
                )
            }
        }
    }
}

@Composable
private fun RoadmapItem(milestone: String, desc: String) {
    Column {
        Text(text = milestone, color = SolarGold, fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
        Text(text = desc, color = TextSecondary, fontSize = 12.sp, lineHeight = 16.sp)
    }
}
