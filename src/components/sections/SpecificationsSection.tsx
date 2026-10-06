import React, { useState } from 'react';
import { FileText, Cpu, Feather, Wrench, Box } from 'lucide-react';
import { TECHNICAL_SPECIFICATIONS } from '../../data/vehicleData';
import { soundManager } from '../../utils/audio';

export const SpecificationsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const icons = [Cpu, Feather, Wrench, Box];

  return (
    <section id="specifications" className="relative min-h-screen py-24 px-6 flex flex-col justify-center pointer-events-none">
      <div className="max-w-7xl mx-auto w-full pointer-events-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[#3B97FF]" />
            <span className="text-[11px] font-mono text-[#3B97FF] uppercase tracking-[0.25em] font-semibold">
              Verified Technical Dossier
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
            Factory Specifications
          </h2>
          <p className="text-xs md:text-sm text-[#A4A4A4] max-w-xl mt-1">
            Official engineering data confirmed for the series-production BMW M4 CSL chassis and powertrain architecture.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {TECHNICAL_SPECIFICATIONS.map((category, idx) => {
            const Icon = icons[idx] || Cpu;
            const isSelected = activeTab === idx;
            return (
              <button
                key={category.category}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(idx);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-white text-black font-bold shadow-lg'
                    : 'glass-panel text-[#A4A4A4] hover:text-white hover:border-white/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{category.category}</span>
              </button>
            );
          })}
        </div>

        {/* Specs Table Grid */}
        <div className="glass-panel-accent p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {TECHNICAL_SPECIFICATIONS[activeTab].items.map((item, idx) => (
              <div
                key={idx}
                className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-baseline justify-between gap-4 mb-1">
                  <span className="text-xs font-mono uppercase text-[#A4A4A4] tracking-wider">
                    {item.name}
                  </span>
                  <span className="text-sm font-bold font-mono text-white text-right">
                    {item.value}
                  </span>
                </div>
                {item.detail && (
                  <p className="text-[11px] text-[#626875] leading-relaxed">
                    {item.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
