---
sidebar_position: 10
title: Flujo 10 - Gestión de Reservas Parqueadero
---

# Flujo 10 - Gestión de Reservas Parqueadero

**Objetivo:** Permitir al operador visualizar y gestionar las reservas activas por sede, filtrando por estado para optimizar la operación (Ref: **CU-P-18**, **CU-P-19**).

**Actores:** Operador de Parqueadero, Frontend, Backend.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Operador accede a módulo de reservas/]
    B --> C[CU-P-18: Visualiza reservas por sede]
    C --> D[Lista reservas con datos cliente, placa y horario]
    D --> E[CU-P-19: Filtra reservas por estado]
    E --> F{¿Estado seleccionado?}
    F -->|Activa| G[Muestra reservas vigentes]
    F -->|Completada| H[Muestra reservas cerradas]
    F -->|Cancelada| I[Muestra reservas canceladas]
    G --> J[Operador puede revisar detalles]
    H --> J
    I --> J
    J --> K[Backend retorna información detallada]
    K --> L[Interfaz muestra datos actualizados]
    L --> M([Fin])
```

## Escenarios BDD Asociados
- **CU-P-18 (Visualizar Reservas por Sede):** *Given* operador seleccionado sede, *When* consulta reservas, *Then* visualiza todas las reservas asociadas con datos completos.
- **CU-P-19 (Filtrar por Estado):** *Given* lista de reservas, *When* operador aplica filtro por estado, *Then* sistema muestra solo reservas del estado seleccionado.
