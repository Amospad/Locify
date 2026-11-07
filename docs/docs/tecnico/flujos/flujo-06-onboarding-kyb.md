---
sidebar_position: 6
title: Flujo 6 - Onboarding KYB (Crítico)
---

# Flujo 6 - Onboarding KYB (Know Your Business)

**Objetivo:** Validar legalmente a un operador y su sede antes de que aparezca en el mapa.

**Actores:** Operador, Administrador, Sistema.

**Casos de Uso vinculados:** CU-P-01 a CU-P-11

| CU | Nombre | RF | Estado |
|---|---|---|---|
| CU-P-01 | Controlar acceso inicial | RFP-01 | ✅ |
| CU-P-02 | Registrar empresa operadora | RFP-02 | ✅ |
| CU-P-03 | Registrar representante legal | RFP-03 | ✅ |
| CU-P-04 | Cargar documentos obligatorios | RFP-04 | ✅ |
| CU-P-05 | Registrar vigencia de pólizas | RFP-05 | ✅ |
| CU-P-06 | Crear sede de parqueadero | RFP-06 | ✅ |
| CU-P-07 | Registrar capacidad del parqueadero | RFP-07 | ✅ |
| CU-P-08 | Registrar características del parqueadero | RFP-08 | ✅ |
| CU-P-09 | Cargar fotos de la sede | RFP-09 | ✅ |
| CU-P-10 | Validar registro antes del envío | RFP-10 | ✅ |
| CU-P-11 | Enviar solicitud de revisión | RFP-11 | ✅ |

> **Nota:** CU-P-01 y CU-P-11 están referenciados en el flujo de [FT-01 de Onboarding](./flujo-01-autenticacion.md) como precondiciones de acceso.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A(["Inicio - Operador nuevo"]) --> B{"¿Cuenta activa?"}
    B -->|No| C["Registro operador (CU-P-02, CU-P-03)"]
    C --> D["Cargar documentos (CU-P-04)"]
    D --> E["Registrar pólizas (CU-P-05)"]
    E --> F["Crear sede (CU-P-06)"]
    F --> G["Capacidad y características (CU-P-07, CU-P-08)"]
    G --> H["Cargar fotos (CU-P-09)"]
    H --> I{"¿Validar? (CU-P-10)"}
    I -->|No válido| J[Mostrar errores y corregir]
    J --> I
    I -->|Válido| K["Enviar para revisión (CU-P-11)"]
    B -->|Sí| L["Acceso denegado hasta aprobación (CU-P-01)"]
    K --> M[Admin revisa documentos]
    M --> N{"¿Cumple normas?"}
    N -->|Sí| O["Admin aprueba (CU-P-01)"]
    O --> P[Sede visible en mapa]
    P --> Q([Fin])
    N -->|No| R[Admin rechaza con motivo]
    R --> S[/Notifica rechazo al Operador/]
    S --> T([Fin])
```

**Flujo de Aprobación (CU-P-01):**

```mermaid
flowchart TD
    A[Operador envía solicitud] --> B[Estado sede: PENDIENTE]
    B --> C{Admin revisa}
    C -->|Aprobado| D[Estado sede: ACTIVA]
    C -->|Rechazado| E[Estado sede: RECHAZADA]
    D --> F[Sede aparece en mapa público]
    E --> G[Operador recibe retroalimentación]
```
