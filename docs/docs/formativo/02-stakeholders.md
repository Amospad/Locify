---
sidebar_position: 2
title: 02. Stakeholders
---

# Identificación de Stakeholders — LOCIFY

## 1. Propósito del Documento

Este documento identifica y analiza a los stakeholders (partes interesadas) del proyecto LOCIFY, definiendo su rol, nivel de interés, capacidad de influencia, expectativas y estrategia de comunicación.

Su utilidad se concreta en:
- **Comunicación:** establecer canales y frecuencias adecuadas.
- **Validación:** asegurar que los entregables sean revisados por las personas correctas.
- **Toma de decisiones:** identificar quiénes tienen poder real para aprobar o modificar el proyecto.
- **Gestión de expectativas:** alinear lo que cada parte espera con lo que el proyecto entregará.

---

## 2. Definición de Stakeholder

Un stakeholder es cualquier persona, grupo u organización que:
- Puede afectar el proyecto (decisiones, recursos, autoridad).
- Puede verse afectado por el proyecto (positiva o negativamente).
- Tiene interés en el resultado, aunque no participe en su construcción.

> **Regla de oro:** No todos los stakeholders son usuarios finales, y no todos tienen el mismo peso.

---

## 3. Matriz de Identificación de Stakeholders (Activos)

Las escalas de **Interés** y **Influencia** se miden en Alto, Medio y Bajo.

| ID | Nombre | Rol | Interés | Influencia | Expectativas Clave | Participación Esperada |
|---|---|---|---|---|---|---|
| **STK-01** | Conductores | Usuario Final | Alto | Bajo | Búsqueda rápida, reservas sin fricción, pagos seguros y evitar filas presenciales. | Uso frecuente de la app, retroalimentación del servicio. |
| **STK-02** | Operadores de Parqueaderos | Cliente B2B | Alto | Medio | Profesionalizar su servicio, control de ocupación en tiempo real y seguridad en el recaudo. | Registro de sedes, configuración de tarifas, control de cupos. |
| **STK-03** | Administrador del Sistema | Gestor Operativo | Alto | Medio | Monitoreo global, auditoría transaccional, motor ágil de reglas y resolución de disputas. | Validación KYB, configuración de parámetros, gestión de tickets. |
| **STK-04** | Pasarela de Pagos | Aliado Tech | Medio | Alto | Procesamiento seguro de transacciones bajo normativas financieras estrictas. | Integración vía API (sandbox y producción). |
| **STK-05** | Instructor SENA | Auditor Metodológico | Bajo | Muy Alta | Cumplimiento de estándares ADSO, metodologías ágiles y calidad técnica del entregable. | Revisión periódica, feedback y calificación. |

---

## 4. Matriz Interés vs. Influencia (Activos)

| Influencia \ Interés | Interés Bajo | Interés Medio | Interés Alto |
|---|---|---|---|
| **Influencia Alta** | - | **STK-04** Pasarela de Pagos *(Mantener Satisfechos)* | **STK-05** Instructor SENA *(Gestionar de Cerca)* |
| **Influencia Media** | - | **STK-03** Administrador *(Mantener Informados)* | **STK-02** Operadores *(Mantener Informados)* |
| **Influencia Baja** | - | - | **STK-01** Conductores *(Mantener Informados)* |

---

## 5. Estrategia de Comunicación

| ID | Stakeholder | Estrategia de Comunicación | Frecuencia | Medio / Canal |
|---|---|---|---|---|
| **STK-01** | Conductores | Notificaciones automáticas sobre estados de reserva, cambios de tarifas y alertas del servicio. | Continua / Por evento | App móvil, notificaciones push, correo automatizado. |
| **STK-02** | Operadores | Coordinación del flujo operativo, métricas de ocupación y conciliaciones financieras. | Continua / Semanal | Dashboard Web, correo institucional, WhatsApp empresarial. |
| **STK-03** | Administrador | Supervisión de métricas macro, alertas críticas y resolución de disputas. | Continua / Según hito | Panel de monitoreo web centralizado. |
| **STK-04** | Pasarela de Pagos | Validación de integraciones, pruebas en sandbox y actualizaciones de API. | Por hito técnico | Documentación técnica / Portal de developers. |
| **STK-05** | Instructor SENA | Entrega y sustentación formal de documentación, actas y demostración de incrementos. | Por clase / Calendario | Sesiones presenciales / Plataforma SENA. |

---

## 6. Riesgos Asociados a Stakeholders

| Stakeholder | Riesgo Identificado | Estrategia / Mitigación |
|---|---|---|
| **STK-01** Conductores | Abandono temprano de la app por caídas del sistema o información desactualizada de cupos. | Pruebas de usabilidad y rendimiento concurrentes; monitoreo proactivo (NPS). |
| **STK-02** Operadores | Falta de actualización manual de disponibilidad, generando sobreventa de cupos. | Implementación de penalizaciones automáticas e inhabilitación temporal de sedes. |
| **STK-04** Pasarela | Restricciones de credenciales o límites de transacciones en el entorno de pruebas. | Uso de entornos sandbox y arquitectura hexagonal (puerto `PagoGateway`). |

---

## 7. Gobernanza y Control de Cambios

El responsable directo de la gestión de stakeholders del proyecto LOCIFY es el **Equipo de Desarrollo y Liderazgo** (Andrés Mosquera, Lilia Torres y Denis Cuervo), operando bajo la metodología Scrum.

**Funciones asignadas:**
1. Coordinar las comunicaciones con los 5 stakeholders identificados.
2. Planificar y ejecutar validaciones funcionales con Conductores y Operadores.
3. Consolidar la retroalimentación en el Product Backlog.
4. Mantener actualizado este documento ante la aparición de nuevos actores.
5. Mitigar riesgos de desalineación que afecten los Sprints o la calidad exigida por el SENA.

---

## 8. Stakeholders Futuros (No Activos en Fase Formativa)

Para la fase de despliegue real (post-SENA), se identifican los siguientes actores que **no están activos** durante el proyecto formativo:

| Stakeholder | Rol Futuro | Razón de exclusión actual |
|---|---|---|
| **Alcaldía / Entidades de Tránsito** | Reguladores del entorno urbano. | El proyecto es un piloto académico sin impacto vial real aún. |
| **Coordinación Académica SENA** | Supervisores institucionales. | La interlocución directa se realiza a través del Instructor (STK-05). |
