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
