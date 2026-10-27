import React from 'react';
import { PlanetInfo } from '../data/planetData';
import { ArcPoint } from '../physics/orbitalPhysics';
import { OrreryCanvas } from '../components/OrreryCanvas';
import { GalacticHud } from '../components/GalacticHud';
import { Play, Pause, Box as BoxIcon, Eye, EyeOff, BookOpen, Rocket, X } from 'lucide-react';

interface OrreryScreenProps {
  elapsedSec: number;
  utcEarthTime: string;
  isOrbitPaused: boolean;
  orbitSpeedMultiplier: number;
  is3dMode: boolean;
  showMoons: boolean;
  selectedPlanet: PlanetInfo | null;
  flightCurrentPoint: ArcPoint | null;
  flightArcPoints: ArcPoint[];
  onTogglePause: () => void;
  onSetSpeed: (speed: number) => void;
  onToggle3d: () => void;
  onToggleMoons: () => void;
  onSelectPlanet: (planet: PlanetInfo | null) => void;
  onOpenPlanetDetail: (slug: string) => void;
  onTargetForFlight: (slug: string) => void;
}

export const OrreryScreen: React.FC<OrreryScreenProps> = ({
  elapsedSec,
  utcEarthTime,
  isOrbitPaused,
  orbitSpeedMultiplier,
  is3dMode,
  showMoons,
  selectedPlanet,
  flightCurrentPoint,
  flightArcPoints,
  onTogglePause,
  onSetSpeed,
  onToggle3d,
  onToggleMoons,
  onSelectPlanet,
  onOpenPlanetDetail,
  onTargetForFlight
}) => {
  return (
    <div className="relative w-full h-[calc(100vh-65px)] flex flex-col bg-[#030712] overflow-hidden">
      {/* 1. Orrery Canvas Simulation */}
      <OrreryCanvas
        elapsedSec={elapsedSec}
        is3dMode={is3dMode}
        showMoons={showMoons}
        selectedPlanet={selectedPlanet}
        flightCurrentPoint={flightCurrentPoint}
        flightArcPoints={flightArcPoints}
        onPlanetSelected={onSelectPlanet}
      />

      {/* 2. Top Galactic HUD Overlay */}
      <div className="absolute top-2 left-0 right-0 z-20 pointer-events-auto">
        <GalacticHud utcTime={utcEarthTime} />
      </div>

      {/* 3. Floating Simulation Controls Bar (Top Right) */}
      <div className="absolute top-20 right-4 z-20 bg-[#0B132B]/90 backdrop-blur-md border border-[#1E2D4A] rounded-2xl p-2 shadow-2xl flex items-center space-x-1.5">
        {/* Play / Pause */}
        <button
          onClick={onTogglePause}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isOrbitPaused
              ? 'bg-[#FBBF24] text-[#030712]'
              : 'hover:bg-[#111D3D] text-[#38BDF8]'
          }`}
          title={isOrbitPaused ? 'Resume Orbit Simulation' : 'Pause Orbit Simulation'}
        >
          {isOrbitPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
        </button>

        {/* Speed multipliers */}
        <div className="flex items-center space-x-1 border-x border-[#1E2D4A] px-1.5">
          {[1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onSetSpeed(s)}
              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                orbitSpeedMultiplier === s
                  ? 'bg-[#38BDF8] text-[#030712]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111D3D]'
              }`}
            >
              {s}×
            </button>
          ))}
        </div>

        {/* 3D perspective toggle */}
        <button
          onClick={onToggle3d}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            is3dMode
              ? 'bg-[#38BDF8] text-[#030712]'
              : 'hover:bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8]'
          }`}
          title="Toggle 3D Orbit Perspective"
        >
          <BoxIcon className="w-4 h-4" />
        </button>

        {/* Moons toggle */}
        <button
          onClick={onToggleMoons}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            showMoons
              ? 'bg-[#38BDF8] text-[#030712]'
              : 'hover:bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8]'
          }`}
          title="Toggle Planetary Moons"
        >
          {showMoons ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>

      {/* 4. Bottom Selected Planet Quick Inspection Sheet */}
      {selectedPlanet && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-30 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div
            className="bg-[#0B132B]/95 backdrop-blur-md border rounded-2xl p-4 shadow-2xl relative"
            style={{ borderColor: selectedPlanet.glowColor }}
          >
            {/* Close button */}
            <button
              onClick={() => onSelectPlanet(null)}
              className="absolute top-3 right-3 p-1 rounded-lg text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111D3D] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-4">
              <img
                src={selectedPlanet.image}
                alt={selectedPlanet.name}
                className="w-14 h-14 rounded-full object-cover filter drop-shadow-md shrink-0 border border-[#1E2D4A]"
              />

              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-bold text-[#F8FAFC] truncate">
                    {selectedPlanet.name}
                  </h4>
                  <span className="text-base">{selectedPlanet.symbol}</span>
                </div>
                <p className="text-xs font-medium truncate" style={{ color: selectedPlanet.glowColor }}>
                  {selectedPlanet.greeting}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  Orbit: <strong className="text-[#F8FAFC]">{selectedPlanet.auDistance} AU</strong> •
                  Gravity:{' '}
                  <strong className="text-[#F8FAFC]">{selectedPlanet.gravityRatio}× Earth</strong>
                </p>
              </div>

              <div className="flex flex-col space-y-1.5 shrink-0">
                <button
                  onClick={() => onOpenPlanetDetail(selectedPlanet.slug)}
                  className="px-3 py-1.5 bg-[#38BDF8] hover:bg-[#0284C7] text-[#030712] font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Atlas & Lab</span>
                </button>

                {selectedPlanet.slug !== 'sun' && (
                  <button
                    onClick={() => onTargetForFlight(selectedPlanet.slug)}
                    className="px-3 py-1.5 bg-[#111D3D] hover:bg-[#1E2D4A] border border-[#FBBF24]/50 text-[#FBBF24] font-semibold text-xs rounded-xl transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Target Flight</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
