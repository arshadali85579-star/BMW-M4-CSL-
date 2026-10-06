import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { HotspotItem } from '../../types';
import { soundManager } from '../../utils/audio';

interface HotspotPinsProps {
  hotspots: HotspotItem[];
  activeHotspotId: string | null;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  visible: boolean;
}

export const HotspotPins: React.FC<HotspotPinsProps> = ({
  hotspots,
  activeHotspotId,
  onSelectHotspot,
  visible
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!visible) return null;

  return (
    <group>
      {hotspots.map((hotspot) => {
        const isActive = activeHotspotId === hotspot.id;
        const isHovered = hoveredId === hotspot.id;

        return (
          <group key={hotspot.id} position={hotspot.position}>
            <Html
              center
              distanceFactor={6}
              zIndexRange={[100, 0]}
              className="pointer-events-auto select-none"
            >
              <div
                className="relative group cursor-pointer flex items-center justify-center p-2"
                onMouseEnter={() => {
                  setHoveredId(hotspot.id);
                  soundManager.playHotspotHover();
                }}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  soundManager.playClick();
                  onSelectHotspot(hotspot);
                }}
              >
                {/* Subtle outer technical radar ring */}
                <div
                  className={`absolute rounded-full border border-[#3B97FF]/50 transition-all duration-300 pointer-events-none ${
                    isActive
                      ? 'w-8 h-8 border-[#3B97FF] scale-110 shadow-[0_0_12px_rgba(59,151,255,0.6)]'
                      : isHovered
                      ? 'w-7 h-7 border-white scale-105'
                      : 'w-5 h-5 border-white/30 animate-pulse'
                  }`}
                />

                {/* Center target dot */}
                <button
                  type="button"
                  aria-label={`Inspect ${hotspot.title}`}
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3B97FF] shadow-[0_0_10px_#3B97FF]'
                      : isHovered
                      ? 'bg-white scale-125 shadow-[0_0_8px_white]'
                      : 'bg-white/80 border border-black/40 hover:bg-white'
                  }`}
                >
                  <div
                    className={`w-1 h-1 rounded-full ${
                      isActive ? 'bg-white' : 'bg-black/80'
                    }`}
                  />
                </button>

                {/* Tooltip badge */}
                <div
                  className={`absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-200 pointer-events-none ${
                    isHovered || isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-1 pointer-events-none'
                  }`}
                >
                  <div className="glass-panel-accent px-2.5 py-1 rounded-md flex flex-col gap-0.5 shadow-xl border border-white/15 backdrop-blur-md">
                    <span className="text-[8px] font-mono text-[#3B97FF] uppercase tracking-wider font-semibold">
                      {hotspot.category}
                    </span>
                    <span className="text-[11px] font-bold text-white tracking-wide">
                      {hotspot.title}
                    </span>
                  </div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
