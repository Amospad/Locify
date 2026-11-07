---
sidebar_position: 0
title: 00. Índice Casos de Uso vs Historias de Usuario
---

# Índice Casos de Uso ↔ Historias de Usuario — LOCIFY

**Fuente oficial:** `casos-de-uso-escenarios.pdf` — Versión 001, 14 de marzo de 2026  
**Elaborado por:** Ficha 3314811 ADSO — Andrés Mosquera, Denis Cuervo y Lilia Torres 
**Trazabilidad:** Mantiene SDD. Ningún código sin spec aprobada. HU ↔ Caso de Uso ↔ RF.

> Este índice mapea los casos de uso extraídos del documento oficial a Historias de Usuario y Requisitos Funcionales. Se usa para trazabilidad HU ↔ CU ↔ RF y para generar escenarios BDD.

---

## Cómo leer la tabla
- **Código CU** según documento oficial PDF.
- **HU relacionada** según `05-historias-usuario.md`.
- **RF** según el documento de Requerimientos de Software.
- **Escenario clave** resume el flujo BDD principal.

---

## Épica 1: Onboarding y Seguridad

| Caso de Uso PDF | Nombre | Actor | HU relacionada | RF | Escenario clave |
|---|---|---|---|---|---|
| CU-O-01 | Registrar usuario mediante formulario | Usuario | HU-01 | RFO-01 | Registro exitoso, envío formulario |
| CU-O-02 | Validar datos del formulario | Sistema | HU-01 | RFO-02 | Campos obligatorios, formato email |
| CU-O-03 | Generar invitación de activación | Sistema | HU-02 | RFO-03 | Invitación 24h |
| CU-O-04 | Enviar correo de activación | Sistema | HU-02 | RFO-04 | Envío enlace único |
| CU-O-05 | Generar enlace único de activación | Sistema | HU-02 | RFO-05 | Token seguro una vez |
| CU-O-06 | Verificar vigencia de invitación | Sistema | HU-02 | RFO-06 | Invitación expirada |
| CU-O-07 | Crear contraseña inicial | Usuario | HU-01 | RFO-07 | Criterios seguridad |
| CU-O-08 | Activar cuenta de usuario | Sistema | HU-02 | RFO-08 | Cuenta activa |
| CU-O-09 | Restringir acceso antes de activación | Sistema | HU-05 | RFO-09 | Bloqueo login |
| CU-O-10 | Gestionar invitación expirada | Sistema | HU-02 | RFO-10 | Mensaje expiración |

---

## Épica 2: Gestión de Operadores KYB

| Caso de Uso PDF | Nombre | Actor | HU relacionada | RF | Escenario clave |
|---|---|---|---|---|---|
| CU-P-02 | Registrar empresa operadora | Operador | HU-06 | RFP-02 | Datos jurídicos |
| CU-P-03 | Registrar representante legal | Operador | HU-06 | RFP-03 | Datos representante |
| CU-P-04 | Cargar documentos obligatorios | Operador | HU-06 | RFP-04 | RUT, Cámara Comercio |
| CU-P-05 | Registrar vigencia de pólizas | Operador | HU-06 | RFP-05 | Fechas pólizas |
| CU-P-06 | Crear sede de parqueadero | Operador | HU-09 | RFP-06 | Registro sede |
| CU-P-07 | Registrar capacidad del parqueadero | Operador | HU-09 | RFP-07 | Cupos totales |
| CU-P-08 | Registrar características del parqueadero | Operador | HU-09 | RFP-08 | Tipos vehículo |
| CU-P-09 | Cargar fotos de la sede | Operador | HU-09 | RFP-09 | Evidencia visual |
| CU-P-10 | Validar registro antes del envío | Operador/Sistema | HU-06 | RFP-10 | Validación completa |
| CU-P-11 | Enviar solicitud de revisión | Operador | HU-06 | RFP-11 | Solicitud Admin |
| CU-P-01 | Controlar acceso inicial del parqueadero | Sistema | HU-07 | RFP-01 | Bloqueo hasta aprobación |
| CU-P-24 | Crear usuarios internos | Operador/Admin | HU-04 | RFP-24 | RBAC operador |
| CU-P-25 | Controlar permisos por rol | Sistema | HU-04 | RFP-25 | Restricción acciones |

---

## Épica 3: Reservas y Búsqueda — Cliente

| Caso de Uso PDF | Nombre | Actor | HU relacionada | RF | Escenario clave |
|---|---|---|---|---|---|
| CU-C-02 | Gestionar Reservas | Usuario | HU-10, HU-11, HU-12, HU-14, HU-15 | RFC-06 a RFC-15 | Búsqueda mapa, filtros, pago, cancelar/extender |
| CU-C-01 | Consultar Dashboard | Usuario | HU-27 | RFC-01 a RFC-05 | Reserva activa, contador, alertas |
| CU-C-07 | Gestionar Vehículos | Usuario | HU-15 | RFC-30 a RFC-31 | Registrar/editar/eliminar placas |
| CU-C-05 | Consultar Actividad y Transacciones | Usuario | HU-28 | RFC-23 a RFC-26 | Historial económico |
| CU-C-06 | Gestionar Beneficios y Créditos | Usuario | HU-29 | RFC-27 a RFC-29 | Aplicar créditos |

---

## Épica 4: Acceso y Uso — Check-in/Check-out

| Caso de Uso PDF | Nombre | Actor | HU relacionada | RF | Escenario clave |
|---|---|---|---|---|---|
| CU-C-03 | Realizar Check-in y Uso del Espacio | Usuario | HU-17, HU-18 | RFC-16 a RFC-19 | QR, validación pago, cronómetro |
| CU-C-04 | Finalizar Uso y Procesar Pago | Sistema/Usuario | HU-20, HU-29 | RFC-20 a RFC-22 | Cobro automático, penalidad sobretiempo |
| CU-P-15 | Registrar ingreso de vehículo | Operador | HU-17, HU-21 | RFP-15 | Ingreso manual/reserva |
| CU-P-16 | Registrar eventos manuales | Operador | HU-21 | RFP-16 | Contingencia sin internet |
| CU-P-17 | Forzar salida de vehículo | Operador | HU-20 | RFP-17 | Cierre excepcional |
| CU-P-21 | Detectar sobretiempos | Sistema | HU-30 | RFP-21 | Alerta sobretiempo |

---

## Épica 5: Operación Parqueadero

| Caso de Uso PDF | Nombre | Actor | HU relacionada | RF | Escenario clave |
|---|---|---|---|---|---|
| CU-P-12 | Visualizar dashboard operativo | Operador | HU-30 | RFP-12 | Ocupación tiempo real |
| CU-P-13 | Mostrar alertas operativas | Sistema | HU-30 | RFP-13 | Conflictos operativos |
| CU-P-14 | Consultar vehículo por placa | Operador | HU-17 | RFP-14 | Estado vehículo |
| CU-P-18 | Visualizar reservas por sede | Operador | HU-30 | RFP-18 | Lista reservas |
| CU-P-19 | Filtrar reservas por estado | Operador | HU-30 | RFP-19 | Filtro activa/completada |
| CU-P-20 | Visualizar vehículos activos | Operador | HU-30 | RFP-20 | Lista activa |
| CU-P-22 | Generar reportes financieros | Operador | HU-25 | RFP-22 | Ingresos periodo |
| CU-P-23 | Consultar penalidades | Operador | HU-25 | RFP-23 | Penalidades registradas |

---

## Épica 6: Soporte y Configuración Cliente

| Caso de Uso PDF | Nombre | Actor | HU relacionada | RF | Escenario clave |
|---|---|---|---|---|---|
| CU-C-08 | Gestionar Soporte | Usuario | HU-23, HU-24 | RFC-32 a RFC-34 | Ticket, evidencia, estado |
| CU-C-09 | Gestionar Configuración de Cuenta | Usuario | HU-04 | RFC-35 a RFC-38 | Datos personales, métodos pago, seguridad |
| CU-C-10 | Consultar Módulo de Ayuda | Usuario | HU-23 | RFC-39 a RFC-48 | Tutoriales, FAQ, búsqueda |

---

## Épica 7: Administrador LOCIFY SaaS

| Caso de Uso PDF | Nombre | Actor | HU relacionada | RF | Escenario clave |
|---|---|---|---|---|---|
| CUA-01 | Consultar Dashboard Ejecutivo | Administrador | HU-A10 | RFA-01 a RFA-08 | Métricas globales |
| CUA-02 | Gestionar Operadores | Administrador | HU-07 | RFA-09,10,14-16 | Aprobar/suspender |
| CUA-03 | Consultar Información de Operadores | Administrador | HU-07 | RFA-11-13,17 | Info legal y documentos |
| CUA-04 | Gestionar Sedes | Administrador | HU-07 | RFA-18 a RFA-23 | Estado sedes |
| CUA-05 | Consultar Transacciones Financieras | Administrador | HU-A10 | RFA-24 | Historial transacciones |
| CUA-06 | Filtrar y Analizar Transacciones | Administrador | HU-A10 | RFA-25 a RFA-29 | Filtros penalidades/créditos |
| CUA-07 | Gestionar Incidencias | Administrador | HU-24 | RFA-30 a RFA-34 | Revisar evidencias, resolver |
| CUA-08 | Proteger Historial de Incidencias | Sistema | HU-A09 | RFA-35 | Append-only inmutable |
| CUA-09 | Configurar Penalidades y Reglas | Administrador | HU-A05, HU-22 | RFA-36 a RFA-38 | Minutos gracia, tarifas |
| CUA-10 | Configurar Políticas Financieras | Administrador | HU-A05 | RFA-39,40 | Límites créditos |
| CUA-11 | Gestionar Versionamiento de Reglas | Administrador | HU-A09 | RFA-41 | Historial versiones |
| CUA-12 | Gestionar Usuarios Internos | Administrador | HU-A06 | RFA-42 a RFA-46 | RBAC soporte |

---

## Trazabilidad rápida

- Ver matriz completa en [07. Matriz de Trazabilidad](./07-matriz-trazabilidad.md)
- Casos de uso detallados en [04. Casos de Uso y Escenarios Completos](./04-casos-uso.md)
- Historias de Usuario en [05. Historias de Usuario](./05-historias-usuario.md)

---

## Próximos pasos
- [x] Extraer IDs reales de Caso de Uso del PDF y completar tabla
- [ ] Vincular cada CU a escenarios de prueba en `docs/docs/tecnico/flujos/`
- [ ] Actualizar criterios de aceptación de HU con referencias a CU
