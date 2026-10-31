# Image to 3D

## Approach A: Depth Parallax (Free, Browser-Only)

Uses Transformers.js for depth estimation — no external API, no data leaves the browser.

```js
import { pipeline } from '@xenova/transformers'

const depthEstimator = await pipeline('depth-estimation', 'Xenova/depth-anything-small-hf')
const result = await depthEstimator(imageUrl)
const depthMap = result.depth  // grayscale depth image

// Create displacement mesh
const geometry = new THREE.PlaneGeometry(2, 2, 256, 256)
const material = new THREE.MeshStandardMaterial({
  map: colorTexture,
  displacementMap: depthTexture,
  displacementScale: 0.3,
  displacementBias: -0.15,
})

// Mouse parallax with smooth lerp (0.05)
```

## Approach B: Full 3D Model (API Required)

Supported APIs and their endpoints:

| API | Endpoint | Quality | Speed |
|---|---|---|---|
| Meshy.ai | api.meshy.ai/v1/image-to-3d | Excellent | 1-3 min |
| Tripo3D | api.tripo3d.ai/v1 | Good | 30s |
| Stability AI | stability.ai | Excellent | 2 min |
| Rodin | hyper3d.ai | Very High | 3-5 min |

### Meshy Implementation
```js
const task = await fetch('https://api.meshy.ai/v1/image-to-3d', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ image_url: url, enable_pbr: true, ai_model: 'meshy-4' })
})
const { result: taskId } = await task.json()

async function poll(taskId) {
  while (true) {
    const status = await fetch(`https://api.meshy.ai/v1/image-to-3d/${taskId}`,
      { headers: { 'Authorization': `Bearer ${API_KEY}` } }).then(r => r.json())
    if (status.status === 'SUCCEEDED') return status.model_urls.glb
    if (status.status === 'FAILED') throw new Error('Generation failed')
    showProgress(status.progress)
    await new Promise(r => setTimeout(r, 3000))
  }
}
```

### Model Display
```js
const gltf = await new GLTFLoader().loadAsync(glbUrl)
const box = new THREE.Box3().setFromObject(gltf.scene)
const center = box.getCenter(new THREE.Vector3())
const size = box.getSize(new THREE.Vector3())
gltf.scene.position.sub(center)
gltf.scene.scale.setScalar(2 / Math.max(size.x, size.y, size.z))

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.autoRotate = true
controls.autoRotateSpeed = 2

gsap.from(gltf.scene.scale, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'elastic.out(1, 0.4)' })
```

### Progress UI
```js
progressBar.style.width = `${percent}%`
progressText.textContent = `Generating 3D model... ${percent}%`
```

### Multi-API Fallback
Try APIs in order: Meshy → Tripo3D → Stability AI → Rodin. If one fails, try the next.
