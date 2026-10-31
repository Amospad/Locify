---
name: 3d-web
description: Build production-quality 3D experiences with Three.js, GSAP, HDR lighting, PBR materials, and image-to-3d conversion
---

# 3D Web Skill — OpenCode Instructions

You have 3D Web Skill installed. Use these commands to generate production-quality 3D experiences.

## Framework

This project uses vanilla. Apply the correct lifecycle adapter automatically.

## Commands

- `/3d:hero` — Generate a full-viewport 3D hero section with PBR materials, HDR environment map, key/fill/rim lighting, and GSAP entrance animation. Use MeshStandardMaterial/MeshPhysicalMaterial. Never use MeshBasicMaterial.
- `/3d:model <path>` — Load a GLB/GLTF model with GLTFLoader. Auto-center via Box3, auto-scale to fit, attach OrbitControls with damping and auto-rotate.
- `/3d:animate <target>` — Apply GSAP animations to any 3D element. Use proper easing: power2.inOut for camera, elastic.out for entrances, power3.out for UI. Use ScrollTrigger with scrub: 1.5 (not boolean).
- `/3d:particles` — Create a GPU particle system with THREE.Points, BufferGeometry, configurable count/size/color.
- `/3d:convert <selector>` — Wrap an HTML component in a Three.js scene with lighting and controls.
- `/3d:site` — Generate a complete 3D website with hero, about, features, footer sections using ScrollTrigger animations.
- `/3d:audit` — Check performance: pixelRatio cap, ACESFilmicToneMapping, proper disposal, visibility pause, delta loops.
- `/3d:image-depth <image>` — Convert photo to 3D parallax using Transformers.js depth estimation (browser-only, free). Create displacement mesh with mouse follow.
- `/3d:image-model <image>` — Convert photo to GLB via Meshy/Tripo3D/Stability AI/Rodin API. Show progress bar during generation. Load with OrbitControls + GSAP entrance.

## Realism Rules
- Always use MeshStandardMaterial or MeshPhysicalMaterial with metalness, roughness, envMapIntensity
- Load HDR environment maps via RGBELoader + PMREMGenerator
- Use ACESFilmicToneMapping, SRGBColorSpace, pixelRatio capped at 2
- Add Bloom + SSAO + SMAA post-processing passes
- Enable shadows with PCFSoftShadowMap, set shadow bias

## Performance Rules
- Dispose geometries, materials, textures on unmount (scene.traverse)
- Pause animation loop when page hidden (visibilitychange)
- Use THREE.Clock.getDelta() for frame-rate-independent animation
- Use InstancedMesh for 50+ identical objects

## Animation Rules
- GSAP for all animations, never manual frame increments
- Lerp factor 0.03-0.08 for mouse parallax
- Max 3 concurrent GSAP timelines
- Call tl.kill() on cleanup

## Lifecycle
Refer to .3d-skill/knowledge/lifecycle.md for framework-specific mount/cleanup.
