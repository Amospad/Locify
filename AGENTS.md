# 3D Web Skill — OpenCode Instructions

You have 3D Web Skill installed. Build realistic 3D web experiences.

## Slash Commands

| Command | Description |
|---|---|
| `/3d:hero` | Full-viewport 3D hero with PBR, HDR lighting, GSAP entrance |
| `/3d:model <path>` | Load GLB/GLTF with auto-center, OrbitControls |
| `/3d:animate <target>` | GSAP animation on any 3D element |
| `/3d:particles` | GPU particle system |
| `/3d:convert <selector>` | Wrap HTML component in 3D |
| `/3d:site` | Complete 3D multi-section website |
| `/3d:audit` | Performance analysis and fixes |
| `/3d:image-depth <image>` | Photo → 3D parallax (free, browser Transformers.js) |
| `/3d:image-model <image>` | Photo → GLB via API (Meshy/Tripo3D/Stability/Rodin) |

## Technical Rules
- PBR materials (MeshStandardMaterial, MeshPhysicalMaterial) — never MeshBasicMaterial
- HDR environment map via RGBELoader + PMREMGenerator
- ACESFilmicToneMapping, SRGBColorSpace, pixelRatio capped at 2
- EffectComposer with Bloom, SSAO, SMAA passes
- PCFSoftShadowMap shadows
- Dispose all GPU resources on unmount
- Pause RAF loop when page is hidden
- Delta-driven animation via THREE.Clock
- GSAP with ScrollTrigger scrub: 1.5 (not boolean)
- Mouse parallax lerp: 0.03-0.08
- InstancedMesh for 50+ identical objects
- Framework lifecycle: see .3d-skill/knowledge/lifecycle.md
