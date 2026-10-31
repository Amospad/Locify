---
description: Check 3D scene performance — pixelRatio, toneMapping, disposal, delta loops
---

Audit the 3D scene for performance issues.

**Checks:**
- pixelRatio capped at 2
- ACESFilmicToneMapping enabled
- Proper disposal of geometries, materials, textures (scene.traverse)
- visibilitychange listener pauses animation loop
- THREE.Clock.getDelta() used (frame-rate-independent)
- No MeshBasicMaterial (should be Standard/Physical)
- Max 3 concurrent GSAP timelines
- InstancedMesh used for 50+ identical objects
