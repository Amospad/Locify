---
sidebar_position: 0
title: 00. Índice Casos de Uso vs Historias de Usuario
---

# Índice Casos de Uso ↔ Historias de Usuario

**Fuente:** [`casos-de-uso-escenarios.pdf`](./casos-de-uso-escenarios.pdf)

Este índice mapea cada Caso de Uso del documento PDF a las Historias de Usuario del Product Backlog y a los escenarios de prueba asociados.

> Nota: El PDF está embebido en `docs/docs/formativo/`. La extracción de texto del PDF requiere un parser externo. Este índice es un esqueleto listo para completar con los IDs de caso extraídos del PDF.

## Cómo usar
1. Abrir `casos-de-uso-escenarios.pdf`
2. Para cada Caso de Uso, anotar: ID-CU, Nombre, Actor, Precondición, Flujo básico, Excepciones
3. Relacionar con HU según la épica
4. Registrar escenarios de prueba y trazabilidad RF/RNF

---

## Épica 1: Onboarding y Seguridad

| Caso de Uso PDF | HU relacionada | RF | Escenario clave |
|---|---|---|---|
| CU-01 Registro de usuario | HU-01 | RF-01 | Registro exitoso, validación email |
| CU-02 Activación de cuenta | HU-02 | RF-04 | Correo de activación, expiración |
| CU-03 Recuperar contraseña | HU-03 | RF-05 | Reset token, cambio contraseña |
| CU-04 Gestión RBAC | HU-04 | RF-32 | Asignación roles |
| CU-05 Bloqueo cuenta inactiva | HU-05 | RNF-01 | Acceso denegado |

---

## Épica 2: Gestión de Operadores KYB

| Caso de Uso PDF | HU relacionada | RF | Escenario clave |
|---|---|---|---|
| CU-06 Solicitud verificación | HU-06 | RF-12 | Subida RUT Cámara Comercio |
| CU-07 Auditoría KYB Admin | HU-07 | RF-13 | Aprobar/Rechazar con motivo |
| CU-08 Ocultar sedes no aprobadas | HU-08 | RF-14 | Filtro mapa |
| CU-09 Configuración capacidad | HU-09 | RF-15 | Editar celdas y tipos vehículo |
| CU-10 Dashboard ocupación | HU-30 | RF-26 | Alertas sobretiempo |

---

## Épica 3: Reservas y Búsqueda

| Caso de Uso PDF | HU relacionada | RF | Escenario clave |
|---|---|---|---|
| CU-11 Búsqueda mapa | HU-10 | RF-06 | Pines verdes, disponibilidad real |
| CU-12 Filtros precio/tipo | HU-11 | RF-07 | Filtro por vehículo |
| CU-13 Modalidad Garantizada/Exprés | HU-12 | RF-08 | Selección modalidad |
| CU-14 Generación QR | HU-13 | RF-09 | QR único con temporizador |
| CU-15 Cancelación reserva | HU-14 | RF-10 | Reembolso según política |
| CU-16 Gestión vehículos | HU-15 | RF-11 | Múltiples placas |
| CU-17 Validación doble reserva | HU-16 | RNF-04 | Prevención duplicado |
| CU-18 Panel reserva activa | HU-27 | RF-09 | Estado activo/check-in |
| CU-19 Historial económico | HU-28 | RF-21 | Desglose pagos |

---

## Épica 4: Acceso y Uso

| Caso de Uso PDF | HU relacionada | RF | Escenario clave |
|---|---|---|---|
| CU-20 Check-in QR | HU-17 | RF-16 | Escaneo QR, cronómetro |
| CU-21 Rechazo QR inválido | HU-18 | RF-17 | QR expirado/usado |
| CU-22 Cronómetro cliente | HU-19 | RF-18 | Tiempo real |
| CU-23 Check-out y cobro | HU-20 | RF-19 | Cálculo automático |
| CU-24 Check-in/out manual | HU-21 | RF-20 | Contingencia sin internet |
| CU-25 Acceso multi-dispositivo | HU-26 | RNF-03 | QR desde web/móvil |
| CU-26 Abono por uso menor | HU-29 | RF-17 | Recálculo y crédito |

---

## Épica 5: Administración y Soporte

| Caso de Uso PDF | HU relacionada | RF | Escenario clave |
|---|---|---|---|
| CU-27 Motor de reglas | HU-22 | RF-31 | Editar tarifas/gracia |
| CU-28 Ticket soporte | HU-23 | RF-22 | Apertura ticket QR/cobro |
| CU-29 Gestión disputas | HU-24 | RF-23 | Evidencia y resolución |
| CU-30 Reportes financieros operador | HU-25 | RF-28 | Ingresos/multa |

---

## Épica 6: Administrador LOCIFY SaaS

| Caso de Uso PDF | HU relacionada | RF | Escenario clave |
|---|---|---|---|
| CU-A05 Config reglas negocio | HU-A05 | RF-31 | Cambio sin afectar reservas |
| CU-A06 RBAC soporte | HU-A06 | RF-32 | Creación cuentas limitadas |
| CU-A07 Línea tiempo reserva | HU-A07 | RF-30 | Auditoría de eventos |
| CU-A08 Suspensión operador | HU-A08 | RF-33 | Moderación |
| CU-A09 Log auditoría | HU-A09 | RNF-02 | Append-only |
| CU-A10 Dashboard global | HU-A10 | RF-34 | Métricas agregadas |
| CU-A11 Reenvío activación | HU-A11 | RF-04 | Token nuevo, invalida anterior |

---

## Trazabilidad rápida

Ver matriz completa en [07. Matriz de Trazabilidad](./07-matriz-trazabilidad.md)

---

## Próximos pasos
- [ ] Extraer IDs reales de Caso de Uso del PDF y completar tabla
- [ ] Vincular cada CU a escenarios de prueba en `docs/docs/tecnico/flujos/`
- [ ] Actualizar criterios de aceptación de HU con referencias a CU
