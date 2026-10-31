---
description: Generate a full-viewport 3D hero section with PBR materials, HDR lighting, and GSAP entrance
---

Generate a production-quality full-viewport 3D hero section.

**Requirements:**
- Use MeshStandardMaterial or MeshPhysicalMaterial (never MeshBasicMaterial)
- Load HDR environment map via RGBELoader + PMREMGenerator
- Key/fill/rim lighting setup
- GSAP entrance animation (tl.fromTo, power2.out)
- ACESFilmicToneMapping, SRGBColorSpace, pixelRatio capped at 2
- Bloom + SSAO + SMAA post-processing
- PCFSoftShadowMap shadows with bias
- Dispose on unmount, pause on visibilitychange, THREE.Clock.getDelta()
