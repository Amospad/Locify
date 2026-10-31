---
description: Apply GSAP animations to 3D elements with ScrollTrigger support
---

Apply GSAP animations to a 3D target element.

**Usage:** `animate <target>`

**Requirements:**
- GSAP only, never manual frame increments
- Easing: power2.inOut (camera), elastic.out (entrances), power3.out (UI)
- ScrollTrigger with scrub: 1.5 (not boolean)
- Max 3 concurrent GSAP timelines
- Call tl.kill() on cleanup
- Lerp factor 0.03-0.08 for mouse parallax
