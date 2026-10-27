import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlanetInfo, SolarSystemRepository } from '../data/planetData';
import { ArcPoint, OrbitalPhysics } from '../physics/orbitalPhysics';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface OrreryCanvasProps {
  elapsedSec: number;
  is3dMode: boolean;
  showMoons: boolean;
  selectedPlanet: PlanetInfo | null;
  flightCurrentPoint: ArcPoint | null;
  flightArcPoints: ArcPoint[];
  onPlanetSelected: (planet: PlanetInfo) => void;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export const OrreryCanvas: React.FC<OrreryCanvasProps> = ({
  elapsedSec,
  is3dMode,
  showMoons,
  selectedPlanet,
  flightCurrentPoint,
  flightArcPoints,
  onPlanetSelected
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport transforms
  const [zoomScale, setZoomScale] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Hovered planet for tooltip
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetInfo | null>(null);

  // Generate starfield once
  const starsRef = useRef<Star[]>([]);
  useEffect(() => {
    const list: Star[] = [];
    for (let i = 0; i < 160; i++) {
      list.push({
        x: Math.random(),
        y: Math.random(),
        radius: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    starsRef.current = list;
  }, []);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      checkHover(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoomScale((prev) => Math.min(3.5, Math.max(0.4, prev * zoomFactor)));
  };

  // Hit detection helper
  const getCoordinatesFromScreen = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2 + panOffset.x;
      const cy = height / 2 + panOffset.y;
      const baseScale = (Math.min(width, height) / 105) * zoomScale;
      const yComp = is3dMode ? 0.52 : 1.0;

      return { x, y, cx, cy, baseScale, yComp };
    },
    [panOffset, zoomScale, is3dMode]
  );

  const checkHover = (clientX: number, clientY: number) => {
    const coords = getCoordinatesFromScreen(clientX, clientY);
    if (!coords) return;
    const { x, y, cx, cy, baseScale, yComp } = coords;

    // Check Sun
    if (Math.hypot(x - cx, y - cy) <= 24 * zoomScale) {
      setHoveredPlanet(SolarSystemRepository.sun);
      return;
    }

    // Check Planets
    for (const p of SolarSystemRepository.planets) {
      const pCoords = OrbitalPhysics.getCoordinates(p.slug, elapsedSec);
      const px = cx + pCoords.x * baseScale;
      const py = cy + pCoords.y * yComp * baseScale;
      const touchRadius = Math.max(24, p.sizeRatio * 14 * zoomScale);
      if (Math.hypot(x - px, y - py) <= touchRadius) {
        setHoveredPlanet(p);
        return;
      }
    }

    setHoveredPlanet(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    const coords = getCoordinatesFromScreen(e.clientX, e.clientY);
    if (!coords) return;
    const { x, y, cx, cy, baseScale, yComp } = coords;

    // Check Sun
    if (Math.hypot(x - cx, y - cy) <= 26 * zoomScale) {
      onPlanetSelected(SolarSystemRepository.sun);
      return;
    }

    // Check Planets
    for (const p of SolarSystemRepository.planets) {
      const pCoords = OrbitalPhysics.getCoordinates(p.slug, elapsedSec);
      const px = cx + pCoords.x * baseScale;
      const py = cy + pCoords.y * yComp * baseScale;
      const touchRadius = Math.max(26, p.sizeRatio * 14 * zoomScale);
      if (Math.hypot(x - px, y - py) <= touchRadius) {
        onPlanetSelected(p);
        return;
      }
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const cx = width / 2 + panOffset.x;
    const cy = height / 2 + panOffset.y;
    const baseScale = (Math.min(width, height) / 105) * zoomScale;
    const yComp = is3dMode ? 0.52 : 1.0;

    // Clear background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Starfield
    for (const s of starsRef.current) {
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();
    }

    // 2. Draw Orbit Guides
    for (const p of SolarSystemRepository.planets) {
      const spec = OrbitalPhysics.specs[p.slug] || p;
      const orbitRadius = spec.r * baseScale;

      ctx.beginPath();
      ctx.ellipse(cx, cy, orbitRadius, orbitRadius * yComp, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(30, 45, 74, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 3. Draw Asteroid Belt (r ~ 25.5)
    const asteroidBeltR = 25.5 * baseScale;
    for (let i = 0; i < 90; i++) {
      const ang = (i * 4 + Math.sin(i) * 3) * (Math.PI / 180);
      const rDev = asteroidBeltR + Math.cos(i * 1.5) * 1.4 * baseScale;
      const ax = cx + rDev * Math.cos(ang);
      const ay = cy + rDev * Math.sin(ang) * yComp;

      ctx.beginPath();
      ctx.arc(ax, ay, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.fill();
    }

    // 4. Central Sun
    const sunRadius = 15 * zoomScale;
    // Outer ambient glow
    const sunGlow = ctx.createRadialGradient(cx, cy, sunRadius * 0.5, cx, cy, sunRadius * 2.8);
    sunGlow.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
    sunGlow.addColorStop(0.5, 'rgba(245, 158, 11, 0.2)');
    sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius * 2.8, 0, Math.PI * 2);
    ctx.fillStyle = sunGlow;
    ctx.fill();

    // Inner bright core
    ctx.beginPath();
    ctx.arc(cx, cy, sunRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF5AA';
    ctx.shadowColor = '#FFAA00';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    // 5. Transfer Flight Arc (if active)
    if (flightArcPoints.length > 0) {
      ctx.beginPath();
      ctx.setLineDash([8, 8]);
      flightArcPoints.forEach((pt, idx) => {
        const ax = cx + pt.x * baseScale;
        const ay = cy + pt.y * yComp * baseScale;
        if (idx === 0) ctx.moveTo(ax, ay);
        else ctx.lineTo(ax, ay);
      });
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 2.4;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 6. Draw Planets & Moons
    for (const planet of SolarSystemRepository.planets) {
      const coords = OrbitalPhysics.getCoordinates(planet.slug, elapsedSec);
      const px = cx + coords.x * baseScale;
      const py = cy + coords.y * yComp * baseScale;
      const pRadius = Math.max(4.5, planet.sizeRatio * 4.5 * zoomScale);
      const isSelected = selectedPlanet?.slug === planet.slug;

      // Selection Highlight Ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(px, py, pRadius + 6 * zoomScale, 0, Math.PI * 2);
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      // Planet body
      ctx.beginPath();
      ctx.arc(px, py, pRadius, 0, Math.PI * 2);
      ctx.fillStyle = planet.primaryColor;
      ctx.shadowColor = planet.glowColor;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Saturn Ring
      if (planet.slug === 'saturn') {
        ctx.beginPath();
        ctx.ellipse(px, py, pRadius * 2.3, pRadius * 0.8 * yComp, -0.2, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(224, 192, 128, 0.75)';
        ctx.lineWidth = 2.2 * zoomScale;
        ctx.stroke();
      }

      // Moons
      if (showMoons) {
        if (planet.slug === 'earth') {
          const moonCoords = OrbitalPhysics.getCoordinates('moon', elapsedSec);
          const mx = cx + moonCoords.x * baseScale;
          const my = cy + moonCoords.y * yComp * baseScale;
          ctx.beginPath();
          ctx.arc(mx, my, Math.max(2, 1.8 * zoomScale), 0, Math.PI * 2);
          ctx.fillStyle = '#E2E8F0';
          ctx.fill();
        } else if (planet.moons.length > 0) {
          planet.moons.forEach((moon, mIdx) => {
            const mAngle = (elapsedSec * moon.speed * 40 + mIdx * 60) * (Math.PI / 180);
            const mDist = moon.distance * 3.5 * zoomScale;
            const mx = px + mDist * Math.cos(mAngle);
            const my = py + mDist * Math.sin(mAngle) * yComp;

            ctx.beginPath();
            ctx.arc(mx, my, Math.max(1.5, 1.6 * zoomScale), 0, Math.PI * 2);
            ctx.fillStyle = moon.color;
            ctx.fill();
          });
        }
      }

      // Planet label (subtle)
      if (zoomScale >= 0.8) {
        ctx.fillStyle = '#94A3B8';
        ctx.font = `${Math.round(10 * Math.max(0.9, zoomScale))}px Outfit, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, px, py + pRadius + 12 * zoomScale);
      }
    }

    // 7. Flying Spacecraft (Rocket)
    if (flightCurrentPoint) {
      const rx = cx + flightCurrentPoint.x * baseScale;
      const ry = cy + flightCurrentPoint.y * yComp * baseScale;

      // Plume exhaust glow
      ctx.beginPath();
      ctx.arc(rx, ry, 9 * zoomScale, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.fill();

      // Rocket core dot
      ctx.beginPath();
      ctx.arc(rx, ry, 4.5 * zoomScale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Rocket text icon
      ctx.font = `${Math.round(14 * zoomScale)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('🚀', rx, ry - 7 * zoomScale);
    }

    ctx.restore();
  }, [
    elapsedSec,
    is3dMode,
    showMoons,
    selectedPlanet,
    flightCurrentPoint,
    flightArcPoints,
    zoomScale,
    panOffset
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] flex-1 select-none overflow-hidden cursor-grab active:cursor-grabbing bg-[#030712]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating Zoom & Reset Controls */}
      <div className="absolute bottom-6 left-6 z-10 flex flex-col space-y-2 bg-[#0B132B]/90 backdrop-blur border border-[#1E2D4A] rounded-xl p-1.5 shadow-xl">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomScale((z) => Math.min(3.5, z * 1.25));
          }}
          className="p-2 hover:bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8] rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomScale((z) => Math.max(0.4, z * 0.8));
          }}
          className="p-2 hover:bg-[#111D3D] text-[#94A3B8] hover:text-[#38BDF8] rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomScale(1.0);
            setPanOffset({ x: 0, y: 0 });
          }}
          className="p-2 hover:bg-[#111D3D] text-[#94A3B8] hover:text-[#FBBF24] rounded-lg transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Tooltip on Hover */}
      {hoveredPlanet && (
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 bg-[#0B132B]/95 border border-[#38BDF8]/40 px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-2 text-xs text-[#F8FAFC]">
          <span>{hoveredPlanet.symbol}</span>
          <span className="font-semibold">{hoveredPlanet.name}</span>
          <span className="text-[#94A3B8]">• Click to inspect</span>
        </div>
      )}
    </div>
  );
};
