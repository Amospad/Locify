---
sidebar_position: 3
title: Principios de Interacción (Apple HIG)
---

# Principios de Interacción (Apple HIG)

Este documento describe **cómo se aplican** los *Human Interface Guidelines* de Apple a las interfaces de LOCIFY. La paleta, los radios y las sombras viven en un único lugar: la [Guía de Diseño UI/UX de LOCIFY](./referencia/guia-diseno-ui.md), cuyos valores están implementados como tokens `--locify-*` en `docs/src/css/custom.css`.

> **Corrección de auditoría:** antes existían dos documentos con el mismo título y paletas contradictorias
> (`#0071e3` azul Apple frente a `#2F5D9F` azul de marca). Esta página ya no define colores para evitar que dos
> fuentes de verdad vuelvan a divergir.

## 1. Principios fundamentales

1. **Claridad:** el texto debe ser legible a cualquier tamaño; el contraste es prioritario sobre la estética.
2. **Deferencia:** la interfaz no compite con el contenido. Fondos limpios y espacio en blanco generoso.
3. **Profundidad:** sombras y capas (modales, *drawers*) comunican jerarquía sin decorar de más.

## 2. Tipografía

- **Fuente:** pila del sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto`). No se descargan fuentes externas; se gana velocidad y se respeta la preferencia del sistema operativo.
- **Jerarquía:** títulos en peso 600, párrafos en 400 con interlineado 1.5, texto secundario con el token `--locify-ink-secondary`.
- **Escala:** los tamaños se definen en `custom.css`; no se introducen tamaños ad hoc en componentes.

## 3. Accesibilidad

- **Contraste:** mínimo 4.5:1 para texto normal y 3:1 para elementos de control (WCAG 2.2 AA). Los valores medidos están en `PROJECT_STATE.md`.
- **Foco visible:** todo elemento interactivo conserva un anillo de foco; el `outline: none` sin reemplazo está prohibido.
- **Movimiento reducido:** las animaciones se desactivan con `@media (prefers-reduced-motion: reduce)` y con `<MotionConfig reducedMotion="user">` en las animaciones de JavaScript.
- **Áreas táctiles:** mínimo 44 × 44 px en móvil.

## 4. Componentes y espaciado

- **Radios y sombras:** se toman de los tokens de marca (`--locify-radius-*`), no se escriben valores literales en los componentes.
- **Espaciado:** múltiplos de 8 px (8, 16, 24, 32, 48, 80).
- **Estados:** todo control debe tener `hover`, `active`, `focus-visible` y `disabled`; los estados de carga usan *skeletons* antes que *spinners*.

## 5. Errores y feedback

- Nunca mostrar errores técnicos crudos (`Error 500`, trazas). Mensaje claro + acción posible: *"No pudimos procesar tu pago. Intenta de nuevo o cambia de método."*
- El feedback destructivo (cancelar reserva, eliminar placa) exige confirmación explícita.

## 6. Referencias

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- Skill de apoyo: `apple-hig`, fijada en `skills-lock.json` desde `AyushRajSinghParihar/apple-human-interface-skills`. El repositorio `dickwu/apple-design-skill` que citaba la versión anterior de este documento no es el origen real de la skill instalada.
