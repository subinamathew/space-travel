import React, { useState } from 'react';
import { PlanetInfo, SolarSystemRepository } from '../data/planetData';
import { CosmicCalculator } from '../components/CosmicCalculator';
import { Rocket, ChevronDown, ChevronUp, Sparkles, Thermometer, Clock, Shield, Compass } from 'lucide-react';

interface PlanetDetailScreenProps {
  currentPlanetSlug: string;
  userWeight: number;
  userHeight: number;
  weightUnit: string;
  heightUnit: string;
  isAstronautFemale: boolean;
  onSelectPlanetSlug: (slug: string) => void;
  onWeightChange: (weight: number) => void;
  onHeightChange: (height: number) => void;
  onToggleWeightUnit: () => void;
  onToggleHeightUnit: () => void;
  onToggleAvatar: () => void;
  onTargetPlanetForFlight: (slug: string) => void;
}

export const PlanetDetailScreen: React.FC<PlanetDetailScreenProps> = ({
  currentPlanetSlug,
  userWeight,
  userHeight,
  weightUnit,
  heightUnit,
  isAstronautFemale,
  onSelectPlanetSlug,
  onWeightChange,
  onHeightChange,
  onToggleWeightUnit,
  onToggleHeightUnit,
  onToggleAvatar,
  onTargetPlanetForFlight
}) => {
  const planet = SolarSystemRepository.findBySlug(currentPlanetSlug) || SolarSystemRepository.earth;
  const allBodies = SolarSystemRepository.getAllBodies();

  // Accordion state for Kids facts
  const [expandedFactIdx, setExpandedFactIdx] = useState<number | null>(null);

  const toggleFact = (idx: number) => {
    setExpandedFactIdx(expandedFactIdx === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Horizontal Celestial Body Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {allBodies.map((body) => {
          const isSelected = body.slug === planet.slug;
          return (
            <button
              key={body.slug}
              onClick={() => onSelectPlanetSlug(body.slug)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#38BDF8] text-[#030712] shadow-md shadow-[#38BDF8]/20'
                  : 'bg-[#0B132B] hover:bg-[#111D3D] border border-[#1E2D4A] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              <span>{body.symbol}</span>
              <span>{body.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Planet Hero Banner */}
      <div
        className="bg-[#0B132B] border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
        style={{ borderColor: `${planet.glowColor}50` }}
      >
        {/* Ambient background glow */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-20 filter blur-3xl pointer-events-none"
          style={{ backgroundColor: planet.glowColor }}
        />

        {/* Large Planet Image with Glow */}
        <div className="relative mb-4">
          <div
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center p-2 relative"
            style={{
              boxShadow: `0 0 50px ${planet.glowColor}40`
            }}
          >
            <img
              src={planet.image}
              alt={planet.name}
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Title & Symbol */}
        <div className="flex items-center space-x-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">{planet.name}</h1>
          <span className="text-2xl">{planet.symbol}</span>
        </div>

        <p className="text-sm sm:text-base font-semibold mt-1" style={{ color: planet.glowColor }}>
          {planet.greeting}
        </p>

        <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl mt-3 leading-relaxed">
          {planet.fact}
        </p>

        {/* Target in Flight Deck Button */}
        {planet.slug !== 'sun' && (
          <button
            onClick={() => onTargetPlanetForFlight(planet.slug)}
            className="mt-5 px-5 py-2.5 bg-[#FBBF24] hover:bg-[#D97706] text-[#030712] font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-[#030712]" />
            <span>Target This World in Flight Simulator 🚀</span>
          </button>
        )}
      </div>

      {/* 3. Astronomical Specifications Grid */}
      <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-[#38BDF8] flex items-center space-x-2 mb-4">
          <Compass className="w-4 h-4 text-[#38BDF8]" />
          <span>Astronomical Specifications 🔭</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-xs">
          <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3">
            <span className="text-[#64748B] block mb-0.5">Orbit Distance</span>
            <span className="text-[#F8FAFC] font-bold font-mono text-sm">{planet.auDistance} AU</span>
          </div>

          <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3">
            <span className="text-[#64748B] block mb-0.5">Orbital Period</span>
            <span className="text-[#F8FAFC] font-bold font-mono text-sm">
              {planet.periodYears} Earth Yrs
            </span>
          </div>

          <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3">
            <span className="text-[#64748B] block mb-0.5">Surface Gravity</span>
            <span className="text-[#FBBF24] font-bold font-mono text-sm">
              {planet.gravityRatio}× Earth
            </span>
          </div>

          <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3">
            <span className="text-[#64748B] block mb-0.5 flex items-center space-x-1">
              <Thermometer className="w-3 h-3" />
              <span>Avg Temperature</span>
            </span>
            <span className="text-[#F8FAFC] font-medium">{planet.temperature}</span>
          </div>

          <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3">
            <span className="text-[#64748B] block mb-0.5 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Day Duration</span>
            </span>
            <span className="text-[#F8FAFC] font-medium">{planet.dayLength}</span>
          </div>

          <div className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3">
            <span className="text-[#64748B] block mb-0.5">Moons Count</span>
            <span className="text-[#10B981] font-bold font-mono text-sm">
              {planet.moonsCount} Moons
            </span>
          </div>

          <div className="col-span-2 sm:col-span-3 bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl p-3">
            <span className="text-[#64748B] block mb-0.5 flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Atmosphere Composition</span>
            </span>
            <span className="text-[#F8FAFC] font-medium leading-relaxed">{planet.atmosphere}</span>
          </div>
        </div>
      </div>

      {/* 4. Cosmic Explorer Lab — Gravity & Jump Calculator */}
      <CosmicCalculator
        planet={planet}
        userWeight={userWeight}
        userHeight={userHeight}
        weightUnit={weightUnit}
        heightUnit={heightUnit}
        isAstronautFemale={isAstronautFemale}
        onWeightChange={onWeightChange}
        onHeightChange={onHeightChange}
        onToggleWeightUnit={onToggleWeightUnit}
        onToggleHeightUnit={onToggleHeightUnit}
        onToggleAvatar={onToggleAvatar}
      />

      {/* 5. Deep Planetary Science & Lore */}
      <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-[#FBBF24] flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#FBBF24]" />
          <span>Astrophysical Lore & Curiosities 🌌</span>
        </h3>
        <h4 className="text-sm font-semibold text-[#F8FAFC] mt-2">{planet.scienceLoreTopic}</h4>
        <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">{planet.scienceLoreDesc}</p>
      </div>

      {/* 6. Kids Explainer Cards (Expandable) */}
      {planet.kidsFacts && planet.kidsFacts.length > 0 && (
        <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-[#10B981] flex items-center space-x-2 mb-3">
            <span>🚀 Kids Science Guide Explainer</span>
          </h3>

          <div className="space-y-2">
            {planet.kidsFacts.map((fact, idx) => {
              const isExpanded = expandedFactIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#111D3D]/50 border border-[#1E2D4A]/60 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFact(idx)}
                    className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#111D3D] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="text-lg">{fact.icon || '🚀'}</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#F8FAFC]">
                        {fact.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3.5 pt-1 text-xs text-[#94A3B8] leading-relaxed border-t border-[#1E2D4A]/40">
                      {fact.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
