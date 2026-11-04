---
sidebar_position: 5
title: Flujo 5 - Historial y Vehículos
---

# Flujo 5 - Historial y Gestión de Vehículos

**Objetivo:** Permitir al conductor consultar sus reservas activas, pasadas y gestionar sus placas.

**Actores:** Conductor, Sistema.

**Casos de Uso vinculados:** CU-C-01, CU-C-05, CU-C-06, CU-C-07

| CU | Nombre | RF | Estado |
|---|---|---|---|
| CU-C-01 | Consultar Dashboard | RFC-01 a RFC-05 | ✅ |
| CU-C-05 | Consultar Actividad y Transacciones | RFC-23 a RFC-26 | ✅ |
| CU-C-06 | Gestionar Beneficios y Créditos | RFC-27 a RFC-29 | ✅ |
| CU-C-07 | Gestionar Vehículos | RFC-30 a RFC-31 | ✅ |

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart LR
    A([Inicio]) --> B[Conductor entra a /dashboard]
    B --> C{¿Ver reserva activa?}
    C -->|Sí| D[/Muestra QR y estado (CU-C-01)/]
    C -->|No| E[/Ve historial (CU-C-05)/]
    B --> F[Gestiona Vehículos (CU-C-07)]
    F --> G{Agregar/Editar/Eliminar}
    G --> H[Agrega nueva placa]
    G --> I[Edita placa existente]
    G --> J[Inactiva placa]
    D --> K([Fin])
    E --> K
    H --> K
    I --> K
    J --> K
```

**Gestión de Créditos (CU-C-06):**

```mermaid
flowchart TD
    A[Desde Dashboard] --> B[Ir a "Mis Beneficios"]
    B --> C{Mostrar saldo créditos}
    C --> D[Ver historial de créditos (CU-C-06)]
    C --> E[Aplicar créditos a reserva (CU-C-06)]
    D --> F([Fin])
    E --> F
```
