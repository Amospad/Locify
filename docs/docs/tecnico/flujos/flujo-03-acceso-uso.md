---
sidebar_position: 3
title: Flujo 3 - Acceso y Uso (Check-in/out)
---

# Flujo 3 - Acceso y Uso del Parqueadero

**Objetivo:** Gestionar el ingreso físico, el tiempo de parqueo y la salida con cobro automático.

**Actores:** Conductor, Operador, Sistema.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Conductor muestra QR en la entrada/]
    B --> C[Operador escanea QR]
    C --> D{¿QR Válido?}
    D -->|No| E[Operador deniega acceso]
    E --> F([Fin])
    D -->|Sí| G[Sistema cambia estado a EN_USO]
    G --> H[Inicia cronómetro de tiempo]
    H --> I[Transcurre tiempo de parqueo]
    I --> J[Operador solicita Check-out]
    J --> K[Sistema calcula tiempo y costo]
    K --> L{¿Cobro Automático?}
    L -->|Sí| M[Sistema cobra tarjeta]
    L -->|No| N[Operador cobra manual]
    M --> O[Sistema cambia a COMPLETADA y libera cupo]
    N --> O
    O --> P([Fin])
```
