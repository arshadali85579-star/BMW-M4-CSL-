import React from 'react';

interface LoadingScreenProps {
  progress: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ progress }) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-700">
      {/* Background Subtle Radial Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#1675D1]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* BMW Roundel Abstract Icon */}
        <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-white/20 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-1 rounded-full border-t-2 border-[#1675D1] animate-spin" style={{ animationDuration: '2s' }} />
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#101114] to-[#1F2228] flex items-center justify-center border border-white/10 shadow-lg">
            <span className="font-mono text-xs font-bold tracking-widest text-[#1675D1]">CSL</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold tracking-[0.25em] text-white uppercase mb-2">
          BMW M4 CSL
        </h2>
        <p className="text-xs font-mono text-[#A4A4A4] tracking-widest uppercase mb-8">
          Calibrating Digital Twin & 3D Shaders
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mb-3 relative">
          <div
            className="h-full bg-gradient-to-r from-[#1675D1] via-[#3B97FF] to-[#E7222E] transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>

        {/* Percentage Counter */}
        <div className="flex items-center justify-between w-64 text-[10px] font-mono text-[#626875]">
          <span>SYSTEM_INIT</span>
          <span className="text-[#3B97FF] font-semibold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};
