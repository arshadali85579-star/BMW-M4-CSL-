import React from 'react';
import { Shield, Sparkles, Wind, Gauge } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface VehicleExperienceSectionProps {
  currentStage: number;
  onSetStage: (stage: number) => void;
}

export const VehicleExperienceSection: React.FC<VehicleExperienceSectionProps> = ({
  currentStage,
  onSetStage
}) => {
  const stages = [
    {
      id: 1,
      title: 'Front Aerodynamic Stance',
      subtitle: 'Laserlight Optics & Minimalist Kidney Architecture',
      icon: Sparkles,
      description: 'Stripped of non-essential weight. The front fascia channels ambient airflow through enlarged dual apertures straight to the high-capacity radiators and twin turbo intercoolers.',
      keyStat: '650 m Beam Range'
    },
    {
      id: 2,
      title: 'Muscular 3/4 Track Contour',
      subtitle: 'Flared Arches & Staggered 19/20" Stance',
      icon: Shield,
      description: 'Wide wheel tracks with negative camber tuned at the Green Hell. The sculpted shoulder line leads eye movement along the carbon-fiber flank.',
      keyStat: '1,617 mm Track Width'
    },
    {
      id: 3,
      title: 'Low-Slung Lightweight Silhouette',
      subtitle: '100 kg Mass Diet & 50:50 Axle Distribution',
      icon: Gauge,
      description: 'The double-bubble CFRP roof drops the roll center by 12 mm. Every line adheres strictly to aerodynamic function rather than styling excess.',
      keyStat: '1,625 kg Total Curb Weight'
    },
    {
      id: 4,
      title: 'Rear Carbon Aerodynamics',
      subtitle: 'Integrated Ducktail & Laser Taillight Weave',
      icon: Wind,
      description: 'An integrated upswept ducktail spoiler generates significant high-speed rear axle downforce. Revolutionary laser taillight glass threads create an unmistakable night signature.',
      keyStat: '7:15.677 Nürburgring Record'
    }
  ];

  const activeStageData = stages.find((s) => s.id === (currentStage || 1)) || stages[0];
  const IconComponent = activeStageData.icon;

  return (
    <section id="experience" className="relative min-h-screen py-24 px-6 flex flex-col justify-center pointer-events-none">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-end justify-between gap-8">
        {/* Left Side: Camera Perspective Selectors */}
        <div className="pointer-events-auto space-y-3">
          <div className="text-[11px] font-mono text-[#3B97FF] uppercase tracking-[0.25em] font-semibold mb-2">
            3D Studio Choreography
          </div>
          <div className="flex flex-col gap-2">
            {stages.map((stage) => {
              const isSelected = (currentStage === stage.id) || (currentStage === 0 && stage.id === 1);
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    soundManager.playClick();
                    onSetStage(stage.id);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-mono transition-all duration-300 ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-lg shadow-white/10 scale-105 translate-x-2'
                      : 'glass-panel text-[#A4A4A4] hover:text-white hover:border-white/30'
                  }`}
                >
                  <span className="text-[10px] opacity-60">0{stage.id}</span>
                  <span>{stage.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Stage Editorial Card */}
        <div className="pointer-events-auto max-w-md w-full glass-panel-accent p-6 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1675D1]/20 flex items-center justify-center text-[#3B97FF]">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono text-[#3B97FF] uppercase tracking-wider font-semibold">
                Perspective 0{activeStageData.id} / 04
              </span>
            </div>
            <div className="text-[11px] font-mono font-bold text-white bg-white/10 px-2.5 py-1 rounded-full">
              {activeStageData.keyStat}
            </div>
          </div>

          <h3 className="text-xl font-bold text-white tracking-wide mb-1">
            {activeStageData.title}
          </h3>
          <p className="text-xs font-mono text-[#A4A4A4] uppercase tracking-wider mb-4">
            {activeStageData.subtitle}
          </p>

          <p className="text-xs text-white/80 leading-relaxed">
            {activeStageData.description}
          </p>
        </div>
      </div>
    </section>
  );
};
