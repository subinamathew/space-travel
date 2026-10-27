import React, { useState } from 'react';
import { PlanetInfo } from '../data/planetData';
import { ArrowUpDown, Sparkles, User } from 'lucide-react';

interface CosmicCalculatorProps {
  planet: PlanetInfo;
  userWeight: number;
  userHeight: number;
  weightUnit: string;
  heightUnit: string;
  isAstronautFemale: boolean;
  onWeightChange: (weight: number) => void;
  onHeightChange: (height: number) => void;
  onToggleWeightUnit: () => void;
  onToggleHeightUnit: () => void;
  onToggleAvatar: () => void;
}

export const CosmicCalculator: React.FC<CosmicCalculatorProps> = ({
  planet,
  userWeight,
  userHeight,
  weightUnit,
  heightUnit,
  isAstronautFemale,
  onWeightChange,
  onHeightChange,
  onToggleWeightUnit,
  onToggleHeightUnit,
  onToggleAvatar
}) => {
  const g = planet.gravityRatio;
  const isSun = planet.slug === 'sun';

  // Weight calculation
  const weightOnPlanet = userWeight * g;
  const weightDiffPct = Math.round((g - 1) * 100);

  let weightDescription = '';
  if (isSun) {
    weightDescription = 'Colossal crushing weight (+2690%) — like a skyscraper pressing down!';
  } else if (g >= 0.98 && g <= 1.02) {
    weightDescription = 'Identical to your Earth weight!';
  } else if (g > 1) {
    let feel = 'heavy winter Antarctic gear!';
    if (g > 20) feel = 'a huge locomotive on your back!';
    else if (g > 2.0) feel = 'a backpack full of giant boulders!';
    weightDescription = `+${weightDiffPct}% heavier — feels like ${feel}`;
  } else {
    let feel = 'springy running trainers!';
    if (g < 0.2) feel = 'a light fluffy floating feather!';
    else if (g < 0.45) feel = 'moon-boots bouncing shoes!';
    weightDescription = `-${Math.abs(weightDiffPct)}% lighter — feels like ${feel}`;
  }

  // Jump calculation (earth jump ~ 22% of body height)
  const earthJump = userHeight * 0.22;
  const jumpOnPlanet = isSun ? 0 : earthJump / g;
  const jumpRatio = isSun ? 0 : 1 / g;

  let jumpDescription = '';
  if (isSun) {
    jumpDescription = "The Sun's crushing 27.9× gravity prevents any jumping at all!";
  } else if (jumpRatio > 1.2) {
    jumpDescription = `${jumpRatio.toFixed(1)}× your Earth leap! Soaring high into the cosmic sky!`;
  } else if (jumpRatio >= 0.8 && jumpRatio <= 1.2) {
    jumpDescription = 'Nearly identical to jumping in your backyard on Earth.';
  } else {
    jumpDescription = `Intense gravity pulls you down fast — only ${jumpRatio.toFixed(1)}× your Earth jump.`;
  }

  // Jump animation state
  const [isJumping, setIsJumping] = useState(false);

  const handleTestJump = () => {
    if (isJumping || isSun) return;
    setIsJumping(true);
    setTimeout(() => {
      setIsJumping(false);
    }, 1200);
  };

  // Jump height in pixels (scaled)
  const jumpPixelHeight = Math.min(80, Math.max(8, jumpRatio * 20));

  return (
    <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-[#38BDF8] flex items-center space-x-2">
            <span>Cosmic Explorer Lab 🧪</span>
          </h3>
          <p className="text-xs text-[#94A3B8]">
            Gravity: <span className="text-[#FBBF24] font-semibold">{g}×</span> Earth • Live Physics
          </p>
        </div>

        <button
          onClick={onToggleAvatar}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#111D3D] hover:bg-[#1E2D4A] border border-[#1E2D4A] text-[#F8FAFC] text-xs font-medium rounded-xl transition-colors cursor-pointer"
          title="Toggle Astronaut Avatar"
        >
          <span>{isAstronautFemale ? '👩‍🚀 Pilot' : '👨‍🚀 Pilot'}</span>
          <User className="w-3.5 h-3.5 text-[#38BDF8]" />
        </button>
      </div>

      {/* Controls Container */}
      <div className="space-y-4">
        {/* Weight input slider */}
        <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#F8FAFC]">
              Your Earth Weight:{' '}
              <strong className="text-[#38BDF8]">
                {Math.round(userWeight)} {weightUnit}
              </strong>
            </span>
            <button
              onClick={onToggleWeightUnit}
              className="px-2.5 py-1 bg-[#111D3D] hover:bg-[#1E2D4A] border border-[#38BDF8]/40 text-[#38BDF8] rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Unit: {weightUnit}</span>
            </button>
          </div>

          <input
            type="range"
            min={weightUnit === 'kg' ? 15 : 30}
            max={weightUnit === 'kg' ? 120 : 260}
            value={userWeight}
            onChange={(e) => onWeightChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#0B132B] rounded-lg appearance-none cursor-pointer"
          />

          {/* Quick presets */}
          <div className="flex items-center space-x-2 mt-2.5">
            <span className="text-[10px] text-[#64748B]">Presets:</span>
            <button
              onClick={() => onWeightChange(weightUnit === 'kg' ? 25 : 55)}
              className="text-[11px] px-2 py-0.5 rounded bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8] border border-[#1E2D4A]"
            >
              Kid ({weightUnit === 'kg' ? '25kg' : '55lbs'})
            </button>
            <button
              onClick={() => onWeightChange(weightUnit === 'kg' ? 50 : 110)}
              className="text-[11px] px-2 py-0.5 rounded bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8] border border-[#1E2D4A]"
            >
              Teen ({weightUnit === 'kg' ? '50kg' : '110lbs'})
            </button>
            <button
              onClick={() => onWeightChange(weightUnit === 'kg' ? 70 : 154)}
              className="text-[11px] px-2 py-0.5 rounded bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8] border border-[#1E2D4A]"
            >
              Adult ({weightUnit === 'kg' ? '70kg' : '154lbs'})
            </button>
          </div>
        </div>

        {/* Height input slider */}
        <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#F8FAFC]">
              Your Earth Height:{' '}
              <strong className="text-[#FBBF24]">
                {Math.round(userHeight)} {heightUnit}
              </strong>
            </span>
            <button
              onClick={onToggleHeightUnit}
              className="px-2.5 py-1 bg-[#111D3D] hover:bg-[#1E2D4A] border border-[#FBBF24]/40 text-[#FBBF24] rounded-lg text-[11px] font-semibold transition-colors flex items-center space-x-1"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>Unit: {heightUnit}</span>
            </button>
          </div>

          <input
            type="range"
            min={heightUnit === 'cm' ? 90 : 35}
            max={heightUnit === 'cm' ? 210 : 82}
            value={userHeight}
            onChange={(e) => onHeightChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-[#0B132B] rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Interactive Lab Physics Results */}
        <div className="bg-[#111D3D] border border-[#1E2D4A] rounded-xl p-4 space-y-3.5">
          {/* Weight result */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">Weight on {planet.name}:</span>
              <span
                className={`text-lg font-bold font-mono ${
                  g > 1 ? 'text-[#FBBF24]' : 'text-[#38BDF8]'
                }`}
              >
                {weightOnPlanet.toFixed(1)} {weightUnit}
              </span>
            </div>
            <p className="text-xs text-[#F8FAFC] mt-0.5 leading-relaxed">{weightDescription}</p>
          </div>

          <div className="border-t border-[#1E2D4A]" />

          {/* Jump result */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94A3B8]">Vertical Jump Leap:</span>
              <span className="text-lg font-bold font-mono text-[#10B981]">
                {isSun ? `0 ${heightUnit}` : `${jumpOnPlanet.toFixed(1)} ${heightUnit}`}
              </span>
            </div>
            <p className="text-xs text-[#F8FAFC] mt-0.5 leading-relaxed">{jumpDescription}</p>
          </div>

          {/* Astronaut Jump Test Sandbox */}
          <div className="pt-2">
            <button
              onClick={handleTestJump}
              disabled={isSun}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between transition-all ${
                isSun
                  ? 'bg-[#0B132B]/60 text-[#64748B] cursor-not-allowed'
                  : 'bg-[#030712] hover:bg-[#030712]/80 border border-[#1E2D4A] text-[#38BDF8] cursor-pointer'
              }`}
            >
              <span className="text-xs font-semibold flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                <span>{isSun ? 'Gravity too strong to leap' : 'Tap to Test Jump Leap!'}</span>
              </span>

              {/* Animated Bouncy Astronaut */}
              <div className="h-10 flex items-end justify-center w-12 overflow-visible relative">
                <span
                  style={{
                    transform: isJumping ? `translateY(-${jumpPixelHeight}px)` : 'translateY(0)',
                    transition: isJumping
                      ? 'transform 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
                      : 'transform 0.5s ease-in'
                  }}
                  className="text-2xl select-none inline-block filter drop-shadow"
                >
                  {isAstronautFemale ? '👩‍🚀' : '👨‍🚀'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
