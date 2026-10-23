---
sidebar_position: 1
title: 01. Acta de Constitución
---

# Acta de Constitución del Proyecto — LOCIFY

| Campo | Detalle |
|---|---|
| **Proyecto** | LOCIFY |
| **Ficha** | 3314811 — ADSO |
| **Institución** | Servicio Nacional de Aprendizaje (SENA) |
| **Instructor** | Deimer Miranda MSc(c) |
| **Versión** | 1.0.0 |
| **Fecha** | Junio de 2026 |
| **Estado** | Consolidado final |

---

## 1. Nombre del Proyecto

**LOCIFY**

El nombre combina la raíz *"Location"* (ubicación) y el sufijo *"-ify"* (tecnología aplicada), comunicando de forma directa la naturaleza del sistema: una plataforma tecnológica para gestionar ubicaciones (estacionamientos) de forma inteligente y escalable.

---

## 2. Justificación

LOCIFY surge para resolver la ineficiencia en la movilidad urbana, transformando la búsqueda de estacionamiento en un proceso digital, predecible y fluido. 

En las ciudades colombianas (particularmente en el Valle de Aburrá), los conductores no tienen forma de saber con certeza si un parqueadero tiene cupo disponible antes de llegar. La búsqueda se hace dando vueltas, generando micro-congestión (el fenómeno de *Cruising for Parking*), consumo innecesario de combustible y emisiones de CO₂.

Por otro lado, los parqueaderos operan de forma manual (taquillas, papel térmico, efectivo), sin visibilidad sobre su propia demanda, lo que les impide optimizar tarifas y operación.

El ecosistema LOCIFY impacta positivamente al:
- **Conductores:** ofreciendo certeza de disponibilidad y eliminando la fricción de pago.
- **Operadores:** digitalizando aforos en tiempo real y profesionalizando su vinculación legal (KYB).
- **Ciudad:** reduciendo el tráfico innecesario y recuperando espacio público invadido.

---

## 3. Objetivo General

Desarrollar un ecosistema tecnológico integral (web y móvil) que conecte a clientes, operadores y administradores, garantizando la transparencia y eficiencia en la reserva y uso de espacios de estacionamiento en entornos urbanos.

---

## 4. Objetivos Específicos

1. **Garantizar la previsibilidad del usuario** mediante un modelo híbrido de reservas (cupo asegurado con pago anticipado o reserva exprés con tolerancia de 5 minutos).
2. **Eliminar la fricción en el acceso** implementando un sistema de check-in/check-out mediante códigos QR inmutables y cobro automático.
3. **Automatizar la gestión administrativa** mediante un panel para operadores que permita controlar capacidad, ocupación y finanzas en tiempo real.
4. **Implementar un motor de reglas globales** que gestione penalidades, compensaciones y caducidades de forma autónoma (ej. liberación de cupos a los 5 min).
5. **Validar la viabilidad operativa** a través de pruebas piloto que evalúen usabilidad, rendimiento y consistencia transaccional.

---

## 5. Alcance del Proyecto

### 5.1 Entregables Principales

| N° | Entregable | Descripción |
|---|---|---|
| 1 | **App del Cliente** | Aplicación (web/móvil responsivo) para conductores. Incluye mapa interactivo, reservas híbridas, generación de QR, historial y gestión de placas. |
| 2 | **App del Parqueadero** | Plataforma web para operadores. Incluye configuración de sedes, dashboard de ocupación en tiempo real, validación de QR y reportes financieros. |
| 3 | **App Admin** | Plataforma web para el gobierno del sistema. Incluye auditoría de tickets KYB, resolución de disputas y configuración del motor de reglas. |
| 4 | **Backend (Microservicios)** | 4 servicios en Node.js + TypeScript (cliente-api, operador-api, admin-api, pago-worker) con arquitectura hexagonal. |
| 5 | **Documentación** | Manuales de usuario, documentación técnica (Docusaurus + ADRs) y evidencias del proceso formativo. |

### 5.2 Exclusiones (Fuera de Alcance)
Para prevenir el *Scope Creep* y garantizar la viabilidad en el tiempo del proyecto formativo, **NO** se incluye:
- Administración del espacio físico ni control automatizado de hardware de talanqueras.
- Sistemas automáticos de reconocimiento de placas por cámaras (LPR).
- Servicios adicionales para vehículos (lavado, mecánica, conductor elegido).

---

## 6. Equipo de Trabajo y Liderazgo

El proyecto se ejecuta con un equipo activo de **3 personas** bajo metodología Scrum:

| Nombre | Rol | Responsabilidades Principales |
|---|---|---|
| **Andrés Mosquera** | Scrum Master + Developer | Facilitar ceremonias ágiles, definir arquitectura hexagonal, contratos de API, revisión de código (code reviews) y desarrollo backend/frontend. |
| **Lilia Torres** | Product Owner + Developer Co-Lead | Priorizar el Product Backlog, gestionar stakeholders, asegurar alineación con el SENA y desarrollo backend/frontend. |
| **Denis Cuervo** | Developer + QA | Implementación de funcionalidades, diseño y ejecución de pruebas (unitarias, integración, e2e), aseguramiento de calidad y matriz de trazabilidad. |

> *Nota: Los colaboradores iniciales que no forman parte del equipo activo han sido removidos de esta versión para reflejar la realidad operativa del proyecto.*

---

## 7. Cronograma General Estimado (8 Sprints)

El desarrollo se realizará bajo metodología Scrum, con entregas progresivas de valor funcional de extremo a extremo:

- **Sprint 1-2:** Implementación del Onboarding Universal y arquitectura de seguridad (control de email, tokens, contraseñas).
- **Sprint 3-4:** Desarrollo del Setup Obligatorio para operadores (configuración de sedes, carga de documentos legales KYB, definición de capacidades).
- **Sprint 5-6:** Flujo End-to-End del Cliente (mapa interactivo, check-in/check-out QR, lógica de pago híbrido).
- **Sprint 7-8:** Consolidación de la App Admin y el Motor de Reglas (supervisión global, resolución de disputas, parametrización en caliente).

---

## 8. Riesgos Iniciales y Mitigación

| ID | Riesgo Identificado | Estrategia de Mitigación |
|---|---|---|
| R1 | **Sobrecarga operacional** por equipo de 3 personas. | Definición limpia de contratos de API (OpenAPI) y arquitectura hexagonal para aislar responsabilidades. |
| R2 | **Scope Creep** o aumento descontrolado de alcance. | El PO (Lilia) protege rigurosamente el backlog y aplica la regla de "No incluye" del alcance. |
| R3 | **Restricciones en credenciales** de pasarela de pagos. | Implementar flujos usando entornos sandbox y abstraer la pasarela mediante un puerto en la arquitectura hexagonal. |
| R4 | **Complejidad técnica** en concurrencia de reservas. | Uso de transacciones ACID y cron jobs concurrentes para garantizar consistencia de datos en tiempo real. |
| R5 | **Expiración de invitaciones** (token de 24 horas). | Implementar notificaciones push/correo automatizadas previas al vencimiento del token. |
| R6 | **Incumplimiento de disponibilidad** por un parqueadero. | Definir penalidades automáticas en el motor de reglas y un plan de contingencia para reubicar al cliente. |

---

## 9. Stakeholders Principales

*(Ver detalle completo en el documento de Stakeholders)*

1. Conductores (Usuarios Finales)
2. Operadores de Parqueaderos (Clientes B2B)
3. Administrador del Sistema (LOCIFY)
4. Pasarela de Pagos (Aliado Tech)
5. Instructor SENA (Auditor Metodológico)

---

## 10. Recursos y Tecnologías

- **Infraestructura:** Servicios gratuitos de alojamiento en la nube (ej. Vercel, Render, Supabase) y estaciones de trabajo locales.
- **Backend:** Node.js + TypeScript (Arquitectura Hexagonal, Microservicios).
- **Frontend:** Next.js / React (Web y Móvil Responsivo).
- **Base de Datos:** PostgreSQL (1 base de datos por microservicio - *Database per service*).
- **Documentación:** Docusaurus, Markdown, ADRs.
- **Control de Versiones:** Git + GitHub (Monorepo).
