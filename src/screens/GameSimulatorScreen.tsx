import React, { useState } from 'react';
import { GameMission, GameRepository, LeaderboardEntry, QuizQuestion } from '../data/gameData';
import { SolarSystemRepository } from '../data/planetData';
import { LaunchResult, WindowMetrics } from '../physics/orbitalPhysics';
import {
  Trophy,
  AlertTriangle,
  Rocket,
  Zap,
  Gauge,
  HelpCircle,
  X,
  RotateCcw,
  SunMedium,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameSimulatorScreenProps {
  pilotName: string;
  score: number;
  lives: number;
  fuel: number;
  thrustPower: number;
  completedMissionsCount: number;
  dockedPlanetSlug: string;
  targetPlanetSlug: string;
  isFreePlay: boolean;
  currentMission: GameMission | null;
  windowMetrics: WindowMetrics | null;
  isFlying: boolean;
  flightProgress: number;
  activeQuiz: QuizQuestion | null;
  selectedQuizOptionIndex: number | null;
  quizSubmitted: boolean;
  launchAlert: LaunchResult | null;
  leaderboard: LeaderboardEntry[];
  onSetThrust: (power: number) => void;
  onSetTargetPlanet: (slug: string) => void;
  onToggleFreePlay: (isFree: boolean) => void;
  onLaunch: () => void;
  onAnswerQuiz: (idx: number) => void;
  onDismissQuiz: () => void;
  onDismissAlert: () => void;
  onRestart: () => void;
  onUpdatePilotName: (name: string) => void;
}

export const GameSimulatorScreen: React.FC<GameSimulatorScreenProps> = ({
  pilotName,
  score,
  lives,
  fuel,
  thrustPower,
  completedMissionsCount,
  dockedPlanetSlug,
  targetPlanetSlug,
  isFreePlay,
  currentMission,
  windowMetrics,
  isFlying,
  flightProgress,
  activeQuiz,
  selectedQuizOptionIndex,
  quizSubmitted,
  launchAlert,
  leaderboard,
  onSetThrust,
  onSetTargetPlanet,
  onToggleFreePlay,
  onLaunch,
  onAnswerQuiz,
  onDismissQuiz,
  onDismissAlert,
  onRestart,
  onUpdatePilotName
}) => {
  const rank = GameRepository.getRankForMissions(completedMissionsCount);
  const dockedPlanet = SolarSystemRepository.findBySlug(dockedPlanetSlug) || SolarSystemRepository.earth;
  const targetPlanet = SolarSystemRepository.findBySlug(targetPlanetSlug) || SolarSystemRepository.luna;
  const allDestinations = SolarSystemRepository.getAllBodies().filter(
    (b) => b.slug !== 'sun' && b.slug !== dockedPlanetSlug
  );

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [pilotInput, setPilotInput] = useState(pilotName);

  const handleQuizAnswer = (idx: number) => {
    onAnswerQuiz(idx);
    if (activeQuiz?.options[idx]?.isCorrect) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-5">
      {/* 1. Pilot Status Bar */}
      <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#111D3D] border border-[#1E2D4A] flex items-center justify-center text-2xl shadow-inner">
            {rank.icon}
          </div>
          <div>
            <div className="text-sm font-bold text-[#F8FAFC] flex items-center space-x-2">
              <span>{pilotName}</span>
              <span className="text-[10px] bg-[#1E2D4A] text-[#38BDF8] px-1.5 py-0.5 rounded font-mono">
                RANK: {rank.title}
              </span>
            </div>
            <div className="text-xs text-[#FBBF24] font-medium mt-0.5">
              Score: <strong className="font-mono text-sm">{score}</strong> pts • Completed:{' '}
              {completedMissionsCount}
            </div>
          </div>
        </div>

        {/* Lives & Leaderboard */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1" title={`${lives} Lives Remaining`}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="text-lg">
                {i < lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-2 bg-[#111D3D] hover:bg-[#1E2D4A] text-[#38BDF8] rounded-xl border border-[#1E2D4A] transition-colors cursor-pointer"
            title="Pilot Logs & High Scores"
          >
            <Trophy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Propellant Fuel Tank with Live Solar Recharge */}
      <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#FBBF24]" />
            <span className="text-xs font-bold text-[#F8FAFC]">⚡ Propellant Fuel Tank</span>
            {fuel < 100 && !isFlying && (
              <span className="text-[11px] text-[#FBBF24] flex items-center space-x-1">
                <SunMedium className="w-3 h-3 animate-pulse" />
                <span>(☀️ Solar Recharging)</span>
              </span>
            )}
          </div>
          <span
            className={`font-mono text-sm font-bold ${
              fuel < 25 ? 'text-[#EF4444]' : 'text-[#10B981]'
            }`}
          >
            {Math.round(fuel)}%
          </span>
        </div>

        <div className="w-full bg-[#111D3D] rounded-full h-2.5 overflow-hidden border border-[#1E2D4A]/50">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              fuel < 25 ? 'bg-[#EF4444]' : 'bg-gradient-to-r from-[#38BDF8] to-[#10B981]'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, fuel))}%` }}
          />
        </div>
      </div>

      {/* 3. Mission Briefing Card */}
      <div
        className="bg-[#0B132B] border rounded-2xl p-5 shadow-xl transition-all"
        style={{ borderColor: `${targetPlanet.glowColor}60` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-[#FBBF24] flex items-center space-x-1.5">
              <span>🎯 Current Mission:</span>
              <span className="text-[#F8FAFC]">{currentMission?.name || targetPlanet.name}</span>
            </span>
            <span className="text-[11px] text-[#64748B]">
              ({completedMissionsCount} Accomplished)
            </span>
          </div>

          {/* Free play toggle */}
          <label className="flex items-center space-x-2 cursor-pointer text-xs text-[#94A3B8]">
            <span>Free Play</span>
            <input
              type="checkbox"
              checked={isFreePlay}
              onChange={(e) => onToggleFreePlay(e.target.checked)}
              className="rounded bg-[#111D3D] border-[#1E2D4A] text-[#38BDF8] focus:ring-0 cursor-pointer"
            />
          </label>
        </div>

        {/* Free Play Planet Selector */}
        {isFreePlay && (
          <div className="mb-4 bg-[#111D3D]/60 border border-[#1E2D4A] rounded-xl p-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[#64748B] w-full">Select Target Destination:</span>
            {allDestinations.map((b) => (
              <button
                key={b.slug}
                onClick={() => onSetTargetPlanet(b.slug)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  targetPlanet.slug === b.slug
                    ? 'bg-[#FBBF24] text-[#030712]'
                    : 'bg-[#0B132B] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {b.symbol} {b.name.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Trajectory Route Badges */}
        <div className="grid grid-cols-5 items-center gap-2 mb-3">
          <div className="col-span-2 bg-[#111D3D] border border-[#1E2D4A] rounded-xl p-3 flex items-center space-x-3">
            <img
              src={dockedPlanet.image}
              alt={dockedPlanet.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">
                Docked World
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#F8FAFC] truncate block">
                {dockedPlanet.name.split(' ')[0]} {dockedPlanet.symbol}
              </span>
            </div>
          </div>

          <div className="col-span-1 text-center font-bold text-lg text-[#38BDF8]">➔</div>

          <div className="col-span-2 bg-[#111D3D] border border-[#1E2D4A] rounded-xl p-3 flex items-center space-x-3">
            <img
              src={targetPlanet.image}
              alt={targetPlanet.name}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] text-[#64748B] block uppercase tracking-wider">
                Target World
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#FBBF24] truncate block">
                {targetPlanet.name.split(' ')[0]} {targetPlanet.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* Mission Clue */}
        {currentMission && (
          <p className="text-xs sm:text-sm text-[#F8FAFC] bg-[#030712]/50 border border-[#1E2D4A]/50 rounded-xl p-3 leading-relaxed">
            📜 <strong className="text-[#38BDF8]">Flight Objective:</strong> &ldquo;
            {currentMission.clue}&rdquo;
          </p>
        )}

        {/* Asteroid Hazard alert */}
        {currentMission?.crossesAsteroids && (
          <div className="mt-3 bg-[#FBBF24]/10 border border-[#FBBF24]/30 rounded-xl p-3 flex items-center space-x-2 text-xs text-[#FBBF24]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              <strong>Orbital Hazard:</strong> Trajectory crosses the Asteroid Belt! Calibrate thrust
              carefully to prevent collision or drift.
            </span>
          </div>
        )}
      </div>

      {/* 4. Flight Deck & Telemetry Controls */}
      <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#38BDF8] flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-[#38BDF8]" />
            <span>Flight Deck & Telemetry 🛰️</span>
          </h3>
        </div>

        {/* Telemetry Metrics */}
        {windowMetrics && (
          <div className="grid grid-cols-3 gap-3 text-xs bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3.5">
            <div>
              <span className="text-[#64748B] block mb-0.5">Current Distance</span>
              <span className="text-[#F8FAFC] font-bold font-mono text-sm">
                {windowMetrics.currentAu.toFixed(2)} AU
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block mb-0.5">Intercept AU</span>
              <span className="text-[#F8FAFC] font-bold font-mono text-sm">
                {windowMetrics.arrivalAu.toFixed(2)} AU
              </span>
            </div>
            <div>
              <span className="text-[#64748B] block mb-0.5">Launch Window</span>
              <span
                className={`font-bold font-mono text-xs sm:text-sm ${
                  windowMetrics.isWindowOpen ? 'text-[#10B981]' : 'text-[#FBBF24]'
                }`}
              >
                {windowMetrics.isWindowOpen
                  ? 'WINDOW OPEN 🟢'
                  : `in ${windowMetrics.timeToWindowSec.toFixed(1)}s`}
              </span>
            </div>
          </div>
        )}

        {/* Thrust Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F8FAFC]">
              Thrust Power: <strong className="text-[#38BDF8] text-sm">{thrustPower}%</strong>
            </span>
            {windowMetrics && (
              <span className="text-[#38BDF8] text-[11px] font-mono">
                Optimal Window: {windowMetrics.minReqEnergy}% – {windowMetrics.maxCapEnergy}%
              </span>
            )}
          </div>

          <input
            type="range"
            min="10"
            max="100"
            value={thrustPower}
            disabled={isFlying}
            onChange={(e) => onSetThrust(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-[#111D3D] rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />

          {windowMetrics && (
            <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>Flight Duration: ~{windowMetrics.flightDurationSec.toFixed(1)}s</span>
              <span>
                Fuel Burn Required:{' '}
                <strong
                  className={fuel >= windowMetrics.fuelRequired ? 'text-[#10B981]' : 'text-[#EF4444]'}
                >
                  {windowMetrics.fuelRequired}%
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Launch Button */}
        <button
          onClick={onLaunch}
          disabled={isFlying}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-xl transition-all ${
            isFlying
              ? 'bg-[#1E2D4A] text-[#94A3B8] cursor-wait'
              : 'bg-[#38BDF8] hover:bg-[#0284C7] text-[#030712] cursor-pointer'
          }`}
        >
          <Rocket className={`w-5 h-5 ${isFlying ? 'animate-bounce' : ''}`} />
          <span>
            {isFlying ? 'IN INTERPLANETARY TRANSIT...' : 'LAUNCH SPACECRAFT 🚀'}
          </span>
        </button>

        {/* Flight In Transit Progress Bar */}
        {isFlying && (
          <div className="space-y-1.5 pt-2 animate-in fade-in">
            <div className="flex justify-between text-xs text-[#FBBF24]">
              <span>Traversing Hohmann Transfer Arc...</span>
              <span className="font-mono">{Math.round(flightProgress * 100)}%</span>
            </div>
            <div className="w-full bg-[#111D3D] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#FBBF24] h-full transition-all duration-100 rounded-full"
                style={{ width: `${Math.round(flightProgress * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL DIALOGS --- */}

      {/* 1. Touchdown Quiz Dialog */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B132B] border border-[#38BDF8]/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center space-x-2 mb-2 text-[#38BDF8]">
              <HelpCircle className="w-5 h-5" />
              <h3 className="font-bold text-base sm:text-lg">
                Touchdown on {targetPlanet.name}! 🎉
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed mb-4">
              {activeQuiz.question}
            </p>

            <div className="space-y-2 mb-4">
              {activeQuiz.options.map((opt, idx) => {
                const isSelected = selectedQuizOptionIndex === idx;
                let btnStyle = 'bg-[#111D3D] hover:bg-[#1E2D4A] text-[#F8FAFC] border-[#1E2D4A]';

                if (quizSubmitted) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-[#10B981] text-[#030712] border-[#10B981] font-bold';
                  } else if (isSelected) {
                    btnStyle = 'bg-[#EF4444] text-[#F8FAFC] border-[#EF4444]';
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-[#38BDF8] text-[#030712] border-[#38BDF8] font-bold';
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => handleQuizAnswer(idx)}
                    className={`w-full p-3 rounded-xl text-xs sm:text-sm text-left border transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt.text}</span>
                    {quizSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-[#030712] shrink-0 ml-2" />
                    )}
                    {quizSubmitted && !opt.isCorrect && isSelected && (
                      <XCircle className="w-4 h-4 text-white shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {quizSubmitted && (
              <div className="bg-[#111D3D] rounded-xl p-3 text-xs text-[#94A3B8] leading-relaxed mb-4 border border-[#1E2D4A]">
                💡 <strong className="text-[#FBBF24]">Scientific Fact:</strong>{' '}
                {activeQuiz.explanation}
              </div>
            )}

            {quizSubmitted && (
              <button
                onClick={onDismissQuiz}
                className="w-full py-2.5 bg-[#FBBF24] hover:bg-[#D97706] text-[#030712] font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                Claim Score & Receive Next Mission 🚀
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Launch Alert Dialog (Sub-orbital drift or Overshoot or Low Fuel) */}
      {launchAlert && launchAlert.outcome !== 'CAPTURE_SUCCESS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B132B] border border-[#EF4444]/60 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-2.5 text-[#EF4444] mb-2">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base sm:text-lg font-bold">{launchAlert.title}</h3>
            </div>

            <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed mb-3">
              {launchAlert.explanation}
            </p>

            <p className="text-xs font-semibold text-[#FBBF24] mb-4">
              {lives <= 0
                ? 'All flight lives exhausted! Tap below to restart your flight log.'
                : `1 life lost. (${lives} lives remaining)`}
            </p>

            <button
              onClick={lives <= 0 ? onRestart : onDismissAlert}
              className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer ${
                lives <= 0
                  ? 'bg-[#FBBF24] hover:bg-[#D97706] text-[#030712]'
                  : 'bg-[#38BDF8] hover:bg-[#0284C7] text-[#030712]'
              }`}
            >
              {lives <= 0 ? 'Restart Flight Deck 🔄' : 'Re-Align Trajectory'}
            </button>
          </div>
        </div>
      )}

      {/* 3. Leaderboard & Pilot Profile Dialog */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <button
              onClick={() => setShowLeaderboard(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#F8FAFC]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-[#FBBF24] mb-4">
              <Trophy className="w-5 h-5" />
              <h3 className="font-bold text-base">🏆 Pilot Logs & High Scores</h3>
            </div>

            {/* Pilot Callsign Edit */}
            <div className="mb-4">
              <label className="text-xs text-[#94A3B8] block mb-1">Your Pilot Callsign:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  maxLength={20}
                  value={pilotInput}
                  onChange={(e) => setPilotInput(e.target.value)}
                  className="bg-[#111D3D] border border-[#1E2D4A] rounded-xl px-3 py-1.5 text-xs text-[#F8FAFC] flex-1 focus:outline-none focus:border-[#38BDF8]"
                />
                <button
                  onClick={() => onUpdatePilotName(pilotInput)}
                  className="px-3 py-1.5 bg-[#38BDF8] text-[#030712] font-bold text-xs rounded-xl"
                >
                  Save
                </button>
              </div>
            </div>

            {/* Scores Table */}
            <div className="space-y-2 mb-4">
              <span className="text-xs font-semibold text-[#64748B] block">Top Orbital Flights:</span>
              {leaderboard.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs bg-[#111D3D]/50 border border-[#1E2D4A]/50 px-3 py-2 rounded-xl"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-[#64748B] font-mono w-4">{idx + 1}.</span>
                    <span className="font-medium text-[#F8FAFC]">{entry.pilotName}</span>
                    <span className="text-[10px] bg-[#1E2D4A] text-[#38BDF8] px-1.5 py-0.5 rounded">
                      {entry.rankTitle}
                    </span>
                  </div>
                  <span className="font-bold font-mono text-[#FBBF24]">{entry.score} pts</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowLeaderboard(false)}
              className="w-full py-2 bg-[#111D3D] hover:bg-[#1E2D4A] text-[#38BDF8] text-xs font-bold rounded-xl transition-colors"
            >
              Close Log
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
