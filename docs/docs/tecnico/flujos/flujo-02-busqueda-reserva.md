---
sidebar_position: 2
title: Flujo 2 - Búsqueda y Reserva (Crítico)
---

# Flujo 2 - Búsqueda y Reserva

**Objetivo:** Permitir al conductor encontrar un parqueadero en el mapa y asegurar su cupo con o sin pago.

**Actores:** Conductor, Sistema, Pasarela de Pagos (Wompi).

**Casos de Uso vinculados:** CU-C-02, CU-C-07, CU-C-09

| CU | Nombre | RF | Estado |
|---|---|---|---|
| CU-C-02 | Gestionar Reservas | RFC-06 a RFC-15 | ✅ |
| CU-C-07 | Gestionar Vehículos | RFC-30 a RFC-31 | ✅ |
| CU-C-09 | Gestión Configuración | RFC-35 a RFC-38 | 🔄 |

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Conductor busca sede (CU-C-02)/]
    B --> C[Aplica filtros y hora]
    C --> D{¿Vehículo registrado?}
    D -->|Sí| E[Selecciona vehículo (CU-C-07)]
    D -->|No| F[/Agregar vehículo (CU-C-07)/]
    E --> G[Elige modalidad]
    F --> G
    G --> H{¿Paga anticipado?}
    H -->|Sí| I[Procesar pago (CU-C-02)]
    I --> J{Pago Exitoso?}
    J -->|No| K[Error, reintentar]
    K --> G
    J -->|Sí| L[Crear reserva]
    H -->|No| L
    L --> M[/Generar QR (CU-C-02)/]
    M --> N[Mostrar confirmación]
    N --> O([Fin])
```
