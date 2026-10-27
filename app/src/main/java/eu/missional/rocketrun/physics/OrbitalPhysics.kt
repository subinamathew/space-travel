package eu.missional.rocketrun.physics

import kotlin.math.*

data class BodyCoordinates(
    val x: Float,
    val y: Float,
    val r: Float,
    val angleDeg: Float
)

data class WindowMetrics(
    val currentDist: Float,
    val currentAu: Float,
    val arrivalDist: Float,
    val arrivalAu: Float,
    val flightDurationSec: Float,
    val timeToWindowSec: Float,
    val isWindowOpen: Boolean,
    val minReqEnergy: Int,
    val maxCapEnergy: Int,
    val fuelRequired: Int
)

enum class LaunchOutcome {
    CAPTURE_SUCCESS,
    FUEL_EXHAUSTED,
    OVERSHOOT
}

data class LaunchResult(
    val outcome: LaunchOutcome,
    val title: String,
    val explanation: String
)

data class ArcPoint(
    val x: Float,
    val y: Float,
    val angleDeg: Float
)

object OrbitalPhysics {

    const val BASE_EARTH_SECONDS = 12.5f

    data class OrbitSpec(
        val r: Float,
        val period: Float,
        val phase: Float,
        val ecc: Float,
        val au: Float,
        val moonDist: Float = 0f
    )

    val specs: Map<String, OrbitSpec> = mapOf(
        "sun" to OrbitSpec(0f, 1f, 0f, 0f, 0f),
        "mercury" to OrbitSpec(9f, 0.240846f, 0.15f, 0.2056f, 0.387f),
        "venus" to OrbitSpec(13f, 0.615197f, 0.45f, 0.0068f, 0.723f),
        "earth" to OrbitSpec(17.5f, 1.0f, 0.70f, 0.0167f, 1.000f),
        "moon" to OrbitSpec(17.5f, 1.0f, 0.70f, 0.0549f, 1.000f, moonDist = 2.8f),
        "luna" to OrbitSpec(17.5f, 1.0f, 0.70f, 0.0549f, 1.000f, moonDist = 2.8f),
        "mars" to OrbitSpec(22.5f, 1.880848f, 0.30f, 0.0934f, 1.524f),
        "jupiter" to OrbitSpec(29f, 11.8626f, 0.85f, 0.0484f, 5.204f),
        "saturn" to OrbitSpec(36.5f, 29.4475f, 0.40f, 0.0565f, 9.582f),
        "uranus" to OrbitSpec(42.5f, 84.0168f, 0.20f, 0.0472f, 19.201f),
        "neptune" to OrbitSpec(48f, 164.7913f, 0.60f, 0.0086f, 30.047f)
    )

    fun getCoordinates(slug: String, elapsedSec: Float): BodyCoordinates {
        val spec = specs[slug.lowercase()] ?: specs["earth"]!!
        if (spec.r == 0f) return BodyCoordinates(0f, 0f, 0f, 0f)

        val periodSec = spec.period * BASE_EARTH_SECONDS
        val initialOffset = spec.phase * periodSec
        val totalSec = elapsedSec + initialOffset
        val angleDeg = ((totalSec / periodSec) * 360f) % 360f
        val rad = Math.toRadians((angleDeg - 90.0).toDouble())

        var x = (spec.r * cos(rad)).toFloat()
        var y = (spec.r * sin(rad)).toFloat()

        if (slug == "moon" || slug == "luna") {
            val moonAngle = (elapsedSec / 2.8f) * 360f
            val moonRad = Math.toRadians(moonAngle.toDouble())
            x += (spec.moonDist * cos(moonRad)).toFloat()
            y += (spec.moonDist * sin(moonRad)).toFloat()
        }

        return BodyCoordinates(x, y, spec.r, angleDeg)
    }

    fun getFlightDuration(originSlug: String, targetSlug: String): Float {
        val o = originSlug.lowercase()
        val t = targetSlug.lowercase()
        if (t == "moon" || t == "luna" || o == "moon" || o == "luna") return 3.5f
        if (t in listOf("jupiter", "saturn", "uranus", "neptune")) return 5.5f
        return 4.2f
    }

    fun calculateFlightFuelBurn(energy: Int, originSlug: String, targetSlug: String): Int {
        val s1 = specs[originSlug.lowercase()] ?: specs["earth"]!!
        val s2 = specs[targetSlug.lowercase()] ?: specs["mars"]!!
        val isMoon = targetSlug in listOf("moon", "luna") || originSlug in listOf("moon", "luna")

        val travelFactor = if (isMoon) {
            0.65f
        } else {
            val dr = abs(s2.r - s1.r)
            0.65f + (dr / 35f)
        }

        val burn = (energy * travelFactor).roundToInt()
        return burn.coerceIn(10, 100)
    }

    fun checkAsteroidHazard(originSlug: String, targetSlug: String): Boolean {
        val r1 = (specs[originSlug.lowercase()] ?: specs["earth"]!!).r
        val r2 = (specs[targetSlug.lowercase()] ?: specs["mars"]!!).r
        return (r1 <= 22.5f && r2 >= 29f) || (r1 >= 29f && r2 <= 22.5f)
    }

    fun checkSolarBoost(originSlug: String, targetSlug: String): Boolean {
        val r1 = (specs[originSlug.lowercase()] ?: specs["earth"]!!).r
        val r2 = (specs[targetSlug.lowercase()] ?: specs["mars"]!!).r
        return r1 <= 13f || r2 <= 13f
    }

    fun calculateMetrics(
        originSlug: String,
        targetSlug: String,
        elapsedSec: Float,
        currentThrust: Int
    ): WindowMetrics {
        val s1 = specs[originSlug.lowercase()] ?: specs["earth"]!!
        val s2 = specs[targetSlug.lowercase()] ?: specs["mars"]!!
        val isMoon = targetSlug in listOf("moon", "luna") || originSlug in listOf("moon", "luna")

        val p1 = getCoordinates(originSlug, elapsedSec)
        val p2 = getCoordinates(targetSlug, elapsedSec)
        val currentDist = hypot(p2.x - p1.x, p2.y - p1.y)

        val duration = getFlightDuration(originSlug, targetSlug)
        val p2Future = getCoordinates(targetSlug, elapsedSec + duration)
        val arrivalDist = hypot(p2Future.x - p1.x, p2Future.y - p1.y)

        val (minAu, maxAu, minDist, maxDist) = if (isMoon) {
            arrayOf(0.0024f, 0.0027f, 2.65f, 2.95f)
        } else {
            val minA = max(0.15f, abs(s2.au * (1f - s2.ecc) - s1.au * (1f + s1.ecc)))
            val maxA = s1.au * (1f + s1.ecc) + s2.au * (1f + s2.ecc)
            val minD = abs(s2.r - s1.r)
            val maxD = s1.r + s2.r
            arrayOf(minA, maxA, minD, maxD)
        }

        val distRange = max(0.1f, maxDist - minDist)
        val normDist = ((currentDist - minDist) / distRange).coerceIn(0f, 1f)
        val currentAu = minAu + normDist * (maxAu - minAu)

        val arrivalNorm = ((arrivalDist - minDist) / distRange).coerceIn(0f, 1f)
        val arrivalAu = minAu + arrivalNorm * (maxAu - minAu)

        // Find optimal window countdown
        var bestDt = 0f
        var bestDist = Float.MAX_VALUE
        var dt = 0f
        while (dt <= 25f) {
            val t = elapsedSec + dt
            val ca = getCoordinates(originSlug, t)
            val cb = getCoordinates(targetSlug, t)
            val d = hypot(cb.x - ca.x, cb.y - ca.y)
            if (d < bestDist) {
                bestDist = d
                bestDt = dt
            }
            dt += 0.5f
        }

        val baseReq = when {
            isMoon -> 25
            targetSlug in listOf("mercury", "venus") -> 35
            targetSlug in listOf("uranus", "neptune") -> 70
            else -> 48
        } + (normDist * 20f).roundToInt()

        val minReq = max(12, baseReq - 10)
        val maxCap = min(100, baseReq + 22)
        val fuelRequired = calculateFlightFuelBurn(currentThrust, originSlug, targetSlug)

        return WindowMetrics(
            currentDist = currentDist,
            currentAu = currentAu,
            arrivalDist = arrivalDist,
            arrivalAu = arrivalAu,
            flightDurationSec = duration,
            timeToWindowSec = bestDt,
            isWindowOpen = bestDt <= 1.2f,
            minReqEnergy = minReq,
            maxCapEnergy = maxCap,
            fuelRequired = fuelRequired
        )
    }

    fun evaluateOutcome(energy: Int, metrics: WindowMetrics): LaunchResult {
        return when {
            energy < metrics.minReqEnergy -> LaunchResult(
                LaunchOutcome.FUEL_EXHAUSTED,
                "Sub-Orbital Drift",
                "Thrust was insufficient to escape planetary gravitational influence. The spacecraft entered a drifting sub-orbital loop."
            )
            energy > metrics.maxCapEnergy -> LaunchResult(
                LaunchOutcome.OVERSHOOT,
                "Hyperbolic Overshoot",
                "Excessive velocity overshot target orbit and slingshotted into deep interplanetary void!"
            )
            else -> LaunchResult(
                LaunchOutcome.CAPTURE_SUCCESS,
                "Orbital Insertion Successful!",
                "Precision Hohmann transfer trajectory achieved. Retro-thrusters captured the spacecraft safely into target orbit."
            )
        }
    }

    fun generateTransferArc(
        originSlug: String,
        targetSlug: String,
        elapsedSec: Float,
        durationSec: Float,
        steps: Int = 30
    ): List<ArcPoint> {
        val p1 = getCoordinates(originSlug, elapsedSec)
        val p2 = getCoordinates(targetSlug, elapsedSec + durationSec)
        val isMoon = targetSlug in listOf("moon", "luna") || originSlug in listOf("moon", "luna")
        val points = mutableListOf<ArcPoint>()

        if (isMoon) {
            val midX = (p1.x + p2.x) / 2f + (p2.y - p1.y) * 0.45f
            val midY = (p1.y + p2.y) / 2f - (p2.x - p1.x) * 0.45f
            for (i in 0..steps) {
                val t = i.toFloat() / steps
                val oneMinusT = 1f - t
                val x = oneMinusT * oneMinusT * p1.x + 2f * oneMinusT * t * midX + t * t * p2.x
                val y = oneMinusT * oneMinusT * p1.y + 2f * oneMinusT * t * midY + t * t * p2.y
                points.add(ArcPoint(x, y, 0f))
            }
        } else {
            val r1 = hypot(p1.x, p1.y)
            val r2 = hypot(p2.x, p2.y)
            val theta1 = atan2(p1.y, p1.x)
            val theta2 = atan2(p2.y, p2.x)

            var dTheta = theta2 - theta1
            while (dTheta <= 0.3f) dTheta += (Math.PI * 2).toFloat()
            if (dTheta > (Math.PI * 1.6).toFloat()) {
                dTheta -= (Math.PI * 2).toFloat()
                if (abs(dTheta) < 0.3f) dTheta = (Math.PI * 0.8).toFloat()
            }

            for (i in 0..steps) {
                val t = i.toFloat() / steps
                val r = r1 + (r2 - r1) * (0.5f - 0.5f * cos(Math.PI * t).toFloat())
                val theta = theta1 + dTheta * t
                val x = r * cos(theta)
                val y = r * sin(theta)
                points.add(ArcPoint(x, y, 0f))
            }
        }

        // Calculate tangent rotation angles
        return points.mapIndexed { i, pt ->
            val prev = points[max(0, i - 1)]
            val next = points[min(steps, i + 1)]
            val dx = next.x - prev.x
            val dy = next.y - prev.y
            val angle = Math.toDegrees(atan2(dy.toDouble(), dx.toDouble())).toFloat() + 90f
            pt.copy(angleDeg = angle)
        }
    }
}
