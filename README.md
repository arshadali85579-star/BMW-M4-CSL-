# BMW M4 CSL — Cinematic 3D Automotive Experience

An ultra-premium, interactive 3D WebGL automotive showcase inspired by the BMW M4 CSL (Competition Sport Lightweight). Engineered using Three.js, React Three Fiber, and Tailwind CSS.

## 🚀 Key Features

### 1. Cinematic Hero Reveal
- Dramatic dark studio reveal sequence with progressive lighting calibration.
- Interactive **"Ignite Headlights"** control with BMW Motorsport yellow GT Laserlight daytime running lights (DRL) and authentic Web Audio acoustic ignition sound.
- Smooth camera choreographies between tight front grille framing and hero front-three-quarter composition.

### 2. Scroll-Driven 3D Car Presentation
- Real-time 3D camera staging synchronized with user scroll:
  - **Stage 01:** Front Aerodynamic Stance & Laserlight Optics
  - **Stage 02:** Muscular 3/4 Track Contour & Flared Arches
  - **Stage 03:** Low-Slung Lightweight Silhouette (-100 kg diet, 1,386 mm height)
  - **Stage 04:** Rear Carbon Aerodynamics & Integrated Ducktail Spoiler
- Direct perspective selectors allowing instant camera navigation.

### 3. Exploded 3D Vehicle Architecture (Genuine Mesh Separation)
- The vehicle smoothly separates into its authentic physical components along controlled 3D trajectories:
  - **4 Individual Forged Wheels:** Front Left (`Object442`), Front Right (`Line005`), Rear Left (`Circle.070`), and Rear Right (`Circle.068`) move outward along the lateral axle track.
  - **CFRP Ducktail Spoiler (`wing`):** Elevates and moves rearward.
  - **Glasshouse Canopy (`Plane.076`, `Plane.065`, `Circle.037`, `Circle.061`):** Lifts vertically to reveal the interior cockpit.
  - **CFRP Body Panels (`Circle.055`, `Circle.054`, `Circle.053`, etc.):** Separate upward and forward.
  - **Front Bumper Assembly:** Separates forward.
- Interactive **Explosion Slider (0% to 100%)** with quick presets (`Assembled`, `50% Separation`, `Full 100%`).
- Component isolation filters for wheels, spoiler, and carbon body panels.

### 4. Interactive 3D Component Hotspots
- White pulsing circular radar hotspots positioned directly on the 3D vehicle in WebGL space:
  - BMW Laserlight Headlights
  - Carbon Minimalist Kidney Grille
  - M Carbon Ceramic Braking & 19" Style 827M Forged Wheels
  - S58 TwinPower Turbo 3.0L Powerplant
  - CFRP Double-Bubble Lightweight Roof
  - M Carbon Full Bucket Racing Cockpit
  - Rear Track Axle & 20" Forged Wheels
  - Integrated CFRP Ducktail Spoiler & Laser Taillights
- Clicking any hotspot triggers a cinematic camera zoom, component highlight, and opens a technical specification dossier.

### 5. Interactive M Exterior Paint Configurator
- Live metallic paint shader customizer with real-time clearcoat and metalness adjustments:
  - Frozen Brooklyn Grey Metallic
  - Alpine White Metallic
  - Black Sapphire Metallic
  - Isle of Man Green M
  - BMW M Deep Velvet Blue

### 6. Factory Verified Telemetry & Specifications
- Powertrain & Performance (543 hp, 650 Nm, 3.7s 0-100, 307 km/h)
- Lightweight Engineering (-100 kg, titanium silencer, CFRP hood/roof)
- Chassis & Running Gear (M Carbon Ceramic brakes, Cup 2 R track tires)
- Nürburgring Nordschleife 7:15.677 series-production record.

### 7. Interactive Controls & Sound Synthesis
- Synthesized audio effects via native Web Audio API (headlight activation, component separation, UI clicks, hotspot pulses).
- 360° Free Orbit Mode toggle for unrestricted inspection.

---

## 🛠️ Tech Stack
- **Framework:** React 18, Vite 5, TypeScript
- **3D & WebGL:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Styling:** Tailwind CSS, Glassmorphism, Custom Shaders
- **Audio:** Web Audio API (Zero external audio asset dependencies)
- **Icons:** Lucide React

---

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in your browser.
