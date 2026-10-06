import { HotspotItem } from '../types';

/**
 * 3D Hotspot Coordinates in BMW M4 CSL Vehicle World Space:
 * X = Length: Front (+X: up to +2.25m) / Rear (-X: down to -2.25m)
 * Y = Height: Ground (0.0m) / Roof (+1.32m)
 * Z = Width: Left (+Z: up to +0.97m) / Right (-Z: down to -0.97m)
 */
export const HOTSPOTS: HotspotItem[] = [
  {
    id: 'laser-headlights',
    title: 'BMW Laserlight Headlights',
    subtitle: 'Motorsport-Derived Yellow DRL Signatures',
    category: 'exterior',
    position: [1.85, 0.68, 0.62],
    cameraTarget: [1.75, 0.65, 0.55],
    cameraPosition: [2.85, 0.95, 1.45],
    highlightMeshes: ['Plane007', 'lightt'],
    description: 'Distinctive yellow daytime running lights paying homage to legendary GT racing cars. High-performance BMW Laserlight technology casts an adaptive high-beam illuminated reach of up to 650 meters, paired with sculpted dark-tinted M Shadowline housings.',
    specs: [
      { label: 'Technology', value: 'BMW Laserlight System' },
      { label: 'DRL Illumination', value: 'Yellow GT Motorsport Accent' },
      { label: 'High-Beam Range', value: 'Up to 650 Meters' },
      { label: 'Optics Housing', value: 'M Shadowline Dark Anodized' }
    ]
  },
  {
    id: 'kidney-grille',
    title: 'Carbon Minimalist Kidney Grille',
    subtitle: 'Aerodynamic Flow & Red Contour Tracing',
    category: 'aerodynamics',
    position: [2.18, 0.58, 0.0],
    cameraTarget: [2.10, 0.55, 0.0],
    cameraPosition: [3.45, 0.85, 0.15],
    highlightMeshes: ['Plane294', 'Circle045', 'Circle044'],
    description: 'Radically stripped-back kidney grille with minimal twin horizontal slats designed to feed massive cooling air to the auxiliary radiators, engine oil cooler, and transmission thermal matrix. Surrounded by signature red contour pinstriping with the vintage CSL badge.',
    specs: [
      { label: 'Design', value: 'Weight-Minimized Twin Slats' },
      { label: 'Air Intake Area', value: '+35% Effective Cooling Area' },
      { label: 'Accent Detailing', value: 'Precision CSL Red Perimeter' },
      { label: 'Emblem', value: 'Classic 50 Jahre BMW M Crest' }
    ]
  },
  {
    id: 'front-wheel',
    title: 'M Carbon Ceramic Braking & 19" Wheels',
    subtitle: 'Forged Style 827M & Track Michelin Cup 2 R',
    category: 'chassis',
    position: [1.42, 0.35, 0.86],
    cameraTarget: [1.40, 0.33, 0.84],
    cameraPosition: [1.85, 0.55, 1.95],
    highlightMeshes: ['Object442', 'Line005'],
    description: '19-inch forged M light-alloy wheels in exclusive Style 827M wrapped in high-grip Michelin Pilot Sport Cup 2 R track rubber (275/35 ZR19). Stopping power is delivered by massive 400 mm perforated ceramic brake discs clamped by 6-piston fixed red calipers.',
    specs: [
      { label: 'Front Rotor', value: '400 mm Perforated Carbon Ceramic' },
      { label: 'Calipers', value: '6-Piston Fixed Aluminum (Red)' },
      { label: 'Wheel Spec', value: '19" x 9.5J Forged Alloy Style 827M' },
      { label: 'Tire Model', value: 'Michelin Pilot Sport Cup 2 R' }
    ]
  },
  {
    id: 'twinpower-engine',
    title: 'S58 TwinPower Turbo Powerplant',
    subtitle: 'High-Revving 3.0-Liter Twin-Turbo Inline-6',
    category: 'powertrain',
    position: [1.05, 0.82, 0.0],
    cameraTarget: [0.95, 0.72, 0.0],
    cameraPosition: [1.85, 1.65, 0.95],
    highlightMeshes: ['Circle054', 'Circle053', 'Circle055'],
    description: 'Upgraded 3.0-liter straight-six engine with charge pressure increased from 1.7 to 2.1 bar. Features a forged lightweight crankshaft, cylinder head with 3D-printed core for optimized coolant routing, and dual electric wastegates producing 543 horsepower.',
    specs: [
      { label: 'Displacement', value: '2,993 cc Inline-6' },
      { label: 'Boost Pressure', value: '2.1 bar (30.5 psi)' },
      { label: 'Power Output', value: '543 hp @ 6,250 rpm' },
      { label: 'Peak Torque', value: '650 Nm @ 2,750 – 5,950 rpm' }
    ]
  },
  {
    id: 'carbon-roof',
    title: 'CFRP Double-Bubble Lightweight Roof',
    subtitle: 'Lowered Center of Gravity & Red Striping',
    category: 'aerodynamics',
    position: [-0.15, 1.34, 0.0],
    cameraTarget: [-0.15, 1.25, 0.0],
    cameraPosition: [-0.15, 2.35, 1.35],
    highlightMeshes: ['Circle052', 'Circle055'],
    description: 'Exposed carbon-fiber reinforced plastic (CFRP) structural roof with ergonomic double-bubble indentations. Reduces overall vehicle weight, removes mass from the highest point of the chassis, and significantly improves lateral rolling stability in high-g corners.',
    specs: [
      { label: 'Material', value: 'Carbon-Fiber Reinforced Plastic (CFRP)' },
      { label: 'Architecture', value: 'Double-Bubble Aerodynamic Profile' },
      { label: 'Center of Gravity', value: '-12 mm Vehicle Roll Center' },
      { label: 'Clearcoat Finish', value: 'High-Gloss UV-Protected Carbon Weave' }
    ]
  },
  {
    id: 'racing-cockpit',
    title: 'M Carbon Full Bucket Racing Seats',
    subtitle: 'Ultra-Rigid Track Architecture & Rear-Seat Delete',
    category: 'interior',
    position: [-0.12, 0.76, 0.28],
    cameraTarget: [-0.12, 0.70, 0.22],
    cameraPosition: [0.65, 1.25, 1.25],
    highlightMeshes: ['interior001', 'interior002', 'Circle049'],
    description: 'Track-ready M Carbon full bucket seats saving 24 kg over standard M seats, featuring removable headrest pads for track helmet clearance and integrated multi-point harness cutouts. The rear bench is eliminated, shedding an extra 21 kg and adding dedicated helmet storage bins.',
    specs: [
      { label: 'Weight Reduction', value: '-45 kg Cockpit Weight Total' },
      { label: 'Seat Shell', value: 'Self-Supporting Carbon Monocoque' },
      { label: 'Steering Wheel', value: 'Alcantara with Red 12-o\'clock Mark' },
      { label: 'Harness Support', value: 'Multi-Point Competition Ready' }
    ]
  },
  {
    id: 'rear-wheel',
    title: 'Rear Track Axle & 20" Forged Wheels',
    subtitle: 'Active M Differential & 285 Track Tires',
    category: 'chassis',
    position: [-1.24, 0.35, 0.86],
    cameraTarget: [-1.22, 0.33, 0.84],
    cameraPosition: [-1.05, 0.55, 1.95],
    highlightMeshes: ['Circle070', 'Circle068'],
    description: 'Staggered 20-inch rear forged wheels with 285/30 ZR20 Cup 2 R rubber engineered to channel the full 650 Nm of torque directly onto the asphalt. Linked with the electronically managed Active M Differential featuring 100% locking capability.',
    specs: [
      { label: 'Wheel Spec', value: '20" x 10.5J Forged Light-Alloy' },
      { label: 'Tire Model', value: '285/30 ZR20 Michelin Pilot Sport Cup 2 R' },
      { label: 'Rear Rotor', value: '380 mm Carbon Ceramic Disc' },
      { label: 'Differential', value: 'Active M Variable Electro-Mechanical Lock' }
    ]
  },
  {
    id: 'ducktail-spoiler',
    title: 'M Carbon Ducktail Spoiler & Laser Lights',
    subtitle: 'Downforce Engineering & Glass-Fiber Laser Weave',
    category: 'aerodynamics',
    position: [-1.88, 0.98, 0.0],
    cameraTarget: [-1.82, 0.90, 0.0],
    cameraPosition: [-3.15, 1.35, 0.85],
    highlightMeshes: ['wing'],
    description: 'Distinctive upswept aerodynamic boot lid crafted in CFRP reminiscent of the iconic E46 M3 CSL. Produces significant rear downforce at triple-digit speeds. Complemented by revolutionary taillights featuring ultra-thin laser filaments illuminated into 3D glass threads.',
    specs: [
      { label: 'Spoiler Design', value: 'Integrated Ducktail CFRP Tailgate' },
      { label: 'Downforce', value: 'Substantial High-Speed Stability' },
      { label: 'Taillight Tech', value: 'BMW Laser Thread Optical Filament' },
      { label: 'Exhaust Tailpipes', value: 'Quad Titanium 100 mm Matte Black' }
    ]
  }
];
