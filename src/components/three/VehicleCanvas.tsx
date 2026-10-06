import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, useProgress } from '@react-three/drei';
import { BmwModel } from './BmwModel';
import { VehicleLighting } from './VehicleLighting';
import { StudioFloor } from './StudioFloor';
import { ScrollCameraController } from './ScrollCameraController';
import { HotspotPins } from './HotspotPins';
import { HOTSPOTS } from '../../data/hotspotsData';
import { VehicleColor, HotspotItem } from '../../types';
import * as THREE from 'three';

interface ScrollState {
  explodedFactor: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  stageLabel: number;
}

interface VehicleCanvasProps {
  headlightsOn: boolean;
  activeColor: VehicleColor;
  scrollStateRef: React.MutableRefObject<ScrollState>;
  selectedHotspot: HotspotItem | null;
  onSelectHotspot: (hotspot: HotspotItem) => void;
  showHotspots: boolean;
  enableFreeControls: boolean;
  revealProgress: number;
  reducedMotion?: boolean;
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

// Inner helper component to sync Drei's true asset loading progress
function ProgressReporter({ onProgress }: { onProgress?: (progress: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => {
    if (onProgress) {
      onProgress(progress);
    }
  }, [progress, onProgress]);
  return null;
}

export const VehicleCanvas: React.FC<VehicleCanvasProps> = ({
  headlightsOn,
  activeColor,
  scrollStateRef,
  selectedHotspot,
  onSelectHotspot,
  showHotspots,
  enableFreeControls,
  revealProgress,
  reducedMotion = false,
  onProgress,
  onLoaded
}) => {
  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows="soft"
        dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1.0 : 1.35]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{ position: [2.8, 1.2, 3.8], fov: 40, near: 0.1, far: 80 }}
        performance={{ min: 0.5 }}
      >
        {/* Track genuine GLTF / Drei loading progress */}
        <ProgressReporter onProgress={onProgress} />

        {/* Deep black studio background with subtle horizon fog */}
        <color attach="background" args={['#040406']} />
        <fog attach="fog" args={['#040406', 16, 42]} />

        {/* Studio HDRI Environment for realistic metallic paint reflections */}
        <Environment preset="night" environmentIntensity={0.55} />

        <Suspense fallback={null}>
          <VehicleLighting
            headlightsOn={headlightsOn}
            revealProgress={revealProgress}
          />

          <StudioFloor />

          <BmwModel
            headlightsOn={headlightsOn}
            activeColor={activeColor}
            scrollStateRef={scrollStateRef}
            selectedHotspotId={selectedHotspot?.id || null}
            reducedMotion={reducedMotion}
            onLoaded={onLoaded}
          />

          {showHotspots && (
            <HotspotPins
              hotspots={HOTSPOTS}
              activeHotspotId={selectedHotspot?.id || null}
              onSelectHotspot={onSelectHotspot}
              visible={showHotspots}
            />
          )}

          <ScrollCameraController
            scrollStateRef={scrollStateRef}
            selectedHotspot={selectedHotspot}
            enableFreeControls={enableFreeControls}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
