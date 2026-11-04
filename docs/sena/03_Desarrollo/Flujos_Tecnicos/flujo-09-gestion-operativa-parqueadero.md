---
sidebar_position: 9
title: Flujo 9 - Gestión Operativa del Parqueadero
---

# Flujo 9 - Gestión Operativa del Parqueadero

**Objetivo:** Permitir al operador del parqueadero gestionar operaciones diarias incluyendo visualización de dashboard operativo, alertas, búsqueda de vehículos, registro de ingresos y eventos manuales (Ref: **CU-P-12**, **CU-P-13**, **CU-P-14**, **CU-P-15**, **CU-P-16**, **CU-P-17**).

**Actores:** Operador de Parqueadero, Frontend, Backend, Sistema de Sensores.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Operador inicia sesión en Dashboard Operativo/]
    B --> C[CU-P-12: Visualiza dashboard con ocupación en tiempo real]
    C --> D[CU-P-13: Revisa alertas operativas (conflictos o sobretiempos)]
    D --> E{¿Acción requerida?}
    E -->|Búsqueda| F[CU-P-14: Busca vehículo por placa]
    E -->|Ingreso| G[CU-P-15: Registra ingreso de vehículo (validar reserva o manual)]
    E -->|Evento manual| H[CU-P-16: Registra eventos manuales entrada/salida]
    E -->|Forzar salida| I[CU-P-17: Forzar salida de vehículo]
    F --> J[Backend valida y retorna resultados]
    G --> K[Backend actualiza estado y cronómetro]
    H --> K
    I --> L[Backend cierra sesión y cobra automáticamente]
    J --> M[Actualiza interfaz de operador]
    K --> M
    L --> M
    M --> N([Fin])
```

## Escenarios BDD Asociados
- **CU-P-12 (Dashboard Operativo):** *Given* el operador accede al dashboard, *When* la sede está activa, *Then* visualiza ocupación en tiempo real y métricas clave.
- **CU-P-13 (Alertas Operativas):** *Given* un conflicto o sobretiempo, *When* el sistema detecta la anomalía, *Then* genera alerta visible en dashboard.
- **CU-P-14 (Búsqueda Vehículo):** *Given* operador ingresa placa, *When* busca en sistema, *Then* retorna datos de reserva, estado y tiempo.
- **CU-P-15 (Registro Ingreso):** *Given* vehículo llega, *When* operador confirma ingreso, *Then* valida reserva o registra manual y inicia cronómetro.
- **CU-P-16 (Eventos Manuales):** *Given* falla del sistema automático, *When* operador registra evento manualmente, *Then* se actualiza estado de vehículo.
- **CU-P-17 (Forzar Salida):** *Given* situación excepcional, *When* operador fuerza salida, *Then* se cierra sesión y procesa cobro final.
