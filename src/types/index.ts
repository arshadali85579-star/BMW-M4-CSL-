export interface HotspotItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'aerodynamics' | 'powertrain' | 'chassis' | 'interior' | 'exterior';
  position: [number, number, number]; // [x, y, z] in Three.js scene coordinates
  cameraTarget: [number, number, number]; // Look-at point
  cameraPosition: [number, number, number]; // Camera position for close-up view
  description: string;
  specs: { label: string; value: string }[];
  highlightMeshes?: string[];
}

export interface VehicleColor {
  name: string;
  hex: string;
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
}

export interface SpecificationCategory {
  category: string;
  items: {
    name: string;
    value: string;
    detail?: string;
  }[];
}

export type ViewMode = 'cinematic' | 'explore' | 'exploded' | 'hotspot';
