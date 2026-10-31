# Framework Lifecycle Adapters

## React / Next.js
```jsx
useEffect(() => {
  const renderer = new THREE.WebGLRenderer()
  // ... setup
  return () => {
    cleanup()  // dispose all
  }
}, [])
```

## Vue / Nuxt
```vue
<script setup>
import { onMounted, onUnmounted } from 'vue'
onMounted(() => { /* setup Three.js */ })
onUnmounted(() => { cleanup() })
</script>
```

## Angular
```typescript
ngAfterViewInit() { /* setup Three.js */ }
ngOnDestroy() { cleanup() }
```

## Svelte / SvelteKit
```svelte
<script>
import { onMount } from 'svelte'
onMount(() => { /* setup Three.js */; return () => cleanup() })
</script>
```

## Astro
```html
<script>
document.addEventListener('DOMContentLoaded', () => { /* setup Three.js */ })
document.addEventListener('astro:before-swap', cleanup)
</script>
```

## Solid.js
```jsx
import { onMount, onCleanup } from 'solid-js'
onMount(() => { /* setup Three.js */ })
onCleanup(() => cleanup())
```

## Vanilla
```js
document.addEventListener('DOMContentLoaded', () => { /* setup Three.js */ })
// Cleanup via removeEventListener or page unload
```
