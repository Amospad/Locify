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

## 5. Logotipo Oficial (2026-10-29 — aprobado)

La identidad oficial aprobada por el equipo es el concepto **C-1 «Vía libre»**. La
especificación completa vive en `static/img/brand/especificacion-logo.md`
(archivo de especificación, no página del sitio) y el board de decisión
(conceptos, racional y renders) en `static/img/brand/board-locify.html`,
ambos junto a los masters de la marca en `static/img/brand/`.

> Los assets derivados ya están integrados en el build: `static/img/logo.svg`
> (lockup full-color en la navbar), `static/img/favicon.ico` (16/32/48 px),
> `static/img/social-card.png` (1200 × 630) y la familia `favicon-16/32`,
> `apple-touch-icon` y `android-chrome-192/512`, declarados en
> `docusaurus.config.ts → headTags`.

### 5.1 El símbolo

**Celda con puerta siempre abierta + tick verde que sale por ella.** Lectura:
*celda libre confirmada*. El verde representa un **estado** (disponible /
confirmado), el mismo rol que ese color tiene en la UI; la puerta siempre abierta
significa que el sistema fluye (check-in → check-out → cobro).

### 5.2 Colores por rol (los mismos tokens de la §1)

| Elemento | HEX | Trabajo |
| :--- | :--- | :--- |
| Azul Acero | `#2F5D9F` | Celda (estructura de la marca); acción primaria |
| Azul Profundo | `#244A80` | Fondos para la versión reverse; estados hover |
| Grafito | `#1F2937` | Wordmark y versiones mono |
| Verde | `#00C853` | **Solo estado**: check / celda libre / confirmación. Nunca relleno decorativo; nunca más de 25 % de la superficie |
| Blanco | `#FFFFFF` | Versión reverse |

### 5.3 Tipografía del wordmark

**Poppins SemiBold** (SIL **OFL 1.1**, libre, con uso comercial). En los SVG
masters el texto está **delineado a paths** (sin `<text>`, sin `font-family`):
no se vuelve a componer la palabra con la fuente viva ni con otra; para
cualquier uso nuevo se parte de los masters. El fallback para el resto del
sistema visual es el stack tipográfico de la §2.

### 5.4 Reglas de uso (resumen; el detalle completo y el clearspace viven en la espec)

**Área de exclusión:** `x = 25 % de la altura de la marca` en los cuatro lados.
**Tamaños mínimos:** marca sola 16 px (favicon, validado por render); lockup
horizontal 96 px de alto en pantalla / 28 mm impreso.

Tres «no hacer» específicas:

1. **No recolorear ni rotar el check** — el verde es un estado del producto, no
   un acento decorativo.
2. **No reconstruir el wordmark con la fuente viva** — usar únicamente los SVG
   masters (paths).
3. **No usar el lockup full-color sobre verde ni sobre fotos con contraste
   caótico** — usar la versión mono (grafito) o reverse con banda sólida
   (Azul Profundo o Grafito).

## 7. Patrones Avanzados UI/UX Awwwards

### 7.1 Skeletons y Empty States
- **Skeletons:** Usar placeholders animados con nimate-pulse en vez de spinners de texto. Aplica en dashboards y listados.
- **Empty States:** Ilustraci�n amigable + mensaje claro + CTA primario. Ejemplo: Dashboard sin reservas.

### 7.2 Glassmorphism y Micro-interacciones
- Barras de b�squeda y filtros con g-white/80 backdrop-blur-md rounded-[24px].
- Tarjetas con hover whileHover={{ scale: 1.02, y: -2 }} y ramer-motion para entrada escalonada.
- Scroll snap en listas tipo Apple Maps: scroll-snap-type: y mandatory.

### 7.3 Accesibilidad
- Contraste WCAG AA para textos sobre fondos claros/oscuros.
- Respetar prefers-reduced-motion en animaciones.
- Estados focus visibles en inputs con borde Azul Acero.

