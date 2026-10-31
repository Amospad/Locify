---
sidebar_position: 4
title: Flujo 4 - Cancelación y Reembolso
---

# Flujo 4 - Cancelación y Reembolso

**Objetivo:** Permitir al conductor cancelar una reserva garantizada y calcular el reembolso según la política escalonada por anticipación.

**Actores:** Conductor, Frontend, Backend, Pasarela de Pagos.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Conductor solicita cancelación/]
    B --> C[Backend calcula tiempo restante]
    C --> D{¿Tiempo > 3h?}
    D -->|Sí| E[Reembolso 100%]
    D -->|No| F{¿Tiempo entre 1h y 3h?}
    F -->|Sí| G[Reembolso 50%]
    F -->|No| H{¿Tiempo < 1h?}
    H -->|Sí| I[Reembolso 0%]
    E --> J[Backend solicita reembolso a Pasarela]
    G --> J
    I --> K[Cancelación sin reembolso]
    J --> L[Actualiza estado a CANCELADA]
    K --> L
    L --> M([Fin])
```
