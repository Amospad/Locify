---
sidebar_position: 0
title: Índice de Flujos de Prueba
---

# Índice de Flujos de Prueba y Escenarios E2E (Trazabilidad CU)

Este directorio contiene la definición de los flujos técnicos y escenarios de prueba de extremo a extremo (E2E), vinculados directamente a los **Casos de Uso (CU)** definidos en el documento oficial `casos-de-uso-escenarios.pdf`.

## Mapeo de Flujos Técnicos vs Casos de Uso

| Flujo Técnico | Archivo | Casos de Uso Vinculados | Objetivo de Prueba |
|---|---|---|---|
| FT-01 | [flujo-01-autenticacion.md](./flujo-01-autenticacion.md) | CU-O-01 a CU-O-10 (Onboarding) | Registro, validación de email, expiración de token y primera contraseña. |
| FT-02 | [flujo-06-onboarding-kyb.md](./flujo-06-onboarding-kyb.md) | CU-P-01 a CU-P-11 (KYB Operador) | Carga de documentos, validación de pólizas y flujo de aprobación Admin. |
| FT-03 | [flujo-02-busqueda-reserva.md](./flujo-02-busqueda-reserva.md) | CU-C-02 (Gestión Reservas) | Proceso completo de pago y generación de reserva. |
| FT-04 | [flujo-03-acceso-uso.md](./flujo-03-acceso-uso.md) | CU-C-03, CU-C-04, CU-P-15, CU-P-21 | Escaneo, inicio de cronómetro, detección de sobretiempo y cobro automático. |
| FT-05 | [flujo-04-cancelacion.md](./flujo-04-cancelacion.md) | CU-C-02 (Extensión) | Extensión de reserva y reembolsos según política. |
| FT-06 | [flujo-05-historial.md](./flujo-05-historial.md) | CU-C-05, CU-C-06 | Historial económico, aplicación de créditos. |

---

## Tabla de Traslación Completa CU ↔ HU ↔ Flujo

| CU Código | HU Relacionada | RF | Flujo Técnico | Estado |
|---|---|---|---|---|
| CU-O-01 | HU-01 | RFO-01 | FT-01 | ✅ |
| CU-O-02 | HU-01 | RFO-02 | FT-01 | ✅ |
| CU-O-03 | HU-02 | RFO-03 | FT-01 | ✅ |
| CU-O-04 | HU-02 | RFO-04 | FT-01 | ✅ |
| CU-O-05 | HU-02 | RFO-05 | FT-01 | ✅ |
| CU-O-06 | HU-02 | RFO-06 | FT-01 | ✅ |
| CU-O-07 | HU-01 | RFO-07 | FT-01 | ✅ |
| CU-O-08 | HU-02 | RFO-08 | FT-01 | ✅ |
| CU-O-09 | HU-05 | RFO-09 | FT-01 | ✅ |
| CU-O-10 | HU-02 | RFO-10 | FT-01 | ✅ |
| CU-P-01 | - | RFP-01 | FT-02 | 🔄 |
| CU-P-02 a CU-P-11 | HU-06 | RFP-02 a RFP-11 | FT-02 | 🔄 |
| CU-C-01 | HU-27 | RFC-01 a RFC-05 | FT-01 | 🔄 |
| CU-C-02 | HU-10, HU-11, HU-12 | RFC-06 a RFC-15 | FT-03 | 🔄 |
| CU-C-03 | HU-17, HU-18 | RFC-16 a RFC-19 | FT-04 | 🔄 |
| CU-C-04 | HU-20, HU-29 | RFC-20 a RFC-22 | FT-04 | 🔄 |
| CU-C-05 | HU-28 | RFC-23 a RFC-26 | FT-06 | 🔄 |
| CU-C-06 | HU-29 | RFC-27 a RFC-29 | FT-06 | 🔄 |
| CU-C-07 | HU-15 | RFC-30 a RFC-31 | - | ❌ |
| CU-C-08 | HU-23, HU-24 | RFC-32 a RFC-34 | - | ❌ |
| CU-C-09 | HU-04 | RFC-35 a RFC-38 | - | ❌ |
| CU-C-10 | HU-23 | RFC-39 a RFC-48 | - | ❌ |
| CU-P-15 | HU-17, HU-21 | RFP-15 | FT-04 | 🔄 |
| CU-P-17 | HU-20 | RFP-17 | FT-04 | 🔄 |
| CU-P-21 | HU-30 | RFP-21 | FT-04 | 🔄 |
| CU-P-22 | HU-25 | RFP-22 | - | ❌ |
| CU-P-23 | HU-25 | RFP-23 | - | ❌ |
| CU-P-24 | HU-04 | RFP-24 | - | ❌ |
| CU-P-25 | HU-04 | RFP-25 | - | ❌ |
| CUA-01 a CUA-12 | HU-A05 a HU-A11 | RFA-01 a RFA-46 | - | ❌ |

## Leyenda
- ✅ **Completo**: Caso de uso confluye directamente con flujo técnico existente.
- 🔄 **Parcial**: Requiere validación y enlace explícito.
- ❌ **Pendiente**: Necesita crear/flujos nuevos o ampliar los existentes.

---

## Próximos pasos
1. Actualizar los flujos existentes con referencias explícitas a CU.
2. Completar los flujos faltantes (CU-C-07 a CU-C-10, CU-P-22 a CU-P-25).
3. Vincular los flujos a los escenarios BDD del PDF.