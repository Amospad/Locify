---
description: Load a GLB/GLTF 3D model with auto-centering, auto-scaling, and OrbitControls
---

Load a GLB/GLTF 3D model into the scene.

**Usage:** `model <path>`

**Requirements:**
- Use GLTFLoader (import from three/addons)
- Auto-center via Box3
- Auto-scale to fit viewport
- OrbitControls with damping (0.05) and auto-rotate
- MeshStandardMaterial/MeshPhysicalMaterial on loaded meshes
- ACESFilmicToneMapping, SRGBColorSpace
- GSAP entrance animation on load
- Dispose on unmount
