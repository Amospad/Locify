---
sidebar_position: 5
title: Flujo 5 - Historial y Vehículos
---

# Flujo 5 - Historial y Gestión de Vehículos

**Objetivo:** Permitir al conductor consultar sus reservas activas, pasadas y gestionar sus placas.

**Actores:** Conductor, Sistema.

**Diagrama de Flujo (Simbología Estándar):**

```mermaid
flowchart LR
    A([Inicio]) --> B[Conductor entra a /dashboard]
    B --> C[/Consulta reserva activa o QR/]
    B --> D[/Ve historial de reservas/]
    B --> E[Gestiona Placas Vehiculares]
    E --> F[Agrega nueva placa o inactiva existente]
    C --> G([Fin])
    D --> G
    F --> G
```
