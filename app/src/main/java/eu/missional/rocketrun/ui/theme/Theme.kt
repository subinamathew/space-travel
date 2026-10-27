package eu.missional.rocketrun.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val SpaceBlack = Color(0xFF030712)
val SpaceCardBg = Color(0xFF0B132B)
val SpaceCardSurface = Color(0xFF111D3D)
val SpaceBorder = Color(0xFF1E2D4A)

val CosmicCyan = Color(0xFF38BDF8)
val SolarGold = Color(0xFFFBBF24)
val OrbitBlue = Color(0xFF60A5FA)
val MarsRed = Color(0xFFEF4444)
val ToxicGreen = Color(0xFF10B981)
val NebulaPurple = Color(0xFFA855F7)

val TextPrimary = Color(0xFFF8FAFC)
val TextSecondary = Color(0xFF94A3B8)
val TextMuted = Color(0xFF64748B)

private val RocketRunColorScheme = darkColorScheme(
    primary = CosmicCyan,
    onPrimary = Color(0xFF020617),
    primaryContainer = Color(0xFF0C4A6E),
    onPrimaryContainer = Color(0xFFBAE6FD),
    secondary = SolarGold,
    onSecondary = Color(0xFF451A03),
    secondaryContainer = Color(0xFF78350F),
    onSecondaryContainer = Color(0xFFFEF3C7),
    tertiary = NebulaPurple,
    onTertiary = Color(0xFF3B0764),
    background = SpaceBlack,
    onBackground = TextPrimary,
    surface = SpaceCardBg,
    onSurface = TextPrimary,
    surfaceVariant = SpaceCardSurface,
    onSurfaceVariant = TextSecondary,
    outline = SpaceBorder
)

@Composable
fun RocketRunTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = RocketRunColorScheme,
        content = content
    )
}
