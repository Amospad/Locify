---
sidebar_position: 3
title: Guía de Diseño UI/UX
---

# Guía de Diseño UI/UX de LOCIFY

Este documento establece los lineamientos visuales, de interacción y de marketing para las interfaces de LOCIFY.

## 1. Estrategia de Marca y Psicología del Color

LOCIFY es una plataforma de movilidad urbana. Nuestra identidad visual debe transmitir **confianza (por el manejo de pagos)** pero también **rapidez y eficiencia**.

### 1.1 Paleta Base (Confianza y Corporativo)
- **Azul Acero (`#2F5D9F`):** Color primario de la marca. Usado en la barra de navegación, el logo y los textos principales.
- **Azul Profundo (`#244A80`):** Para estados *hover* o elementos de énfasis.
- **Azul Muy Claro (`#E6EEF8`):** Fondo de tarjetas (Cards) para dar un toque tecnológico y limpio.

### 1.2 Color de Acción / CTA (Marketing)
> **Regla de conversión:** Los botones de acción (ej. "Reservar Ahora", "Pagar", "Validar QR") **NO usarán el azul de la marca**. 
> Para generar urgencia y positividad (vía libre), usaremos un **Verde Esmeralda (`#00C853`)** o un **Naranja Cálido (`#FF7A00`)**. Estos colores destacan sobre el fondo claro y aumentan la tasa de clics (CTR).

### 1.3 Colores Neutros y de Estado
- **Gris Claro (`#F4F6F8`):** Fondo general (Modo Claro).
- **Grafito (`#1F2937`):** Texto principal (evita el negro puro).
- **Gris Oscuro (`#4B5563`):** Texto secundario.
- **Éxito (`#2E7D5B`):** Confirmaciones (se alinea con el verde de acción).
- **Advertencia (`#C58A00`):** Sobretiempo o alertas.
- **Error (`#C23B3B`):** Fallos de pago o QRs inválidos.

## 2. Tipografía y Espaciado
- **Fuente:** San Francisco / Segoe UI / Roboto (Pila del sistema).
- **Botones:** Ligeramente redondeados (`border-radius: 6px`) para transmitir seriedad B2B, pero con sombras suaves (`box-shadow`) para hacerlos resaltar.

## 3. Diseño Responsivo y Mobile-First

LOCIFY se diseña **primero para pantallas pequeñas** y luego se amplía. El conductor reserva desde el celular, de pie y con una mano; el mismo conductor puede abrir la reserva en el computador de su casa. La interfaz tiene que funcionar en ambos casos sin dos productos distintos.

### 3.1 Puntos de corte

| Rango | Objetivo | Regla de composición |
| :--- | :--- | :--- |
| **< 640 px** | Móvil (360 px como caso base) | Una columna; acciones primarias a ancho completo; navegación inferior; nada esencial oculto tras *hover* |
| **640–1023 px** | Tableta / móvil horizontal | Dos columnas; barra lateral colapsable; mismas áreas táctiles |
| **≥ 1024 px** | Escritorio | Barra lateral fija; contenido con ancho máximo de lectura; tablas en lugar de tarjetas; `hover` y atajos de teclado |

Los puntos de corte se declaran con `min-width` (mobile-first), nunca con `max-width`, para que el estilo base sea el del teléfono.

### 3.2 Reglas de interacción

- **Área de toque mínima 44 × 44 px**, también en escritorio: un *touchpad* y una pantalla táctil de portátil existen. El área táctil puede ser mayor que el icono visible (padding transparente).
- **Nada exclusivo de `hover`:** todo lo que aparece al pasar el ratón debe poder revelarse con foco de teclado o con un toque. Apple HIG lo exige para iPadOS con puntero y para macOS.
- **Tipografía fluida** con `clamp()` sobre la escala del §2; el cuerpo nunca baja de 16 px para evitar el zoom automático de iOS en los campos de formulario.
- **Formularios:** `inputmode`, `autocomplete` y `type` correctos (email, tel, numeric) para que el teclado del móvil sea el adecuado, y etiquetas visibles (no sólo *placeholder*).
- **Áreas seguras:** `env(safe-area-inset-*)` en la navegación inferior para no quedar bajo el *notch* ni la barra de gestos.
- **Tablas → tarjetas:** un listado con más de tres columnas se convierte en tarjetas apiladas por debajo de 640 px; nunca se fuerza *scroll* horizontal en la acción principal.
- **QR legible en ambos entornos:** a pantalla completa en móvil y descargable/imprimible en A4 desde escritorio (HU-26).
- **Rendimiento percibido:** los mapas se cargan de forma diferida y las listas usan *skeletons*; una conexión móvil lenta no debe mostrar una pantalla en blanco.

### 3.3 Principios Apple HIG aplicados a las dos plataformas

| Principio HIG | En móvil (iOS) | En escritorio (macOS / web) |
| :--- | :--- | :--- |
| **Claridad** | Jerarquía tipográfica y contraste 4.5:1 | Misma jerarquía; el espacio extra no se rellena con decoración |
| **Deferencia** | El contenido ocupa la pantalla; controles discretos | Barras laterales y menús no compiten con el contenido |
| **Profundidad** | Hojas y *drawers* con sombra | Modales centrados y popovers anclados al control |
| **Retroalimentación** | Vibración/háptica cuando exista; si no, estado visible | `hover`, `active` y `focus-visible` explícitos |

Los detalles de contraste, foco y movimiento reducido viven en [Principios de Interacción (Apple HIG)](../guia-diseno-ui.md); esta sección sólo añade la dimensión de tamaño de pantalla.

## 4. Referencias
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Adaptivity — Apple HIG](https://developer.apple.com/design/human-interface-guidelines/layout)