# Troubleshooting Common Three.js Issues

## Shadow Acne
**Fix:** Adjust shadow.bias (-0.001 to -0.005) and shadow.normalBias
```js
light.shadow.bias = -0.001
light.shadow.normalBias = 0.02
```

## Texture Loading (CORS / Cross-Origin)
**Fix:** Use TextureLoader with crossOrigin or ensure server sends CORS headers. For local dev, use a local server (not file://).

## Memory Leaks
**Fix:** Always dispose on unmount. Use `renderer.forceContextLoss()` after `renderer.dispose()`. Avoid creating new objects in animation loop.

## WebGL Context Loss
**Fix:** 
```js
renderer.domElement.addEventListener('webglcontextlost', (e) => {
  e.preventDefault()
  cancelAnimationFrame(animationId)
})
renderer.domElement.addEventListener('webglcontextrestored', () => {
  // re-initialize
  animate()
})
```

## Mobile Performance
- pixelRatio cap at 2 (or 1.5 for low-end)
- Disable post-processing on mobile
- Use lower polygon counts
- Reduce shadow map size to 1024

## GLB Model Not Showing
- Check model is added to scene
- Auto-center and scale: model may be far from origin
- Check for missing textures in the GLB
- Verify the model loads (check for 404s on .bin files)

## Environment Map Not Reflecting
- scene.environment must be set (not just scene.background)
- Material must be MeshStandardMaterial or MeshPhysicalMaterial
- envMapIntensity may need to be > 1
