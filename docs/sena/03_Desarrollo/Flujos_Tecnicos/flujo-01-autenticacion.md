---
sidebar_position: 1
title: Flujo 1 - Autenticación
---

# Flujo 1 - Autenticación del Conductor

**Objetivo:** Permitir que un conductor se registre y acceda de forma segura a la plataforma.

**Actores:** Conductor, Sistema.

**Casos de Uso vinculados:** CU-O-01 a CU-O-10

| CU | Nombre | RF | Estado |
|---|---|---|---|
| CU-O-01 | Registrar usuario mediante formulario | RFO-01 | ✅ |
| CU-O-02 | Validar datos del formulario | RFO-02 | ✅ |
| CU-O-03 | Generar invitación de activación | RFO-03 | ✅ |
| CU-O-04 | Enviar correo de activación | RFO-04 | ✅ |
| CU-O-05 | Generar enlace único de activación | RFO-05 | ✅ |
| CU-O-06 | Verificar vigencia de invitación | RFO-06 | ✅ |
| CU-O-07 | Crear contraseña inicial | RFO-07 | ✅ |
| CU-O-08 | Activar cuenta de usuario | RFO-08 | ✅ |
| CU-O-09 | Restringir acceso antes de activación | RFO-09 | ✅ |
| CU-O-10 | Gestionar invitación expirada | RFO-10 | ✅ |

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B{¿Tiene cuenta?}
    B -->|No| C[/Formulario de Registro (CU-O-01)/]
    C --> D[/Validar datos (CU-O-02)/]
    D --> E[/Generar invitación (CU-O-03)/]
    E --> F[/Enviar correo (CU-O-04)/]
    F --> G[Recibe token en email]
    G --> H{¿Token válido?}
    H -->|Sí| I[Crear contraseña (CU-O-07)]
    H -->|No/Vencido| J[ mostrar error (CU-O-06, CU-O-10)]
    I --> K[Activar cuenta (CU-O-08)]
    K --> L[Iniciar sesión (CU-O-09)]
    L --> M[Redirige a /buscar]
    B -->|Sí| L
    M --> N([Fin])
```

**Escenarios BDD:**

- **Escenario Exitoso:** Dado que el usuario envía el formulario válido, Cuando el sistema genera la invitación, Entonces el usuario recibe el correo de activación.
- **Escenario Expiración:** Dado que la invitación venció (24h), Cuando el usuario accede al link, Entonces el sistema bloquea el acceso con mensaje de expiración.
