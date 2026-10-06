import React from 'react';
import { ContactShadows } from '@react-three/drei';

export const StudioFloor: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <group position={[0, 0, 0]}>
      {/* Optimized Contact Shadows: 512 on desktop, 256 on mobile */}
      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.82}
        scale={7.5}
        blur={2.0}
        far={2.2}
        resolution={isMobile ? 256 : 512}
        color="#000000"
      />

      {/* Main Studio Floor with subtle specular gloss */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#08090C"
          roughness={0.42}
          metalness={0.7}
          envMapIntensity={0.55}
        />
      </mesh>

      {/* Automotive Studio Turn-table Radial Rings (64 segments for smooth roundness with 50% fewer vertices) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <ringGeometry args={[3.2, 3.22, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.12} transparent />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]}>
        <ringGeometry args={[4.4, 4.41, 64]} />
        <meshBasicMaterial color="#1675D1" opacity={0.08} transparent />
      </mesh>
    </group>
  );
};
