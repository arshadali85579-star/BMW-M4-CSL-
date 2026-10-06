import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, Shield } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [creditVisible, setCreditVisible] = useState(false);
  const creditRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setCreditVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCreditVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (creditRef.current) {
      observer.observe(creditRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#050505] border-t border-white/10 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto w-full space-y-10">
        {/* Top Tier */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-[#3B97FF] -skew-x-12" />
              <span className="w-1.5 h-5 bg-[#1675D1] -skew-x-12" />
              <span className="w-1.5 h-5 bg-[#E7222E] -skew-x-12" />
              <span className="text-lg font-black tracking-widest text-white uppercase">
                BMW M4 CSL
              </span>
            </div>
            <p className="text-xs font-mono text-[#A4A4A4] uppercase tracking-wider">
              Cinematic 3D WebGL Automotive Interactive Experience
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono uppercase tracking-wider text-[#A4A4A4]">
            <button onClick={() => onNavigate('hero')} className="hover:text-white transition-colors">
              Reveal
            </button>
            <button onClick={() => onNavigate('experience')} className="hover:text-white transition-colors">
              Design
            </button>
            <button onClick={() => onNavigate('exploded')} className="hover:text-white transition-colors">
              Exploded View
            </button>
            <button onClick={() => onNavigate('hotspots')} className="hover:text-white transition-colors">
              Hotspots
            </button>
            <button onClick={() => onNavigate('performance')} className="hover:text-white transition-colors">
              Performance
            </button>
            <button onClick={() => onNavigate('specifications')} className="hover:text-white transition-colors">
              Specs
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:border-white/40 text-xs font-mono uppercase tracking-wider text-white transition-all hover:scale-105"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5 text-[#3B97FF]" />
          </button>
        </div>

        {/* Professional Developer Credit Signature Bar */}
        <div
          ref={creditRef}
          className={`border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-700 ease-out ${
            creditVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Subtle M-Color Accent Line & Credit */}
          <div className="flex items-center gap-3 group select-none">
            <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="w-1 h-3.5 bg-[#3B97FF] -skew-x-12 rounded-sm" />
              <span className="w-1 h-3.5 bg-[#1675D1] -skew-x-12 rounded-sm" />
              <span className="w-1 h-3.5 bg-[#E7222E] -skew-x-12 rounded-sm" />
            </div>

            <div className="text-xs font-mono tracking-wider text-white/70 group-hover:text-white transition-colors">
              Designed &amp; Developed by{' '}
              <span className="font-semibold text-white tracking-widest group-hover:text-[#3B97FF] transition-colors relative inline-block">
                Sayyad Arshad
                <span className="absolute bottom-0 left-0 w-0 group-hover:w-full h-px bg-[#3B97FF] transition-all duration-300" />
              </span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-[#626875]">
            &copy; {new Date().getFullYear()} Cinematic 3D Automotive Showcase.
          </div>
        </div>

        {/* Legal Disclaimer & Compliance */}
        <div className="border-t border-white/5 pt-6 flex items-start gap-2 text-[11px] font-mono text-[#626875] leading-relaxed">
          <Shield className="w-4 h-4 text-[#1675D1] shrink-0 mt-0.5" />
          <span>
            Disclaimer: This website is an independent creative design &amp; WebGL portfolio demonstration concept honoring the BMW M4 CSL. It is not affiliated with, sponsored, or endorsed by Bayerische Motoren Werke AG (BMW).
          </span>
        </div>
      </div>
    </footer>
  );
};
