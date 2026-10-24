---
sidebar_position: 3
title: Guía de Diseño UI/UX
---

# Guía de Diseño UI/UX (Basada en Apple HIG)

Este documento establece los lineamientos visuales y de interacción para las interfaces de LOCIFY, utilizando como referencia los **Human Interface Guidelines (HIG)** de Apple, adaptados a la web.

## 1. Principios Fundamentales
1. **Claridad:** El texto debe ser legible a cualquier tamaño. El contraste es prioritario.
2. **Deferencia:** La interfaz no debe competir con el contenido del usuario. Fondos limpios y espacios en blanco generosos.
3. **Profundidad:** Uso de sombras sutiles y capas (modales) para indicar jerarquía visual.

## 2. Tipografía
- **Fuente:** San Francisco (Apple) / Segoe UI (Windows) / Roboto (Android). En web usaremos la pila de fuentes del sistema (`-apple-system, BlinkMacSystemFont, 'Segoe UI'`).
- **Jerarquía:**
  - Títulos principales: Negrita (600).
  - Texto de párrafo: Regular (400), con un interlineado de 1.5.
  - Texto secundario: Gris (color secundario) y tamaño ligeramente menor.

## 3. Colores y Accesibilidad (A11y)
- **Modo Claro:** Fondo `#f5f5f7` (gris muy claro), texto `#1d1d1f` (gris casi negro). Evitar el negro puro y el blanco puro para reducir la fatiga visual.
- **Modo Oscuro:** Fondo `#1d1d1f`, texto `#f5f5f7`.
- **Color Primario:** Azul Apple (`#0071e3` en claro, `#2997ff` en oscuro) para botones de acción.
- **Contraste:** Todo texto debe cumplir con una relación de contraste mínima de 4.5:1 (WCAG AA).

## 4. Componentes y Espaciado
- **Bordes (Corner Radius):** 
  - Botones: Totalmente redondeados (tipo píldora, `border-radius: 980px`).
  - Bloques de código e imágenes: Redondeados suavemente (`border-radius: 12px`).
- **Sombras:** Muy sutiles, simulando elevación (`box-shadow: 0 4px 12px rgba(0,0,0,0.05)`).
- **Espaciado:** Múltiplos de 8px (8, 16, 24, 32).

## 5. Interacción y Feedback
- **Estados de carga:** Usar *skeletons* o *spinners* claros.
- **Feedback táctil (Móvil):** Los botones deben tener un estado de `hover` o `active` que reduzca su opacidad o los escale levemente.
- **Errores:** Nunca mostrar errores técnicos crudos (ej. `Error 500`). Usar mensajes claros: *"No pudimos procesar tu pago, intenta de nuevo"*.

## 6. Referencias
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- Repositorio de referencia: `dickwu/apple-design-skill`    