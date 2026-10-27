import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavBar, AppScreen } from './components/NavBar';
import { OrreryScreen } from './screens/OrreryScreen';
import { PlanetDetailScreen } from './screens/PlanetDetailScreen';
import { GameSimulatorScreen } from './screens/GameSimulatorScreen';
import { CosmicJokesScreen } from './screens/CosmicJokesScreen';
import { PlanetInfo, SolarSystemRepository } from './data/planetData';
import { GameMission, GameRepository, LeaderboardEntry, QuizQuestion } from './data/gameData';
import { ArcPoint, LaunchResult, OrbitalPhysics, WindowMetrics } from './physics/orbitalPhysics';

export const App: React.FC = () => {
  // Navigation
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('ORRERY');

  // Orrery State
  const [isOrbitPaused, setIsOrbitPaused] = useState(false);
  const [orbitSpeedMultiplier, setOrbitSpeedMultiplier] = useState(1.0);
  const [is3dMode, setIs3dMode] = useState(false);
  const [showMoons, setShowMoons] = useState(true);
  const [selectedOrreryPlanet, setSelectedOrreryPlanet] = useState<PlanetInfo | null>(null);
  const [elapsedOrbitTimeSec, setElapsedOrbitTimeSec] = useState(0);
  const [utcEarthTime, setUtcEarthTime] = useState('12:00:00 UTC');

  // Planet Detail & Cosmic Lab State
  const [currentPlanetSlug, setCurrentPlanetSlug] = useState('earth');
  const [userWeight, setUserWeight] = useState(45);
  const [userHeight, setUserHeight] = useState(140);
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [isAstronautFemale, setIsAstronautFemale] = useState(false);

  // Flight Simulator / Mission Game State
  const [isFreePlay, setIsFreePlay] = useState(false);
  const [dockedPlanetSlug, setDockedPlanetSlug] = useState('earth');
  const [targetPlanetSlug, setTargetPlanetSlug] = useState('moon');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [thrustPower, setThrustPower] = useState(45);
  const [completedMissionsCount, setCompletedMissionsCount] = useState(0);
  const [currentMission, setCurrentMission] = useState<GameMission | null>(null);
  const [windowMetrics, setWindowMetrics] = useState<WindowMetrics | null>(null);
  const [isFlying, setIsFlying] = useState(false);
  const [flightProgress, setFlightProgress] = useState(0);
  const [flightArcPoints, setFlightArcPoints] = useState<ArcPoint[]>([]);
  const [flightCurrentPoint, setFlightCurrentPoint] = useState<ArcPoint | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [selectedQuizOptionIndex, setSelectedQuizOptionIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [launchAlert, setLaunchAlert] = useState<LaunchResult | null>(null);
  const [pilotName, setPilotName] = useState('Captain Zack');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(GameRepository.initialLeaderboard);

  // Cosmic Jokes State
  const [currentRandomJokeIndex, setCurrentRandomJokeIndex] = useState(0);
  const [isRandomJokeRevealed, setIsRandomJokeRevealed] = useState(false);
  const [revealedStaticJokeIds, setRevealedStaticJokeIds] = useState<number[]>([]);

  // Mission pool ref for continuous mission generation
  const missionPoolRef = useRef<string[]>([]);

  // Generate new mission
  const generateNewMission = useCallback(
    (currentDocked: string = dockedPlanetSlug) => {
      const available = [
        'moon',
        'mercury',
        'venus',
        'earth',
        'mars',
        'jupiter',
        'saturn',
        'uranus',
        'neptune'
      ].filter((slug) => slug !== currentDocked);

      if (missionPoolRef.current.length === 0) {
        missionPoolRef.current = [...available].sort(() => Math.random() - 0.5);
      }
      const target =
        missionPoolRef.current.shift() ||
        available[Math.floor(Math.random() * available.length)];

      const planetInfo = SolarSystemRepository.findBySlug(target);
      const clue =
        GameRepository.missionClues[target] || `Reach ${planetInfo?.name || target}!`;
      const crosses = OrbitalPhysics.checkAsteroidHazard(currentDocked, target);

      const mission: GameMission = {
        id: `mission_${completedMissionsCount + 1}`,
        name: planetInfo?.name || target.charAt(0).toUpperCase() + target.slice(1),
        targetSlug: target,
        clue: clue,
        crossesAsteroids: crosses
      };

      setCurrentMission(mission);
      setTargetPlanetSlug(target);
    },
    [dockedPlanetSlug, completedMissionsCount]
  );

  // Initialize initial mission on mount
  useEffect(() => {
    generateNewMission('earth');
  }, [generateNewMission]);

  // Main Orbit Simulation Animation Frame Loop (~30-60 FPS)
  useEffect(() => {
    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const deltaSec = (now - lastTime) / 1000;
      lastTime = now;

      if (!isOrbitPaused) {
        setElapsedOrbitTimeSec((prev) => prev + deltaSec * orbitSpeedMultiplier);
      }

      // Update formatted UTC time
      const date = new Date();
      const timeStr = date.toUTCString().split(' ')[4] + ' UTC';
      setUtcEarthTime(timeStr);

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isOrbitPaused, orbitSpeedMultiplier]);

  // Update Flight Telemetry Window Metrics continuously
  useEffect(() => {
    const metrics = OrbitalPhysics.calculateMetrics(
      dockedPlanetSlug,
      targetPlanetSlug,
      elapsedOrbitTimeSec,
      thrustPower
    );
    setWindowMetrics(metrics);
  }, [dockedPlanetSlug, targetPlanetSlug, elapsedOrbitTimeSec, thrustPower]);

  // Solar Recharge Clock (Every 1 second)
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isFlying) {
        setFuel((prev) => {
          if (prev >= 100) return 100;
          let rate = 1.7;
          if (['mercury', 'venus', 'sun'].includes(dockedPlanetSlug)) {
            rate = 2.5;
          } else if (['jupiter', 'saturn', 'uranus', 'neptune'].includes(dockedPlanetSlug)) {
            rate = 1.2;
          }
          return Math.min(100, prev + rate);
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isFlying, dockedPlanetSlug]);

  // Navigation actions
  const handleOpenPlanetDetail = (slug: string) => {
    setCurrentPlanetSlug(slug);
    setCurrentScreen('PLANETS');
  };

  const handleTargetForFlight = (slug: string) => {
    if (slug === dockedPlanetSlug) return;
    setTargetPlanetSlug(slug);
    setIsFreePlay(true);
    setCurrentScreen('GAME');
  };

  // Cosmic Lab toggles
  const handleToggleWeightUnit = () => {
    if (weightUnit === 'kg') {
      setWeightUnit('lbs');
      setUserWeight((w) => Math.min(650, Math.max(10, w * 2.20462)));
    } else {
      setWeightUnit('kg');
      setUserWeight((w) => Math.min(300, Math.max(5, w / 2.20462)));
    }
  };

  const handleToggleHeightUnit = () => {
    if (heightUnit === 'cm') {
      setHeightUnit('in');
      setUserHeight((h) => Math.min(100, Math.max(12, h / 2.54)));
    } else {
      setHeightUnit('cm');
      setUserHeight((h) => Math.min(250, Math.max(30, h * 2.54)));
    }
  };

  // Launch Spacecraft Sequence
  const handleLaunch = () => {
    if (isFlying || !windowMetrics) return;

    // Check fuel
    if (fuel < windowMetrics.fuelRequired) {
      setLaunchAlert({
        outcome: 'FUEL_EXHAUSTED',
        title: 'Low Fuel Tank!',
        explanation: `Need ${windowMetrics.fuelRequired}% propellant fuel, but only ${Math.round(
          fuel
        )}% is available. Wait for solar recharge or reduce thrust power!`
      });
      return;
    }

    // Consume fuel
    setFuel((f) => Math.max(0, f - windowMetrics.fuelRequired));

    // Generate Hohmann transfer arc
    const arcPoints = OrbitalPhysics.generateTransferArc(
      dockedPlanetSlug,
      targetPlanetSlug,
      elapsedOrbitTimeSec,
      windowMetrics.flightDurationSec,
      40
    );

    setIsFlying(true);
    setFlightProgress(0);
    setFlightArcPoints(arcPoints);
    setFlightCurrentPoint(arcPoints[0] || null);
    setLaunchAlert(null);

    const totalSteps = arcPoints.length;
    const stepDurationMs = Math.max(
      35,
      Math.min(180, (windowMetrics.flightDurationSec * 1000) / totalSteps)
    );

    let step = 0;
    const flightTimer = setInterval(() => {
      step++;
      if (step < totalSteps) {
        setFlightProgress(step / (totalSteps - 1));
        setFlightCurrentPoint(arcPoints[step] || null);
      } else {
        clearInterval(flightTimer);

        // Evaluate launch outcome
        const outcomeResult = OrbitalPhysics.evaluateOutcome(thrustPower, windowMetrics);

        if (outcomeResult.outcome === 'CAPTURE_SUCCESS') {
          // Touchdown successful
          const target = targetPlanetSlug;
          const quizzes = GameRepository.quizzes[target] || GameRepository.quizzes.earth;
          const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];

          setIsFlying(false);
          setDockedPlanetSlug(target);
          setScore((s) => s + 250);
          setActiveQuiz(quiz);
          setSelectedQuizOptionIndex(null);
          setQuizSubmitted(false);
          setFlightArcPoints([]);
          setFlightCurrentPoint(null);
        } else {
          // Failure: decrement life
          setIsFlying(false);
          setLives((l) => Math.max(0, l - 1));
          setLaunchAlert(outcomeResult);
          setFlightArcPoints([]);
          setFlightCurrentPoint(null);
        }
      }
    }, stepDurationMs);
  };

  // Quiz submission
  const handleAnswerQuiz = (idx: number) => {
    if (quizSubmitted || !activeQuiz) return;
    setSelectedQuizOptionIndex(idx);
    setQuizSubmitted(true);

    const isCorrect = activeQuiz.options[idx]?.isCorrect;
    const bonus = isCorrect ? 150 : 0;
    setScore((s) => s + bonus);
    setCompletedMissionsCount((c) => c + 1);
  };

  const handleDismissQuiz = () => {
    setActiveQuiz(null);
    setSelectedQuizOptionIndex(null);
    setQuizSubmitted(false);
    setLaunchAlert(null);
    generateNewMission(targetPlanetSlug);
  };

  const handleDismissAlert = () => {
    setLaunchAlert(null);
    if (lives <= 0) {
      handleRestart();
    }
  };

  const handleRestart = () => {
    setLives(3);
    setFuel(100);
    setDockedPlanetSlug('earth');
    setScore(0);
    setCompletedMissionsCount(0);
    setIsFlying(false);
    setLaunchAlert(null);
    generateNewMission('earth');
  };

  const handleUpdatePilotName = (name: string) => {
    const clean = name.trim().slice(0, 20);
    if (clean) {
      setPilotName(clean);
      setLeaderboard((prev) => [
        {
          pilotName: clean,
          score: Math.max(score, 1250),
          missionsCompleted: Math.max(completedMissionsCount, 5),
          rankTitle: GameRepository.getRankForMissions(completedMissionsCount).title
        },
        ...prev.filter((e) => e.pilotName !== clean)
      ]);
    }
  };

  // Space Jokes actions
  const handleRollNextJoke = () => {
    setCurrentRandomJokeIndex((prev) => (prev + 1) % GameRepository.jokes.length);
    setIsRandomJokeRevealed(false);
  };

  const handleToggleStaticJoke = (jokeId: number) => {
    setRevealedStaticJokeIds((prev) =>
      prev.includes(jokeId) ? prev.filter((id) => id !== jokeId) : [...prev, jokeId]
    );
  };

  const rank = GameRepository.getRankForMissions(completedMissionsCount);

  return (
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col">
      {/* Universal Top Navigation Header */}
      <NavBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        pilotName={pilotName}
        score={score}
        rankTitle={rank.title}
        rankIcon={rank.icon}
      />

      {/* Main Viewport Router */}
      <main className="flex-1 flex flex-col">
        {currentScreen === 'ORRERY' && (
          <OrreryScreen
            elapsedSec={elapsedOrbitTimeSec}
            utcEarthTime={utcEarthTime}
            isOrbitPaused={isOrbitPaused}
            orbitSpeedMultiplier={orbitSpeedMultiplier}
            is3dMode={is3dMode}
            showMoons={showMoons}
            selectedPlanet={selectedOrreryPlanet}
            flightCurrentPoint={flightCurrentPoint}
            flightArcPoints={flightArcPoints}
            onTogglePause={() => setIsOrbitPaused(!isOrbitPaused)}
            onSetSpeed={setOrbitSpeedMultiplier}
            onToggle3d={() => setIs3dMode(!is3dMode)}
            onToggleMoons={() => setShowMoons(!showMoons)}
            onSelectPlanet={setSelectedOrreryPlanet}
            onOpenPlanetDetail={handleOpenPlanetDetail}
            onTargetForFlight={handleTargetForFlight}
          />
        )}

        {currentScreen === 'PLANETS' && (
          <PlanetDetailScreen
            currentPlanetSlug={currentPlanetSlug}
            userWeight={userWeight}
            userHeight={userHeight}
            weightUnit={weightUnit}
            heightUnit={heightUnit}
            isAstronautFemale={isAstronautFemale}
            onSelectPlanetSlug={setCurrentPlanetSlug}
            onWeightChange={setUserWeight}
            onHeightChange={setUserHeight}
            onToggleWeightUnit={handleToggleWeightUnit}
            onToggleHeightUnit={handleToggleHeightUnit}
            onToggleAvatar={() => setIsAstronautFemale(!isAstronautFemale)}
            onTargetPlanetForFlight={handleTargetForFlight}
          />
        )}

        {currentScreen === 'GAME' && (
          <GameSimulatorScreen
            pilotName={pilotName}
            score={score}
            lives={lives}
            fuel={fuel}
            thrustPower={thrustPower}
            completedMissionsCount={completedMissionsCount}
            dockedPlanetSlug={dockedPlanetSlug}
            targetPlanetSlug={targetPlanetSlug}
            isFreePlay={isFreePlay}
            currentMission={currentMission}
            windowMetrics={windowMetrics}
            isFlying={isFlying}
            flightProgress={flightProgress}
            activeQuiz={activeQuiz}
            selectedQuizOptionIndex={selectedQuizOptionIndex}
            quizSubmitted={quizSubmitted}
            launchAlert={launchAlert}
            leaderboard={leaderboard}
            onSetThrust={setThrustPower}
            onSetTargetPlanet={setTargetPlanetSlug}
            onToggleFreePlay={setIsFreePlay}
            onLaunch={handleLaunch}
            onAnswerQuiz={handleAnswerQuiz}
            onDismissQuiz={handleDismissQuiz}
            onDismissAlert={handleDismissAlert}
            onRestart={handleRestart}
            onUpdatePilotName={handleUpdatePilotName}
          />
        )}

        {currentScreen === 'JOKES_ABOUT' && (
          <CosmicJokesScreen
            currentRandomJokeIndex={currentRandomJokeIndex}
            isRandomJokeRevealed={isRandomJokeRevealed}
            revealedStaticJokeIds={revealedStaticJokeIds}
            onRollNextJoke={handleRollNextJoke}
            onRevealRandomJoke={() => setIsRandomJokeRevealed(true)}
            onToggleStaticJoke={handleToggleStaticJoke}
          />
        )}
      </main>
    </div>
  );
};
