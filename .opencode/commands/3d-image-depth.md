---
description: Convert a photo to 3D parallax using browser-based depth estimation
---

Convert a photo to a 3D parallax effect using depth estimation.

**Usage:** `image-depth <image>`

**Requirements:**
- Transformers.js depth estimation (browser-only, free)
- Create displacement mesh from depth map
- Mouse-follow parallax with lerp factor 0.03-0.08
- MeshStandardMaterial on displacement mesh
- Dispose textures and geometries on unmount
