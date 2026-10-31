# Realistic 3D Rendering

## PBR Materials

Use MeshStandardMaterial or MeshPhysicalMaterial for realistic materials.

```js
// Realistic material — never MeshBasicMaterial
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.8,       // 0 = plastic, 1 = metal
  roughness: 0.2,       // 0 = mirror, 1 = rough
  envMapIntensity: 1.5,
})

// Glass / transparent
const glass = new THREE.MeshPhysicalMaterial({
  metalness: 0.9,
  roughness: 0.1,
  transmission: 0.5,
  thickness: 1.5,
  ior: 1.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1,
})
```

## Lighting Setup

```js
// 1. Environment map (most important for realism)
const pmremGenerator = new THREE.PMREMGenerator(renderer)
const envTexture = await new RGBELoader().loadAsync('studio.hdr')
const envMap = pmremGenerator.fromEquirectangular(envTexture).texture
scene.environment = envMap

// 2. Key light (main source)
const keyLight = new THREE.DirectionalLight(0xfff5e0, 3)
keyLight.position.set(5, 8, 5)
keyLight.castShadow = true
keyLight.shadow.mapSize.set(2048, 2048)
keyLight.shadow.bias = -0.001

// 3. Fill light
const fillLight = new THREE.DirectionalLight(0xc8d8ff, 1)
fillLight.position.set(-5, 3, -5)

// 4. Rim light
const rimLight = new THREE.DirectionalLight(0xffffff, 2)
rimLight.position.set(0, 5, -8)
```

## Post-Processing

```js
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.4, 0.4, 0.85))
composer.addPass(new SSAOPass(scene, camera, w, h))
composer.addPass(new SMAAPass(w, h))
// Use composer.render() instead of renderer.render()
```

## Shadows

```js
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// Shadow catcher
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.ShadowMaterial({ opacity: 0.3 }))
floor.receiveShadow = true
floor.rotation.x = -Math.PI / 2
```

## Renderer Settings

```js
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.outputColorSpace = THREE.SRGBColorSpace
```
