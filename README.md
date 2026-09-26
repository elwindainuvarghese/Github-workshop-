# CODEX: GitHub Workshop Landing Page

An elite, high-performance, cyberpunk-themed landing page built for a GitHub & Version Control Workshop. 

This project goes far beyond a standard React website by integrating a **procedurally generated WebGL particle system** directly into the DOM architecture, creating a deeply immersive, living digital environment.

## 🚀 Live Demo Features

- **Procedural 3D Particle Laptop:** Constructed entirely from 65,000 individual glowing neon particles (`THREE.Points`). The geometry uses custom edge-sampling algorithms to maintain varying particle density—dense on the structural borders, faint in the atmospheric space.
- **Custom GLSL Shaders:** The particles are driven by custom vertex and fragment shaders featuring:
  - 3D Simplex noise for organic, floating atmospheric drift.
  - Subtle magnetic scatter physics when hovered by the cursor.
  - Z-depth scaling (particles closer to the camera are physically larger).
- **The "Pulse" (Terminal-to-WebGL Sync):** A glassmorphic terminal on the UI types out real Git commands. When it executes \`$ git commit -m "first breath"\`, a custom event triggers a physical energy wave (Pulse) that ripples through the 3D particle canvas in real-time.
- **3D Projected UI (Git Graph):** Using \`@react-three/drei\`'s \`<Html>\` component, an interactive, glowing Git branching tree and directory file structure is projected physically onto the screen of the 3D laptop.
- **Interactive Celestial Background:** An infinite, perfectly distributed starfield background that naturally tracks mouse movement to create deep, smooth parallax.
- **Responsive "Hacker" UI:** Custom Glitch text effects, glassmorphic floating metric cards, and a grid-based informational layout that seamlessly stacks on mobile devices.

## 🛠 Tech Stack

- **Framework:** React + Vite
- **3D Engine:** Three.js + React Three Fiber (`@react-three/fiber`)
- **3D Helpers:** `@react-three/drei`
- **Animations:** Framer Motion (DOM) + GLSL Shaders (WebGL)
- **Styling:** Inline CSS + Custom Typography (Orbitron, Space Grotesk, Share Tech Mono)

## 🏗 Development Journey & Changelog

Here is a step-by-step breakdown of how this project was architected from start to finish:

### 1. Base Architecture & Glitch Typography
- Initialized a Vite + React environment.
- Built the foundational `HeroSection.jsx` layout.
- Created a custom `<GlitchTitle>` component using React state and intervals to randomly scramble text with special characters (`!@#$%&*`) across multiple colored layers (Cyan/Red/Green) to create a chromatic aberration effect.
- Built the typing Terminal window simulating a bash environment.

### 2. The 3D WebGL Canvas
- Introduced `TechParticleObject.jsx` serving as a fixed `z-index: 0` background layer.
- Designed 3D geometries (Server racks, Laptops, Desktops) using `THREE.BoxGeometry`.
- Wrote a custom edge-sampling algorithm to pull vertices heavily from the edges of the geometries (75%) and sparsely from the interior faces (25%) to create holographic objects.
- Wrote the initial GLSL Vertex and Fragment shaders to handle particle rendering, additive blending, and fluid morphing between shapes based on scroll progress.

### 3. Iteration & Physics Tuning
- Shifted the layout to stack typography on the left and the 3D particle canvas on the right.
- Encountered a physics bug where an overly aggressive "Bulge" effect permanently distorted the laptop into a sphere due to default center-screen mouse coordinates.
- **The Fix:** Pushed the default mouse vector off-screen, completely deleted the destructive "Bulge" physics, and replaced it with a highly subtle "Magnetic Scatter" that gently repels particles without destroying the object's geometry.
- Refactored the laptop geometry code to prevent double-rotations and ensured the scale was massive and imposing on desktop (`1.1x`).

### 4. Background Ambience Overhaul
- Attempted to build a custom particle background using Math.random, which accidentally resulted in a visible, rotating cube of stars.
- Iterated with a Gaussian distribution, but ultimately ripped out the custom math and implemented `@react-three/drei`'s `Stars` component for a flawless, edge-free celestial void.
- Added smooth mouse-tracking parallax to the starfield to give the site immense depth.

### 5. Final Polish: The UI Roadmap & Pulse Sync
- Executed the final UI roadmap: adding the `[CODEX]` Navbar, the Date/Time/Location grid, the action buttons, and absolute-positioned glassmorphic metrics cards orbiting the laptop.
- Built the **Git Screen**: Projected a glowing HTML/CSS layout (featuring a file tree and a node-based Git graph) directly onto the tilted 3D face of the laptop.
- Built **The Pulse**: Wired up a `window.dispatchEvent('terminalPulse')` inside the Terminal's typing loop. Bound this event to a uniform (`uPulse`) in the WebGL shader to trigger a bright, undulating shockwave through the 3D particles exactly when the code is committed.

## 🏃‍♂️ How to Run Locally

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
2. Start the dev server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Open \`http://localhost:5173\` in your browser.
