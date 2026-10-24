---
sidebar_position: 7
title: 07. Matriz de Trazabilidad
---

# Matriz Maestra de Trazabilidad

Este documento garantiza que cada necesidad del negocio esté cubierta por un requerimiento, sea modelada en un caso de uso, tenga una historia de usuario y cuente con un criterio de aceptación para ser probada.

## 1. Matriz de Requerimientos a Casos de Uso

| ID Requerimiento | Descripción Corta | Caso de Uso Relacionado | Prioridad |
| :--- | :--- | :--- | :--- |
| **RF-01** | Registro de usuario | CU-01 (Onboarding) | Alta |
| **RF-08** | Restricción de acceso | CU-01, CU-02 | Alta |
| **RF-09** | Dashboard dinámico | CU-03 (Reserva) | Alta |
| **RF-14** | Modelo de reserva híbrido | CU-03 (Reserva) | Alta |
| **RF-18** | Validación de QR y expiración | CU-04 (Check-in) | Alta |
| **RF-23** | Carga de documentos KYB | CU-01 (Onboarding) | Alta |
| **RF-26** | Dashboard de ocupación | CU-05 (Monitoreo) | Alta |
| **RF-29** | Auditoría de tickets KYB | CU-02 (Validación) | Alta |

## 2. Matriz de Casos de Uso a Historias de Usuario

| Caso de Uso | Historia de Usuario Asociada | Criterio de Aceptación Clave |
| :--- | :--- | :--- |
| **CU-01 (KYB)** | HU-P01 | El sistema bloquea la sede hasta que el ticket esté aprobado. |
| **CU-02 (Validación)** | HU-A04 | El admin debe justificar el rechazo obligatoriamente. |
| **CU-03 (Reserva)** | HU-C04 | El QR exprés caduca exactamente a los 5 minutos. |
| **CU-04 (Check-in)** | HU-C05 | Un QR usado o expirado deniega el acceso. |
| **CU-05 (Monitoreo)** | HU-P03 | El dashboard se actualiza en menos de 500ms. |

## 3. Trazabilidad de Criterios de Aceptación (CA)

| Criterio de Aceptación | Módulos Involucrados | RF Cubiertos | RNF Cubiertos |
| :--- | :--- | :--- | :--- |
| **CA-01 (Interoperabilidad)** | Todos | RF-01 a RF-04, RF-09 a RF-11 | RNF-01, RNF-04, RNF-05 |
| **CA-02 (Seguridad y Roles)** | Onboarding, Admin | RF-05 a RF-08, RF-18, RF-24 | RNF-01, RNF-02 |
| **CA-03 (Motor de Reservas)** | Cliente, Operador | RF-13 a RF-19, RF-31 | RNF-06, RNF-09 |
| **CA-04 (Trazabilidad Legal)** | Onboarding, Admin | RF-01, RF-02, RF-21, RF-23 | RNF-02, RNF-03 |