import { VehicleColor, SpecificationCategory } from '../types';

export const VEHICLE_DETAILS = {
  model: 'BMW M4 CSL',
  badge: 'CSL // COMPETITION SPORT LIGHTWEIGHT',
  tagline: 'ELECTRIFIED AGILITY. PURE MOTORSPORT DNA.',
  heroDescription: 'Engineered for absolute track dominance. Born from the crucible of the Nürburgring Nordschleife with a blistering 7:15.677 lap record.',
  edition: 'Strictly Limited Production: 1,000 Units Worldwide',
  acceleration0to100: '3.7 s',
  acceleration0to200: '10.7 s',
  topSpeed: '307 km/h',
  powerOutput: '543 hp (550 PS)',
  torque: '650 Nm',
  curbWeight: '1,625 kg',
  powerToWeight: '2.95 kg/hp',
  nurburgringTime: '7:15.677',
};

export const COLOR_OPTIONS: VehicleColor[] = [
  {
    name: 'Frozen Brooklyn Grey',
    hex: '#5A6065',
    roughness: 0.38,
    metalness: 0.85,
    clearcoat: 0.5,
    clearcoatRoughness: 0.3
  },
  {
    name: 'Alpine White Metallic',
    hex: '#E8ECF0',
    roughness: 0.18,
    metalness: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  },
  {
    name: 'Black Sapphire Metallic',
    hex: '#0D0E11',
    roughness: 0.12,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
  },
  {
    name: 'Isle of Man Green M',
    hex: '#0E3B2E',
    roughness: 0.22,
    metalness: 0.92,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15
  },
  {
    name: 'BMW M Deep Velvet Blue',
    hex: '#102B5C',
    roughness: 0.25,
    metalness: 0.92,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  }
];

export const TECHNICAL_SPECIFICATIONS: SpecificationCategory[] = [
  {
    category: 'Powertrain & Performance',
    items: [
      { name: 'Engine Type', value: '3.0L M TwinPower Turbo Inline-6 (S58)', detail: 'High-revving motorsport concept with forged lightweight crankshaft and 3D-printed cylinder head core.' },
      { name: 'Displacement', value: '2,993 cc', detail: 'Twin mono-scroll turbochargers boosting at 2.1 bar (30.5 psi).' },
      { name: 'Max Power', value: '543 hp (405 kW) @ 6,250 rpm', detail: '+40 hp gain over the standard M4 Competition.' },
      { name: 'Max Torque', value: '650 Nm (479 lb-ft) @ 2,750 – 5,950 rpm', detail: 'Instant torque plateau across an ultra-wide rev band.' },
      { name: 'Transmission', value: '8-Speed M Steptronic with Drivelogic', detail: 'Lightning-quick shift times with carbon-fiber paddle shifters and manual track mode.' },
      { name: 'Drive Concept', value: 'Rear-Wheel Drive (RWD) with Active M Differential', detail: 'Calibrated M Traction Control with 10-stage selectable drift and track intervention levels.' },
      { name: '0 – 100 km/h', value: '3.7 seconds', detail: 'Official BMW factory timing under ambient track conditions.' },
      { name: 'Top Speed', value: '307 km/h (191 mph)', detail: 'Electronically regulated by standard M Driver\'s Package.' }
    ]
  },
  {
    category: 'Lightweight Engineering & Aerodynamics',
    items: [
      { name: 'Weight Reduction', value: '-100 kg vs M4 Competition', detail: 'Curb weight trimmed to 1,625 kg (DIN).' },
      { name: 'Carbon Fiber Roof & Bonnet', value: 'CFRP with Unpainted Channels', detail: 'Recessed carbon channels with vibrant red accent contouring.' },
      { name: 'Tailgate Aerodynamics', value: 'Integrated CFRP Ducktail Spoiler', detail: 'Homage to the legendary 2003 BMW E46 M3 CSL.' },
      { name: 'Exhaust System', value: 'Titanium Rear Silencer (-4.3 kg)', detail: 'Electrically controlled active flap valves for exhilarating acoustic resonance.' },
      { name: 'Interior Lightening', value: 'M Carbon Full Bucket Seats (-24 kg)', detail: 'Rear bench eliminated (-21 kg) with dedicated integrated helmet storage.' },
      { name: 'Underbody & Diffuser', value: 'Full Flat-Floor with Functional Aerofoil', detail: 'Optimized airflow generating downforce at high-speed cornering.' }
    ]
  },
  {
    category: 'Chassis & Running Gear',
    items: [
      { name: 'Front Axle / Wheels', value: '19-inch M Light-Alloy Style 827M', detail: 'Forged cross-spoke wheels in matte black or bronze with 275/35 ZR19 Michelin Pilot Sport Cup 2 R.' },
      { name: 'Rear Axle / Wheels', value: '20-inch M Light-Alloy Style 827M', detail: 'Ultra-light forged wheels with 285/30 ZR20 Michelin Pilot Sport Cup 2 R semi-slick track tires.' },
      { name: 'Braking System', value: 'M Carbon Ceramic Brakes', detail: '6-piston fixed calipers front with 400 mm ceramic rotors; single-piston floating calipers rear with 380 mm ceramic rotors.' },
      { name: 'Suspension', value: 'M Adaptive Track Suspension', detail: 'Ride height dropped by 8 mm; auxiliary helper springs and custom tuned anti-roll bars.' },
      { name: 'Steering', value: 'M Servotronic Electric Power Steering', detail: 'Direct rack ratio with precision feedback under high lateral g-forces.' }
    ]
  },
  {
    category: 'Dimensions & Capacities',
    items: [
      { name: 'Length / Width / Height', value: '4,794 mm / 1,921 mm / 1,386 mm', detail: 'Aggressive low-slung motorsport silhouette.' },
      { name: 'Wheelbase', value: '2,857 mm', detail: 'Extended wheelbase for stability in high-speed direction transitions.' },
      { name: 'Track Width Front / Rear', value: '1,617 mm / 1,605 mm', detail: 'Muscular flared arches accommodating ultra-wide track rubber.' },
      { name: 'Fuel Tank Capacity', value: '59 Liters', detail: 'High-octane unleaded fuel system.' }
    ]
  }
];
