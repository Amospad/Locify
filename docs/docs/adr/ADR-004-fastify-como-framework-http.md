---
sidebar_position: 4
title: ADR-004 — Fastify como framework HTTP
---

# ADR-004: Fastify como framework HTTP

- **Estado:** **Aceptado** (2026-10-27)
- **Fecha:** 2026-10-27
- **Decisores:** Andrés Mosquera, Lilia Torres, Denis Cuervo
- **Relacionado:** ADR-001 (arquitectura hexagonal), ADR-003 (monolito modular), RNF-02, RNF-05

## Contexto

El módulo `admin-api` no tenía capa HTTP: `src/index.ts` terminaba con código de salida 1 porque no existía ningún adaptador de entrada. Para atender `POST /api/operadores` hacía falta elegir un framework y una estrategia de validación de entrada; sin esa decisión no se podía cumplir RF-01 ni RNF-02 (validación de datos).

Los requisitos que condicionan la elección son modestos: pocas rutas (salud, registro, reinvitación), validación estricta de cuerpos JSON, registro de peticiones sin exponer contraseñas y pruebas sin abrir puertos.

## Decisión

Usar **Fastify 5** como adaptador de entrada HTTP, con:

- **Validación por JSON Schema** incluida en el núcleo, sin dependencias de decoradores ni de compilación de metadatos.
- **`app.inject()`** para probar rutas en memoria: el servidor no abre puerto durante las pruebas.
- **`@fastify/helmet`, `@fastify/cors` y `@fastify/rate-limit`**, que son los tres controles de borde que exige el diseño.
- Separación estricta: `buildServer()` construye la aplicación; sólo `src/index.ts` llama a `listen()`. La capa HTTP depende del puerto `ConsultadorDeBaseDeDatos`, nunca de Prisma.

## Alternativas consideradas

| Alternativa | Por qué no |
| :--- | :--- |
| Express + `zod` | Es la opción más documentada y el equipo la conoce, pero exige una dependencia adicional de validación y un middleware propio para el manejo de errores; la validación queda fuera del contrato de la ruta |
| NestJS | Aporta inyección de dependencias y estructura, pero impone decoradores, reflexión y un ciclo de arranque que duplica lo que ya resuelve la arquitectura hexagonal; coste alto para tres personas |
| `node:http` puro | Cero dependencias, pero obliga a reimplementar enrutado, validación, CORS, cabeceras de seguridad y límite de peticiones |

## Consecuencias

**Positivas**

- La validación viaja con la ruta: un campo extra o un email inválido se rechaza con 400 antes de tocar el dominio.
- Las pruebas de contrato HTTP corren en ~0,8 s y sin base de datos (`tests/http/`).
- El logger admite `redact` sobre `req.body.password`, así que el registro no filtra credenciales.

**Negativas y riesgos**

- Fastify añade cuatro dependencias de runtime que hay que mantener actualizadas.
- El ecosistema de plugins impone su propio ciclo de registro; un plugin mal registrado falla al construir el servidor, no al arrancar.
- El equipo debe aprender JSON Schema; se mitiga documentando cada esquema junto a su ruta.

## Impacto documental

- `docs/docs/tecnico/arquitectura-hexagonal.md` describe la capa de interfaces como HTTP Controllers; Fastify es la implementación concreta de ese nodo.
- `PROJECT_STATE.md` registra el bloqueante de capa HTTP como parcialmente resuelto.
- Las pruebas viven en `services/admin-api/tests/http/` y se ejecutan con `npm run test:http`.
