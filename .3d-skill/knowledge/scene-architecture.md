# Scene Architecture

## Scene Graph Organization
- Root scene: ambient + environment
- Group visible objects under a parent Group for easy transforms
- Keep hierarchy flat (max 3-4 levels deep)

## Camera Setup
```js
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 2, 5)
```

## Responsive Handling
```js
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```

## Render Loop Pattern
```js
let animationId
const clock = new THREE.Clock()
function animate() {
  animationId = requestAnimationFrame(animate)
  const delta = clock.getDelta()
  controls?.update()
  composer.render()
}
```
