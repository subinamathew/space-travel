import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Compass, Globe } from 'lucide-react';

interface GalacticHudProps {
  utcTime: string;
}

export const GalacticHud: React.FC<GalacticHudProps> = ({ utcTime }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2">
      <div className="bg-[#0B132B]/90 backdrop-blur-md border border-[#1E2D4A] rounded-2xl shadow-xl overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[#111D3D]/50 transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌌</span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm text-[#F8FAFC]">
                  Milky Way Galaxy • Orion Arm
                </span>
                <span className="text-[10px] bg-[#1E2D4A] text-[#38BDF8] px-1.5 py-0.5 rounded font-mono">
                  SOL SECTOR
                </span>
              </div>
              <div className="text-xs text-[#38BDF8] font-mono flex items-center space-x-1.5 mt-0.5">
                <Globe className="w-3 h-3 text-[#38BDF8]" />
                <span>Earth UTC: {utcTime}</span>
              </div>
            </div>
          </div>

          <div className="p-1 rounded-lg bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isExpanded && (
          <div className="px-4 pb-3 pt-1 border-t border-[#1E2D4A]/60 text-xs space-y-2 bg-[#090E20]/80">
            <div className="flex justify-between items-center py-1 border-b border-[#1E2D4A]/30">
              <span className="text-[#64748B] flex items-center space-x-1.5">
                <Compass className="w-3 h-3 text-[#94A3B8]" />
                <span>Galactic Coordinates:</span>
              </span>
              <span className="font-mono text-[#F8FAFC] font-medium">RA 17h 45.6m, Dec -29°00′</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1E2D4A]/30">
              <span className="text-[#64748B]">Galactic Core Distance:</span>
              <span className="font-mono text-[#F8FAFC] font-medium">26,000 Light-Years</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-[#1E2D4A]/30">
              <span className="text-[#64748B]">Planetary System:</span>
              <span className="text-[#94A3B8]">Sol • 8 Planets & Asteroid Belt</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-[#64748B]">Astrophysics Ephemerides:</span>
              <span className="text-[#FBBF24] font-medium">NASA JPL Keplerian Model (2026)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
