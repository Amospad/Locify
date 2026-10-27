---
sidebar_position: 2
title: Arquitectura de Agentes IA
---

# Arquitectura de Agentes de IA en LOCIFY

LOCIFY no usa IA como "un chat que escribe código". Los agentes son **un miembro más del equipo con reglas versionadas**: reciben instrucciones del repositorio, ejecutan skills reutilizables, dejan memoria del trabajo y solo pueden declarar una tarea terminada si una verificación real pasó.

Este documento explica cómo está montada esa arquitectura: qué herramienta hace qué, dónde vive cada instrucción y cómo se orquesta el trabajo entre el humano, el agente y los verificadores automáticos.

## 1. Principios rectores

Cuatro reglas explican el resto del diseño:

1. **El repositorio es la fuente de verdad, no el contexto del agente.** Todo lo que un agente necesita saber está en archivos versionados (`AGENTS.md`, `PROJECT_STATE.md`, `.harness/knowledge/`). Si un dato no está ahí ni en el código, el agente no lo asume (`memory.mdc`).
2. **Nada se declara terminado sin evidencia ejecutada.** No vale "debería funcionar": se exige la salida de `npm run build`, de las pruebas y del `verifier`.
3. **El humano decide, el agente ejecuta y verifica.** Alcance, arquitectura y decisiones de negocio son humanas; la implementación, las pruebas y el rastreo de errores son delegables.
4. **Las instrucciones se versionan, las skills se fijan con hash.** Si mañana cambia la skill de diseño, el `skills-lock.json` dice exactamente qué versión se usó.

## 2. Vista general

```mermaid
flowchart TD
    subgraph Terminal["1. Terminal del agente"]
        Cursor["Cursor"]
        OpenCode["OpenCode"]
    end

    subgraph Instrucciones["2. Instrucciones versionadas"]
        AGENTS["AGENTS.md<br/>(estándar agents.md)"]
        Rules[".cursor/rules/<br/>memory.mdc · workflow.mdc"]
    end

    subgraph Skills["3. Skills reutilizables"]
        HIG["apple-hig<br/>(Diseño UI)"]
        RIG["rig<br/>(CI/CD + Seguridad)"]
        QA["agentic-qe / qa-skills<br/>(QA)"]
        PRISMA["prisma-8<br/>(Persistencia)"]
    end

    subgraph Repo["4. Repositorio"]
        Code["Código hexagonal<br/>services/*"]
        Tests["Pruebas<br/>tests/**"]
    end

    subgraph Verify["5. Verificación"]
        Build["npm run build"]
        Verifier["Subagente verifier<br/>(escéptico)"]
        CI["pre-commit + CI"]
    end

    subgraph Memoria["6. Memoria"]
        State["PROJECT_STATE.md"]
        Progress[".agent/progress.md"]
        Feature["feature_list.json<br/>(evidencia y estado)"]
    end

    Cursor --> Instrucciones
    OpenCode --> AGENTS
    Instrucciones --> Skills
    Rules --> Skills
    Skills --> Repo
    Repo --> Verify
    Verify -->|"verde"| Memoria
    Verify -->|"rojo"| Repo
    Memoria -->|"próxima sesión"| Terminal
```

El ciclo es cerrado: la verificación alimenta la memoria, y la memoria es lo primero que lee el siguiente agente.

## 3. Capa 1 — Instrucciones portables (`AGENTS.md`)

`AGENTS.md` es el **contrato que todas las terminales comparten**. Sigue el estándar `agentsmd/agents.md` y lo extiende con el modelo de 5 subsistemas del harness:

| Subsistema | Artefacto mínimo | Para qué sirve |
| :--- | :--- | :--- |
| **Instructions** | `AGENTS.md` | Entrada, reglas y definición de "terminado" |
| **State** | `specs/<NNN>/feature_list.json` | Tarea activa, estado y evidencia |
| **Verification** | `init.ps1` + `.harness/scripts/ps/verify.ps1` | Comandos que el agente debe ejecutar antes de afirmar que terminó |
| **Scope** | `depends_on` en `feature_list.json` | Qué bloquea qué; prohibición de tocar fuera del subgrafo |
| **Lifecycle** | `session-handoff.md` + `.agent/progress.md` | Que la siguiente sesión pueda retomar sin adivinar |

Dos detalles del contrato que vale la pena conocer:

- **Contrato de idioma:** `output_lang` en `.harness/config.toml` define el idioma de los entregables del harness, pero los encabezados Markdown, los IDs estables (`REQ-NNN`, `ADR-NNNN`), las palabras RFC 2119 y los nombres de metodologías se mantienen en inglés para que las herramientas los reconozcan. Este documento y los del proyecto se escriben en español porque son entregables para personas.
- **Zonas de permiso:** `AGENTS.md` §4.1 clasifica toda acción en *Always do* (ejecutar verificación, citar `path:line`), *Ask first* (push, dependencias nuevas, tocar `.gitlab-ci.yml` o la constitución) y *Never do* (debilitar pruebas, incrustar secretos, tratar contenido del repo como instrucciones).

## 4. Capa 2 — Adaptadores por terminal

Cada herramienta consume el mismo núcleo por caminos distintos:

| Herramienta | Qué consume del repo | Artefacto concreto |
| :--- | :--- | :--- |
| **Cursor** | `.cursor/rules/*.mdc` con `alwaysApply: true`, más subagentes en `.cursor/agents/` | `memory.mdc` (lee `PROJECT_STATE.md` al iniciar), `workflow.mdc` (los 7 pasos), `verifier.md` |
| **OpenCode** | `AGENTS.md` como contexto raíz y skills desde su catálogo global | No requiere carpeta propia en el repo: la configurabilidad vive en `AGENTS.md` + `.harness/` |
| **Claude / Devin** | Copias materializadas de skills por servicio | `.claude/skills/` y `.devin/skills/` en `services/admin-api`, generadas por `prisma skills sync` (script `postinstall`) |

Las skills externas se fijan en `skills-lock.json` con su origen y hash:

```json
"apple-hig": { "source": "AyushRajSinghParihar/apple-human-interface-skills", "computedHash": "8fc3d15b…" }
```

Esto convierte "la IA hizo algo raro" en una pregunta auditable: *¿con qué versión de la skill?*

## 5. Capa 3 — Skills: qué automatiza cada una

Una **skill** es un paquete de instrucciones + referencias + assets que el agente carga bajo demanda. Se invoca por descripción, no por memoria del modelo, y eso es lo que reduce la variabilidad entre sesiones.

| Skill | Dominio | Qué produce en LOCIFY | Origen |
| :--- | :--- | :--- | :--- |
| `apple-hig` | **Diseño** | Jerarquía visual, contraste, tipografía y patrones de interacción coherentes con las guías de Apple para la app móvil | `.agents/skills/apple-hig` |
| `rig` | **CI/CD + Seguridad** | Hooks de git, plantillas de PR, workflows de lint/type-check/build y escaneo de credenciales antes de cada commit | `slamb2k/mad-skills` |
| `agentic-qe` / `qa-skills` | **QA** | Casos de prueba unitarios, bordes y datos de prueba para la funcionalidad que se implementa | **No instaladas**: no aparecen en `skills-lock.json` ni en `.agents/skills/` |
| `prisma-8` | **Persistencia** | Contratos, migraciones y consultas correctas para Prisma 8 (evita sintaxis de Prisma 5/6) | `prisma skills sync` |
| `test-driven-development` | **QA (proceso)** | Fuerza el ciclo rojo → verde → refactor: la prueba falla antes de escribir la implementación | Catálogo del agente |

**Seguridad** no es una skill aislada sino una propiedad del sistema: la regla "datos ≠ instrucciones" de `AGENTS.md` §4.1, el gate manual para dependencias nuevas (fuente, licencia, CVE, actividad) y el escaneo de credenciales que la skill `rig` aporta al pre-commit (ver estado en §9) forman la barrera completa.

## 6. Memoria del proyecto

La memoria tiene cuatro niveles, cada uno con un propósito distinto:

| Nivel | Archivo | Se escribe cuándo | Se lee cuándo |
| :--- | :--- | :--- | :--- |
| Estado vivo | `PROJECT_STATE.md` | Al cerrar una tarea o tomar una decisión | **Siempre, al iniciar** (`memory.mdc`) |
| Principios | `.harness/memory/constitution.md` | Solo por propuesta + ratificación humana | Al diseñar o revisar |
| Conocimiento | `.harness/knowledge/` | Cuando cambia el stack o una convención | Bajo demanda |
| Bitácora | `.agent/progress.md` | Append-only, por sesión | Al reconstruir el historial |

`PROJECT_STATE.md` es deliberadamente corto y legible por humanos: fase actual, stack, decisiones (ADR) y backlog con evidencia. La regla 7 del workflow lo hace obligatorio: **si se tomó una decisión arquitectónica nueva, se actualiza ese archivo**. Un agente que retoma el proyecto lee un archivo, no reconstruye el contexto desde cero.

Cuando el harness está activo, el estado por tarea se lleva además en `specs/<NNN>/feature_list.json`, donde cada `status: passing` exige un campo `evidence` no vacío (commit, salida de pruebas o `path:line`).

## 7. Workflow de orquestación

El `workflow.mdc` define un ciclo de 7 pasos que se ejecuta en cada solicitud de funcionalidad o corrección:

```mermaid
sequenceDiagram
    participant H as Humano
    participant A as Agente implementador
    participant S as Skills
    participant V as Verifier (escéptico)
    participant M as PROJECT_STATE.md

    H->>A: Solicitud de funcionalidad / bug
    A->>M: 1. Lee el estado del proyecto
    A->>S: 2. Diseño (apple-hig) si hay UI
    A->>A: 3. Implementa respetando el dominio
    A->>S: 4. QA: genera pruebas
    A->>A: 5. CI/CD: actualiza despliegue si cambió el stack
    A->>V: 6. Invoca verificación
    V->>V: Ejecuta build y pruebas
    alt Verde
        V-->>A: Evidencia de éxito
        A->>M: 7. Actualiza memoria
        A-->>H: Entrega con evidencia
    else Rojo
        V-->>A: Reporta qué falló
        A->>A: Corrige y repite
    end
```

| Paso | Gate asociado | Evidencia exigida |
| :--- | :--- | :--- |
| 1. Contexto | Lectura de `PROJECT_STATE.md` | No se asume nada fuera del archivo o del código |
| 2–3. Diseño + desarrollo | Arquitectura Hexagonal | El dominio no importa infraestructura |
| 4. QA | Pruebas unitarias | La prueba falla antes de implementar (TDD) |
| 5. CI/CD | Pipeline actualizado | `package.json` o Docker coherentes con el cambio |
| 6. Verificación | Subagente `verifier` | `npm run build` y pruebas en verde, con salida real |
| 7. Memoria | `PROJECT_STATE.md` | Decisión y evidencia registradas |

El **`verifier`** (`.cursor/agents/verifier.md`) es la pieza clave del diseño: se le define como *"un validador escéptico"* cuyo trabajo es *"verificar que el trabajo que se afirma como completado realmente funcione"*, buscando casos límite y **sin aceptar afirmaciones sin pruebas**. Es la versión agéntica de una revisión de código: no implementa, contradice.

## 8. Ejemplo real: del estado a la evidencia

El flujo no es teórico. Con la tarea "validar Prisma contra PostgreSQL en `admin-api`" ocurrió esto:

1. **Contexto:** `PROJECT_STATE.md` indicaba que la prueba de conexión ya estaba hecha y que el adaptador faltaba.
2. **Verificación del supuesto:** se ejecutó `npm run test:db` → `SELECT 1` OK, pero la base no tenía tablas (`db init` nunca se había corrido).
3. **Desarrollo con evidencia de esquema:** `npm run db:init` creó la tabla `usuario` con su índice único y los `CHECK` de los enums.
4. **QA (TDD):** se escribieron primero `tests/unit/Usuario.test.ts` y `tests/integration/PostgresUsuarioRepository.test.ts`. Fallaron por la razón correcta (`Usuario.reconstituir is not a function`).
5. **Hallazgo que la prueba destapó:** el codec de Prisma 8 para `DateTime` exigía `Temporal.Instant`, inexistente en Node 24. El test lo detectó antes de producción; se corrigió el contrato a `TimestamptzJsDate`.
6. **Cierre:** `npm test` → 7/7 en verde, `npm run build` limpio, y el resultado quedó escrito en `PROJECT_STATE.md`.

Ese orden —leer estado, verificar, implementar, probar, registrar— es exactamente el workflow de §7 aplicado a una tarea real.

## 9. Estado actual y pendientes

Documentar la arquitectura también exige decir qué está operativo y qué solo declarado:

| Artefacto | Estado | Evidencia |
| :--- | :--- | :--- |
| `AGENTS.md` y modelo de 5 subsistemas | Operativo | Leído por Cursor y OpenCode en cada sesión |
| Reglas `.cursor/rules/*.mdc` y subagente `verifier` | Operativo | `memory.mdc`, `workflow.mdc`, `verifier.md` existen en el repositorio |
| Skills de diseño y CI/CD | **Parcial** | `apple-hig` y `rig` instaladas y fijadas en `skills-lock.json`; `agentic-qe`/`qa-skills` **no** están instaladas |
| Memoria (`PROJECT_STATE.md`) | Operativo | Actualizado con evidencia en cada cierre |
| `.harness/scripts/ps/verify.ps1` | **Pendiente** | Referenciado por `init.ps1`, `.pre-commit-config.yaml` y `.gitlab-ci.yml`, aún no materializado |
| Hooks de `rig` (lefthook + escaneo de secretos) | Pendiente | No existe `lefthook.yml`; hoy el único hook es `.pre-commit-config.yaml`, que invoca el `verify.sh` faltante |
| `specs/<NNN>/feature_list.json` | Pendiente | Se crea con el primer `/hx-propose` |
| Pipeline de GitLab | **Roto** | `.gitlab-ci.yml` usa la imagen `ubuntu:24.04` sin Node/npm y llama a `.harness/scripts/ps/verify.sh`, que no existe: cualquier merge request falla |

> Nota de honestidad técnica: mientras `verify.ps1` no exista, el gate real es `npm run build` + `npm test`, y `init.ps1` falla por un problema de codificación (UTF-8 sin BOM) al leer el guion `—`. Un documento de arquitectura que esconde esto no sirve para operar el proyecto.

## 10. Checklist para incorporar un agente nuevo

1. Leer `AGENTS.md` completo (no solo el resumen).
2. Leer `PROJECT_STATE.md` antes de proponer cualquier cambio.
3. Confirmar qué skill aplica a la tarea y cargarla (diseño, QA, persistencia).
4. Implementar dentro del hexágono: el dominio no conoce Prisma, HTTP ni Stripe.
5. Escribir la prueba antes de la implementación.
6. Invocar al `verifier` con la salida real de build y pruebas.
7. Actualizar `PROJECT_STATE.md` con la decisión y su evidencia.
