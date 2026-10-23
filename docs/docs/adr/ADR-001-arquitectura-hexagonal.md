---
sidebar_position: 1
title: ADR-001 - Arquitectura Hexagonal
---

# ADR-001: Adoptar Arquitectura Hexagonal (Ports & Adapters)

- **Estado:** Aceptado
- **Fecha:** Junio de 2026
- **Decisores:** Andrés Mosquera, Lilia Torres, Denis Cuervo

## Contexto
LOCIFY tiene un dominio complejo (reserva híbrida, caducidad, KYB, cobro automático) y múltiples adaptadores externos (Stripe, PostgreSQL, SendGrid, cron). Necesitamos testear el dominio sin depender de red, base de datos ni pasarela.

## Decisión
Adoptamos arquitectura hexagonal con 4 capas:
- `domain/` — entidades, value objects, use cases, ports (interfaces puras).
- `application/` — orquestación de use cases.
- `infrastructure/` — adaptadores (Postgres, Stripe, SendGrid).
- `interfaces/` — HTTP controllers, cron jobs.

El dominio no importa nada de las capas externas. Los puertos son interfaces TypeScript.

## Alternativas consideradas
- **MVC clásico:** más simple, pero mezcla lógica de negocio con HTTP y ORM. Difícil de testear.
- **Clean Architecture (Uncle Bob):** similar a hexagonal pero con más capas de ceremonia. Descartada por sobrecarga para equipo de 3.

## Consecuencias
- ✅ Dominio testeable sin mocks de infraestructura.
- ✅ Cambio de pasarela de pagos = 1 archivo nuevo en `infrastructure/payment/`.
- ⚠️ Más archivos y carpetas que MVC. Curva de aprendizaje.
- ⚠️ Requiere disciplina: si alguien importa Prisma en `domain/`, se rompe el patrón.

## Referencias
- Alistair Cockburn, "Hexagonal Architecture" (2005)
- Docs LOCIFY: `tecnico/arquitectura-hexagonal.md`