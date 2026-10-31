# GSAP Animation Rules

## Easing by Type

| Animation Type | Easing |
|---|---|
| Camera movement | `power2.inOut` |
| Entrance | `elastic.out(1, 0.4)` |
| UI elements | `power3.out` |
| Hover/feedback | `back.out(2)` |

## ScrollTrigger

```js
gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  scrollTrigger: {
    trigger: '#section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1.5,       // Always numeric, never boolean
  }
})
```

## Mouse Parallax

```js
const mouse = new THREE.Vector2()
const target = new THREE.Vector2()
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
})
// In animation loop:
target.x += (mouse.x - target.x) * 0.05  // lerp factor: 0.03-0.08
target.y += (mouse.y - target.y) * 0.05
group.rotation.x = target.y * 0.3
group.rotation.y = target.x * 0.3
```

## Timeline Management
- Max 3 concurrent GSAP timelines
- Call `tl.kill()` on cleanup
- Use GSAP for all animations — never manual frame increments
