---
sidebar_position: 1
title: Flujo 1 - Autenticación
---

# Flujo 1 - Autenticación del Conductor

**Objetivo:** Permitir que un conductor se registre y acceda de forma segura a la plataforma.

**Actores:** Conductor, Sistema.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B{¿Tiene cuenta?}
    B -->|No| C[/Formulario de Registro/]
    C --> D[/Recibe correo con token/]
    D --> E[Activa cuenta y define contraseña]
    E --> F[Inicia sesión con JWT]
    B -->|Sí| F
    F --> G[Redirige a /buscar]
    G --> H([Fin])
```
