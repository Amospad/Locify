---
sidebar_position: 1
title: Arquitectura Hexagonal (Ports & Adapters)
---

# Arquitectura Hexagonal en LOCIFY

Para garantizar que el código de LOCIFY sea mantenible, testeable y escalable, hemos adoptado el patrón de **Arquitectura Hexagonal** (también conocido como *Ports & Adapters*).

## 1. ¿Por qué Hexagonal y no MVC?

En un proyecto tradicional (MVC), la lógica de negocio suele quedar fuertemente acoplada al framework (ej. Express, NestJS), al ORM (ej. Prisma, TypeORM) o a servicios externos (Stripe). Esto genera dos problemas graves:
1. **Difícil de testear:** Para probar una regla de negocio, necesitas levantar una base de datos o mockear medio framework.
2. **Difícil de cambiar:** Si mañana decidimos cambiar la pasarela de pagos, tendríamos que modificar los controladores, los servicios y los tests.

La Arquitectura Hexagonal resuelve esto poniendo el **Dominio (lógica de negocio pura) en el centro**, aislado de todo lo externo.

## 2. Las 4 Capas de LOCIFY

Cada microservicio (`cliente-api`, `operador-api`, `admin-api`, `pago-worker`) tiene exactamente esta misma estructura interna:

```mermaid
flowchart TD
    subgraph Interfaces ["1. Interfaces (Entrada)"]
        HTTP[HTTP Controllers]
        CRON[CRON Jobs]
    end

    subgraph Infrastructure ["2. Infraestructura (Salida)"]
        DB[(PostgreSQL)]
        Stripe[Pasarela de Pagos]
        Sendgrid[Servicio de Correos]
    end

    subgraph Application ["3. Aplicación (Orquestación)"]
        Services[Servicios de Aplicación]
    end

    subgraph Domain ["4. Dominio (Núcleo Puro)"]
        Entities[Entidades: Reserva, Usuario]
        VO[Value Objects: Placa, QR]
        UseCases[Casos de Uso]
        Ports[[Puertos / Interfaces]]
    end

    %% Conexiones
    HTTP --> Services
    CRON --> Services
    Services --> UseCases
    UseCases --> Entities
    UseCases --> VO
    UseCases --> Ports
    
    %% Adaptadores implementan los puertos
    DB -.->|Implementa| Ports
    Stripe -.->|Implementa| Ports
    Sendgrid -.->|Implementa| Ports