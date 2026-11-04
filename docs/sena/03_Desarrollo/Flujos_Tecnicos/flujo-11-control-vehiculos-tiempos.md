---
sidebar_position: 11
title: Flujo 11 - Control de Vehículos y Tiempos
---

# Flujo 11 - Control de Vehículos y Tiempos

**Objetivo:** Permitir al operador monitorear vehículos activos en la sede y detectar sobretiempos automáticamente para gestionar alertas y penalizaciones (Ref: **CU-P-20**, **CU-P-21**).

**Actores:** Operador de Parqueadero, Frontend, Backend, Sistema de Monitoreo.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Operador accede a panel de control de vehículos/]
    B --> C[CU-P-20: Visualiza vehículos activos en sede]
    C --> D[Lista con placa, celda, hora ingreso y tiempo transcurrido]
    D --> E[CU-P-21: Sistema detecta sobretiempos automáticamente]
    E --> F{¿Vehículo en sobretiempo?}
    F -->|Sí| G[Genera alerta operativa]
    F -->|No| H[Continúa monitoreo]
    G --> I[Alerta muestra placa, tiempo excedido y monto penalidad]
    I --> J[Operador decide acción: cobrar, notificar cliente o forzar salida]
    J --> K[Backend actualiza estado y registra evento]
    K --> L[Dashboard se actualiza en tiempo real]
    L --> M([Fin])
```

## Escenarios BDD Asociados
- **CU-P-20 (Vehículos Activos):** *Given* sede operativa, *When* operador consulta vehículos activos, *Then* visualiza lista completa con datos de ingreso y tiempo.
- **CU-P-21 (Detección Sobretiempos):** *Given* vehículo excede tiempo reservado, *When* sistema evalúa automáticamente, *Then* genera alerta con cálculo de penalidad aplicable.
