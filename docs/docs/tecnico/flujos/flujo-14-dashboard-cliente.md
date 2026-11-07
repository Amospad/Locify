---
sidebar_position: 14
title: Flujo 14 - Dashboard Cliente
---

# Flujo 14 - Dashboard Cliente

**Objetivo:** Permitir al cliente visualizar su estado actual, reservas activas, contador de uso y alertas desde el dashboard principal (Ref: **CU-C-01**).

**Actores:** Cliente, Frontend, Backend.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Cliente inicia sesión/]
    B --> C[CU-C-01: Sistema consulta estado del cliente]
    C --> D{¿Cliente tiene actividad?}
D -->|Reserva activa| E["Muestra tarjeta de reserva con: sede, placa, hora inicio, tiempo restante"]
    D -->|Check-in en curso| F["Muestra estado 'En curso' con cronómetro activo"]
    D -->|Sin actividad| G["Muestra estado vacío con botón 'Buscar parqueadero'"]
    E --> H[Muestra acciones: Ver QR, Cancelar]
    F --> I[Muestra acciones: Ver QR, Finalizar uso]
    G --> J[Muestra sugerencias y parqueaderos cercanos]
    H --> K[Cliente interactúa con acciones disponibles]
    I --> K
    J --> K
    K --> L[Backend procesa acción solicitada]
    L --> M[Dashboard se actualiza en tiempo real]
    M --> N([Fin])
```

## Escenarios BDD Asociados
- **CU-C-01 Escenario 1 (Dashboard con reserva activa):** *Given* usuario logueado tiene reserva garantizada vigente, *When* accede al dashboard, *Then* muestra sede, placa, hora inicio, tiempo restante y acciones disponibles.
- **CU-C-01 Escenario 2 (Dashboard sin reservas):** *Given* usuario sin reservas activas, *When* accede al dashboard, *Then* muestra estado vacío con mensaje indicativo y acción principal de búsqueda.
- **CU-C-01 Escenario 3 (Check-in en curso):** *Given* usuario tiene check-in activo, *When* accede al dashboard, *Then* muestra estado "En curso" con cronómetro desde check-in.
