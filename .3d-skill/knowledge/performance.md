# Performance Optimization

## Renderer Config
- pixelRatio: Math.min(window.devicePixelRatio, 2)
- ACESFilmicToneMapping for realistic look
- SRGBColorSpace output

## Memory Cleanup
```js
function cleanup() {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose()
    if (obj.material) {
      Object.values(obj.material).forEach(v => { if (v?.isTexture) v.dispose() })
      Array.isArray(obj.material) ? obj.material.forEach(m => m.dispose()) : obj.material.dispose()
    }
  })
  renderer.dispose()
  renderer.forceContextLoss()
}
```

## Animation Loop
```js
const clock = new THREE.Clock()
function animate() {
  const delta = clock.getDelta()
  requestAnimationFrame(animate)
  // use delta for all animation values
}
document.addEventListener('visibilitychange', () => {
  document.hidden ? cancelAnimationFrame(id) : animate()
})
```

## Instancing
Use InstancedMesh for 50+ identical geometries instead of individual Meshes.

## Texture Optimization
- Use WebP format instead of PNG
- Compress HDR environment maps
- Use texture atlas for multiple small textures

## Avoid in Animation Loop
- No `new THREE.Vector3()` or `new THREE.Object3D()`
- No `JSON.parse()` or heavy string operations
- No dynamic buffer attribute re-allocations
