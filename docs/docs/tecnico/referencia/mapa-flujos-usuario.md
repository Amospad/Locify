---
sidebar_position: 5
title: Mapa de Flujos de Usuario
---

# Mapa Completo de Flujos de Usuario

Este documento detalla los 10 flujos (User Journeys) que componen el ecosistema LOCIFY, garantizando que todos los actores (Conductor, Operador y Administrador) tengan un camino claro y sin fricciones.

## 1. Flujo del Conductor: Autenticación
*   **Actor:** Conductor
*   **Objetivo:** Registrarse y acceder al sistema de forma segura.

```mermaid
flowchart TD
    A[Usuario ingresa a la App] --> B{¿Tiene cuenta?}
    B -->|No| C[Formulario de Registro]
    C --> D[Recibe correo con token]
    D --> E[Activa cuenta y define contraseña]
    E --> F[Inicia sesión con JWT]
    B -->|Sí| F
    F --> G[Redirige a /buscar]
´´´
