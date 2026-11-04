---
sidebar_position: 13
title: Flujo 13 - Módulo Administrador LOCIFY
---

# Flujo 13 - Módulo Administrador LOCIFY

**Objetivo:** Permitir al administrador de plataforma gestionar operadores, sedes, transacciones financieras, incidencias y configurar reglas del negocio (Ref: **CUA-01** a **CUA-12**).

**Actores:** Administrador LOCIFY, Frontend, Backend, Módulos Operacionales.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Administrador inicia sesión/]
    B --> C[CUA-01: Dashboard Ejecutivo - Métricas globales]
    C --> D{¿Módulo a gestionar?}
    D -->|Operadores| E[CUA-02: Gestionar Operadores (aprobar/suspender) / CUA-03: Consultar información]
    D -->|Sedes| F[CUA-04: Gestionar Sedes (estado operativo)]
    D -->|Finanzas| G[CUA-05: Consultar transacciones / CUA-06: Filtrar y analizar]
    D -->|Incidencias| H[CUA-07: Gestionar incidencias / CUA-08: Proteger historial]
    D -->|Reglas| I[CUA-09: Configurar penalidades / CUA-10: Configurar políticas / CUA-11: Versionamiento]
    D -->|Usuarios| J[CUA-12: Gestionar usuarios internos]
    E --> K[Backend valida y aplica cambios]
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
    K --> L[Sistema actualiza base de datos y notifica]
    L --> M[Administrador verifica cambios en dashboard]
    M --> N([Fin])
```

## Escenarios BDD Asociados
- **CUA-01 (Dashboard Ejecutivo):** *Given* administrador logueado, *When* accede a dashboard, *Then* visualiza métricas estratégicas de plataforma.
- **CUA-02/CUA-03 (Gestionar/Consultar Operadores):** *Given* solicitud de aprobación, *When* admin revisa documentos, *Then* puede aprobar, rechazar o suspender operadores.
- **CUA-04 (Gestionar Sedes):** *Given* sede en estado pendiente, *When* admin modifica estado, *Then* sede se actualiza y refleja en mapa público.
- **CUA-05/CUA-06 (Transacciones):** *Given* necesidad de análisis financiero, *When* admin filtra transacciones por fecha/tipo, *Then* sistema retorna datos agregados.
- **CUA-07/CUA-08 (Incidencias):** *Given* ticket de disputa, *When* admin revisa evidencia y registra decisión, *Then* historial queda inmutable.
- **CUA-09 a CUA-11 (Configuración y Reglas):** *Given* cambio en políticas, *When* admin actualiza reglas, *Then* sistema versiona y aplica a nuevas reservas.
- **CUA-12 (Usuarios Internos):** *Given* necesidad de equipo, *When* admin crea usuario con rol, *Then* cuenta queda en estado pendiente de activación.
