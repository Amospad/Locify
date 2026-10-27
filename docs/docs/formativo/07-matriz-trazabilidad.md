---
sidebar_position: 7
title: 07. Matriz de Trazabilidad
---

# Matriz Maestra de Trazabilidad

Este documento garantiza que cada necesidad del negocio esté cubierta por un requerimiento, sea modelada en un caso de uso, tenga una historia de usuario y cuente con un criterio de aceptación para ser probada.

> **Alcance de esta versión:** cubre los **32 requerimientos funcionales** y los **10 no funcionales** definidos en
> [03. Alcance y Requerimientos](./03-alcance-requerimientos.md). Los identificadores de casos de uso (`CU-01…CU-10`)
> corresponden a [04. Casos de Uso](./04-casos-uso.md) y los de historias (`HU-01…HU-26`) a
> [05. Historias de Usuario](./05-historias-usuario.md). La columna *Estado en el código* distingue lo implementado,
> lo parcial y lo que solo está especificado. `HU-26` es transversal: exige que la App del Cliente funcione en móvil
> y en escritorio, sin sustituir la historia propia de cada requerimiento.

## 1. Matriz de requerimientos funcionales

| ID | Requerimiento (resumen) | Caso de uso | Historia | Prioridad | Estado en el código |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RF-01** | Registro con campos mínimos por rol | CU-01 | HU-01 | Alta | **Parcial** — `Usuario.crear` + `RegistrarOperador`; sin capa HTTP |
| **RF-02** | Validación de correo y campos obligatorios | CU-01 | HU-01 | Alta | **Parcial** — validación de email en `Usuario.crear`; resto de campos sin contrato de entrada |
| **RF-03** | Token de invitación con 24 h de vigencia | CU-01 | HU-02 | Alta | **Implementado (dominio)** — `RegistrarOperador.ejecutar` |
| **RF-04** | Correo automatizado con enlace de activación | CU-01 | HU-02 | Alta | **Parcial** — puerto `EmailService` definido; sin adaptador real |
| **RF-05** | Validar token no expirado ni usado | CU-01 | HU-02, HU-05 | Alta | **Parcial** — `Usuario.tokenHaExpirado`; no hay marca de "usado" |
| **RF-06** | Contraseña con política de complejidad | CU-01 | HU-01 | Alta | **No implementado** — no hay hashing ni política; solo se valida que el valor sea un hash |
| **RF-07** | Activación: guardar contraseña y pasar a ACTIVO | CU-01 | HU-02 | Alta | **No implementado** — no existe caso de uso de activación |
| **RF-08** | Bloquear dashboard si la cuenta no está activa | CU-01 | HU-05 | Alta | **Parcial** — `Usuario.puedeAccederAlDashboard`; no hay capa de acceso que lo aplique |
| **RF-09** | Dashboard del cliente con reserva o check-in activo | — | **Falta historia** | Alta | **No implementado** |
| **RF-10** | Cronómetro desde el check-in | CU-07 | HU-19 | Alta | **No implementado** |
| **RF-11** | Mapa interactivo con ubicación de sedes | CU-05 | HU-10 | Alta | **No implementado** |
| **RF-12** | Filtros por precio, horario, vehículo y disponibilidad | CU-05 | HU-11 | Media | **No implementado** |
| **RF-13** | Cálculo del valor estimado antes del pago | CU-05 | HU-12 (parcial) | Alta | **No implementado** |
| **RF-14** | Modelo híbrido Garantizada / Exprés | CU-05 | HU-12 | Alta | **No implementado** |
| **RF-15** | QR único con caducidad de 5 min en Exprés | CU-05 | HU-13 | Alta | **No implementado** |
| **RF-16** | Cancelación con ventana de gratuidad | CU-06 | HU-14 | Alta | **No implementado** |
| **RF-17** | Recalculo y abono de créditos por uso menor | CU-09 | **Falta historia** | Media | **No implementado** |
| **RF-18** | Validación de vigencia del QR al escanear | CU-07 | HU-18 | Alta | **No implementado** |
| **RF-19** | Cobro automático al registrar check-out | CU-09 | HU-20 | Alta | **No implementado** |
| **RF-20** | Alta, modificación e inactivación de placas | CU-05 | HU-15 | Alta | **No implementado** |
| **RF-21** | Historial con desglose económico | — | **Falta historia** | Media | **No implementado** |
| **RF-22** | Tickets de soporte con evidencias | CU-10 | HU-23 | Alta | **No implementado** |
| **RF-23** | Carga de documentos KYB | CU-02 | HU-06 | Alta | **No implementado** |
| **RF-24** | Bloqueo de la sede hasta aprobar el KYB | CU-02, CU-03 | HU-08 | Alta | **No implementado** |
| **RF-25** | Parametrización de sedes y cupos | CU-04 | HU-09 | Alta | **No implementado** |
| **RF-26** | Dashboard de ocupación con alertas | CU-04 (parcial) | **Falta historia** | Alta | **No implementado** |
| **RF-27** | Búsqueda por placa y registro manual | CU-08 | HU-21 | Alta | **No implementado** |
| **RF-28** | Reportes de ingresos, penalidades y caja | CU-09 | HU-25 | Alta | **No implementado** |
| **RF-29** | Auditoría de tickets KYB | CU-03 | HU-07 | Alta | **No implementado** |
| **RF-30** | Vista de disputas con línea de tiempo | CU-10 | HU-24 | Alta | **No implementado** |
| **RF-31** | Motor de reglas configurable | — | HU-22 | Alta | **No implementado** |
| **RF-32** | RBAC con roles internos | — | HU-04 | Alta | **No implementado** |

**Cobertura:** 32/32 requerimientos listados. Implementados o parciales: 8 (RF-01 a RF-08, todos del módulo de onboarding). El resto está especificado pero sin código.

## 2. Matriz de requerimientos no funcionales

| ID | Requerimiento | Gate o evidencia verificable | Estado |
| :--- | :--- | :--- | :--- |
| **RNF-01** | HTTPS/TLS 1.3 y hashing BCrypt/Argon2 | No hay terminación TLS ni adaptador de hashing; `Usuario.crear` solo rechaza valores que no sean hash | **No implementado** |
| **RNF-02** | Logs de auditoría inmutables | No existe tabla ni escritor de eventos | **No implementado** |
| **RNF-03** | Ley 1581: consentimiento antes de persistir | No existe entidad de aceptación ni validación | **No implementado** |
| **RNF-04** | Peticiones críticas ≤ 3 s | Sin pruebas de carga ni métricas | **Sin medición** |
| **RNF-05** | Disponibilidad ≥ 99.5 % mensual | Sin monitoreo ni SLA | **Sin medición** |
| **RNF-06** | ACID para evitar sobreventa | Solo operaciones de una tabla (`upsert`); no hay transacciones multi-tabla ni tabla de reservas | **Parcial** |
| **RNF-07** | Sincronización de cupos ≤ 500 ms | No existe sincronización | **No implementado** |
| **RNF-08** | Operación offline con caché seguro | No implementado | **No implementado** |
| **RNF-09** | CRON que libera reservas exprés > 5 min | No existe worker ni `pago-worker` | **No implementado** |
| **RNF-10** | Reportes sobre réplicas de lectura | `compose.yaml` solo define una instancia; sin réplica | **No implementado** |

## 3. Trazabilidad de criterios de aceptación

Alineada con la tabla de la sección 4 del SRS. Cualquier cambio en una de las dos tablas debe replicarse en la otra.

| Criterio de Aceptación | Módulo | RF cubiertos | RNF cubiertos |
| :--- | :--- | :--- | :--- |
| **CA-01** Interoperabilidad y Sincronización | Todos | RF-01 a RF-04, RF-09 a RF-11, RF-26 a RF-28 | RNF-01, RNF-04, RNF-05, RNF-07, RNF-08 |
| **CA-02** Validación de Roles y Seguridad | Onboarding/Admin | RF-05 a RF-08, RF-18, RF-24, RF-29, RF-32 | RNF-01, RNF-02 |
| **CA-03** Exactitud del Motor de Reservas | Cliente/Operador | RF-13 a RF-19, RF-31 | RNF-06, RNF-09 |
| **CA-04** Trazabilidad y Cumplimiento | Onboarding/Admin | RF-01, RF-02, RF-21, RF-23, RF-30 | RNF-02, RNF-03, RNF-10 |

## 4. Huecos de trazabilidad detectados

| Tipo | Elementos | Acción requerida |
| :--- | :--- | :--- |
| RF sin historia de usuario | RF-09, RF-17, RF-21, RF-26 | Crear HU antes de implementar (el backlog tiene 26 historias para 32 RF) |
| RF sin caso de uso | RF-09, RF-21, RF-31, RF-32 | Añadir CU o justificar que se cubren como regla transversal |
| RF con caso de uso parcial | RF-13, RF-20, RF-26 | Precisar el escenario en `04-casos-uso.md` |
| Historia sin requerimiento | HU-03 (recuperación de contraseña), HU-16 (doble reserva), HU-26 (acceso multiplataforma) | Derivar el RF correspondiente o declararla transversal al alcance |
| RNF sin instrumento de verificación | RNF-01 a RNF-10 | Definir métrica, umbral y comando de verificación antes de afirmar cumplimiento |
