import React from 'react';
import { Compass, BookOpen, Rocket, Laugh } from 'lucide-react';

export type AppScreen = 'ORRERY' | 'PLANETS' | 'GAME' | 'JOKES_ABOUT';

interface NavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  pilotName: string;
  score: number;
  rankTitle: string;
  rankIcon: string;
}

export const NavBar: React.FC<NavBarProps> = ({
  currentScreen,
  onNavigate,
  pilotName,
  score,
  rankTitle,
  rankIcon
}) => {
  const tabs = [
    {
      id: 'ORRERY' as AppScreen,
      label: 'Orrery 3D',
      icon: Compass,
      desc: 'Solar System Tour'
    },
    {
      id: 'PLANETS' as AppScreen,
      label: 'Atlas & Lab',
      icon: BookOpen,
      desc: 'Planetary Science'
    },
    {
      id: 'GAME' as AppScreen,
      label: 'Flight Deck',
      icon: Rocket,
      desc: 'Missions & Quizzes'
    },
    {
      id: 'JOKES_ABOUT' as AppScreen,
      label: 'Jokes & Lore',
      icon: Laugh,
      desc: 'Space Riddles & About'
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030712]/95 backdrop-blur-md border-b border-[#1E2D4A] px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#38BDF8] to-[#FBBF24] p-[2px] flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
            <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center text-xl">
              🚀
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#F8FAFC] via-[#38BDF8] to-[#FBBF24]">
                ROCKETRUN
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-[#1E2D4A] text-[#38BDF8] px-1.5 py-0.5 rounded">
                v3.2.0
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">Solar System Tour & Orbital Spaceflight</p>
          </div>
        </div>

        {/* Center Screen Navigation Tabs */}
        <nav className="flex items-center bg-[#0B132B] p-1 rounded-2xl border border-[#1E2D4A] shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#38BDF8] text-[#030712] shadow-md shadow-[#38BDF8]/30'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#111D3D]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#030712]' : 'text-[#38BDF8]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Pilot Profile Quick Badge */}
        <div
          onClick={() => onNavigate('GAME')}
          className="hidden sm:flex items-center space-x-2.5 bg-[#0B132B] border border-[#1E2D4A] px-3.5 py-1.5 rounded-xl cursor-pointer hover:border-[#38BDF8]/50 transition-colors"
          title="Go to Flight Deck"
        >
          <span className="text-xl">{rankIcon}</span>
          <div className="text-right">
            <div className="text-xs font-bold text-[#F8FAFC] leading-none">{pilotName}</div>
            <div className="text-[10px] text-[#FBBF24] font-medium leading-tight mt-0.5">
              {rankTitle} • {score} pts
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
