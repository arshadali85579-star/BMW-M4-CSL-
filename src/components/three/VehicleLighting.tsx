import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface VehicleLightingProps {
  headlightsOn: boolean;
  revealProgress: number; // 0 to 1
}

/**
 * Cinematic Studio Lighting Rig for BMW M4 CSL
 * Vehicle Coordinate System:
 *   X = Longitudinal: Front (+X: up to +2.25m) / Rear (-X: down to -2.25m)
 *   Y = Vertical: Ground (0.0m) / Roof (+1.32m)
 *   Z = Lateral: Left (+Z: up to +0.97m) / Right (-Z: down to -0.97m)
 */
export const VehicleLighting: React.FC<VehicleLightingProps> = ({
  headlightsOn,
  revealProgress
}) => {
  const spotLeftRef = useRef<THREE.SpotLight>(null);
  const spotRightRef = useRef<THREE.SpotLight>(null);
  const targetLeftRef = useRef<THREE.Object3D>(null);
  const targetRightRef = useRef<THREE.Object3D>(null);

  const overheadRef = useRef<THREE.DirectionalLight>(null);
  const fillFrontRef = useRef<THREE.DirectionalLight>(null);
  const rimLeftRef = useRef<THREE.DirectionalLight>(null);
  const rimRightRef = useRef<THREE.DirectionalLight>(null);
  const rearRimRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (spotLeftRef.current && targetLeftRef.current) {
      spotLeftRef.current.target = targetLeftRef.current;
    }
    if (spotRightRef.current && targetRightRef.current) {
      spotRightRef.current.target = targetRightRef.current;
    }
  }, []);

  useFrame((_, delta) => {
    const targetHeadlightIntensity = headlightsOn ? 5.5 * revealProgress : 0;
    if (spotLeftRef.current) {
      spotLeftRef.current.intensity = THREE.MathUtils.damp(
        spotLeftRef.current.intensity,
        targetHeadlightIntensity,
        6,
        delta
      );
    }
    if (spotRightRef.current) {
      spotRightRef.current.intensity = THREE.MathUtils.damp(
        spotRightRef.current.intensity,
        targetHeadlightIntensity,
        6,
        delta
      );
    }

    // Overhead studio softbox
    if (overheadRef.current) {
      const targetOverhead = 1.0 + 1.2 * revealProgress;
      overheadRef.current.intensity = THREE.MathUtils.damp(
        overheadRef.current.intensity,
        targetOverhead,
        4,
        delta
      );
    }

    // Front fill light
    if (fillFrontRef.current) {
      fillFrontRef.current.intensity = THREE.MathUtils.damp(
        fillFrontRef.current.intensity,
        0.85 * revealProgress,
        4,
        delta
      );
    }

    // Lateral rim lights
    if (rimLeftRef.current) {
      rimLeftRef.current.intensity = THREE.MathUtils.damp(
        rimLeftRef.current.intensity,
        0.75 * revealProgress,
        4,
        delta
      );
    }
    if (rimRightRef.current) {
      rimRightRef.current.intensity = THREE.MathUtils.damp(
        rimRightRef.current.intensity,
        0.95 * revealProgress,
        4,
        delta
      );
    }

    // Rear silhouette
    if (rearRimRef.current) {
      rearRimRef.current.intensity = THREE.MathUtils.damp(
        rearRimRef.current.intensity,
        0.7 * revealProgress,
        4,
        delta
      );
    }
  });

  return (
    <group>
      {/* Baseline Ambient Light */}
      <ambientLight intensity={0.25 + 0.35 * revealProgress} color="#ffffff" />

      {/* Main Overhead Softbox Light (Ceiling studio panel directly over car center) */}
      <directionalLight
        ref={overheadRef}
        position={[0, 9, 0]}
        intensity={0.6}
        color="#F4F8FC"
        castShadow
        shadow-mapSize={typeof window !== 'undefined' && window.innerWidth < 768 ? [512, 512] : [1024, 1024]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-4.5, 4.5, 4.5, -4.5, 0.1, 20]} />
      </directionalLight>

      {/* Front-Quarter Fill Light (Illuminates front nose & three-quarter flank) */}
      <directionalLight
        ref={fillFrontRef}
        position={[5, 3.5, 3.5]}
        intensity={0.6 * revealProgress}
        color="#E6F0FA"
      />

      {/* Left Lateral Rim Light (Subtle BMW M cyan-blue accent along left flank) */}
      <directionalLight
        ref={rimLeftRef}
        position={[0, 2.8, 5.5]}
        intensity={0.4}
        color="#8AB4F8"
      />

      {/* Right Lateral Crisp Rim Light (Clean white contouring along right flank) */}
      <directionalLight
        ref={rimRightRef}
        position={[0, 2.8, -5.5]}
        intensity={0.5}
        color="#FFFFFF"
      />

      {/* Rear Silhouette Highlight (Positioned behind rear bumper at negative X) */}
      <directionalLight
        ref={rearRimRef}
        position={[-6, 2.4, 0]}
        intensity={0.5 * revealProgress}
        color="#FF8A80"
      />

      {/* ── Headlight Projector Targets (Pointing forward along +X) ────────── */}
      <primitive object={new THREE.Object3D()} ref={targetLeftRef} position={[9.0, 0.05, 0.85]} />
      <primitive object={new THREE.Object3D()} ref={targetRightRef} position={[9.0, 0.05, -0.85]} />

      {/* ── Left Headlight Projector Beam ─────────────────────────────────── */}
      <spotLight
        ref={spotLeftRef}
        position={[1.95, 0.68, 0.62]}
        angle={Math.PI / 6}
        penumbra={0.65}
        intensity={0}
        color="#FFE57F" // BMW Motorsport Yellow DRL Laser
        distance={22}
      />

      {/* ── Right Headlight Projector Beam ────────────────────────────────── */}
      <spotLight
        ref={spotRightRef}
        position={[1.95, 0.68, -0.62]}
        angle={Math.PI / 6}
        penumbra={0.65}
        intensity={0}
        color="#FFE57F"
        distance={22}
      />
    </group>
  );
};
