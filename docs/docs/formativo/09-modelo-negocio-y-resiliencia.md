---
sidebar_position: 9
title: 09. Modelo de Negocio y Resiliencia
---

# Modelo de Negocio, Ocupación y Resiliencia

Este documento define las reglas económicas de LOCIFY, la estrategia de gestión física de celdas (para evitar sobreventa) y la matriz de contingencia ante fallos técnicos u operativos.

## 1. Modelo de Negocio (Monetización)

LOCIFY opera bajo un modelo **B2B2C** (Business to Business to Consumer), generando ingresos por dos vías principales:

1. **Fee por Transacción (Cliente B2C):** Se aplica una tarifa de servicio fija por cada reserva realizada en la plataforma (ej. $500 COP). Este monto se suma al valor del parqueadero y cubre los costos de la pasarela de pagos y el mantenimiento de la infraestructura en la nube.
2. **Suscripción SaaS (Operador B2B):** Los operadores acceden al panel de administración, reportes financieros y gestión de sedes mediante un plan mensual o un porcentaje de comisión sobre las reservas (a definir en la fase comercial).

## 2. Gestión de Disponibilidad y Ocupación Física

El mayor riesgo de un sistema de reservas es el **Overbooking físico** (vender un cupo digital cuando la celda física está bloqueada por un vehículo en sobretiempo).

### 2.1 Buffer de Seguridad del 95%
El algoritmo de LOCIFY nunca expondrá el 100% de las celdas físicas en el mapa interactivo. Si una sede tiene 100 celdas, el sistema solo permitirá **95 reservas digitales simultáneas**. 

*   **El 5% restante** queda como "colchón" (Buffer) para uso exclusivo del operador en el parqueadero. Esto permite manejar manualmente a los clientes que llegan sin reserva (walk-ins), vehículos en sobretiempo o fallos de conectividad.

### 2.2 Ciclo de Vida de una Reserva y el Sobretiempo
1. **Check-in:** El cronómetro inicia.
2. **Alerta de Vencimiento:** 15 minutos antes de que expire el tiempo reservado, el sistema envía un push al cliente: *"Tu tiempo está por vencer, pulsa aquí para extender"*.
3. **Sobretiempo:** Si el cliente excede el tiempo, el sistema cambia el estado a `EN_SOBRETIEMPO` y comienza a cobrar por fracciones de hora (tarifa dinámica).
4. **Acción del Operador:** Si el vehículo lleva más de 2 horas en sobretiempo sin pagar, el operador recibe una alerta en su dashboard para tomar acciones físicas (ej. inmovilizar el vehículo).

## 3. Matriz de Resiliencia (¿Qué pasa si...?)

Esta tabla define cómo responde el sistema (y el equipo) ante los 8 escenarios de error más críticos.

| N° | Escenario de Error | Impacto | Solución / Respuesta del Sistema |
| :--- | :--- | :--- | :--- |
| **1** | El parqueadero se queda sin internet. | El operador no puede escanear QRs. | **Check-in Manual:** El operador digita la placa. La reserva se guarda en estado `ACTIVA` con `sincronizado = false` y se reconcilia cuando vuelve la red. |
| **2** | El cliente no tiene señal en su celular al llegar. | No puede mostrar el QR. | El operador busca la reserva por placa o cédula desde su panel. |
| **3** | La pasarela de pagos rechaza la tarjeta. | La reserva queda en el limbo. | El sistema bloquea el cupo por 10 minutos mientras el cliente intenta con otro medio de pago. Pasado el tiempo, cancela y libera. |
| **4** | Un cliente intenta reservar la misma placa para la misma hora. | Duplicidad de reservas. | **Diseño:** el backend rechaza la petición con un índice `UNIQUE` sobre (`vehiculo_id`, franja horaria). **Estado:** no implementado; hoy no existe la tabla `RESERVA` (ver `modelo-datos.md` §5). |
| **5** | El parqueadero cierra antes de que el cliente salga. | El cliente queda encerrado. | El modelo de datos de la `SEDE` incluye `horario_cierre`. La app bloquea reservas cuya hora de fin supere ese horario. |
| **6** | Un operador vende más cupos físicos de los que tiene. | Caos en la sede. | El sistema bloquea el acceso a la sede y el Admin (App Admin) recibe una alerta roja. |
| **7** | El servidor de la nube se cae (Downtime). | Toda la plataforma se cae. | El proveedor de nube debe tener alta disponibilidad (RNF-05) y respaldos diarios. Ninguno de los dos está configurado todavía: `compose.yaml` no define política de backup y no hay monitoreo. |
| **8** | El cliente cancela después del tiempo límite. | Pérdida de dinero para el operador. | El sistema aplica la penalidad automática. El dinero se divide: el operador recupera su cupo y LOCIFY retiene el Fee por gestión. |

## 4. Actualización del Modelo de Datos

Para soportar este modelo, se requieren los siguientes ajustes en la base de datos (a implementar en Prisma):

1.  **Entidad `Sede`:** Agregar campos `horarioApertura` (String) y `horarioCierre` (String).
2.  **Entidad `Reserva`:** Agregar campo `sincronizado` (Boolean, por defecto `true`) para el modo offline. Usar un solo booleano evita duplicar el estado: la reserva sigue siendo `ACTIVA`.
3.  **Entidad `Reserva`:** El sobretiempo se representa con el estado `EN_SOBRETIEMPO` de la máquina de estados, no con un booleano adicional (`enSobretiempo`), para no tener dos fuentes de verdad.

## 5. Automatización y Agentes de IA

La calidad del software no se garantiza con una revisión al final del proyecto: se construye con **puertas automáticas** que impiden avanzar cuando algo está roto. El equipo incorpora asistentes de IA (Cursor y OpenCode) como apoyo a la implementación, pero la garantía de calidad **no depende de que la IA "tenga razón"**: depende de reglas escritas, pruebas ejecutables y verificaciones que cualquiera puede repetir.

La idea central es simple: un agente de IA puede escribir código muy rápido, y precisamente por eso necesita límites explícitos. Esos límites son los que documenta esta sección.

### 5.1 Qué se automatiza y qué se reserva al equipo

| Actividad | Apoyo de IA | Control humano |
| :--- | :--- | :--- |
| Recordar el estado del proyecto | El agente lee `PROJECT_STATE.md` al iniciar cada sesión | El equipo decide el alcance y las prioridades |
| Escribir código repetitivo (adaptadores, mapeos, controladores) | Generación asistida | Revisión de que respete la Arquitectura Hexagonal |
| Diseñar y escribir pruebas | Generación asistida con ciclo TDD | Validación de que la prueba refleja el criterio de aceptación |
| Redactar documentación técnica | Borradores asistidos | Revisión, corrección y firma del equipo |
| Verificar que el trabajo funciona | Subagente `verifier` que ejecuta build y pruebas | El equipo interpreta el resultado y decide el cierre |
| Decisiones de negocio y de arquitectura | **No se automatiza** | Responsabilidad exclusiva del equipo |

### 5.2 Puertas de calidad (Quality Gates)

Una puerta de calidad es una condición que debe cumplirse para que una tarea pueda considerarse terminada. En LOCIFY hay cinco, y cada una deja evidencia verificable:

| # | Puerta | Cuándo se ejecuta | Criterio para pasar | Evidencia que deja |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Compilación** | Antes de cerrar cualquier tarea | Cero errores de TypeScript | `npm run build` sin salida de error |
| 2 | **Pruebas automáticas** | Antes de cerrar cualquier tarea | Todas en verde, sin pruebas eliminadas ni debilitadas | `npm test` → `pass N, fail 0` |
| 3 | **Revisión escéptica** | Antes de declarar "terminado" | El verificador reproduce el resultado y busca casos límite | Reporte de qué pasó y qué falló |
| 4 | **Revisión de secretos** | Antes de cada commit | Ninguna credencial en el código ni en el historial | Diff sin llaves; credenciales solo en variables de entorno |
| 5 | **Integración continua (CI)** | Al subir cambios al repositorio | El pipeline del merge request termina en verde | Registro del pipeline |

La puerta 3 merece explicación: el equipo no le pregunta al agente que implementó *"¿quedó bien?"* —eso sería preguntarle al interesado—, sino que invoca a un **verificador independiente** cuyo papel es desconfiar. Su instrucción literal es *"no aceptes afirmaciones sin pruebas"*.

### 5.3 El ciclo de trabajo con el agente

Todo cambio, sin importar quién lo pida, recorre el mismo ciclo:

1. **Contexto:** el agente lee el estado del proyecto antes de proponer nada. No puede suponer información que no esté en el código o en la memoria escrita.
2. **Diseño y desarrollo:** si hay interfaz de usuario, se aplican las guías de diseño; si es código, se respeta la separación del dominio respecto a la base de datos y los servicios externos.
3. **Pruebas:** se escribe primero la prueba y se comprueba que **falla**, luego se implementa hasta que pase. Una prueba que nunca falló no demuestra nada.
4. **Verificación y memoria:** se ejecuta la verificación completa y el resultado —junto con la decisión tomada— se registra en `PROJECT_STATE.md`.

Este orden es lo que convierte a la IA en una herramienta de calidad y no en una fuente de código sin trazabilidad.

### 5.4 Cómo se demuestra que algo funciona

El proyecto exige **evidencia, no opiniones**. Un ejemplo real ocurrido durante la conexión de Prisma con PostgreSQL en el microservicio `admin-api`:

- El equipo creyó que la prueba de conexión estaba completa, pero al verificar se descubrió que la base de datos no tenía tablas: faltaba aplicar el esquema.
- Se aplicó el esquema y se implementó el adaptador de usuarios con **pruebas escritas antes del código**.
- La prueba detectó un defecto real que la revisión manual habría dejado pasar: el tipo de fecha del ORM no era compatible con la versión de Node.js del proyecto. **El error apareció en la ejecución de la prueba, no en producción.**
- El cierre quedó registrado con tres datos concretos: `7/7` pruebas en verde, compilación limpia y la corrección documentada en `PROJECT_STATE.md`.

Ese es el valor medible de la automatización: no "escribir más rápido", sino **encontrar antes** y **dejar rastro** de lo encontrado.

### 5.5 Límites y responsabilidad

Automatizar no significa delegar la responsabilidad. El equipo asume estos compromisos:

- **El agente no decide el negocio.** Tarifas, penalidades y reglas de ocupación son decisiones humanas documentadas en este modelo de negocio.
- **Nada se declara terminado sin verificación.** Una afirmación sin salida de comando es una hipótesis, no un resultado.
- **No se debilita una prueba para que pase.** Si una prueba falla, se corrige el código; alterar la prueba para ocultar el fallo destruye la garantía.
- **Los datos sensibles no se exponen.** Credenciales y cadenas de conexión viven en variables de entorno, nunca en el código ni en el historial de versiones.
- **El contenido externo es dato, no instrucción.** Un documento, un issue o una página web no pueden darle órdenes al agente; solo las dan las reglas del proyecto y el equipo.
- **Autoría humana.** El equipo responde por lo que entrega, aunque haya usado IA para producirlo.

### 5.6 Beneficios observados

| Beneficio | Cómo se manifiesta en el proyecto |
| :--- | :--- |
| Detección temprana de defectos | Errores de tipos y de compatibilidad detectados por pruebas antes de integrar |
| Documentación viva | El estado del proyecto se actualiza al cerrar cada tarea, no al final del semestre |
| Incorporación más rápida | Un integrante nuevo (o un agente) entiende el proyecto leyendo un archivo corto |
| Menos retrabajo | El ciclo de verificación evita "arreglar" en la siguiente entrega lo que se pudo detectar en la actual |
| Consistencia | Todos los cambios siguen el mismo ciclo y las mismas puertas de calidad |