---
sidebar_position: 5
title: ADR-005 — Arquitectura Dual Next.js y Fastify
---

# ADR-005: Arquitectura Dual Next.js y Fastify sobre Supabase

- **Estado:** **Aceptado** (2026-11-03)
- **Fecha:** 2026-11-03
- **Decisores:** Equipo de Ingeniería LOCIFY, Líder Técnico ADSO
- **Relacionado:** ADR-001 (Hexagonal), ADR-003 (Monolito Modular), ADR-004 (Fastify), Modelo de Datos

## Contexto
Durante el diseño inicial del ecosistema LOCIFY, existía ambigüedad sobre si el frontend en Next.js debía comunicarse exclusivamente con un microservicio backend en Fastify para todas las operaciones (incluyendo autenticación y consultas simples) o si podía interactuar de manera directa con Supabase. 

Debido a los requerimientos de la PWA (búsqueda geoespacial en tiempo real, mapas, Supabase Realtime para celdas disponibles) y la necesidad de aislar procesos pesados (orquestación de pagos con Wompi, generación de códigos QR, webhooks y cron jobs de expiración), se requiere definir formalmente la topología de comunicación y responsabilidades.

## Decisión
Se adopta una **Arquitectura Dual Híbrida**:
1. **Next.js 14+ (App Router):** Actúa como la interfaz de usuario PWA y pasarela web principal. Se conecta **directamente a Supabase** (PostgREST + Auth + Realtime) utilizando Server Actions y el cliente oficial de Supabase. La seguridad está garantizada por las políticas **Row Level Security (RLS)** de PostgreSQL basadas en el JWT del usuario.
2. **Fastify Backend:** Actúa como el motor de servicios internos y transacciones complejas. Se conecta a la **misma base de datos Supabase** mediante Prisma ORM utilizando `service_role_key` exclusivamente para tareas de sistema, webhooks de Wompi, y procesamiento asíncrono.
3. **Consistencia de Datos:** Ambos mundos comparten la misma instancia de PostgreSQL en Supabase, eliminando la duplicación de bases de datos por servicio y garantizando transaccionalidad robusta.

## Consecuencias

### Positivas
- **Rendimiento superior en UI:** Las consultas de búsqueda de parqueaderos y actualización de estados en tiempo real (Supabase Realtime) operan sin sobrecarga en un servidor intermediario.
- **Seguridad nativa:** RLS en Supabase previene fugas de datos multi-tenant a nivel de fila, incluso si hay errores en la capa de aplicación frontend.
- **Desacoplamiento de lógica pesada:** Fastify maneja de forma eficiente pasarelas de pago (Wompi) y tareas concurrentes sin bloquear el renderizado del cliente.

### Negativas / Mitigaciones
- *Mitigación:* La duplicación de lógica de validación (Zod en Next.js / JSON Schema en Fastify) se mitiga centralizando los contratos de dominio en los paquetes compartidos y la documentación de esquemas.

## Referencias
- `docs/docs/tecnico/referencia/modelo-datos.md`
- `docs/constitution.md`
