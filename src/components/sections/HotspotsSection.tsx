import React, { useState } from 'react';
import { Target, Search, ArrowUpRight } from 'lucide-react';
import { HOTSPOTS } from '../../data/hotspotsData';
import { HotspotItem } from '../../types';
import { soundManager } from '../../utils/audio';

interface HotspotsSectionProps {
  onSelectHotspot: (hotspot: HotspotItem) => void;
  activeHotspotId: string | null;
}

export const HotspotsSection: React.FC<HotspotsSectionProps> = ({
  onSelectHotspot,
  activeHotspotId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Components' },
    { id: 'aerodynamics', label: 'Aerodynamics' },
    { id: 'powertrain', label: 'Powertrain' },
    { id: 'chassis', label: 'Chassis & Brakes' },
    { id: 'interior', label: 'Cockpit' },
    { id: 'exterior', label: 'Optics & Exterior' }
  ];

  const filteredHotspots = activeCategory === 'all'
    ? HOTSPOTS
    : HOTSPOTS.filter((h) => h.category === activeCategory);

  return (
    <section id="hotspots" className="relative min-h-screen py-24 px-6 flex flex-col justify-between pointer-events-none">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-[#3B97FF]" />
          <span className="text-[11px] font-mono text-[#3B97FF] uppercase tracking-[0.25em] font-semibold">
            Interactive 3D Component Inspection
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
          Precision Hotspots & Technical Close-Ups
        </h2>
        <p className="text-xs md:text-sm text-[#A4A4A4] max-w-xl">
          Click any white pulse marker directly on the 3D model, or select an engineering focal point below to execute a cinematic camera close-up.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'glass-panel text-[#A4A4A4] hover:text-white hover:border-white/30'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Horizontal Hotspots Carousel / Grid */}
      <div className="max-w-7xl mx-auto w-full pointer-events-auto mt-auto pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredHotspots.slice(0, 4).map((hotspot) => {
            const isActive = activeHotspotId === hotspot.id;
            return (
              <button
                key={hotspot.id}
                onClick={() => {
                  soundManager.playClick();
                  onSelectHotspot(hotspot);
                }}
                className={`group text-left p-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'glass-panel-accent border-[#1675D1] scale-105'
                    : 'glass-panel hover:border-white/30 hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#3B97FF] font-semibold">
                    {hotspot.category}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#A4A4A4] group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-wide mb-1 group-hover:text-[#3B97FF] transition-colors">
                  {hotspot.title}
                </h4>
                <p className="text-[11px] text-[#A4A4A4] line-clamp-2 leading-relaxed">
                  {hotspot.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-[#626875] px-1">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-[#3B97FF]" />
            Select any item to trigger real-time 3D camera re-targeting
          </span>
          <span className="text-[#A4A4A4]">
            Showing {filteredHotspots.length} verified hotspots
          </span>
        </div>
      </div>
    </section>
  );
};
