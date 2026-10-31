---
sidebar_position: 6
title: Flujo 6 - Onboarding KYB (Crítico)
---

# Flujo 6 - Onboarding KYB

**Objetivo:** Validar legalmente a un operador y su sede antes de que aparezca en el mapa.

**Actores:** Operador, Administrador, Sistema.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart TD
    A([Inicio]) --> B[/Operador sube documentos RUT, Cámara/]
    B --> C[Sistema crea Ticket KYB En Revisión]
    C --> D[Sede oculta en el mapa]
    D --> E[Admin revisa documentos]
    E --> F{¿Cumple normas?}
    F -->|Sí| G[Admin aprueba Ticket]
    G --> H[Sede visible en el mapa]
    H --> I([Fin])
    F -->|No| J[Admin rechaza Ticket]
    J --> K[/Notifica rechazo al Operador/]
    K --> L([Fin])
```
