import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { VehicleCanvas } from './components/three/VehicleCanvas';
import { LoadingScreen } from './components/three/LoadingScreen';
import { Navbar } from './components/navigation/Navbar';
import { VehicleExperienceSection } from './components/sections/VehicleExperienceSection';
import { HotspotsSection } from './components/sections/HotspotsSection';
import { HotspotModal } from './components/sections/HotspotModal';
import { PerformanceSection } from './components/sections/PerformanceSection';
import { SpecificationsSection } from './components/sections/SpecificationsSection';
import { Footer } from './components/sections/Footer';
import { COLOR_OPTIONS } from './data/vehicleData';
import { VehicleColor, HotspotItem } from './types';
import { soundManager } from './utils/audio';

gsap.registerPlugin(ScrollTrigger);

// ─── High-Frequency Ref State (Bypasses React Re-renders During 3D Animation) ─
interface ScrollState {
  explodedFactor: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  stageLabel: number;
}

export const App: React.FC = () => {
  // ── Asset Loading State ───────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(12);
  const [modelReady, setModelReady] = useState(false);

  // ── Vehicle Interactive State ─────────────────────────────────────────────
  const [headlightsOn, setHeadlightsOn] = useState(false);
  const [activeColor, setActiveColor] = useState<VehicleColor>(COLOR_OPTIONS[0]);
  const [revealProgress, setRevealProgress] = useState(0);
  const [enableFreeControls, setEnableFreeControls] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ── Active Section & Narrative Stages ─────────────────────────────────────
  const [activeSection, setActiveSection] = useState('hero');
  const [stageLabel, setStageLabel] = useState(0);
  const [choreographyStage, setChoreographyStage] = useState(1);
  const [explodedFactorDisplay, setExplodedFactorDisplay] = useState(0);

  // ── Hotspot Inspection State ──────────────────────────────────────────────
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotItem | null>(null);

  // ── 3D Scene Reference Vector (Updated directly by GSAP ticker) ───────────
  const scrollStateRef = useRef<ScrollState>({
    explodedFactor: 0,
    camPos: [2.8, 1.2, 3.8],
    camTarget: [0, 0.65, 0],
    stageLabel: 0
  });

  // GSAP tween proxy bridge
  const gsapProxy = useRef({
    explodedFactor: 0,
    camPosX: 2.8,
    camPosY: 1.2,
    camPosZ: 3.8,
    camTargetX: 0,
    camTargetY: 0.65,
    camTargetZ: 0,
  });

  const pinWrapRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Throttling refs to prevent unnecessary React re-renders during high-frequency scroll
  const lastDisplayedFactorRef = useRef(-1);
  const lastStageLabelRef = useRef(-1);
  const hasExplodedAudioTriggeredRef = useRef(false);

  // Single Authoritative Synchronization Path: GSAP proxy -> scrollStateRef
  const syncFromProxy = useCallback(() => {
    const p = gsapProxy.current;
    scrollStateRef.current.explodedFactor = p.explodedFactor;
    scrollStateRef.current.camPos = [p.camPosX, p.camPosY, p.camPosZ];
    scrollStateRef.current.camTarget = [p.camTargetX, p.camTargetY, p.camTargetZ];

    // Audio explosion guard: triggers once when crossing 0.08, resets below 0.02
    if (p.explodedFactor > 0.08 && !hasExplodedAudioTriggeredRef.current) {
      hasExplodedAudioTriggeredRef.current = true;
      soundManager.playExplode();
    } else if (p.explodedFactor < 0.02) {
      hasExplodedAudioTriggeredRef.current = false;
    }

    // Only update React state when the displayed integer percentage changes
    const rounded = Math.round(p.explodedFactor * 100);
    if (rounded !== lastDisplayedFactorRef.current) {
      lastDisplayedFactorRef.current = rounded;
      setExplodedFactorDisplay(rounded);
    }
  }, []);

  // ── Accessibility: prefers-reduced-motion listener ────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // ── Lenis Smooth Scrolling Integrated with GSAP Ticker ───────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Single tuned motion pipeline: responsive lerp (0.14) without delayed drag
    const lenis = new Lenis({
      duration: reducedMotion ? 0.3 : 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, [reducedMotion]);

  // ── Real Asset Loading Listener ───────────────────────────────────────────
  const handleDreiProgress = useCallback((p: number) => {
    setLoadProgress((prev) => Math.max(prev, Math.round(p)));
  }, []);

  const handleModelLoaded = useCallback(() => {
    setModelReady(true);
    setLoadProgress(100);
    setTimeout(() => {
      setLoading(false);
      // Cinematic studio reveal: illumination sweep
      gsap.to({ v: 0 }, {
        v: 1,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate: function () {
          const val = this.targets()[0].v as number;
          setRevealProgress(val);
          if (val > 0.65) {
            setHeadlightsOn(true);
          }
        }
      });
    }, 450);
  }, []);

  // ── GSAP ScrollTrigger Timeline for Pinned Explode & Reassemble ───────────
  useEffect(() => {
    if (!modelReady || !pinWrapRef.current) return;

    const ctx = gsap.context(() => {
      const proxy = gsapProxy.current;

      // Root ScrollTrigger drives the entire scrub (scrub: 0.6 for responsive follow)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapRef.current,
          start: 'top top',
          end: '+=400%',
          pin: true,
          scrub: reducedMotion ? 0.2 : 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            const nextStage =
              p < 0.15 ? 0 :
              p < 0.35 ? 1 :
              p < 0.55 ? 2 :
              p < 0.75 ? 3 : 4;

            if (nextStage !== lastStageLabelRef.current) {
              lastStageLabelRef.current = nextStage;
              setStageLabel(nextStage);
            }

            syncFromProxy();
          }
        }
      });

      // Child tweens define keyframe targets without redundant onUpdate callbacks
      // STAGE 0 -> 0.15: Fully Assembled Front Three-Quarter
      tl.to(proxy, {
        camPosX: 3.2, camPosY: 1.25, camPosZ: 3.6,
        camTargetX: 0, camTargetY: 0.65, camTargetZ: 0,
        explodedFactor: 0,
        duration: 0.15,
        ease: 'none',
      }, 0);

      // STAGE 0.15 -> 0.35: Camera sweeps in, wheels separate laterally on Z
      tl.to(proxy, {
        camPosX: 2.4, camPosY: 1.1, camPosZ: 2.9,
        camTargetX: 0.3, camTargetY: 0.65, camTargetZ: 0,
        explodedFactor: 0.30,
        duration: 0.20,
        ease: 'none',
      }, 0.15);

      // STAGE 0.35 -> 0.60: Canopy & carbon roof lift upward on Y, bonnet separates
      tl.to(proxy, {
        camPosX: 3.6, camPosY: 2.1, camPosZ: 3.4,
        camTargetX: 0, camTargetY: 0.75, camTargetZ: 0,
        explodedFactor: 0.65,
        duration: 0.25,
        ease: 'none',
      }, 0.35);

      // STAGE 0.60 -> 0.80: Maximum Technical Explosion
      tl.to(proxy, {
        camPosX: 4.2, camPosY: 2.6, camPosZ: 3.8,
        camTargetX: 0, camTargetY: 0.6, camTargetZ: 0,
        explodedFactor: 1.0,
        duration: 0.20,
        ease: 'none',
      }, 0.60);

      // STAGE 0.80 -> 1.00: Rear sweep revealing M Carbon Ducktail & Laser Thread filaments
      tl.to(proxy, {
        camPosX: -3.8, camPosY: 2.2, camPosZ: -3.4,
        camTargetX: -0.5, camTargetY: 0.55, camTargetZ: 0,
        explodedFactor: 1.0,
        duration: 0.20,
        ease: 'none',
      }, 0.80);
    });

    return () => {
      ctx.revert();
    };
  }, [modelReady, syncFromProxy, reducedMotion]);

  // ── Native ScrollTrigger Section Tracking (Accurate across all pins) ───────
  useEffect(() => {
    if (!modelReady) return;

    const sections = [
      { id: 'hero', name: 'hero' },
      { id: 'experience', name: 'experience' },
      { id: 'exploded', name: 'exploded' },
      { id: 'hotspots', name: 'hotspots' },
      { id: 'performance', name: 'performance' },
      { id: 'specifications', name: 'specifications' },
    ];

    const triggers: ScrollTrigger[] = [];

    sections.forEach(({ id, name }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveSection(name),
        onEnterBack: () => setActiveSection(name),
      });
      triggers.push(st);
    });

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [modelReady]);

  // ── Smooth Navigation Handler ─────────────────────────────────────────────
  const handleNavigate = (id: string) => {
    soundManager.playClick();
    if (id === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'exploded') {
      pinWrapRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // ── Design Stage Choreography Selector ────────────────────────────────────
  const handleSetExperienceStage = (stageId: number) => {
    setChoreographyStage(stageId);
    soundManager.playClick();
    const proxy = gsapProxy.current;
    let targetX = 3.2, targetY = 1.25, targetZ = 3.6;
    let lookX = 0, lookY = 0.65, lookZ = 0;

    if (stageId === 1) { // Front Stance
      targetX = 3.8; targetY = 1.1; targetZ = 0.0;
      lookX = 1.0; lookY = 0.6; lookZ = 0.0;
    } else if (stageId === 2) { // 3/4 Muscular
      targetX = 3.2; targetY = 1.25; targetZ = 3.4;
      lookX = 0.2; lookY = 0.65; lookZ = 0.0;
    } else if (stageId === 3) { // Low-Slung Silhouette
      targetX = 0.0; targetY = 1.1; targetZ = 4.6;
      lookX = 0.0; lookY = 0.65; lookZ = 0.0;
    } else if (stageId === 4) { // Rear Aerodynamics
      targetX = -3.6; targetY = 1.35; targetZ = -2.8;
      lookX = -1.0; lookY = 0.7; lookZ = 0.0;
    }

    gsap.to(proxy, {
      camPosX: targetX, camPosY: targetY, camPosZ: targetZ,
      camTargetX: lookX, camTargetY: lookY, camTargetZ: lookZ,
      duration: reducedMotion ? 0.4 : 1.2,
      ease: 'power2.out',
      onUpdate: syncFromProxy
    });
  };

  // ── Hotspot Selection & Inspection Handlers ───────────────────────────────
  const handleSelectHotspot = (hotspot: HotspotItem) => {
    soundManager.playClick();
    setSelectedHotspot(hotspot);
    setEnableFreeControls(false);
  };

  const handleCloseHotspot = () => {
    soundManager.playClick();
    setSelectedHotspot(null);
  };

  // ── Headlights Toggle Handler ─────────────────────────────────────────────
  const handleToggleHeadlights = () => {
    soundManager.playHeadlights();
    setHeadlightsOn(!headlightsOn);
    if (!headlightsOn) {
      setRevealProgress(1.0);
    }
  };

  // Narrative descriptions per explosion stage
  const stageTexts = [
    {
      badge: 'STAGE 01 // ASSEMBLED',
      title: 'BMW M4 CSL',
      sub: 'Competition Sport Lightweight — 1 of 1,000 Limited Production',
      desc: '543 hp • 650 Nm • 3.7 s 0–100 km/h • 7:15.677 Nürburgring Nordschleife Benchmark'
    },
    {
      badge: 'STAGE 02 // SEPARATION BEGINS',
      title: 'Forged Running Gear & Ceramic Brakes',
      sub: 'Style 827M 19"/20" Alloys + M Carbon Ceramic Rotors',
      desc: 'Four wheel assemblies and brake calipers separating cleanly outward along the lateral axle track.'
    },
    {
      badge: 'STAGE 03 // BODY & CANOPY LIFT',
      title: 'CFRP Aerodynamic Monocoque',
      sub: 'Carbon-Fiber Reinforced Plastic Canopy & Double-Bubble Roof',
      desc: 'Exterior aerodynamic panels and tinted glasshouse canopy elevating to expose cockpit architecture.'
    },
    {
      badge: 'STAGE 04 // FULL TECHNICAL EXPLODE',
      title: 'Complete Vehicle Architecture',
      sub: 'Integrated Ducktail Aerofoil • Splitters • Chassis • Wheels',
      desc: 'Fully expanded technical engineering composition revealing chassis geometry and running components.'
    },
    {
      badge: 'STAGE 05 // REAR SIGNATURE',
      title: 'M Carbon Ducktail & Laser Taillights',
      sub: 'Glass-Fiber Laser Thread Optical Filaments',
      desc: 'Rear aerodynamic tailgate downforce lip and signature 3D illuminated optical laser threads.'
    }
  ];

  const currentText = stageTexts[stageLabel] ?? stageTexts[0];

  return (
    <div ref={scrollContainerRef} className="relative bg-[#050505] text-white selection:bg-[#1675D1]">
      {/* ── Cinematic Loading Overlay ────────────────────────────────────────── */}
      {loading && <LoadingScreen progress={loadProgress} />}

      {/* ── Fixed Sticky Navigation (All 6 sections verified) ────────────────── */}
      <Navbar
        activeSection={activeSection}
        activeColor={activeColor}
        onSelectColor={(c) => {
          soundManager.playClick();
          setActiveColor(c);
        }}
        enableFreeControls={enableFreeControls}
        onToggleFreeControls={() => {
          soundManager.playClick();
          setEnableFreeControls(!enableFreeControls);
        }}
        onNavigate={handleNavigate}
      />

      {/* ── Fixed 3D Viewport (Always visible, never obscured) ──────────────── */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <VehicleCanvas
          headlightsOn={headlightsOn}
          activeColor={activeColor}
          scrollStateRef={scrollStateRef}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={handleSelectHotspot}
          showHotspots={activeSection === 'hotspots' || selectedHotspot !== null}
          enableFreeControls={enableFreeControls}
          revealProgress={revealProgress}
          reducedMotion={reducedMotion}
          onProgress={handleDreiProgress}
          onLoaded={handleModelLoaded}
        />
      </div>

      {/* ── 01. HERO REVEAL SECTION ─────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative z-10 min-h-screen flex flex-col justify-end pb-16 px-6 md:px-16 pointer-events-none bg-transparent"
      >
        <div className="max-w-2xl pointer-events-none">
          {/* Brand Accent */}
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12 bg-[#1675D1]" />
            <span className="text-[11px] font-mono tracking-[0.3em] text-[#3B97FF] uppercase font-bold">
              Competition Sport Lightweight
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white uppercase leading-none mb-4">
            BMW<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1675D1] via-[#3B97FF] to-[#E7222E]">
              M4 CSL
            </span>
          </h1>

          <p className="text-sm md:text-base text-white/75 font-light max-w-lg leading-relaxed mb-6">
            Electrified agility and pure motorsport DNA. Engineered with an obsessive 100 kg carbon-fiber diet to conquer the Nürburgring Nordschleife in 7:15.677.
          </p>

          {/* Quick Metrics & Controls Strip */}
          <div className="flex flex-wrap items-center gap-4 glass-panel px-5 py-3.5 rounded-2xl border border-white/10 pointer-events-auto shadow-2xl">
            <div className="text-left pr-3 border-r border-white/10">
              <div className="text-base md:text-xl font-mono font-black text-white">543 HP</div>
              <div className="text-[9px] font-mono text-[#A4A4A4] uppercase tracking-wider">TwinPower Turbo</div>
            </div>
            <div className="text-left pr-3 border-r border-white/10">
              <div className="text-base md:text-xl font-mono font-black text-[#3B97FF]">3.7 s</div>
              <div className="text-[9px] font-mono text-[#A4A4A4] uppercase tracking-wider">0–100 km/h</div>
            </div>
            <div className="text-left pr-3 border-r border-white/10">
              <div className="text-base md:text-xl font-mono font-black text-[#E7222E]">7:15.677</div>
              <div className="text-[9px] font-mono text-[#A4A4A4] uppercase tracking-wider">Nordschleife</div>
            </div>

            {/* Interactive Headlight Toggle */}
            <button
              onClick={handleToggleHeadlights}
              className={`text-xs font-mono px-3.5 py-2 rounded-xl transition-all ${
                headlightsOn
                  ? 'bg-[#FFE57F] text-black font-bold shadow-lg shadow-[#FFE57F]/30 scale-105'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {headlightsOn ? '⚡ Laserlights ON' : '⚡ Ignite Lights'}
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={() => handleNavigate('experience')}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce pointer-events-auto cursor-pointer group"
        >
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#626875] group-hover:text-[#3B97FF] uppercase transition-colors">
            Scroll to Explore Design ↓
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-[#1675D1] to-transparent" />
        </button>
      </section>

      {/* ── 02. DESIGN / VEHICLE EXPERIENCE SECTION ─────────────────────────── */}
      <div id="experience" className="relative z-10 bg-transparent">
        <VehicleExperienceSection
          currentStage={choreographyStage}
          onSetStage={handleSetExperienceStage}
        />
      </div>

      {/* ── 03. PINNED EXPLODED VIEW SECTION ────────────────────────────────── */}
      <div
        ref={pinWrapRef}
        id="exploded"
        className="relative z-10 h-screen overflow-hidden bg-transparent pointer-events-none"
      >
        {/* Stage Narrative Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col md:flex-row items-end md:items-center justify-between px-6 md:px-16 pb-12 md:pb-8 pointer-events-none gap-4">
          <div className="max-w-md pointer-events-auto glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#3B97FF] animate-pulse" />
              <span className="text-[10px] font-mono text-[#3B97FF] uppercase tracking-widest font-semibold">
                {currentText.badge}
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">
              {currentText.title}
            </h2>
            <p className="text-xs font-mono text-[#A4A4A4] mt-1">{currentText.sub}</p>
            <p className="text-xs text-white/70 mt-2 leading-relaxed">{currentText.desc}</p>
          </div>

          {/* Separation Progress Meter & Paint Swatches */}
          <div className="flex flex-col items-end gap-2 pointer-events-auto glass-panel p-4 rounded-2xl border border-white/10">
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#A4A4A4] uppercase tracking-wider">Separation Vector</span>
              <div className="text-2xl font-mono font-black text-[#3B97FF]">
                {explodedFactorDisplay}<span className="text-sm text-[#626875]">%</span>
              </div>
            </div>
            <div className="w-36 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1675D1] via-[#3B97FF] to-[#E7222E] rounded-full transition-none"
                style={{ width: `${explodedFactorDisplay}%` }}
              />
            </div>

            {/* Quick Paint Finish Picker */}
            <div className="flex items-center gap-1.5 mt-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  onClick={() => {
                    soundManager.playClick();
                    setActiveColor(c);
                  }}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    activeColor.name === c.name ? 'border-white scale-125 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stage Dots Indicator */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 pointer-events-none">
          {[0, 1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-1.5 rounded-full transition-all duration-500 ${
                stageLabel === s ? 'h-6 bg-white' : 'h-1.5 bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── 04. INTERACTIVE HOTSPOTS SECTION ─────────────────────────────────── */}
      <div id="hotspots" className="relative z-10 bg-transparent">
        <HotspotsSection
          onSelectHotspot={handleSelectHotspot}
          activeHotspotId={selectedHotspot?.id || null}
        />
      </div>

      {/* ── 05. PERFORMANCE & TELEMETRY SECTION ─────────────────────────────── */}
      <div id="performance" className="relative z-10 bg-[#050505]/85 backdrop-blur-lg border-t border-white/10">
        <PerformanceSection
          activeColor={activeColor}
          onSelectColor={(c) => {
            soundManager.playClick();
            setActiveColor(c);
          }}
        />
      </div>

      {/* ── 06. FACTORY SPECIFICATIONS SECTION ───────────────────────────────── */}
      <div id="specifications" className="relative z-10 bg-[#08090C]/90 backdrop-blur-xl border-t border-white/5">
        <SpecificationsSection />
      </div>

      {/* ── 07. LUXURY AUTOMOTIVE FOOTER ─────────────────────────────────────── */}
      <div className="relative z-10 bg-[#050505]">
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* ── TECHNICAL DOSSIER INSPECTION MODAL DRAWER ────────────────────────── */}
      <HotspotModal
        hotspot={selectedHotspot}
        onClose={handleCloseHotspot}
        onSelectHotspot={handleSelectHotspot}
      />
    </div>
  );
};

export default App;
