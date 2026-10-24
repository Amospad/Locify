---
sidebar_position: 1
title: 01. Formulación y Constitución
---

# Formulación y Constitución del Proyecto de Software — LOCIFY

**Documento 01 de la arquitectura documental del proyecto**

| Campo | Información |
| :--- | :--- |
| **Código del documento** | DOC-01-FCP |
| **Nombre** | Formulación y Constitución del Proyecto |
| **Estado** | En revisión |
| **Clasificación** | Documento de formulación y gobierno inicial |
| **Responsable de elaboración** | Andrés Mosquera, Lilia Torres, Denis Cuervo |
| **Responsable de revisión** | Deimer Miranda MSc(c) - Instructor |
| **Versión** | 1.0 |

---

## 1. Propósito y uso del documento

### 1.1 Objetivos del documento
- Definir el problema u oportunidad que origina el proyecto LOCIFY.
- Establecer objetivos, beneficios, indicadores y criterios de éxito medibles.
- Identificar al equipo y responsables iniciales.
- Registrar entregables, hitos, restricciones y riesgos.
- Autorizar formalmente el inicio del proyecto formativo.

### 1.2 Alcance documental
Este documento actúa como el contrato técnico y metodológico para las fases de diseño, desarrollo y pruebas del ecosistema LOCIFY en el marco del programa ADSO del SENA.

---

## 2. Información general del proyecto

| Campo | Información |
| :--- | :--- |
| **Código interno** | LOCIFY-ADSO-3314811 |
| **Nombre oficial** | LOCIFY: Ecosistema digital para la gestión de parqueaderos urbanos |
| **Nombre corto** | LOCIFY |

**Descripción en una frase:** 
LOCIFY es una plataforma web y móvil que conecta a conductores y operadores de parqueaderos mediante reservas anticipadas, control de ocupación en tiempo real y validación de acceso mediante códigos QR inmutables, eliminando la fricción del papel y el efectivo.

### 2.2 Clasificación del proyecto

| Criterio | Selección |
| :--- | :--- |
| **Plataforma** | Web / Móvil / API (Híbrida) |
| **Contexto de uso** | Académico / Empresarial (Simulado) |
| **Nivel de madurez esperado** | Producto funcional (MVP) |
| **Existencia de cliente real** | No (Proyecto formativo) |
| **Tratamiento de datos personales** | Sí (Requiere consentimiento Ley 1581) |
| **Integraciones externas** | Sí (Pasarela de Pagos en Sandbox) |

---

## 3. Contexto y antecedentes

### 3.1 Contexto organizacional o sectorial
En las ciudades colombianas (particularmente en el Valle de Aburrá), la búsqueda de estacionamiento es un proceso manual y reactivo. Los conductores pierden tiempo valioso dando vueltas (fenómeno conocido como *Cruising for Parking*), lo que genera micro-congestión, mayor consumo de combustible y emisiones de CO2. 

Por otro lado, los operadores de parqueaderos operan con taquillas físicas, dispensadores de papel térmico y cobros en efectivo. Esto genera filas, vulnerabilidad ante la pérdida de tiquetes y una total opacidad sobre su propia demanda, impidiéndoles optimizar tarifas o capacidad.

### 3.2 Evidencias iniciales

| ID | Evidencia | Tipo | Fuente | Hallazgo principal |
| :--- | :--- | :--- | :--- | :--- |
| **EVI-01** | Estudio de tráfico en Medellín | Documento | TomTom Traffic Index (2023) | Un conductor pierde en promedio 94 horas al año en el tráfico. |
| **EVI-02** | Crecimiento del parque automotor | Base de datos | RUNT (2023) | El Valle de Aburrá supera los 1.5 millones de vehículos matriculados. |
| **EVI-03** | Fenómeno de búsqueda de parqueo | Libro | Donald Shoup, *The High Cost of Free Parking* (2005) | Hasta el 30% del tráfico urbano se debe a vehículos buscando estacionamiento. |

---

## 4. Planteamiento del problema

### 4.1 Enunciado del problema

| Elemento | Redacción |
| :--- | :--- |
| **Situación actual** | Búsqueda ineficiente de estacionamiento y gestión manual de parqueaderos. |
| **Población afectada** | Conductores (pérdida de tiempo) y Operadores (pérdida de ingresos/opacidad). |
| **Proceso afectado** | Movilidad urbana y transacciones de estacionamiento. |
| **Causas principales** | Falta de información en tiempo real y procesos analógicos (papel/efectivo). |
| **Consecuencias** | Congestión vehicular, contaminación, filas y sobreventa de cupos. |
| **Magnitud** | 94 horas perdidas al año por conductor y 30% del tráfico buscando parqueo. |
| **Pregunta orientadora** | ¿Cómo podría un ecosistema digital optimizar la reserva y el acceso a parqueaderos? |

### 4.2 Árbol del problema

| Nivel | ID | Descripción | Evidencia relacionada |
| :--- | :--- | :--- | :--- |
| **Efecto** | EFE-01 | Aumento de la micro-congestión y emisiones de CO2. | EVI-01, EVI-03 |
| **Efecto** | EFE-02 | Pérdida de ingresos potenciales para los operadores. | EVI-02 |
| **Problema Central** | PRO-01 | Ineficiencia en la gestión y asignación de espacios de estacionamiento en entornos urbanos. | - |
| **Causa Directa** | CAU-01 | Conductores carecen de información sobre disponibilidad antes de llegar. | EVI-03 |
| **Causa Directa** | CAU-02 | Procesos de acceso y pago son manuales (taquillas, papel, efectivo). | Entrevista/Observación |
| **Causa Raíz** | CAU-03 | Falta de digitalización y centralización de la oferta de parqueaderos. | Análisis del sector |

### 4.3 Validación del problema
- **¿Describe una situación verificable?** Sí, el tráfico y la pérdida de tiempo están documentados.
- **¿Identifica la población?** Sí (Conductores y Operadores).
- **¿Distingue causas y consecuencias?** Sí.
- **¿Cuenta con evidencia?** Sí (EVI-01, EVI-02, EVI-03).
---

## 5. Justificación

### 5.1 Dimensiones de justificación

| Dimensión | Argumento y evidencia |
| :--- | :--- |
| **Necesidad** | El déficit de celdas y la pérdida de tiempo (EVI-01) exigen una solución digital inmediata. |
| **Valor para usuarios** | Certeza de cupo, acceso sin fricción (QR) y transparencia en tarifas. |
| **Valor organizacional** | Digitalización de aforos, control de ingresos y profesionalización (KYB). |
| **Viabilidad técnica** | Uso de stack moderno Open Source (Node.js, React) y microservicios escalables. |
| **Viabilidad operativa** | Plataforma intuitiva Web/Móvil sin requerir hardware costoso (talanqueras). |
| **Viabilidad económica** | Bajo costo de infraestructura en la nube frente al alto retorno por optimización de cupos. |
| **Pertinencia formativa** | Aplica competencias ADSO: análisis, diseño de arquitectura hexagonal, desarrollo Full-Stack y QA. |
| **Aspectos legales** | Cumplimiento estricto de la Ley 1581 de 2012 (Habeas Data) y Ley 1480 (Estatuto del Consumidor). |

### 5.2 Alternativas consideradas

| Alternativa | Descripción | Ventajas | Desventajas | Decisión |
| :--- | :--- | :--- | :--- | :--- |
| **ALT-01** | Mantener proceso actual (manual) | Cero inversión inicial. | Mantiene congestión y pérdida de tiempo. | Descartada |
| **ALT-02** | Instalar hardware automatizado (talanqueras) | Control físico total. | Altísimo costo de instalación y mantenimiento. | Descartada |
| **ALT-03** | Desarrollar LOCIFY (Software) | Bajo costo, escalable, usa QR y mapas. | Requiere conectividad a internet. | **Seleccionada** |

---

## 6. Objetivos

### 6.1 Objetivo general
Desarrollar un ecosistema tecnológico web y móvil que conecte a conductores y operadores, para optimizar la reserva, el control de acceso y la gestión inteligente de parqueaderos urbanos.

### 6.2 Objetivos específicos

| ID | Objetivo específico | Entregable relacionado | Indicador relacionado |
| :--- | :--- | :--- | :--- |
| **OBJ-01** | Diseñar la arquitectura de microservicios y el modelo de datos relacional. | Documento de arquitectura y scripts SQL. | 100% de microservicios definidos y documentados. |
| **OBJ-02** | Desarrollar el módulo de reservas híbridas y validación de acceso por QR. | Código fuente de `cliente-api`. | Flujo de check-in completado en < 3 segundos. |
| **OBJ-03** | Implementar el panel de control (Dashboard) para operadores en tiempo real. | Código fuente de `operador-api`. | Latencia de actualización de cupos < 500 ms. |
| **OBJ-04** | Validar la calidad del software mediante pruebas unitarias y de integración. | Reporte de pruebas QA. | > 80% de cobertura en el dominio (Hexagonal). |

### 6.3 Validación SMART
- **Específico:** Cada objetivo tiene un módulo y funcionalidad clara.
- **Medible:** Se usan métricas de tiempo (< 3s) y porcentajes (80% cobertura).
- **Alcanzable:** Acorde al tiempo de 8 sprints del SENA.
- **Relevante:** Resuelve el problema central (CAU-01 y CAU-02).
- **Temporal:** Se ejecutará dentro del cronograma formativo 2026.

---

## 7. Beneficios y valor esperado

| ID | Beneficio esperado | Beneficiario | Tipo | Indicador |
| :--- | :--- | :--- | :--- | :--- |
| **BEN-01** | Reducción del tiempo de búsqueda de parqueo. | Conductor | Directo | Disminución de vueltas (estimado 15 min ahorrados). |
| **BEN-02** | Aumento de la rotación y visibilidad del parqueadero. | Operador | Directo | Ocupación medida desde el dashboard. |
| **BEN-03** | Digitalización y eliminación del papel térmico. | Ambos | Indirecto | 0 tiquetes físicos emitidos. |
| **BEN-04** | Reducción de emisiones de CO2 por micro-congestión. | Ciudad | Indirecto | Huella de carbono (estimación teórica). |

### 7.1 Propuesta de valor

| Para | Que necesita | El proyecto propone | A diferencia de | El valor principal es |
| :--- | :--- | :--- | :--- | :--- |
| Conductores y Operadores | Agilizar el acceso a estacionamientos. | Un ecosistema con reservas anticipadas y QR. | Taquillas manuales y papel. | Eliminar la fricción y la incertidumbre. |

---

## 8. Indicadores de éxito

| ID | Indicador | Objetivo | Meta | Método / Fuente |
| :--- | :--- | :--- | :--- | :--- |
| **IND-01** | Cobertura de pruebas unitarias. | OBJ-04 | > 80% | Reporte de Jest/Vitest. |
| **IND-02** | Tiempo de respuesta de la API (Check-in). | OBJ-02 | < 3 segundos | Logs del servidor. |
| **IND-03** | Latencia de sincronización de cupos. | OBJ-03 | < 500 ms | Prueba de carga (Postman). |
| **IND-04** | Finalización del flujo de reserva. | OBJ-01 | 100% exitoso | Prueba End-to-End (E2E). |

---

## 9. Alcance preliminar

### 9.1 Capacidades o módulos incluidos

| ID | Capacidad o módulo | Descripción | Prioridad |
| :--- | :--- | :--- | :--- |
| **ALC-01** | Onboarding Universal (KYB) | Registro y validación de operadores. | Alta |
| **ALC-02** | App Cliente (Búsqueda y Reserva) | Mapa, modelo híbrido y generación de QR. | Alta |
| **ALC-03** | App Operador (Dashboard y Check-in) | Panel de ocupación y escáner de QR. | Alta |
| **ALC-04** | App Admin (Motor de reglas) | Auditoría, resolución de disputas. | Media |

### 9.2 Fuera de alcance
- Control automatizado de hardware (talanqueras/plumas).
- Reconocimiento de placas por cámaras (LPR).
- Servicios adicionales (lavado, mecánica).

### 9.3 Producto mínimo viable (MVP)

| Flujo crítico | Resultado mínimo esperado | Evidencia de funcionamiento |
| :--- | :--- | :--- |
| **Reserva y Check-in** | Un conductor busca una sede, reserva (con o sin pago) y el operador valida su QR. | Video demostrativo y pruebas E2E. |

---

## 10. Entregables e hitos

### 10.1 Entregables principales

| ID | Entregable | Descripción | Criterio de aceptación |
| :--- | :--- | :--- | :--- |
| **ENTG-01** | Formulación y constitución | Este documento. | Aprobado por el instructor. |
| **ENTG-02** | Alcance y requisitos | SRS (32 RF, 10 RNF). | Sin ambigüedades, con matriz de trazabilidad. |
| **ENTG-03** | Diseño y arquitectura | Hexagonal y Modelo ER. | Diagramas claros y código base compilando. |
| **ENTG-04** | Producto funcional (MVP) | Código fuente en GitHub. | Flujo E2E funcionando. |
| **ENTG-05** | Pruebas y evidencias | Reporte QA. | Cobertura > 80%. |

### 10.2 Hitos generales

| ID | Hito | Resultado verificable | Fecha estimada |
| :--- | :--- | :--- | :--- |
| **HIT-01** | Formulación aprobada | Documento DOC-01 | Semana 2 |
| **HIT-02** | MVP demostrable | App funcional en la nube | Semana 6 |
| **HIT-03** | Pruebas y aceptación | QA aprobado | Semana 8 |

---

## 11. Organización y gobierno inicial

| Rol | Nombre / cargo | Responsabilidades principales |
| :--- | :--- | :--- |
| **Patrocinador / Cliente** | *[Por definir con el Instructor]* | Validar necesidades y aceptar entregables. |
| **Líder del Proyecto** | Andrés Mosquera | Coordinar, planificar y controlar cambios (Scrum Master). |
| **Product Owner** | Lilia Torres | Priorizar el backlog y gestionar stakeholders. |
| **QA / Developer** | Denis Cuervo | Asegurar calidad técnica y pruebas. |
| **Instructor** | Deimer Miranda MSc(c) | Orientar, revisar evidencias y evaluar competencias. |

---

## 12. Recursos y viabilidad preliminar

| Categoría | Recurso | Disponibilidad | Costo estimado |
| :--- | :--- | :--- | :--- |
| **Talento humano** | Equipo de 3 aprendices SENA. | Disponible | $0 |
| **Software** | Node.js, React, PostgreSQL, Docker. | Disponible | $0 (Open Source) |
| **Infraestructura** | GitHub, Vercel, Render (Free Tier). | Parcial | $0 |
| **Asesoría** | Instructor Deimer Miranda. | Disponible | $0 |

---

## 13. Restricciones, supuestos y dependencias

### 13.1 Restricciones
| ID | Tipo | Restricción | Impacto |
| :--- | :--- | :--- | :--- |
| **RES-01** | Temporal | 8 sprints para el desarrollo. | Alto (obliga a priorizar MVP). |
| **RES-02** | Académica | Cumplimiento de rúbricas SENA. | Medio. |

### 13.2 Supuestos
| ID | Supuesto | Consecuencia si es falso |
| :--- | :--- | :--- |
| **SUP-01** | Los servicios gratuitos en la nube soportarán el MVP. | Se requeriría buscar hosting pago o local. |

### 13.3 Dependencias
| ID | Dependencia | Tipo | Plan alternativo |
| :--- | :--- | :--- | :--- |
| **DEP-01** | Disponibilidad de la pasarela de pagos (Sandbox). | Servicio | Implementar modo "Pago Contra Entrega" temporal. |

---

## 14. Riesgos iniciales

| ID | Riesgo | Causa | Consecuencia | P | I | Nivel | Respuesta |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Sobrecarga del equipo | Solo 3 personas. | Retraso en sprints. | 3 | 4 | Alto | Mitigar (Arquitectura Hexagonal y APIs claras). |
| **RSK-02** | Falla de conectividad | Caída de internet en la demo. | No poder mostrar el MVP. | 2 | 5 | Medio | Mitigar (Grabar video de respaldo de la demo). |
| **RSK-03** | Scope Creep | Añadir funciones no planeadas. | No terminar el MVP. | 3 | 5 | Alto | Evitar (PO protege el backlog). |

---

## 15. Criterios de autorización del proyecto

| ID | Criterio | Cumple | Evidencia |
| :--- | :--- | :--- | :--- |
| **AUT-01** | Problema definido con evidencia. | Sí | Sección 3 y 4. |
| **AUT-02** | Objetivos SMART verificables. | Sí | Sección 6. |
| **AUT-03** | Alcance y exclusiones claros. | Sí | Sección 9. |
| **AUT-04** | Riesgos críticos con tratamiento. | Sí | Sección 14. |

### 15.1 Decisión
- [X] Proyecto autorizado.
- [ ] Autorizado con condiciones.
- [ ] Requiere reformulación.

---

## 16. Declaración de constitución

Mediante la aprobación de este documento, las partes reconocen la necesidad descrita, autorizan el inicio formal del proyecto dentro del alcance preliminar establecido y designan al líder del proyecto para coordinar las actividades necesarias, sujeto a las restricciones y criterios de éxito aquí definidos.

---

## 17. Lista de verificación de calidad

| N.º | Verificación | Cumple |
| :--- | :--- | :--- |
| 1 | El contexto explica cómo funciona actualmente el proceso. | Sí |
| 2 | El problema no está redactado como ausencia de una solución. | Sí |
| 3 | Las causas y efectos están diferenciados. | Sí |
| 4 | Existe evidencia inicial que respalda el problema. | Sí |
| 5 | La población afectada está identificada. | Sí |
| 6 | La justificación considera valor y viabilidad. | Sí |
| 7 | El objetivo general se relaciona directamente con el problema. | Sí |
| 8 | Los objetivos específicos son verificables. | Sí |
| 9 | Los indicadores tienen meta, unidad y método de medición. | Sí |
| 10 | El alcance preliminar distingue inclusiones y exclusiones. | Sí |
| 11 | El MVP está claramente identificado. | Sí |
| 12 | Los entregables tienen criterios de aceptación. | Sí |
| 13 | Los hitos son realistas frente al tiempo y recursos. | Sí |
| 14 | Los roles, responsables y autoridad del líder están definidos. | Sí |
| 15 | La viabilidad preliminar fue evaluada. | Sí |
| 16 | Restricciones, supuestos y dependencias están diferenciados. | Sí |
| 17 | Los riesgos críticos tienen responsable y respuesta. | Sí |
| 18 | La decisión de autorización está registrada. | Sí |
| 19 | El documento tiene versión, responsables e historial de cambios. | Sí |
| 20 | La información es consistente con la arquitectura documental. | Sí |

---
**Fin del documento**