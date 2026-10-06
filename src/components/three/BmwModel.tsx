import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { VehicleColor, HotspotItem } from '../../types';
import { HOTSPOTS } from '../../data/hotspotsData';

interface ScrollState {
  explodedFactor: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  stageLabel: number;
}

interface BmwModelProps {
  headlightsOn: boolean;
  activeColor: VehicleColor;
  scrollStateRef: React.MutableRefObject<ScrollState>;
  selectedHotspotId: string | null;
  reducedMotion?: boolean;
  onLoaded?: () => void;
}

interface PrecomputedComponent {
  object: THREE.Object3D;
  originX: number;
  originY: number;
  originZ: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
}

interface HighlightedMeshState {
  mesh: THREE.Mesh;
  originalEmissive: THREE.Color;
  originalIntensity: number;
}

/**
 * Transforms a displacement defined in VEHICLE COORDINATES:
 *   X = Longitudinal: Front (+X) / Rear (-X)
 *   Y = Vertical: Up (+Y) / Down (-Y)
 *   Z = Lateral: Left (+Z) / Right (-Z)
 * into the local coordinate system of the GLB 'Empty' container node.
 * Inside the BMW GLB, 'Empty' has a rotation of -90° around X (-π/2 rad).
 * Therefore:
 *   Empty Local X =  Vehicle X
 *   Empty Local Y = -Vehicle Z
 *   Empty Local Z =  Vehicle Y
 */
function vehicleToLocalOffset(vehX: number, vehY: number, vehZ: number): [number, number, number] {
  return [vehX, -vehZ, vehY];
}

export const BmwModel: React.FC<BmwModelProps> = ({
  headlightsOn,
  activeColor,
  scrollStateRef,
  selectedHotspotId,
  reducedMotion = false,
  onLoaded
}) => {
  const gltf = useGLTF('/models/bmw_m4csl.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene once to avoid multi-render mutation conflicts
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const precomputedCompsRef = useRef<PrecomputedComponent[]>([]);
  const sharedPaintMatRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const sharedHeadlightMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const highlightedMeshesRef = useRef<HighlightedMeshState[]>([]);
  const smoothedFactorRef = useRef(0);

  // ─── ONE-TIME SETUP: SCALE, SHARED MATERIALS & SHADOW POLICY ──────────────
  useEffect(() => {
    if (!scene) return;

    precomputedCompsRef.current = [];

    // 1. Measure raw bounding box
    const rawBox = new THREE.Box3().setFromObject(scene);
    const rawSize = rawBox.getSize(new THREE.Vector3());
    const rawCenter = rawBox.getCenter(new THREE.Vector3());

    // 2. Scale car to 4.5m physical length (X axis is vehicle length)
    const TARGET_LENGTH = 4.5;
    const scaleFactor = TARGET_LENGTH / rawSize.x;
    scene.scale.setScalar(scaleFactor);

    // 3. Center X/Z, sit on Y=0 ground floor
    scene.position.set(
      -rawCenter.x * scaleFactor,
      -rawBox.min.y * scaleFactor,
      -rawCenter.z * scaleFactor
    );

    // ── 4. Create High-Performance Shared Material Pool ─────────────────────
    // Single shared MeshPhysicalMaterial for all car paint panels
    const paintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColor.hex),
      roughness: activeColor.roughness,
      metalness: activeColor.metalness,
      clearcoat: activeColor.clearcoat ?? 1.0,
      clearcoatRoughness: activeColor.clearcoatRoughness ?? 0.03,
      reflectivity: 0.95,
      envMapIntensity: 2.2,
    });
    sharedPaintMatRef.current = paintMat;

    // Single shared physical material for tinted automotive glass
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#0a111a'),
      transparent: true,
      opacity: 0.35,
      roughness: 0.02,
      metalness: 0.1,
      transmission: 0.55,
      ior: 1.52,
      envMapIntensity: 2.2,
      depthWrite: false,
    });

    // Single shared material for dark plastics, carbon diffusers, trims
    const darkPlasticMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#101216'),
      roughness: 0.72,
      metalness: 0.05,
      envMapIntensity: 0.4,
    });

    // Single shared metallic material for alloy wheels, brake rotors, chrome
    const alloyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c0c4cc'),
      metalness: 0.96,
      roughness: 0.14,
      envMapIntensity: 2.2,
    });

    // Single shared emissive material for headlights
    const headlightMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      emissive: new THREE.Color(headlightsOn ? '#FFE57F' : '#181610'),
      emissiveIntensity: headlightsOn ? 5.0 : 0,
      roughness: 0.1,
      metalness: 0.1,
    });
    sharedHeadlightMatRef.current = headlightMat;

    // Single shared emissive material for taillights
    const taillightMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#200508'),
      emissive: new THREE.Color('#FF1744'),
      emissiveIntensity: 3.5,
      roughness: 0.15,
    });

    // ── 5. Intentional Shadow Policy & Material Assignment ───────────────────
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const on = mesh.name.toLowerCase();
      const parentName = (mesh.parent?.name || '').toLowerCase();

      // Shadow policy: ONLY major body panels, wheels, bumpers, and spoiler cast shadows
      const isMajorCaster =
        on.includes('paint') ||
        on.includes('circle070') ||
        on.includes('circle068') ||
        on.includes('object442') ||
        on.includes('line005') ||
        on.includes('plane294') ||
        on.includes('wing') ||
        on.includes('object_11') ||
        parentName.includes('circle070') ||
        parentName.includes('circle068') ||
        parentName.includes('object442') ||
        parentName.includes('line005');

      mesh.castShadow = isMajorCaster;
      mesh.receiveShadow = isMajorCaster;

      // Assign optimized shared materials
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const assigned = mats.map((m) => {
        const mn = (m.name || '').toLowerCase();

        // Car Paint
        if (mn.includes('paint') || on.includes('paint')) {
          return paintMat;
        }

        // Automotive Glass
        if (
          mn.includes('glass') || mn.includes('glasss') ||
          mn.includes('mirror') || on.includes('glass')
        ) {
          return glassMat;
        }

        // Headlights (Laserlight Yellow DRL)
        if (mn.includes('lightt') || on.includes('lightt')) {
          return headlightMat;
        }

        // Taillights (Laser Threads)
        if (mn.includes('red_light') || mn.includes('red2') || on.includes('red_light')) {
          return taillightMat;
        }

        // Wheel Alloy & Chrome Trim
        if (mn.includes('steel') || mn.includes('iron') || mn.includes('chrome')) {
          return alloyMat;
        }

        // Dark Plastic & Carbon
        if (
          mn.includes('plastic') || mn.includes('black222') ||
          mn.includes('black2') || mn.includes('black3')
        ) {
          return darkPlasticMat;
        }

        return m;
      });

      mesh.material = assigned.length === 1 ? assigned[0] : assigned;
    });

    // ── 6. Precompute Explosion Transforms (Zero allocations during frame loop) ──
    const emptyNode = scene.getObjectByName('Empty');
    const childrenList = emptyNode ? emptyNode.children : scene.children;

    childrenList.forEach((obj) => {
      const rawName = obj.name;
      const clean = rawName.replace(/[\._\-]/g, '').toLowerCase();

      let localOffset: [number, number, number] | null = null;

      // 1. Four Wheel Assemblies (Outward on lateral Z axis)
      if (clean === 'object442') {
        localOffset = vehicleToLocalOffset(0, 0, +0.65);
      } else if (clean === 'line005') {
        localOffset = vehicleToLocalOffset(0, 0, -0.65);
      } else if (clean === 'circle070') {
        localOffset = vehicleToLocalOffset(0, 0, +0.65);
      } else if (clean === 'circle068') {
        localOffset = vehicleToLocalOffset(0, 0, -0.65);
      }
      // 2. M Carbon Ducktail Spoiler (Rearward on -X, upward on +Y)
      else if (clean === 'wing') {
        localOffset = vehicleToLocalOffset(-0.45, +0.42, 0);
      }
      // 3. Glass Canopy & Windshields (Upward on +Y)
      else if (['plane076', 'plane066', 'plane065', 'circle037', 'circle061', 'circle059', 'circle011', 'plane003', 'plane044', 'plane039'].some(k => clean === k)) {
        localOffset = vehicleToLocalOffset(0, +0.60, 0);
      }
      // 4. Exterior Body Panels & Bonnet (Upward on +Y, forward on +X)
      else if (['circle055', 'circle054', 'circle053', 'circle052', 'circle051', 'circle016', 'circle030', 'circle019', 'circle018', 'circle'].some(k => clean === k)) {
        localOffset = vehicleToLocalOffset(+0.14, +0.38, 0);
      }
      // 5. Front Bumper, Splitter & Flaps (Forward on +X)
      else if (['plane294', 'circle045', 'circle044', 'plane057', 'plane028', 'plane025', 'circle014', 'circle010', 'circle009', 'plane007'].some(k => clean === k)) {
        localOffset = vehicleToLocalOffset(+0.50, 0, 0);
      }
      // 6. Rear Bumper, Diffuser & Taillights (Rearward on -X)
      else if (['object11', 'circle041', 'circle039', 'circle038', 'circle036', 'plane029', 'nurbspath015', 'nurbspath014', 'circle035', 'nurbspath005', 'nurbspath001'].some(k => clean === k)) {
        localOffset = vehicleToLocalOffset(-0.50, 0, 0);
      }

      if (localOffset) {
        precomputedCompsRef.current.push({
          object: obj,
          originX: obj.position.x,
          originY: obj.position.y,
          originZ: obj.position.z,
          offsetX: localOffset[0],
          offsetY: localOffset[1],
          offsetZ: localOffset[2],
        });
      }
    });

    if (onLoaded) onLoaded();
  }, [scene]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── LIVE PAINT COLOR UPDATE (Single shared material update) ──────────────
  useEffect(() => {
    if (!sharedPaintMatRef.current) return;
    const mat = sharedPaintMatRef.current;
    mat.color.set(activeColor.hex);
    mat.roughness = activeColor.roughness;
    mat.metalness = activeColor.metalness;
    mat.clearcoat = activeColor.clearcoat ?? 1.0;
    mat.clearcoatRoughness = activeColor.clearcoatRoughness ?? 0.03;
    mat.needsUpdate = true;
  }, [activeColor]);

  // ─── LIVE HEADLIGHT EMISSIVE UPDATE (Single shared material update) ───────
  useEffect(() => {
    if (!sharedHeadlightMatRef.current) return;
    const mat = sharedHeadlightMatRef.current;
    mat.emissive.set(headlightsOn ? '#FFE57F' : '#181610');
    mat.emissiveIntensity = headlightsOn ? 5.0 : 0;
    mat.needsUpdate = true;
  }, [headlightsOn]);

  // ─── HOTSPOT COMPONENT HIGHLIGHTING (Executed ONLY on hotspot state change) ─
  useEffect(() => {
    // 1. Restore previous highlights
    highlightedMeshesRef.current.forEach(({ mesh, originalEmissive, originalIntensity }) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && 'emissive' in mat) {
        mat.emissive.copy(originalEmissive);
        mat.emissiveIntensity = originalIntensity;
        mat.needsUpdate = true;
      }
    });
    highlightedMeshesRef.current = [];

    if (!selectedHotspotId || !scene) return;

    // 2. Lookup matching mesh keywords from HOTSPOTS data definition
    const targetHotspot = HOTSPOTS.find((h: HotspotItem) => h.id === selectedHotspotId);
    const targetKeywords = targetHotspot?.highlightMeshes || [];
    if (targetKeywords.length === 0) return;

    // 3. Scan scene ONCE on selection, clone material only for highlighted mesh
    scene.traverse((obj) => {
      if (!(obj as THREE.Mesh).isMesh) return;
      const mesh = obj as THREE.Mesh;
      const name = mesh.name.replace(/[\._\-]/g, '').toLowerCase();
      const parentName = (mesh.parent?.name || '').replace(/[\._\-]/g, '').toLowerCase();

      const isMatch = targetKeywords.some((kw: string) => {
        const normalizedKeyword = kw.replace(/[\._\-]/g, '').toLowerCase();
        return name.includes(normalizedKeyword) || parentName.includes(normalizedKeyword);
      });

      if (isMatch) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && 'emissive' in mat) {
          highlightedMeshesRef.current.push({
            mesh,
            originalEmissive: mat.emissive.clone(),
            originalIntensity: mat.emissiveIntensity,
          });
          // Clone material only for the highlighted mesh so other meshes remain clean
          mesh.material = mat.clone();
          const cloned = mesh.material as THREE.MeshStandardMaterial;
          cloned.emissive = new THREE.Color('#3B97FF');
          cloned.emissiveIntensity = 2.4;
          cloned.needsUpdate = true;
        }
      }
    });

    return () => {
      highlightedMeshesRef.current.forEach(({ mesh, originalEmissive, originalIntensity }) => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat && 'emissive' in mat) {
          mat.emissive.copy(originalEmissive);
          mat.emissiveIntensity = originalIntensity;
          mat.needsUpdate = true;
        }
      });
      highlightedMeshesRef.current = [];
    };
  }, [selectedHotspotId, scene]);

  // ─── FRAME LOOP: ZERO-ALLOCATION FAST FLOAT TRANSFORM UPDATE ──────────────
  useFrame((_, delta) => {
    const targetT = THREE.MathUtils.clamp(scrollStateRef.current.explodedFactor, 0, 1);

    // Responsive damping: fast tracking (14.0) or immediate when reducedMotion
    const t = reducedMotion
      ? targetT
      : (smoothedFactorRef.current = THREE.MathUtils.damp(
          smoothedFactorRef.current,
          targetT,
          14.0,
          delta
        ));

    const comps = precomputedCompsRef.current;
    const len = comps.length;

    // Flat precomputed float arithmetic — zero allocations in frame loop
    for (let i = 0; i < len; i++) {
      const c = comps[i];
      c.object.position.x = c.originX + c.offsetX * t;
      c.object.position.y = c.originY + c.offsetY * t;
      c.object.position.z = c.originZ + c.offsetZ * t;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload('/models/bmw_m4csl.glb');
