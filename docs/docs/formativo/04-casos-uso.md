---
sidebar_position: 4
title: 04. Casos de Uso y Escenarios Completos
---

# Casos de Uso y Escenarios — LOCIFY (Documento Oficial Completo)

Este documento detalla todos los casos de uso oficiales del sistema extraídos del documento fuente corporativo (versión 001, 14 de marzo de 2026), abarcando los módulos de **Onboarding**, **Cliente**, **Parqueadero** y **Administrador**, con sus respectivos flujos y escenarios BDD.

---

## 1. Módulo Onboarding (CU-O-01 a CU-O-10)

| Código | Nombre | Actor Principal | Descripción | Referencia RF |
| :--- | :--- | :--- | :--- | :--- |
| **CU-O-01** | Registrar usuario mediante formulario | Usuario | Permite completar el formulario inicial de onboarding. | RFO-01 |
| **CU-O-02** | Validar datos del formulario | Sistema | Valida campos obligatorios y formato de correo electrónico. | RFO-02 |
| **CU-O-03** | Generar invitación de activación | Sistema | Genera invitación con vigencia limitada tras el envío del formulario. | RFO-03 |
| **CU-O-04** | Enviar correo de activación | Sistema | Envía un correo con el enlace único para activar la cuenta. | RFO-04 |
| **CU-O-05** | Generar enlace único de activación | Sistema | Crea el token seguro asociado a la invitación. | RFO-05 |
| **CU-O-06** | Verificar vigencia de invitación | Sistema | Valida que la invitación no haya expirado al acceder al enlace. | RFO-06 |
| **CU-O-07** | Crear contraseña inicial | Usuario | Permite al usuario definir su contraseña al usar el enlace válido. | RFO-07 |
| **CU-O-08** | Activar cuenta de usuario | Sistema | Cambia el estado de la cuenta a activa tras definir la contraseña. | RFO-08 |
| **CU-O-09** | Restringir acceso antes de activación | Sistema | Impide el inicio de sesión si la cuenta no ha sido activada. | RFO-09 |
| **CU-O-10** | Gestionar invitación expirada | Sistema | Informa al usuario y bloquea el acceso si el enlace venció (24h). | RFO-10 |

---

## 2. Módulo Cliente (CU-C-01 a CU-C-10)

| Código | Nombre | Actor Principal | Descripción | Referencia RF |
| :--- | :--- | :--- | :--- | :--- |
| **CU-C-01** | Consultar Dashboard | Usuario | Visualiza estado actual, reservas activas, contador y alertas. | RFC-01 a RFC-05 |
| **CU-C-02** | Gestionar Reservas | Usuario | Búsqueda de espacios, filtros, horarios, pagos, cancelar/extender. | RFC-06 a RFC-15 |
| **CU-C-03** | Realizar Check-in y Uso del Espacio | Usuario | Valida medios de pago, disponibilidad, check-in digital y cronómetro. | RFC-16 a RFC-19 |
| **CU-C-04** | Finalizar Uso y Procesar Pago | Sistema / Usuario | Calcula tarifa proporcional, cobro automático y recordatorios. | RFC-20 a RFC-22 |
| **CU-C-05** | Consultar Actividad y Transacciones | Usuario | Historial de usos, estados de transacciones y detalle financiero. | RFC-23 a RFC-26 |
| **CU-C-06** | Gestionar Beneficios y Créditos | Usuario | Consulta saldo, historial y aplica créditos en reservas. | RFC-27 a RFC-29 |
| **CU-C-07** | Gestionar Vehículos | Usuario | Registrar, editar o eliminar placas asociadas a la cuenta. | RFC-30 a RFC-31 |
| **CU-C-08** | Gestionar Soporte | Usuario | Crear tickets, adjuntar evidencia y consultar estado del caso. | RFC-32 a RFC-34 |
| **CU-C-09** | Gestionar Configuración de Cuenta | Usuario | Datos personales, métodos de pago, seguridad y notificaciones. | RFC-35 a RFC-38 |
| **CU-C-10** | Consultar Módulo de Ayuda | Usuario | Tutoriales, reglas, FAQ, búsqueda y redirección a soporte. | RFC-39 a RFC-48 |

### Escenarios Específicos (BDD) — Cliente
- **CUO01 (Dashboard)**: Escenario 1 (Dashboard con reserva activa - *Given* usuario logueado, *When* accede, *Then* muestra reserva activa); Escenario 2 (Dashboard sin reservas - *Given* sin reservas, *When* accede, *Then* indica ausencia de reservas).
- **CUO02 (Reservas)**: Escenario 1 (Reserva exitosa - calcula valor y permite pago); Escenario 2 (Cancelación de reserva - valida reglas y confirma); Escenario 3 (Extensión de reserva - verifica disponibilidad y aprueba).
- **CUO03 (Check-in)**: Escenario 1 (Check-in exitoso - genera QR y cronómetro); Escenario 2 (Sin método de pago - solicita agregar medio de pago).
- **CUO04 (Finalizar Uso)**: Escenario 1 (Finaliza correctamente - calcula tiempo y cobra); Escenario 2 (Sobretiempo - aplica penalidad).
- **CUO05 a CUO10**: Consultas de historial, aplicación de créditos, registro de vehículos, gestión de tickets de soporte, actualización de configuración y uso de la base de conocimiento de ayuda.

---

## 3. Módulo Parqueadero (CUP-01 a CUP-25)

Agrupado en 6 sub-módulos operativos:

### 3.1. Gestión de Registro y Configuración
- **CUP-01**: Controlar acceso inicial del parqueadero (bloqueado hasta aprobación del Admin).
- **CUP-02**: Registrar empresa operadora (datos jurídicos).
- **CUP-03**: Registrar representante legal.
- **CUP-04**: Cargar documentos obligatorios (RUT, cámara de comercio).
- **CUP-05**: Registrar vigencia de pólizas.
- **CUP-06**: Crear sede de parqueadero.
- **CUP-07**: Registrar capacidad del parqueadero (cupos totales).
- **CUP-08**: Registrar características del parqueadero (tipos de vehículo).
- **CUP-09**: Cargar fotos de la sede.
- **CUP-10**: Validar registro antes del envío (integridad de datos).
- **CUP-11**: Enviar solicitud de revisión al Administrador.

### 3.2. Gestión Operativa del Parqueadero
- **CUP-12 (CUP-P-12)**: Visualizar dashboard operativo (ocupación en tiempo real).
- **CUP-13 (CUP-P-13)**: Mostrar alertas operativas (conflictos o sobretiempos).
- **CUP-14 (CUP-P-14)**: Buscar vehículo por placa.
- **CUP-15 (CUP-P-15)**: Registrar ingreso de vehículo (validar reserva o manual).
- **CUP-16 (CUP-P-16)**: Registrar eventos manuales (entrada/salida).
- **CUP-17 (CUP-P-17)**: Forzar salida de vehículo (cierre excepcional).

### 3.3. Gestión de Reservas
- **CUP-18 (CUP-P-18)**: Visualizar reservas por sede.
- **CUP-19 (CUP-P-19)**: Filtrar reservas por estado (activa, completada, cancelada).

### 3.4. Control de Vehículos y Tiempos
- **CUP-20 (CUP-P-20)**: Visualizar vehículos activos en la sede.
- **CUP-21 (CUP-P-21)**: Detectar sobretiempos automáticamente.

### 3.5. Gestión Financiera
- **CUP-22 (CUP-P-22)**: Generar reportes de ingresos por periodo.
- **CUP-23 (CUP-P-23)**: Consultar penalidades registradas.

### 3.6. Gestión de Usuarios y Seguridad
- **CUP-24 (CUP-P-24)**: Crear usuarios internos (equipo operador).
- **CUP-25 (CUP-P-25)**: Controlar permisos por rol.

### Escenarios Específicos (BDD) — Parqueadero
- **Escenario 1 (Registro empresa)**: *Given* en formulario, *When* ingresa datos jurídicos, *Then* guarda datos.
- **Escenario 4 (Creación sede)**: *Given* empresa registrada, *When* crea sede, *Then* registra sede.
- **Escenario 6 (Validación incompleta)**: *Given* intenta enviar, *When* falta info, *Then* bloquea y solicita completar.
- **Escenario 9 (Ingreso vehículo)**: *Given* vehículo llega, *When* confirma ingreso, *Then* valida reserva o registra manual.
- **Escenario 11 (Detección sobretiempo)**: *Given* vehículo excede tiempo, *When* sistema evalúa, *Then* genera alerta.

---

## 4. Módulo Administrador (CUA-01 a CUA-12)

| Código | Nombre | Actor Principal | Descripción | Referencia RF |
| :--- | :--- | :--- | :--- | :--- |
| **CUA-01** | Consultar Dashboard Ejecutivo | Administrador | Indicadores estratégicos y métricas globales de la plataforma. | RFA-01 a RFA-08 |
| **CUA-02** | Gestionar Operadores | Administrador | Aprobar, suspender o modificar estado de operadores. | RFA-09, 10, 14-16 |
| **CUA-03** | Consultar Información de Operadores | Administrador | Visualizar info legal, documentos e historial de revisión. | RFA-11-13, 17 |
| **CUA-04** | Gestionar Sedes | Administrador | Supervisar y modificar el estado operativo de las sedes. | RFA-18 a RFA-23 |
| **CUA-05** | Consultar Transacciones Financieras | Administrador | Visualizar todas las transacciones de la plataforma. | RFA-24 |
| **CUA-06** | Filtrar y Analizar Transacciones | Administrador | Análisis financiero de penalidades, créditos y liquidaciones. | RFA-25 a RFA-29 |
| **CUA-07** | Gestionar Incidencias | Administrador | Revisar incidencias, evidencias, registrar decisiones y estados. | RFA-30 a RFA-34 |
| **CUA-08** | Proteger Historial de Incidencias | Sistema | Garantiza que los registros históricos no sean eliminados ni alterados. | RFA-35 |
| **CUA-09** | Configurar Penalidades y Reglas | Administrador | Definir penalidades, tiempos de gracia y fórmulas de créditos. | RFA-36 a RFA-38 |
| **CUA-10** | Configurar Políticas Financieras | Administrador | Establecer límites de créditos y políticas de compensación. | RFA-39, RFA-40 |
| **CUA-11** | Gestionar Versionamiento de Reglas | Administrador | Registrar nuevas versiones al modificar reglas globales. | RFA-41 |
| **CUA-12** | Gestionar Usuarios Internos | Administrador | Crear usuarios administrativos, asignar roles, permisos e historial. | RFA-42 a RFA-46 |

### Escenarios Específicos (BDD) — Administrador
- **CUA-01 (Dashboard)**: Visualización exitosa y manejo de errores de conexión con recarga.
- **CUA-02 (Operadores)**: Aprobación de operadores pendientes y suspensión por irregularidades.
- **CUA-04 (Sedes)**: Consulta general de sedes y cambio de estado a suspendida.
- **CUA-06 (Transacciones)**: Filtrado por rango de fechas y por tipo de transacción (ej. penalidades).
- **CUA-08 (Inmutabilidad)**: Bloqueo de intentos de eliminación de registros históricos de incidencias.
- **CUA-09 / 10 / 11 (Reglas y Versionamiento)**: Configuración de tiempos de gracia y creación de versiones de reglas globales.
- **CUA-12 (Usuarios Internos)**: Creación de usuarios administrativos y asignación de roles.

---
*Documento oficial sincronizado con las especificaciones técnicas y requerimientos funcionales de LOCIFY.*
