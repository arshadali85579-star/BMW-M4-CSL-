import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { HotspotItem } from '../../types';
import { HOTSPOTS } from '../../data/hotspotsData';
import { soundManager } from '../../utils/audio';

interface HotspotModalProps {
  hotspot: HotspotItem | null;
  onClose: () => void;
  onSelectHotspot: (hotspot: HotspotItem) => void;
}

export const HotspotModal: React.FC<HotspotModalProps> = ({
  hotspot,
  onClose,
  onSelectHotspot
}) => {
  // Support Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!hotspot) return null;

  const currentIndex = HOTSPOTS.findIndex((h) => h.id === hotspot.id);
  const prevHotspot = HOTSPOTS[(currentIndex - 1 + HOTSPOTS.length) % HOTSPOTS.length];
  const nextHotspot = HOTSPOTS[(currentIndex + 1) % HOTSPOTS.length];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end md:items-center justify-end p-4 md:p-10">
      <div className="pointer-events-auto w-full max-w-lg glass-panel-accent p-6 md:p-8 rounded-3xl shadow-2xl border border-white/15 backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-8 md:slide-in-from-right-8 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3B97FF] animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#3B97FF] font-bold">
              Engineering Inspection // {hotspot.category}
            </span>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#A4A4A4] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-4">
          <h3 className="text-2xl font-black text-white tracking-wide mb-1">
            {hotspot.title}
          </h3>
          <p className="text-xs font-mono text-[#A4A4A4] tracking-wider uppercase">
            {hotspot.subtitle}
          </p>
        </div>

        {/* Detailed Engineering Description */}
        <p className="text-xs md:text-sm text-white/80 leading-relaxed mb-6">
          {hotspot.description}
        </p>

        {/* Technical Specs Table */}
        <div className="bg-black/40 rounded-xl p-4 mb-6 border border-white/5 space-y-2.5">
          <div className="text-[10px] font-mono text-[#626875] uppercase tracking-wider mb-2 font-semibold">
            Verified Factory Specifications
          </div>
          {hotspot.specs.map((spec, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-xs font-mono border-b border-white/5 pb-1.5 last:border-0 last:pb-0"
            >
              <span className="text-[#A4A4A4] flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 text-[#1675D1]" />
                {spec.label}
              </span>
              <span className="text-white font-bold text-right">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Controls: Next/Prev & Return to Vehicle */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onSelectHotspot(prevHotspot);
              }}
              title={`Previous: ${prevHotspot.title}`}
              className="p-2 rounded-xl glass-panel text-[#A4A4A4] hover:text-white hover:border-white/30 transition-all flex items-center gap-1 text-xs font-mono"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onSelectHotspot(nextHotspot);
              }}
              title={`Next: ${nextHotspot.title}`}
              className="p-2 rounded-xl glass-panel text-[#A4A4A4] hover:text-white hover:border-white/30 transition-all flex items-center gap-1 text-xs font-mono"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-white/90 text-black text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-lg hover:scale-105"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Return to Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};
