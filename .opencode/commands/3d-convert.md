---
description: Wrap an HTML component in a Three.js scene with lighting and controls
---

Wrap an HTML element/component in a Three.js 3D scene.

**Usage:** `convert <selector>`

**Requirements:**
- Create a Three.js scene wrapping the target DOM element
- Full PBR lighting: HDR env map, key/fill/rim
- OrbitControls
- MeshStandardMaterial/MeshPhysicalMaterial
- ACESFilmicToneMapping, SRGBColorSpace
- Dispose on unmount
