---
sidebar_position: 2
title: Flujo 2 - Búsqueda y Reserva (Crítico)
---

# Flujo 2 - Búsqueda y Reserva

**Objetivo:** Permitir al conductor encontrar un parqueadero en el mapa y asegurar su cupo con o sin pago.

**Actores:** Conductor, Frontend, Backend, Pasarela de Pagos.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Conductor selecciona Sede en el mapa/]
    B --> C[Conductor elige modalidad]
    C --> D{¿Reserva Garantizada?}
    D -->|Sí| E[Frontend procesa pago en Pasarela]
    E --> F{Pago Exitoso?}
    F -->|No| G[Error de pago, reintentar]
    G --> C
    F -->|Sí| H[Backend valida cupo y crea Reserva]
    D -->|No| H
    H --> I[/Devuelve CodigoQR/]
    I --> J[Muestra modal con QR]
    J --> K([Fin])
```
