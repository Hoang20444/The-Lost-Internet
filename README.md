# THE LOST INTERNET

> A browser-based 3D atmospheric exploration indie game prototype built with React, Three.js, and @react-three/fiber.

![Room 404](https://img.shields.io/badge/Status-Phase%201%20Complete-brightgreen)
![Three.js](https://img.shields.io/badge/Three.js-r186-blue)
![React](https://img.shields.io/badge/React-19-cyan)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blueviolet)

---

## 🌌 Overview

**THE LOST INTERNET** transports you into **Room 404: Archival Node** — an isolated technological capsule from 2004 preserved at night in the midst of a cybernetic blackout. Outside the rain-slicked window, the silhouettes of silent skyscrapers tower in neon mist. Inside, you explore and interact with vintage hardware, restore system power, align analog chronometers, decipher archival logs in a retro CRT terminal, and unlock the heavy security blast door.

---

## 🎮 Phase 1 Features

- **Atmospheric 3D Room**: Handcrafted low-poly chamber with dark parquet flooring, exposed ceiling rafters, deep indigo/navy walls, window looking out into rain and neon city skyline, mahogany workstation, and archival tape racks.
- **Smooth Character Movement**: Responsive WASD and Arrow key controls with turning damping, footstep cadence, and walking leg animations.
- **Cinematic Third-Person Exploration Camera**: Smooth camera follow that is clamped strictly inside room boundaries to prevent clipping through walls or ceiling beams.
- **Slide Collision System**: Realistic 2D/3D collision boundaries for perimeter walls, desk furniture, server cabinets, and security doorways.
- **Contextual Holographic Prompt**: An elegant `[E]` badge that smoothly surfaces only when the explorer approaches interactive objects.
- **Interactive Workstation Lamp**: Toggleable switch that physically alters the scene lighting with real-time shadow casting and emissive bulb glow.
- **Adjustable Chronometer**: Wall clock with animated ticking hands. Interactive inspection modal allows advancing/rewinding time. Synchronizing the chronometer to `04:04` triggers a chime and reveals the system passcode `NET-404`.
- **Retro CRT Terminal OS**: Phosphor scanline terminal (`LOST-NET OS v1.0.4`) supporting commands:
  - `help` — command reference
  - `status` — room power, clock synchronization, and airlock diagnostics
  - `logs` — list discovered archive files
  - `cat lore.txt` / `cat protocol.txt` / `cat passkey.txt` — read data records
  - `clock` — inspect system timestamp
  - `lamp` — toggle workstation lighting via terminal
  - `unlock <passcode>` — disengage blast door locks
- **Heavy Security Blast Door**: Industrial chamber door with animated swing hinge and dual-state red/green LED indicator. Can be unlocked via keypad codes or terminal command.
- **Procedural Web Audio Synthesis**: Completely self-contained procedural sound effects synthesized in real-time via the Web Audio API (zero external sound files/dependencies) — footsteps, switch clicks, clock ticks, terminal beeps, and door servo unlatch.
- **Pause & Control Guide**: `ESC` menu with quick controls guide, audio mute toggle, particle effects toggle, dynamic shadow toggle, and position reset.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: Vanilla CSS (Glassmorphism, custom CRT shader filters, modern typography)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Icons**: [lucide-react](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended, tested on v24)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Hoang20444/The-Lost-Internet.git
   cd The-Lost-Internet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/`.

### Production Build

To build the production bundle:
```bash
npm run build
npm run preview
```

---

## ⌨️ Controls

| Key | Action |
| :--- | :--- |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or Arrows | Move explorer smoothly |
| <kbd>E</kbd> or Click Hint | Look at / interact with nearby objects |
| <kbd>ESC</kbd> | Pause menu / Close active modal |

---

## 📁 Project Structure

```
├── src/
│   ├── audio/
│   │   └── soundManager.ts       # Procedural Web Audio API synthesizer
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── Clock.tsx         # Responsive analog wall clock
│   │   │   ├── Computer.tsx      # CRT monitor, keyboard & PC tower
│   │   │   ├── Desk.tsx          # Wooden desk & office swivel chair
│   │   │   ├── Door.tsx          # Blast door with swing hinge & LED
│   │   │   ├── DustParticles.tsx # Atmospheric floating dust motes
│   │   │   ├── GameCanvas.tsx    # R3F Canvas setup
│   │   │   ├── Lamp.tsx          # Articulated desk lamp with emissive bulb
│   │   │   ├── Lighting.tsx      # Dynamic room lights and shadows
│   │   │   ├── Player.tsx        # Player character, movement & camera follow
│   │   │   ├── Room.tsx          # Architectural room, walls & floor
│   │   │   ├── Scene.tsx         # Composite 3D scene assembly
│   │   │   ├── ServerRack.tsx    # Mainframe cabinet with tape reels
│   │   │   └── WindowView.tsx    # Rainy cyber night window & skyline
│   │   └── ui/
│   │       ├── ClockModal.tsx    # Interactive time adjustment dial
│   │       ├── DoorModal.tsx     # Airlock keypad & passcode interface
│   │       ├── HUD.tsx           # Objectives tracker & header overlay
│   │       ├── InteractionPrompt.tsx # Contextual [E] badge
│   │       ├── NotesModal.tsx    # Archival tape reel logs
│   │       ├── PauseModal.tsx    # Control guide & graphics/audio settings
│   │       ├── TerminalModal.tsx # CRT console with CLI commands
│   │       └── WindowModal.tsx   # Atmospheric narrative dialog
│   ├── config/
│   │   └── interactables.ts      # Object coordinates & collision boundaries
│   ├── state/
│   │   └── gameStore.ts          # Centralized Zustand store
│   ├── types/
│   │   └── game.ts               # Core TypeScript definitions
│   ├── App.css                   # Custom UI & CRT styling
│   ├── index.css                 # Design tokens & typography
│   └── main.tsx                  # Application entry point
├── package.json
└── vite.config.ts
```

---

## 📜 License

MIT License. Crafted for **THE LOST INTERNET**.
