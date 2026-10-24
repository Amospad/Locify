---
sidebar_position: 1
title: 02. Gestión de Interesados y del Proyecto
---

# Gestión de Interesados y del Proyecto

**Documento 02 de la arquitectura documental del proyecto**

| Campo | Información |
| :--- | :--- |
| **Código del documento** | ADSO-GES-01 |
| **Nombre** | Gestión de Interesados y del Proyecto |
| **Clasificación** | Documento de gestión |
| **Estado** | En revisión |
| **Propietario** | Líder del proyecto |
| **Ubicación oficial** | Repositorio del proyecto /docs/gestion |
| **Periodicidad de revisión** | Al inicio de cada iteración o ante cambios relevantes |
| **Versión** | 1.0 |

---

## 1. Propósito y alcance del documento

### 1.1 Objetivos específicos
- Identificar quién puede afectar o verse afectado por el proyecto.
- Definir quién decide, valida, ejecuta y debe mantenerse informado.
- Establecer una metodología de trabajo (Scrum) adaptada a un equipo de 3 personas.
- Planificar iteraciones, hitos, entregas y responsabilidades.
- Gestionar riesgos, cambios, reuniones, acuerdos y bloqueos.
- Garantizar trazabilidad de la contribución individual en el repositorio.

### 1.2 Alcance
Aplica desde la autorización del proyecto hasta su cierre (sustentación final). Debe actualizarse cuando cambien los interesados, roles, metodología, cronograma, riesgos relevantes o responsables de aprobación.

> **Criterio de calidad:** La gestión no se demuestra por la cantidad de reuniones, sino cuando existen responsables claros, acuerdos trazables, decisiones justificadas y evidencia de avance progresivo en GitHub.

---

## 2. Principios de gestión

| Principio | Aplicación práctica en LOCIFY |
| :--- | :--- |
| **Proporcionalidad** | La gestión es ligera; no hay burocracia innecesaria para 3 personas. |
| **Transparencia** | El tablero de GitHub Projects y el código son visibles para todos. |
| **Responsabilidad** | Toda tarea en el tablero tiene un único responsable asignado. |
| **Trazabilidad** | Los cambios de código se hacen vía Pull Requests (PR) con commits descriptivos. |
| **Participación** | El instructor SENA actúa como validador de hitos clave. |
| **Adaptación** | Los cambios se evalúan en la Sprint Review, pero se controlan. |
| **No burocracia** | No se duplica información; el tablero es la única fuente de verdad para el avance. |

---

## 3. Identificación y análisis de interesados

### 3.1 Registro de interesados

| ID | Nombre / grupo | Tipo | Rol o relación | Necesidad principal | Interés | Influencia | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **STK-01** | Conductores | Usuario final | Cliente B2C | Reservas sin fricción, pagos seguros. | Alto | Bajo | Activo |
| **STK-02** | Operadores de Parqueadero | Usuario final | Cliente B2B | Control de ocupación y recaudo. | Alto | Medio | Activo |
| **STK-03** | Administrador LOCIFY | Actor del sistema | Equipo interno | Monitoreo global y auditoría KYB. | Alto | Medio | Activo |
| **STK-04** | Pasarela de Pagos | Externo | Aliado Tech | Transacciones seguras. | Medio | Alto | Activo |
| **STK-05** | Instructor SENA | Evaluador | Aprobador académico | Cumplimiento de rúbricas y calidad. | Bajo | Muy Alta | Activo |

### 3.2 Análisis de interés e influencia

| Cuadrante | Condición | Estrategia recomendada |
| :--- | :--- | :--- |
| **Gestión activa** | Alta influencia y alto interés | STK-02 y STK-03: Involucrar en validaciones de UX/UI y pruebas funcionales. |
| **Mantener satisfecho** | Alta influencia y bajo interés | STK-04 (Pasarela): Comunicar resultados de integración (Sandbox). |
| **Mantener informado** | Baja influencia y alto interés | STK-01: Compartir avances de la app y recoger retroalimentación. |
| **Monitorear** | Baja influencia y bajo interés | N/A (Todos tienen interés). |

### 3.3 Matriz de evaluación de interesados

| ID | Necesidades | Expectativas | Aporte esperado | Riesgo asociado | Posición actual | Responsable de relación |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **STK-01** | Rapidez | Que la app no falle. | Feedback de usabilidad. | Abandono por bugs. | Neutral | Lilia |
| **STK-02** | Control | Que el dinero cuadre. | Validación de reportes. | Resistencia al cambio. | Neutral | Lilia |
| **STK-05** | Rigor | Que se cumplan los estándares. | Retroalimentación técnica. | Baja calificación. | Apoya | Andrés |

---

## 4. Estrategia de involucramiento y comunicación

### 4.1 Plan de comunicación

| ID | Interesado | Información | Objetivo | Frecuencia | Medio | Evidencia |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **COM-01** | Equipo (STK internos) | Avance, bloqueos, decisiones. | Sincronización diaria. | Diaria (15 min) | Daily Scrum (Discord/Meet) | Tablero actualizado |
| **COM-02** | Instructor (STK-05) | Entregables de hito. | Validación académica. | Por Sprint Review | Sesión presencial/virtual | Documentos en repo |
| **COM-03** | Operadores (STK-02) | Demo de funcionalidades. | Validación de UX. | Por hito (Sprint 4 y 8) | Video demo o prototipo | Acta de validación |

### 4.2 Reglas de comunicación
- Las decisiones que afecten alcance o arquitectura se registran en los ADRs (Architecture Decision Records) y en el CHANGELOG.
- Los mensajes por WhatsApp/Discord son para coordinación rápida; no reemplazan los issues o PRs en GitHub.
- No se publican datos personales ni credenciales en el repositorio.

### 4.3 Estrategia de validación

| Entregable | Validador funcional | Validador técnico | Momento | Criterio de aprobación |
| :--- | :--- | :--- | :--- | :--- |
| Problema y objetivos | Lilia (PO) | Instructor | Hito 1 | Documento aprobado |
| Alcance y requisitos | Lilia (PO) | Andrés (SM) | Hito 2 | Matriz de trazabilidad completa |
| Prototipo / MVP | Lilia (PO) | Denis (QA) | Hito 3 y 4 | Flujo E2E exitoso |

### 4.4 Manejo de desacuerdos y escalamiento
1. Registrar el desacuerdo (Issue en GitHub con etiqueta `discussion`).
2. Revisar requerimientos, restricciones y evidencias.
3. Si el equipo no llega a un acuerdo en 24 horas, escala al Instructor (STK-05).
4. Registrar la decisión final en la bitácora o ADR.

---

## 5. Organización del proyecto

### 5.1 Estructura del equipo

| ID | Integrante | Rol principal | Responsabilidades | Disponibilidad |
| :--- | :--- | :--- | :--- | :--- |
| **EQ-01** | Andrés Mosquera | Scrum Master / Backend | Facilitar ceremonias, arquitectura, contratos API, code reviews. | Tiempo completo |
| **EQ-02** | Lilia Torres | Product Owner / Frontend | Priorizar backlog, gestionar interesados, desarrollo UI. | Tiempo completo |
| **EQ-03** | Denis Cuervo | Developer / QA | Implementación, pruebas unitarias/E2E, control de calidad. | Tiempo completo |

### 5.2 Matriz RACI (adaptada a 3 personas)
*R = Responsable de ejecutar; A = Responsable final (Accountable); C = Consultado; I = Informado.*

| Actividad / Entregable | Andrés | Lilia | Denis | Instructor |
| :--- | :--- | :--- | :--- | :--- |
| Definir problema y objetivos | C | **A/R** | I | I |
| Aprobar alcance | R | **A** | C | I |
| Diseñar arquitectura | **A/R** | C | C | I |
| Desarrollar Frontend | C | **A/R** | C | I |
| Desarrollar Backend | **A/R** | I | C | I |
| Ejecutar Pruebas QA | C | I | **A/R** | I |
| Aceptar entregables (Hito) | I | **A** | I | **R** (Evaluar) |

### 5.3 Autoridad del líder del proyecto

| Puede decidir | Debe consultar | Debe escalar |
| :--- | :--- | :--- |
| Asignación de issues en el Sprint. | Cambios en el alcance del MVP. | Bloqueos técnicos que detengan el Sprint. |
| Convenciones de código y ramas. | Decisiones de arquitectura (ADRs). | Conflictos no resueltos en el equipo. |

---

## 6. Metodología y forma de trabajo

### 6.1 Selección de metodología: Scrum
Se seleccionó **Scrum** porque permite entregas incrementales de valor, se adapta bien a equipos pequeños (3 personas) y obliga a tener revisiones constantes, lo cual encaja perfectamente con la dinámica de evaluación por sprints del SENA. Además, fomenta la transparencia mediante el tablero y las reuniones diarias.

### 6.2 Justificación del enfoque elegido

| Campo | Aplicación en LOCIFY |
| :--- | :--- |
| **Metodología** | Scrum (marco ágil). |
| **Razones** | Equipo pequeño, requisitos cambiantes, necesidad de demostrar valor rápido (MVP). |
| **Duración de iteración** | 2 semanas (Sprints). |
| **Herramienta de seguimiento** | GitHub Projects (Tablero Kanban: To Do, In Progress, In Review, Done). |
| **Políticas de entrada/salida** | Una tarea entra al Sprint si cumple el *Definition of Ready* y sale si cumple el *Definition of Done*. |

### 6.3 Flujo de trabajo en GitHub Projects

| Estado | Condición de entrada | Acción esperada | Condición de salida | Responsable |
| :--- | :--- | :--- | :--- | :--- |
| **Backlog** | Historia priorizada por el PO. | Refinamiento (Planning). | Lista para Sprint. | Lilia (PO) |
| **To Do** | Seleccionada para el Sprint actual. | Asignación de issue. | Inicio de desarrollo. | Andrés (SM) |
| **In Progress** | Desarrollador trabajando en rama local. | Crear commits y código. | Push al remoto. | Denis / Andrés |
| **In Review** | Pull Request (PR) abierto. | Code Review y pruebas CI. | Aprobación de 1 revisor. | Andrés (SM) |
| **Done** | PR mergeado a `main`. | Deploy en ambiente de pruebas. | Demo en Sprint Review. | Lilia (PO) |

### 6.4 Definition of Ready (DoR)
Una historia de usuario está lista para entrar a un Sprint cuando:
- Tiene un formato claro ("Como [rol], quiero [acción], para [beneficio]").
- Tiene **Criterios de Aceptación** (Gherkin: Given/When/Then).
- Tiene estimación en puntos (Planning Poker).
- No tiene bloqueos técnicos o de dependencias (ej. "esperando API de pagos").

### 6.5 Definition of Done (DoD)
Una historia está terminada (Done) solo cuando:
- ✅ El código compila sin errores (`npm run build`).
- ✅ El código pasa el linter y las pruebas unitarias (Cobertura > 80% en dominio).
- ✅ Se respeta la arquitectura hexagonal (el dominio no importa infraestructura).
- ✅ El Pull Request (PR) fue revisado por otro miembro y aprobado.
- ✅ La documentación en `/docs` está actualizada (si el cambio lo requiere).
- ✅ Se integra en la rama `main` y pasa el pipeline de CI/CD.

---

## 7. Planificación, entregas e hitos

### 7.1 Roadmap general (8 Sprints)

| Hito | Objetivo | Entregables | Sprints | Dependencias | Responsable |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **H-01** | Formulación y Arquitectura | Docs SENA + Repo + Arquitectura Hexagonal | Sprint 1 | Ninguna | Andrés / Lilia |
| **H-02** | Onboarding y KYB | Admin API + Auth (Tokens) | Sprint 2 y 3 | Base de datos Docker | Denis / Andrés |
| **H-03** | Setup Operador | Operador API + Dashboard Ocupación | Sprint 4 y 5 | H-02 finalizado | Lilia / Denis |
| **H-04** | Flujo Cliente (MVP) | Cliente API + Check-in QR + Pagos | Sprint 6 y 7 | H-03 finalizado | Andrés / Denis |
| **H-05** | Versión Candidata | Integración E2E + Pruebas de carga | Sprint 8 | H-04 finalizado | Denis (QA) |
| **H-06** | Entrega y Cierre | Manuales, Deploy final y Sustentación | Post-Sprint 8 | Todo lo anterior | Todo el equipo |

### 7.2 Plan de iteraciones (Sprints)

| Iteración | Objetivo | Entregable verificable | Fechas |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | Setup Monorepo y Docusaurus | Docs v1 + Repo configurado | Semana 1-2 |
| **Sprint 2** | Auth y Registro (Admin API) | Endpoint `/registro` con Prisma | Semana 3-4 |
| **Sprint 3** | Validación KYB (Admin API) | Endpoint de tickets y bloqueo | Semana 5-6 |
| **Sprint 4** | Gestión de Sedes (Operador) | CRUD de sedes y celdas | Semana 7-8 |
| **Sprint 5** | Dashboard Ocupación | WebSockets o Polling en Frontend | Semana 9-10 |
| **Sprint 6** | Mapa y Reservas (Cliente) | Búsqueda geolocalizada + Reserva | Semana 11-12 |
| **Sprint 7** | Check-in QR y Pagos | Validación QR + Sandbox Pago | Semana 13-14 |
| **Sprint 8** | QA y Despliegue | Cobertura de pruebas + Deploy nube | Semana 15-16 |

---

## 8. Gestión de riesgos

### 8.1 Criterios de valoración (Escala 1 a 3)
- **Probabilidad:** 1 (Baja) - 2 (Media) - 3 (Alta)
- **Impacto:** 1 (Bajo) - 2 (Medio) - 3 (Alto)
- **Exposición (P x I):** 6 a 9 requiere tratamiento prioritario.

### 8.2 Registro de riesgos

| ID | Categoría | Riesgo | Causa | Consecuencia | P | I | Nivel | Respuesta | Responsable | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Gestión | Retraso por carga académica. | Falta de tiempo del equipo. | No terminar el MVP. | 3 | 3 | **9** | Mitigar (Priorizar MVP y usar DoR). | Lilia | Abierto |
| **RSK-02** | Técnico | Falla en la pasarela de pagos. | Límites del Sandbox. | No se puede probar check-in real. | 2 | 3 | **6** | Mitigar (Crear Mock de Pago como respaldo). | Andrés | Abierto |
| **RSK-03** | Técnico | Conflictos de código (Merge). | Ramas desactualizadas. | Pérdida de tiempo en integración. | 2 | 2 | **4** | Evitar (Usar PRs diarios y `git pull`). | Denis | Abierto |
| **RSK-04** | Usuario | Baja usabilidad del mapa. | Curva de aprendizaje del usuario. | Rechazo de la App Cliente. | 2 | 2 | **4** | Mitigar (Pruebas con usuarios reales). | Lilia | Abierto |

---

## 9. Gestión de cambios

### 9.1 Flujo de control de cambios
1. Cualquier miembro crea un **Issue** en GitHub con la etiqueta `change-request`.
2. El PO (Lilia) evalúa el impacto en el tiempo y el alcance.
3. Si el cambio es aprobado, se agrega al Backlog del próximo Sprint.
4. Si es rechazado, se documenta el motivo en el Issue y se cierra.

### 9.2 Historial de cambios aprobados

| ID | Resumen | Documento / requisito afectado | Versión objetivo | Responsable | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CHG-01** | Adoptar Arquitectura Hexagonal. | Arquitectura / `admin-api`. | v1.0 | Andrés | Aprobado (ADR-001) |
| **CHG-02** | Sustituir Acta por DOC-01-FCP del SENA. | Docs / `01-formulacion-constitucion.md`. | v1.0 | Lilia | Aprobado |

---

## 10. Seguimiento de entregables y calidad

### 10.1 Registro de entregables

| ID | Entregable | Criterios de aceptación | Responsable | Validador | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ENTG-01** | Docs Formulación y Gestión | Plantillas SENA completas. | Lilia | Instructor | En revisión |
| **ENTG-02** | Arquitectura y Modelo de Datos | Diagramas Mermaid y código base. | Andrés | Instructor | Aprobado |
| **ENTG-03** | MVP LOCIFY | Flujo E2E funcional (Reserva -> QR). | Denis | Lilia | Pendiente |

### 10.2 Estados permitidos
`Pendiente` | `En elaboración` | `En revisión` | `Devuelto` | `Aprobado` | `Obsoleto`

### 10.3 Reporte de estado (Ejemplo Sprint 1)

| Dimensión | Estado | Evidencia | Riesgo / desviación | Acción siguiente |
| :--- | :--- | :--- | :--- | :--- |
| **Alcance** | 🟢 Verde | Docs SENA subidos | Ninguno | Empezar código |
| **Cronograma** | 🟢 Verde | En semana 2 | Ninguno | Sprint 2 |
| **Calidad** | 🟡 Amarillo | Falta cobertura de tests | Dominio sin probar aún | Configurar Vitest |
| **Riesgos** | 🟢 Verde | RSK-01 mitigado | Ninguno | Monitorear |

---

## 11. Evidencia individual y trabajo colaborativo

### 11.1 Registro de contribución individual (Ejemplo)

| Integrante | Periodo | Actividades | Artefactos / módulos | PR / commits / evidencias | Validado por |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Andrés** | Sprint 1 | Setup repo, Docker, Arquitectura Hexagonal | `docker-compose.yml`, `admin-api/src/domain` | PR #1, PR #2 | Lilia |
| **Lilia** | Sprint 1 | Redacción SENA, Docusaurus | `docs/docs/formativo/` | PR #3, PR #4 | Andrés |
| **Denis** | Sprint 1 | Configuración de pruebas y QA | `services/admin-api/tests/` | PR #5 | Andrés |

### 11.2 Reglas de autoría
- No se aceptan commits masivos de último minuto (GitHub muestra el historial real).
- El código debe ser entendido por todos; no se permite copiar/pegar sin comprender (el instructor puede preguntar en la sustentación).
- El uso de IA para generar código debe ser revisado y testeado por el autor antes de subirlo.

---

## 12. Indicadores de gestión

| ID | Indicador | Fórmula / método | Meta | Frecuencia | Fuente | Responsable |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **IND-GES-01** | Cumplimiento de entregables | Entregables aprobados / planificados x 100 | 100% | Por hito | Registro de entregables | Lilia |
| **IND-GES-02** | Cambios controlados | Cambios analizados / cambios solicitados x 100 | 100% | Mensual | Issues de GitHub | Lilia |
| **IND-GES-03** | Riesgos tratados | Riesgos altos con respuesta / total riesgos altos | 100% | Semanal | Tabla de riesgos | Andrés |
| **IND-GES-04** | Participación trazable | Integrantes con PRs / total integrantes | 100% | Por Sprint | GitHub Insights | Andrés |

---

## 13. Lista de verificación

| N.° | Verificación | Cumple | Evidencia |
| :--- | :--- | :--- | :--- |
| 1 | Los interesados relevantes están identificados y clasificados. | Sí | Sección 3.1 |
| 2 | Cada entregable tiene responsable y aprobador. | Sí | Sección 10.1 |
| 3 | Existe una metodología definida y justificada. | Sí | Sección 6 |
| 4 | El tablero evidencia planificación y seguimiento real. | Sí | GitHub Projects |
| 5 | La matriz RACI no tiene actividades críticas sin responsable. | Sí | Sección 5.2 |
| 6 | Los hitos y fechas consideran capacidad y dependencias. | Sí | Sección 7.1 |
| 7 | Las decisiones y acuerdos relevantes están registrados. | Sí | ADRs y CHANGELOG |
| 8 | Los riesgos tienen nivel, respuesta y responsable. | Sí | Sección 8.2 |
| 9 | Los cambios relevantes se analizan y aprueban. | Sí | Sección 9 |
| 10 | Los entregables poseen criterios de aceptación y evidencia. | Sí | Sección 10 |
| 11 | La contribución individual es trazable. | Sí | Sección 11 |
| 12 | No existen datos sensibles o credenciales expuestos. | Sí | Uso de `.env` ignorados |
| 13 | El documento está actualizado y coincide con las herramientas. | Sí | Repo GitHub |
| 14 | El cierre registra pendientes, riesgos y lecciones. | Sí | A completar en Sprint 8 |

---

## 14. Lecciones aprendidas (Se llenará al final)

| ID | Situación | Qué funcionó | Qué no funcionó | Aprendizaje | Recomendación futura |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **LA-01** | [Pendiente Sprint 8] | | | | |

---
**Fin del documento**