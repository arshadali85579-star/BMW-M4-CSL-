import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { HotspotItem } from '../../types';

interface ScrollState {
  explodedFactor: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  stageLabel: number;
}

interface ScrollCameraControllerProps {
  scrollStateRef: React.MutableRefObject<ScrollState>;
  selectedHotspot: HotspotItem | null;
  enableFreeControls: boolean;
  reducedMotion?: boolean;
}

/**
 * Authoritative Unified Camera Controller for the BMW M4 CSL Experience:
 * Handles 3 distinct, non-conflicting operational states:
 * 1. SCROLL     -> Follows GSAP ScrollTrigger scrubbed cinematic timeline
 * 2. HOTSPOT    -> Smoothly inspects focused technical component
 * 3. FREE_ORBIT -> Silky 360° interactive turntable rotation with zero snapping
 */
export const ScrollCameraController: React.FC<ScrollCameraControllerProps> = ({
  scrollStateRef,
  selectedHotspot,
  enableFreeControls,
  reducedMotion = false
}) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const currentLookAt = useRef(new THREE.Vector3(0, 0.65, 0));
  const wasFreeControlsRef = useRef(false);

  // Subtle breathing idle drift to keep cinematic studio scene dynamic
  const idleAmplitude = reducedMotion ? 0.0 : 0.035;

  // Sync controls target when transitioning into free mode to prevent snapping
  useEffect(() => {
    if (enableFreeControls && controlsRef.current) {
      controlsRef.current.target.copy(currentLookAt.current);
      controlsRef.current.update();
    }
    wasFreeControlsRef.current = enableFreeControls;
  }, [enableFreeControls]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;

    // ── MODE 1: FREE 360° ORBIT ─────────────────────────────────────────────
    if (enableFreeControls) {
      if (controls) {
        controls.update();
        // Keep currentLookAt aligned with orbit target
        currentLookAt.current.copy(controls.target);
      }
      return;
    }

    // ── MODE 2 & 3: HOTSPOT or CINEMATIC SCROLL ─────────────────────────────
    const { camPos, camTarget } = scrollStateRef.current;
    const time = state.clock.getElapsedTime();

    let targetX: number, targetY: number, targetZ: number;
    let lookX: number, lookY: number, lookZ: number;

    if (selectedHotspot) {
      // Hotspot close-up coordinates
      [targetX, targetY, targetZ] = selectedHotspot.cameraPosition;
      [lookX, lookY, lookZ] = selectedHotspot.cameraTarget;
    } else {
      // Cinematic scroll timeline coordinates
      [targetX, targetY, targetZ] = camPos;
      [lookX, lookY, lookZ] = camTarget;

      // Add gentle organic breathing motion if motion reduction is off
      if (!reducedMotion) {
        targetX += Math.sin(time * 0.35) * idleAmplitude;
        targetY += Math.cos(time * 0.28) * (idleAmplitude * 0.5);
      }
    }

    // Responsive damping tuned to follow scroll without double lag
    const posDamp = reducedMotion ? 12.0 : (selectedHotspot ? 5.5 : 6.5);
    const lookDamp = reducedMotion ? 14.0 : (selectedHotspot ? 6.0 : 7.0);

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, posDamp, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, posDamp, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, posDamp, delta);

    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, lookX, lookDamp, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, lookY, lookDamp, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, lookZ, lookDamp, delta);

    camera.lookAt(currentLookAt.current);

    // Keep OrbitControls internal target synchronized so toggling to Free Orbit never snaps
    if (controls) {
      controls.target.copy(currentLookAt.current);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={enableFreeControls}
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      minDistance={2.2}
      maxDistance={8.5}
      maxPolarAngle={Math.PI / 2 - 0.04} // Prevent clipping beneath floor
      minPolarAngle={Math.PI / 12}        // Prevent extreme top gimbal lock
      rotateSpeed={0.75}
    />
  );
};
