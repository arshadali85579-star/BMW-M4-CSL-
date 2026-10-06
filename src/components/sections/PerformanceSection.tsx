import React from 'react';
import { Gauge, Zap, Trophy, Weight, Flame, Timer } from 'lucide-react';
import { COLOR_OPTIONS, VEHICLE_DETAILS } from '../../data/vehicleData';
import { VehicleColor } from '../../types';
import { soundManager } from '../../utils/audio';

interface PerformanceSectionProps {
  activeColor: VehicleColor;
  onSelectColor: (color: VehicleColor) => void;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  activeColor,
  onSelectColor
}) => {
  const metrics = [
    {
      label: 'Maximum Power',
      value: VEHICLE_DETAILS.powerOutput,
      subtext: '@ 6,250 rpm (+40 hp over M4 Comp)',
      icon: Zap,
      color: '#3B97FF'
    },
    {
      label: 'Acceleration (0–100 km/h)',
      value: VEHICLE_DETAILS.acceleration0to100,
      subtext: '0–200 km/h in 10.7 seconds',
      icon: Timer,
      color: '#1675D1'
    },
    {
      label: 'Nürburgring Nordschleife',
      value: VEHICLE_DETAILS.nurburgringTime,
      subtext: 'Fastest series-production BMW in history',
      icon: Trophy,
      color: '#E7222E'
    },
    {
      label: 'Lightweight Mass Reduction',
      value: VEHICLE_DETAILS.curbWeight,
      subtext: '-100 kg carbon-fiber intensive diet',
      icon: Weight,
      color: '#3B97FF'
    },
    {
      label: 'Peak Engine Torque',
      value: VEHICLE_DETAILS.torque,
      subtext: 'Plateau across 2,750 – 5,950 rpm',
      icon: Flame,
      color: '#1675D1'
    },
    {
      label: 'Top Track Velocity',
      value: VEHICLE_DETAILS.topSpeed,
      subtext: 'M Driver’s Package standard regulation',
      icon: Gauge,
      color: '#E7222E'
    }
  ];

  return (
    <section id="performance" className="relative min-h-screen py-24 px-6 flex flex-col justify-center pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#E7222E] animate-pulse" />
              <span className="text-[11px] font-mono text-[#E7222E] uppercase tracking-[0.25em] font-semibold">
                Motorsport Benchmarks
              </span>
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-white uppercase tracking-tight">
              Pure Track Telemetry
            </h2>
            <p className="text-xs md:text-sm text-[#A4A4A4] max-w-xl mt-1">
              Every millisecond and kilogram shaved in pursuit of uncompromising handling agility.
            </p>
          </div>

          {/* Interactive Paint Customizer Bar */}
          <div className="glass-panel-accent p-4 rounded-2xl flex flex-col gap-2 border border-white/10 shadow-xl">
            <span className="text-[10px] font-mono text-[#A4A4A4] uppercase tracking-wider">
              Selected Exterior Finish: <strong className="text-white">{activeColor.name}</strong>
            </span>
            <div className="flex items-center gap-2.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => {
                    soundManager.playClick();
                    onSelectColor(c);
                  }}
                  title={c.name}
                  className={`w-7 h-7 rounded-full transition-all duration-300 relative flex items-center justify-center ${
                    activeColor.name === c.name
                      ? 'ring-2 ring-white scale-110 shadow-lg'
                      : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {activeColor.name === c.name && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#A4A4A4]">
                    {item.label}
                  </span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform"
                    style={{ color: item.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="text-3xl md:text-4xl font-black font-mono text-white tracking-tight mb-1">
                  {item.value}
                </div>

                <div className="text-[11px] font-mono text-[#626875]">
                  {item.subtext}
                </div>
              </div>
            );
          })}
        </div>

        {/* Limited Production Banner */}
        <div className="glass-panel-accent p-6 rounded-2xl border border-[#E7222E]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#E7222E]/20 flex items-center justify-center text-[#E7222E] shrink-0">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white uppercase tracking-wider">
                Exclusivity: 1 of 1,000 Vehicles Worldwide
              </h4>
              <p className="text-xs text-[#A4A4A4]">
                Manufactured at BMW Group Plant Dingolfing in an intensely limited single-model-year production run.
              </p>
            </div>
          </div>

          <div className="font-mono text-xs text-[#E7222E] font-bold tracking-widest uppercase bg-[#E7222E]/10 px-4 py-2 rounded-xl border border-[#E7222E]/20 shrink-0">
            Collector Heritage
          </div>
        </div>
      </div>
    </section>
  );
};
