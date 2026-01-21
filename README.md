# Portfolio (Vite + React + TypeScript + Three.js)

This is a minimal single-page portfolio template using Vite, React, TypeScript and Three.js for a small animated hero visual.

Quick start (Windows PowerShell):

```powershell
cd c:\Users\Admin\Desktop\portfolio
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

Notes:
- The sample Three.js scene is in `src/components/ThreeScene.tsx` and uses a rotating TorusKnot.
- To deploy, build with `npm run build` and host the `dist` folder on any static host.

Possible next steps:
- Add Tailwind CSS or a design system.
- Replace the scene with `@react-three/fiber` for React-native 3D integration.
- Add routes and project pages if you want multiple views.
