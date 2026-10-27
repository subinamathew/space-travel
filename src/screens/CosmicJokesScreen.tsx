import React, { useState } from 'react';
import { GameRepository, SpaceJoke } from '../data/gameData';
import { Sparkles, Dices, Eye, EyeOff, Calendar, Users, Heart } from 'lucide-react';

interface CosmicJokesScreenProps {
  currentRandomJokeIndex: number;
  isRandomJokeRevealed: boolean;
  revealedStaticJokeIds: number[];
  onRollNextJoke: () => void;
  onRevealRandomJoke: () => void;
  onToggleStaticJoke: (id: number) => void;
}

export const CosmicJokesScreen: React.FC<CosmicJokesScreenProps> = ({
  currentRandomJokeIndex,
  isRandomJokeRevealed,
  revealedStaticJokeIds,
  onRollNextJoke,
  onRevealRandomJoke,
  onToggleStaticJoke
}) => {
  const currentRandomJoke =
    GameRepository.jokes[currentRandomJokeIndex] || GameRepository.jokes[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* 1. Hero Header */}
      <div>
        <h2 className="text-2xl font-bold text-[#38BDF8] flex items-center space-x-2">
          <span>Cosmic Space Jokes & Roadmap 💬</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Kid-friendly astronomical humor, scientific curiosities & solar system mission roadmap
        </p>
      </div>

      {/* 2. Interactive Joke Generator Card */}
      <div className="bg-[#0B132B] border border-[#FBBF24]/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🚀</span>
            <h3 className="text-sm sm:text-base font-bold text-[#FBBF24]">
              Cosmic Humor Generator
            </h3>
          </div>

          <button
            onClick={onRollNextJoke}
            className="px-3.5 py-1.5 bg-[#FBBF24] hover:bg-[#D97706] text-[#030712] font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Another Joke!</span>
          </button>
        </div>

        {/* Joke Question / Setup */}
        <p className="text-base sm:text-lg font-bold text-[#F8FAFC] my-3 leading-relaxed">
          {currentRandomJoke.setup}
        </p>

        {/* Punchline Reveal Button or Revealed Answer */}
        <div className="mt-4">
          {!isRandomJokeRevealed ? (
            <button
              onClick={onRevealRandomJoke}
              className="px-4 py-2 bg-[#111D3D] hover:bg-[#1E2D4A] border border-[#38BDF8]/40 text-[#38BDF8] font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FBBF24]" />
              <span>Reveal Punchline ✨</span>
            </button>
          ) : (
            <div className="bg-[#111D3D] border border-[#10B981]/50 rounded-2xl p-4 animate-in fade-in">
              <span className="text-xs text-[#10B981] font-bold block mb-1">
                PUNCHLINE:
              </span>
              <p className="text-base sm:text-lg font-bold text-[#10B981]">
                {currentRandomJoke.punchline}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Curated Space Crew Riddles */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[#F8FAFC] flex items-center space-x-2">
          <span>Curated Space Crew Riddles</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GameRepository.jokes.slice(1).map((joke) => {
            const isRevealed = revealedStaticJokeIds.includes(joke.id);
            return (
              <div
                key={joke.id}
                onClick={() => onToggleStaticJoke(joke.id)}
                className="bg-[#0B132B] hover:bg-[#111D3D]/60 border border-[#1E2D4A] rounded-2xl p-4 transition-all cursor-pointer shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2.5">
                    <span className="text-lg">{joke.emoji || '🚀'}</span>
                    <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC] leading-snug">
                      {joke.setup}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#38BDF8] shrink-0 font-medium ml-2">
                    {isRevealed ? 'Hide' : 'Reveal ✨'}
                  </span>
                </div>

                {isRevealed && (
                  <p className="text-xs sm:text-sm font-bold text-[#FBBF24] mt-3 pt-2 border-t border-[#1E2D4A]/60 animate-in fade-in">
                    {joke.punchline}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Mission Roadmap */}
      <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-[#38BDF8] flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-[#38BDF8]" />
          <span>Mission Roadmap (2026 Schedule) 🚀</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="border-l-2 border-[#10B981] pl-3.5">
            <span className="font-bold text-[#10B981] block text-xs">
              Oct 2026 • Live
            </span>
            <p className="text-[#94A3B8] mt-0.5 leading-relaxed">
              Game Mode, Keplerian transfer trajectories, Circadian solar recharge, Cosmic Space
              Jokes, and interactive gravity jumps.
            </p>
          </div>

          <div className="border-l-2 border-[#FBBF24] pl-3.5">
            <span className="font-bold text-[#FBBF24] block text-xs">
              Nov 2026 • Upcoming
            </span>
            <p className="text-[#94A3B8] mt-0.5 leading-relaxed">
              High-contrast planetary typography, cosmic font scale accessibility, and orbital
              velocity graphs.
            </p>
          </div>

          <div className="border-l-2 border-[#38BDF8] pl-3.5">
            <span className="font-bold text-[#38BDF8] block text-xs">
              Dec 2026 • Target
            </span>
            <p className="text-[#94A3B8] mt-0.5 leading-relaxed">
              Complete WCAG 2.2 AAA accessibility standard, assistive telemetry, and zero-sensory
              barriers for classroom exploration.
            </p>
          </div>
        </div>
      </div>

      {/* 5. About & Creators */}
      <div className="bg-[#0B132B] border border-[#1E2D4A] rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-[#F8FAFC] flex items-center space-x-2">
          <Users className="w-4 h-4 text-[#38BDF8]" />
          <span>Creators & Collaboration 🧑‍🚀</span>
        </h3>

        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Created with cosmic love by <strong className="text-[#F8FAFC]">Zachary David Mathew + Papa</strong>.
          Designed to ignite curiosity about astronomy, orbital physics, and our marvelous solar
          system for kids and curious minds everywhere.
        </p>

        <p className="text-xs text-[#38BDF8] leading-relaxed">
          Part of <strong className="font-mono">missional.eu</strong> — an initiative fostering
          scientific wonder, open educational tools, and cosmic exploration.
        </p>

        <p className="text-[11px] text-[#64748B] pt-1">
          Astronomical data sources: NASA Solar System Exploration, Jet Propulsion Laboratory (JPL),
          and European Space Agency (ESA).
        </p>
      </div>
    </div>
  );
};
