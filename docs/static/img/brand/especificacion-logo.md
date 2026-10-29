---
title: Especificación del logo LOCIFY (v1)
---

# Especificación del logo — LOCIFY v1

> Entrega de la skill `brand-identity` (2026-10-28). El board con conceptos, racional y
> evidencia de render vive en `board-locify.html` (junto a este archivo).
> **Estado: aprobado por el equipo el 2026-10-29.** La versión full-color horizontal
> integra la navbar de Docusaurus (`static/img/logo.svg`, reverse en modo oscuro),
> con el set de favicon (`favicon.ico` + `favicon-16/32`, `apple-touch-icon`,
> `android-chrome-192/512` en `docusaurus.config.ts → headTags`) y la tarjeta
> social `static/img/social-card.png` (1200 × 630).

## Posicionamiento

«Para operadores de parqueaderos y administradores de movilidad, LOCIFY es la plataforma SaaS
que convierte los cupos físicos en datos confiables al instante — lo que ves es lo que hay,
y cada operación queda confirmada.» El racional de conceptos completo está en el board.

## El símbolo

**C-1 «Vía libre»**: una celda (anillo cuadrado redondeado) con una puerta siempre abierta en
su costado derecho, por donde sale un tick verde. Lectura: *celda libre confirmada*.
El verde significa **estado** (disponible / confirmado), igual que en el producto; la puerta siempre
abierta significa que el sistema fluye (check-in → check-out → cobro).

## Colores (rol, no decoración)

| Nombre | HEX | Trabajo |
| :--- | :--- | :--- |
| Azul Acero | `#2F5D9F` | Celda (estructura de la marca); acción primaria |
| Azul Profundo | `#244A80` | Fondos para la versión reverse; estados hover |
| Grafito | `#1F2937` | Wordmark y versiones mono |
| Verde (acento) | `#00C853` | **Solo estado**: check / celda libre / confirmación. Nunca relleno decorativo; nunca más de 25 % de la superficie. |
| Blanco | `#FFFFFF` | Versión reverse |

## Tipografía

Wordmark empalmado con **Poppins SemiBold** — licencia **SIL Open Font License 1.1** (libre, con
uso comercial; archivo `.brandwork/.Poppins-SemiBold.ttf`). Los SVG masters son **exclusivamente paths**
(sin `<text>`, sin `font-family`): cualquier uso parte de los masters tal cual, nunca de la fuente viva.
Fallback del sistema visual (v2, pendiente): `system-ui, 'Segoe UI', sans-serif`.

## Área de exclusión (clearspace)

`x = 25 % de la altura de la marca` (≈ 16 px sobre la caja de 96). Mantener `x` en los cuatro lados.
El check sale de la puerta y necesita ese aire: nada invade, ni siquiera otros elementos de la marca.

## Tamaños mínimos

- Marca sola: **16 px** en pantalla (validado por render; hoja en `png/hoja-validacion.png`).
- Lockup horizontal: **96 px de alto** en pantalla; **28 mm** en impreso.

## Tres «no hacer» específicas de esta marca

1. **No recolorear ni rotar el check.** El verde es un estado del producto, no un acento; la primera
   iteración (anillo con barra diagonal) se descartó porque leía como señal de prohibición.
2. **No reconstruir el wordmark con la fuente viva ni con otra fuente.** Los masters son paths;
   la única fuente correcta es el archivo Poppins OFL de este repositorio.
3. **No usar el lockup full-color sobre verde ni sobre foto con caos de contraste.**
   Usar la versión mono o reverse con banda sólida (Azul Profundo o Grafito).

## Colisión de nombre (flag)

La búsqueda web no estuvo disponible durante esta sesión, así que **el nombre no pudo verificarse**
contra usos existentes (marcas, dominio `locify.com`). Recomendado antes de invertir: registrar el
dominio y hacer una búsqueda de registro de marca (movilidad / SaaS). Esto es un flag, no asesoría legal.
