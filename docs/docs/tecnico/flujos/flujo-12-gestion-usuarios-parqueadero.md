---
sidebar_position: 12
title: Flujo 12 - Gestión de Usuarios y Seguridad Parqueadero
---

# Flujo 12 - Gestión de Usuarios y Seguridad Parqueadero

**Objetivo:** Permitir al operador crear usuarios internos para su equipo y controlar permisos por rol para garantizar seguridad operativa (Ref: **CU-P-24**, **CU-P-25**).

**Actores:** Operador Principal, Frontend, Backend, Módulo de Seguridad.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Operador principal accede a gestión de usuarios/]
    B --> C[CU-P-24: Crea usuarios internos del equipo operador]
    C --> D[Formulario con datos: nombre, correo, rol]
    D --> E[Backend valida datos y envía invitación]
    E --> F[Usuario recibe correo de activación]
    F --> G[CU-P-25: Controla permisos por rol]
    G --> H{¿Configuración de permisos?}
    H -->|Asignar| I[Define permisos específicos por rol]
    H -->|Revisar| J[Visualiza matriz de permisos actual]
    I --> K[Backend actualiza roles y permisos]
    J --> K
    K --> L[Sistema aplica restricciones en frontend y backend]
    L --> M([Fin])
```

## Escenarios BDD Asociados
- **CU-P-24 (Crear Usuarios Internos):** *Given* operador principal, *When* crea cuenta para miembro del equipo, *Then* sistema genera invitación y usuario puede activarse.
- **CU-P-25 (Controlar Permisos por Rol):** *Given* usuario inicia sesión, *When* accede a funcionalidad, *Then* sistema valida permisos del rol y bloquea acceso no autorizado.
