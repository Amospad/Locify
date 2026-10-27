---
sidebar_position: 3
title: ADR-003 — Monolito modular antes que microservicios
---

# ADR-003: Monolito modular antes que microservicios

- **Estado:** **Aceptado** (ratificado por el equipo el 2026-10-27)
- **Fecha:** 2026-10-27
- **Decisores:** Andrés Mosquera, Lilia Torres, Denis Cuervo
- **Relacionado:** ADR-001 (arquitectura hexagonal), ADR-002 (modelo híbrido de reservas), RNF-05, RNF-06

## Contexto

La documentación describe cuatro microservicios (`admin-api`, `operador-api`, `cliente-api`, `pago-worker`) con una base de datos PostgreSQL por servicio. El repositorio, sin embargo, contiene:

- **Un** servicio con código (`admin-api`), y de ese servicio solo existe el módulo de usuarios.
- **Una** base de datos (`admin-db` en `compose.yaml`).
- **Cero** contratos HTTP entre servicios, cero mensajería, cero observabilidad y un pipeline de CI que no puede ejecutarse.
- Un equipo de **tres personas** que también debe entregar 32 requerimientos funcionales, la documentación y las pruebas.

Los microservicios resuelven un problema organizacional (varios equipos que necesitan desplegar por separado) y de escala (módulos con perfiles de carga muy distintos). Ninguna de las dos condiciones se cumple hoy. Adoptarlos ahora significa pagar de antemano: consistencia eventual, transacciones distribuidas, versionado de contratos, cuatro pipelines y tres bases que respaldar.

## Decisión

Se adopta un **monolito modular** como paso previo, sin renunciar a los límites del hexagonal:

1. **Un solo despliegue** con módulos de dominio aislados: `identidad` (admin-api actual), `operador`, `cliente`, `pagos`, `soporte`.
2. **Un clúster PostgreSQL con un esquema por módulo** (`admin`, `operador`, `cliente`). Sin `FOREIGN KEY` entre esquemas: se conserva la regla de IDs lógicos y la posibilidad de separar bases después.
3. **Los límites se verifican**, no se declaran: cada módulo expone puertos y ningún módulo importa las entidades de otro. Un test de arquitectura puede comprobarlo.
4. **Las transacciones son locales** mientras dure el monolito, lo que resuelve RNF-06 (ACID, evitar sobreventa) sin sagas ni outbox prematuros.

## Criterios para extraer un servicio

Un módulo se extrae solo cuando se cumple **al menos dos** de estas condiciones:

- Tiene un equipo dueño con su propio ciclo de despliegue.
- Su perfil de carga obliga a escalar de forma distinta al resto (p. ej. `pagos`).
- Existe un requisito regulatorio o de aislamiento de datos que lo exija.
- El monolito ya tiene CI verde, observabilidad y respaldos automatizados.

## Consecuencias

**Positivas**

- El equipo entrega funcionalidad en lugar de infraestructura.
- Transacciones ACID reales para reservas y cupos, que es el riesgo de negocio más caro (sobreventa).
- Un solo pipeline y un solo *deploy* que mantener mientras el equipo es pequeño.
- La extracción futura sigue siendo posible porque los límites ya existen en el código.

**Negativas**

- No hay escalado independiente por módulo.
- Un fallo en un módulo afecta a todo el proceso (se mitiga con réplicas del monolito, no con microservicios).
- Hay que vigilar que los módulos no se acoplen: sin disciplina, el monolito se vuelve un bloque.

## Alternativas consideradas

| Alternativa | Por qué se rechaza |
| :--- | :--- |
| Microservicios desde el inicio (estado documentado actual) | Coste operativo y de coordinación desproporcionado para tres personas; hoy no hay ni un contrato HTTP entre servicios |
| Monolito sin módulos | Resuelve el corto plazo pero impide extraer nada después y mezcla dominio con infraestructura |
| Serverless por función | Añade latencia en flujos transaccionales (RNF-04) y dispersa la lógica de dominio |

## Impacto documental

Al quedar **Aceptado**, la decisión es vinculante para el diseño:

- `modelo-datos.md` mantiene el diagrama como **modelo lógico**, pero la implementación usa un esquema por módulo (`admin`, `operador`, `cliente`) en un solo clúster, no tres bases separadas.
- `arquitectura-hexagonal.md` debe leerse como **cuatro módulos** del monolito (`identidad`, `operador`, `cliente`, `pagos`), no como cuatro despliegues independientes.
- `PROJECT_STATE.md` registra la ratificación y el plan del próximo sprint.

Queda pendiente reescribir la sección "database-per-service" de `modelo-datos.md` para describir esquemas en lugar de clústeres. Hasta entonces, ambas páginas llevan una nota que apunta a este ADR.
