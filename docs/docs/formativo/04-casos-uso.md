---
sidebar_position: 4
title: 04. Casos de Uso
---

# Casos de Uso y Escenarios — LOCIFY

Este documento representa las interacciones entre los actores (usuarios o sistemas externos) y el sistema LOCIFY para alcanzar un objetivo específico.

## Diagrama General de Casos de Uso

```mermaid
flowchart LR
    %% Actores
    A1((Administrador LOCIFY))
    A2((Operador de Parqueadero))
    A3((Conductor))
    A4[(Pasarela de Pagos)]

    %% Sistema
    subgraph LOCIFY [Ecosistema Digital]
        CU1[CU-01: Registro y Onboarding Legal KYB]
        CU2[CU-02: Validación Administrativa]
        CU3[CU-03: Reservar Espacio Híbrido]
        CU4[CU-04: Validar Acceso QR]
        CU5[CU-05: Monitoreo de Ocupación]
    end

    %% Relaciones
    A2 --> CU1
    A1 --> CU2
    A3 --> CU3
    A3 --> CU4
    A2 --> CU5
    
    %% Dependencia de pago
    CU3 -.-> A4