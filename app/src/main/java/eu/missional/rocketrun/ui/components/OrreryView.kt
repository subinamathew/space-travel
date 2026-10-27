package eu.missional.rocketrun.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.gestures.detectTransformGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import eu.missional.rocketrun.data.PlanetInfo
import eu.missional.rocketrun.data.SolarSystemRepository
import eu.missional.rocketrun.physics.ArcPoint
import eu.missional.rocketrun.physics.OrbitalPhysics
import eu.missional.rocketrun.ui.theme.*
import kotlin.math.*
import kotlin.random.Random

data class StarParticle(val x: Float, val y: Float, val radius: Float, val alpha: Float)

@Composable
fun OrreryCanvas(
    elapsedSec: Float,
    is3dMode: Boolean,
    showMoons: Boolean,
    selectedPlanet: PlanetInfo?,
    flyingPoint: ArcPoint?,
    transferArc: List<ArcPoint>,
    onPlanetSelected: (PlanetInfo) -> Unit,
    modifier: Modifier = Modifier
) {
    var zoomScale by remember { mutableFloatStateOf(1.0f) }
    var panOffset by remember { mutableStateOf(Offset.Zero) }

    val stars = remember {
        val rand = Random(42)
        List(140) {
            StarParticle(
                x = rand.nextFloat(),
                y = rand.nextFloat(),
                radius = rand.nextFloat() * 1.8f + 0.6f,
                alpha = rand.nextFloat() * 0.7f + 0.3f
            )
        }
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTransformGestures { _, pan, zoom, _ ->
                    zoomScale = (zoomScale * zoom).coerceIn(0.45f, 3.2f)
                    panOffset += pan
                }
            }
            .pointerInput(elapsedSec, is3dMode, zoomScale, panOffset) {
                detectTapGestures { tapOffset ->
                    val width = size.width
                    val height = size.height
                    val cx = width / 2f + panOffset.x
                    val cy = height / 2f + panOffset.y
                    val baseScale = (min(width, height) / 105f) * zoomScale

                    // Check Sun first
                    val sunDist = hypot(tapOffset.x - cx, tapOffset.y - cy)
                    if (sunDist <= 24f * zoomScale) {
                        onPlanetSelected(SolarSystemRepository.sun)
                        return@detectTapGestures
                    }

                    // Check planets
                    for (planet in SolarSystemRepository.planets) {
                        val coords = OrbitalPhysics.getCoordinates(planet.slug, elapsedSec)
                        val px = cx + coords.x * baseScale
                        val py = cy + (if (is3dMode) coords.y * 0.52f else coords.y) * baseScale
                        val d = hypot(tapOffset.x - px, tapOffset.y - py)
                        val touchRadius = max(32f, planet.sizeRatio * 14f * zoomScale)
                        if (d <= touchRadius) {
                            onPlanetSelected(planet)
                            return@detectTapGestures
                        }
                    }
                }
            }
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val width = size.width
            val height = size.height
            val cx = width / 2f + panOffset.x
            val cy = height / 2f + panOffset.y
            val baseScale = (min(width, height) / 105f) * zoomScale
            val yCompression = if (is3dMode) 0.52f else 1.0f

            // 1. Draw Starfield
            for (s in stars) {
                drawCircle(
                    color = Color.White.copy(alpha = s.alpha),
                    radius = s.radius,
                    center = Offset(s.x * width, s.y * height)
                )
            }

            // 2. Draw Orbit Guides
            for (planet in SolarSystemRepository.planets) {
                val orbitRadius = (OrbitalPhysics.specs[planet.slug]?.r ?: planet.orbitR) * baseScale
                drawOval(
                    color = SpaceBorder.copy(alpha = 0.5f),
                    topLeft = Offset(cx - orbitRadius, cy - orbitRadius * yCompression),
                    size = androidx.compose.ui.geometry.Size(orbitRadius * 2f, orbitRadius * 2f * yCompression),
                    style = Stroke(width = 1.2f)
                )
            }

            // 3. Draw Asteroid Belt (r ~ 25.5)
            val asteroidBeltR = 25.5f * baseScale
            for (i in 0 until 90) {
                val ang = (i * 4f + sin(i.toDouble()) * 3f).toFloat()
                val rDev = asteroidBeltR + (cos(i * 1.5) * 1.4f * baseScale).toFloat()
                val rad = Math.toRadians(ang.toDouble())
                val ax = cx + (rDev * cos(rad)).toFloat()
                val ay = cy + (rDev * sin(rad) * yCompression).toFloat()
                drawCircle(
                    color = Color(0xFF94A3B8).copy(alpha = 0.35f),
                    radius = 1.2f,
                    center = Offset(ax, ay)
                )
            }

            // 4. Draw Central Sun
            val sunRadius = 14f * zoomScale
            // Ambient glow
            drawCircle(
                color = Color(0xFFF59E0B).copy(alpha = 0.22f),
                radius = sunRadius * 2.5f,
                center = Offset(cx, cy)
            )
            drawCircle(
                color = Color(0xFFFBBF24).copy(alpha = 0.45f),
                radius = sunRadius * 1.6f,
                center = Offset(cx, cy)
            )
            drawCircle(
                color = Color(0xFFFFFBEB),
                radius = sunRadius,
                center = Offset(cx, cy)
            )

            // 5. Draw Flight Trajectory Arc if active
            if (transferArc.isNotEmpty()) {
                val path = Path()
                transferArc.forEachIndexed { idx, pt ->
                    val arcX = cx + pt.x * baseScale
                    val arcY = cy + (pt.y * yCompression) * baseScale
                    if (idx == 0) path.moveTo(arcX, arcY) else path.lineTo(arcX, arcY)
                }
                drawPath(
                    path = path,
                    color = SolarGold.copy(alpha = 0.85f),
                    style = Stroke(width = 2.4f, pathEffect = androidx.compose.ui.graphics.PathEffect.dashPathEffect(floatArrayOf(10f, 10f)))
                )
            }

            // 6. Draw Planets & Moons
            for (planet in SolarSystemRepository.planets) {
                val coords = OrbitalPhysics.getCoordinates(planet.slug, elapsedSec)
                val px = cx + coords.x * baseScale
                val py = cy + (coords.y * yCompression) * baseScale
                val pRadius = max(4f, planet.sizeRatio * 4.5f * zoomScale)
                val isSelected = selectedPlanet?.slug == planet.slug

                // Selection ring
                if (isSelected) {
                    drawCircle(
                        color = CosmicCyan,
                        radius = pRadius + 6f * zoomScale,
                        center = Offset(px, py),
                        style = Stroke(width = 1.8f)
                    )
                }

                // Planet body
                drawCircle(
                    color = planet.primaryColor,
                    radius = pRadius,
                    center = Offset(px, py)
                )

                // Saturn ring representation
                if (planet.slug == "saturn") {
                    drawOval(
                        color = Color(0xFFE0C080).copy(alpha = 0.65f),
                        topLeft = Offset(px - pRadius * 2.2f, py - pRadius * 0.7f),
                        size = androidx.compose.ui.geometry.Size(pRadius * 4.4f, pRadius * 1.4f),
                        style = Stroke(width = 2f)
                    )
                }

                // Moons
                if (showMoons) {
                    if (planet.slug == "earth") {
                        val moonCoords = OrbitalPhysics.getCoordinates("moon", elapsedSec)
                        val mx = cx + moonCoords.x * baseScale
                        val my = cy + (moonCoords.y * yCompression) * baseScale
                        drawCircle(
                            color = Color(0xFFE2E8F0),
                            radius = max(2f, 1.8f * zoomScale),
                            center = Offset(mx, my)
                        )
                    } else {
                        planet.moons.forEachIndexed { mIdx, moon ->
                            val mAngle = (elapsedSec * moon.speed * 40f + mIdx * 60f) % 360f
                            val mRad = Math.toRadians(mAngle.toDouble())
                            val mDist = moon.distance * 3.5f * zoomScale
                            val mx = px + (mDist * cos(mRad)).toFloat()
                            val my = py + (mDist * sin(mRad) * yCompression).toFloat()
                            drawCircle(
                                color = moon.color,
                                radius = max(1.5f, 1.6f * zoomScale),
                                center = Offset(mx, my)
                            )
                        }
                    }
                }
            }

            // 7. Draw Flying Spacecraft if in transit
            if (flyingPoint != null) {
                val rx = cx + flyingPoint.x * baseScale
                val ry = cy + (flyingPoint.y * yCompression) * baseScale

                // Rocket glow & thruster trail
                drawCircle(
                    color = Color(0xFFEF4444).copy(alpha = 0.5f),
                    radius = 8f * zoomScale,
                    center = Offset(rx, ry)
                )
                drawCircle(
                    color = Color.White,
                    radius = 4f * zoomScale,
                    center = Offset(rx, ry)
                )
            }
        }
    }
}
