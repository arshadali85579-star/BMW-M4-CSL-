import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Compass, Palette } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { COLOR_OPTIONS } from '../../data/vehicleData';
import { VehicleColor } from '../../types';

interface NavbarProps {
  activeSection: string;
  activeColor: VehicleColor;
  onSelectColor: (color: VehicleColor) => void;
  enableFreeControls: boolean;
  onToggleFreeControls: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  activeColor,
  onSelectColor,
  enableFreeControls,
  onToggleFreeControls,
  onNavigate
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [colorMenuOpen, setColorMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Reveal' },
    { id: 'experience', label: 'Design' },
    { id: 'exploded', label: 'Exploded View' },
    { id: 'hotspots', label: 'Hotspots' },
    { id: 'performance', label: 'Performance' },
    { id: 'specifications', label: 'Specs' }
  ];

  const handleAudioToggle = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.playClick();
    }
  };

  const handleNavItemClick = (id: string) => {
    soundManager.playClick();
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
          : 'bg-gradient-to-b from-[#050505]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Mark */}
        <button
          onClick={() => handleNavItemClick('hero')}
          className="flex items-center gap-3 group text-left"
        >
          {/* BMW M Stripes & Emblem */}
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-6 bg-[#3B97FF] -skew-x-12 rounded-sm" />
            <span className="w-1.5 h-6 bg-[#1675D1] -skew-x-12 rounded-sm" />
            <span className="w-1.5 h-6 bg-[#E7222E] -skew-x-12 rounded-sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-widest text-white group-hover:text-[#3B97FF] transition-colors">
                BMW M4
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E7222E] text-white font-bold tracking-wider">
                CSL
              </span>
            </div>
            <span className="text-[9px] font-mono text-[#A4A4A4] tracking-widest uppercase">
              Lightweight Special
            </span>
          </div>
        </button>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 glass-panel px-4 py-1.5 rounded-full">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-[#A4A4A4] hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Utility Controls */}
        <div className="flex items-center gap-3">
          {/* Color Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setColorMenuOpen(!colorMenuOpen);
                soundManager.playClick();
              }}
              title="Change Paint Finish"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel hover:border-white/30 text-xs font-mono text-white transition-all"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                style={{ backgroundColor: activeColor.hex }}
              />
              <span className="hidden lg:inline text-[11px] text-[#A4A4A4]">
                {activeColor.name}
              </span>
              <Palette className="w-3.5 h-3.5 text-[#A4A4A4]" />
            </button>

            {/* Dropdown Menu */}
            {colorMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-panel-accent p-2 rounded-xl shadow-2xl z-50 flex flex-col gap-1">
                <span className="text-[10px] font-mono text-[#A4A4A4] px-2 py-1 tracking-wider uppercase">
                  M Exterior Paint
                </span>
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      onSelectColor(c);
                      setColorMenuOpen(false);
                      soundManager.playClick();
                    }}
                    className={`flex items-center gap-3 px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                      activeColor.name === c.name
                        ? 'bg-[#1675D1]/30 text-white font-semibold'
                        : 'text-[#A4A4A4] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3D Free Rotate / Orbit Toggle */}
          <button
            onClick={() => {
              onToggleFreeControls();
              soundManager.playClick();
            }}
            title={enableFreeControls ? "Lock Camera to Story" : "Enable Free 360° Drag"}
            className={`p-2 rounded-full glass-panel transition-all ${
              enableFreeControls
                ? 'bg-[#1675D1] text-white border-[#3B97FF] shadow-lg shadow-[#1675D1]/30'
                : 'text-[#A4A4A4] hover:text-white hover:border-white/30'
            }`}
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={handleAudioToggle}
            title={isMuted ? "Unmute Studio Acoustics" : "Mute Studio Acoustics"}
            className="p-2 rounded-full glass-panel text-[#A4A4A4] hover:text-white hover:border-white/30 transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#3B97FF]" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full glass-panel text-[#A4A4A4] hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-accent mt-3 mx-4 p-4 rounded-2xl flex flex-col gap-2 border border-white/10 shadow-2xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavItemClick(item.id)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm font-mono uppercase tracking-wider transition-colors ${
                activeSection === item.id
                  ? 'bg-white text-black font-bold'
                  : 'text-[#A4A4A4] hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
